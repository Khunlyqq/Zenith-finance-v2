import { createWorker } from 'tesseract.js';

export interface ScanResult {
  amount: number;
  note: string;
  category?: string;
  confidence: number;
}

/**
 * Clean strings for amount parsing: 125.000 -> 125000, Rp45,000 -> 45000
 */
const parseCurrencyString = (str: string): number => {
  // Remove non-numeric characters except for dots and commas
  const clean = str.replace(/[^\d.,]/g, '');
  
  // Handle Indonesian formatting: 125.000,00 or 125.000
  // If it's a dot for thousand and comma for decimal
  if (clean.includes('.') && clean.includes(',')) {
    return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
  }
  
  // If it's just dots (125.000)
  if (clean.includes('.') && !clean.includes(',')) {
    // Check if the last part after dot is 3 digits (Indonesian thousand sep)
    const parts = clean.split('.');
    if (parts[parts.length - 1].length === 3) {
      return parseFloat(clean.replace(/\./g, ''));
    }
    return parseFloat(clean);
  }

  // If it's just commas (45,000)
  if (clean.includes(',') && !clean.includes('.')) {
    return parseFloat(clean.replace(/,/g, ''));
  }

  return parseFloat(clean) || 0;
};

export const extractReceiptData = async (file: File, lang: 'id' | 'en' = 'id'): Promise<ScanResult> => {
  const worker = await createWorker('ind+eng'); // Support ID and EN
  
  try {
    const { data: { text } } = await worker.recognize(file);
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // 1. Identify Vendor (First few lines that aren't purely numeric/dates)
    let vendor = lang === 'id' ? "Struk Belanja" : "Shopping Receipt";
    const noiseWords = ['tgl', 'jam', 'no.', 'struk', 'kasir', 'telp', 'id', 'pajak', 'tax', 'bukti'];
    
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      const line = lines[i].toLowerCase();
      // Skip if line is too short, mostly numeric, or contains noise words at start
      if (line.length < 3) continue;
      if (/^\d+$/.test(line)) continue;
      if (noiseWords.some(word => line.startsWith(word))) continue;
      
      // Clean the line and keep it as vendor
      vendor = lines[i]
        .replace(/[^\w\s&]/g, '') // Remove special chars but keep space and &
        .trim();
        
      if (vendor.length > 0) break;
    }

    // 2. Identify Total Amount (Find largest currency-like number)
    // Regex for numbers like: 125.000, Rp 45,000, 1.250.000
    const currencyRegex = /(?:rp|total|bayar)?\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/gi;
    let maxAmount = 0;
    
    const matches = text.matchAll(currencyRegex);
    for (const match of matches) {
      const val = parseCurrencyString(match[1]);
      if (val > maxAmount && val < 10000000) { // Limit to 10M to avoid outliers like dates or account numbers
        maxAmount = val;
      }
    }

    // 3. Infer Category
    let category = lang === 'id' ? "Lainnya" : "Others";
    const lowerText = text.toLowerCase();
    if (lowerText.includes('makan') || lowerText.includes('food') || lowerText.includes('resto') || lowerText.includes('kopi') || lowerText.includes('cafe')) {
      category = lang === 'id' ? "Makanan & Minuman" : "Food & Drink";
    } else if (lowerText.includes('grab') || lowerText.includes('gojek') || lowerText.includes('ojek') || lowerText.includes('trans') || lowerText.includes('taxi')) {
      category = lang === 'id' ? "Transportasi" : "Transportation";
    } else if (lowerText.includes('pln') || lowerText.includes('listrik') || lowerText.includes('air') || lowerText.includes('internet') || lowerText.includes('wifi')) {
      category = lang === 'id' ? "Tagihan" : "Bills";
    } else if (lowerText.includes('indo') || lowerText.includes('alfa') || lowerText.includes('market') || lowerText.includes('belanja') || lowerText.includes('shop')) {
      category = lang === 'id' ? "Belanja" : "Shopping";
    }

    return {
      amount: maxAmount || (lang === 'id' ? 50000 : 50), // Fallback
      note: vendor,
      category,
      confidence: text.length > 20 ? 0.8 : 0.4
    };
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  } finally {
    await worker.terminate();
  }
};
