"use client";

import React, { useState } from "react";
import { useModal } from "@/components/providers/ModalProvider";
import { createSavingsGoal } from "@/actions/savings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { savingsGoalSchema, SavingsGoalInput } from "@/lib/validations/savings";
import { X, Plus, PiggyBank, Target, Calendar, PenLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SavingsModal() {
  const { isSavingsModalOpen, closeSavingsModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SavingsGoalInput>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      current_amount: 0,
      target_amount: 0,
      deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    },
  });

  async function onSubmit(data: SavingsGoalInput) {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        formData.append(k, String(v));
      }
    });

    const result = await createSavingsGoal(null, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      reset();
      closeSavingsModal();
      setLoading(false);
    }
  }

  if (!isSavingsModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSavingsModal}
          className="absolute inset-0 bg-[#0a0c0d]/80 backdrop-blur-md"
        />

        {/* Modal Body */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-[#101415] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#181c1d] to-[#101415] p-8 border-b border-white/5 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black font-headline tracking-tighter">Target Tabungan Baru</h3>
              <p className="text-[10px] text-[#899295] font-black uppercase tracking-widest mt-1">THE DIGITAL CURATOR FLOW</p>
            </div>
            <button 
              onClick={closeSavingsModal}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#899295] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}

            {/* Goal Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2 flex items-center gap-2">
                <PenLine size={12} /> NAMA TARGET
              </label>
              <input 
                type="text"
                {...register("name")}
                placeholder="Misal: Liburan ke Jepang, Dana Darurat..."
                className="w-full bg-[#181c1d] border border-white/5 rounded-2xl px-6 py-4 text-lg font-bold outline-none focus:ring-4 focus:ring-[#86d2e5]/10 focus:border-[#86d2e5]/30 transition-all"
              />
              {errors.name && <p className="text-red-400 text-[10px] font-bold px-2">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Target Amount */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2 flex items-center gap-2">
                  <Target size={12} /> TARGET NOMINAL
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#899295]">Rp</span>
                  <input 
                    type="number"
                    {...register("target_amount", { valueAsNumber: true })}
                    className="w-full bg-[#181c1d] border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-base font-bold outline-none focus:ring-2 focus:ring-[#86d2e5]/20"
                  />
                </div>
                {errors.target_amount && <p className="text-red-400 text-[10px] font-bold px-2">{errors.target_amount.message}</p>}
              </div>

              {/* Current Amount */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2 flex items-center gap-2">
                  <PiggyBank size={12} /> SALDO AWAL
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#899295]">Rp</span>
                  <input 
                    type="number"
                    {...register("current_amount", { valueAsNumber: true })}
                    className="w-full bg-[#181c1d] border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-base font-bold outline-none focus:ring-2 focus:ring-[#86d2e5]/20"
                  />
                </div>
                {errors.current_amount && <p className="text-red-400 text-[10px] font-bold px-2">{errors.current_amount.message}</p>}
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2 flex items-center gap-2">
                <Calendar size={12} /> TENGGAT WAKTU (DEADLINE)
              </label>
              <input 
                type="date"
                {...register("deadline")}
                className="w-full bg-[#181c1d] border border-white/5 rounded-2xl px-6 py-4 text-base font-bold outline-none focus:ring-4 focus:ring-[#86d2e5]/10 focus:border-[#86d2e5]/30 transition-all"
              />
              {errors.deadline && <p className="text-red-400 text-[10px] font-bold px-2">{errors.deadline.message}</p>}
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={closeSavingsModal}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-[#899295] hover:text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all"
              >
                BATALKAN
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 bg-gradient-to-br from-[#86d2e5] to-[#006778] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "MENYIMPAN..." : (
                  <>
                    <Plus size={18} />
                    <span>BUAT TARGET</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
