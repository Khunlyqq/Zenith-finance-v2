const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic .env.local parser
const envPath = path.resolve(__dirname, '../../../.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const categories = [
  { name: 'Makan & Minum', icon: 'utensils', color: '#ffb870' },
  { name: 'Transportasi', icon: 'directions_car', color: '#86d2e5' },
  { name: 'Belanja', icon: 'shopping_bag', color: '#78dc77' },
  { name: 'Hiburan', icon: 'movie', color: '#ffb4ab' },
  { name: 'Kesehatan', icon: 'medical_services', color: '#ff897d' },
  { name: 'Gaji', icon: 'payments', color: '#78dc77' },
  { name: 'Investasi', icon: 'trending_up', color: '#86d2e5' },
  { name: 'Tagihan', icon: 'receipt_long', color: '#ffb870' },
];

async function seed() {
  console.log("Fetching existing categories...");
  const { data: existing, error: fetchError } = await supabase
    .from('categories')
    .select('name');

  if (fetchError) {
    console.error("Error fetching categories:", fetchError.message);
    process.exit(1);
  }

  const existingNames = new Set(existing.map(c => c.name));
  const toInsert = categories.filter(c => !existingNames.has(c.name));

  if (toInsert.length === 0) {
    console.log("All categories already exist. Skipping seed.");
    return;
  }

  console.log(`Inserting ${toInsert.length} categories...`);
  const { error: insertError } = await supabase
    .from('categories')
    .insert(toInsert);

  if (insertError) {
    console.error("Error inserting categories:", insertError.message);
    process.exit(1);
  }

  console.log("Categories seeded successfully!");
}


seed();
