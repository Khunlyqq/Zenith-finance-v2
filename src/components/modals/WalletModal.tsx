"use client";

import { useModal } from "@/components/providers/ModalProvider";
import { X, Wallet as WalletIcon, CreditCard, PiggyBank, Landmark, Sparkles } from "lucide-react";
import { useState } from "react";
import { createWallet } from "@/lib/actions/wallets";
import { toast } from "sonner";

const icons = [
  { id: "payments", icon: <WalletIcon size={20} /> },
  { id: "account_balance", icon: <Landmark size={20} /> },
  { id: "credit_card", icon: <CreditCard size={20} /> },
  { id: "savings", icon: <PiggyBank size={20} /> },
];

export default function WalletModal() {
  const { isWalletModalOpen, closeWalletModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("payments");

  if (!isWalletModalOpen) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.append("icon", selectedIcon);
    const result = await createWallet(formData);
    setLoading(false);

    if (result?.success) {
      toast.success("Dompet baru berhasil dibuat!");
      closeWalletModal();
    } else {
      toast.error(result?.error || "Gagal membuat dompet");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#0a0c0d]/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeWalletModal}
      />
      
      <div className="relative bg-[#181c1d] border border-white/5 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 premium-glow">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#86d2e5] to-[#006778] p-8 pb-12 relative">
          <div className="absolute top-6 right-6">
            <button 
              onClick={closeWalletModal}
              className="w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-white/80 mb-2 uppercase tracking-widest text-[10px] font-black">
             <Sparkles size={14} className="animate-pulse" />
             <span>Manajemen Aset Digital</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Tambah Dompet Baru</h2>
          <p className="text-white/60 text-xs font-medium mt-2 max-w-[280px]">Mulai kategorisasi aset Anda untuk pengawasan finansial yang lebih presisi.</p>
        </div>

        {/* Form Content */}
        <form action={handleSubmit} className="p-8 space-y-8 -mt-6 bg-[#181c1d] rounded-t-[2.5rem] relative">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-1">Nama Dompet</label>
              <input 
                name="name"
                required
                placeholder="cth: Tabungan Utama, Investasi, dll"
                className="w-full bg-[#323537]/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-[#e0e3e4] placeholder:text-[#899295]/40 focus:ring-2 focus:ring-[#86d2e5]/20 focus:border-[#86d2e5]/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-1">Saldo Awal (Rp)</label>
              <input 
                name="balance"
                type="number"
                required
                defaultValue="0"
                className="w-full bg-[#323537]/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-[#e0e3e4] placeholder:text-[#899295]/40 focus:ring-2 focus:ring-[#86d2e5]/20 focus:border-[#86d2e5]/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-1">Pilih Ikon</label>
              <div className="grid grid-cols-4 gap-4">
                {icons.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIcon(item.id)}
                    className={`h-14 rounded-2xl flex items-center justify-center transition-all ${
                      selectedIcon === item.id 
                        ? "bg-[#86d2e5] text-[#101415] shadow-[0_0_20px_rgba(134,210,229,0.3)] scale-105" 
                        : "bg-[#323537]/50 text-[#899295] hover:text-[#e0e3e4] hover:bg-[#323537] border border-white/5"
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#86d2e5] to-[#006778] text-[#97e3f6] font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Buat Dompet Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
