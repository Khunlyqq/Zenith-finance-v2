"use client";

import React, { useState } from "react";
import { useModal } from "@/components/providers/ModalProvider";
import { addFundToGoal } from "@/actions/savings";
import { X, Plus, PiggyBank, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddFundModal() {
  const { isAddFundModalOpen, closeAddFundModal, selectedGoal } = useModal();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddFund(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGoal) return;
    
    setLoading(true);
    setError(null);

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Masukkan nominal yang valid");
      setLoading(false);
      return;
    }

    const result = await addFundToGoal(selectedGoal.id, numAmount);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setAmount("");
      closeAddFundModal();
      setLoading(false);
    }
  }

  if (!isAddFundModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAddFundModal}
          className="absolute inset-0 bg-[#0a0c0d]/80 backdrop-blur-md"
        />

        {/* Modal Body */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#101415] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#181c1d] p-6 border-b border-white/5 flex justify-between items-center text-center">
            <div className="mx-auto">
              <h3 className="text-xl font-black font-headline tracking-tighter">Tambah Dana</h3>
              <p className="text-[10px] text-[#86d2e5] font-black uppercase tracking-widest mt-1">{selectedGoal?.name}</p>
            </div>
            <button 
              onClick={closeAddFundModal}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#899295] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleAddFund} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2 flex items-center gap-2">
                <DollarSign size={12} /> NOMINAL TAMBAHAN
              </label>
              
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg font-black text-[#899295]">Rp</span>
                <input 
                  autoFocus
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#181c1d] border border-white/5 rounded-2xl pl-16 pr-6 py-6 text-3xl font-black outline-none focus:ring-4 focus:ring-[#86d2e5]/10 focus:border-[#86d2e5]/30 transition-all placeholder:text-white/5"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading || !amount}
                className="w-full py-5 bg-gradient-to-br from-[#86d2e5] to-[#006778] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "MEMPROSES..." : (
                  <>
                    <Plus size={18} />
                    <span>KONFIRMASI TAMBAH</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={closeAddFundModal}
                className="w-full py-4 text-[#899295] hover:text-white font-black text-[9px] uppercase tracking-widest transition-colors"
              >
                KEMBALI
              </button>
            </div>
          </form>

          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#86d2e5]/5 rounded-full blur-3xl pointer-events-none"></div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
