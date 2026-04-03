"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "@/components/providers/ModalProvider";
import { createClient } from "@/lib/supabase/client";
import { createBudget } from "@/actions/budgets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, BudgetInput } from "@/lib/validations/budget";
import { X, Plus, Tag, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BudgetModal() {
  const { isBudgetModalOpen, closeBudgetModal } = useModal();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: 0,
    },
  });

  useEffect(() => {
    if (isBudgetModalOpen) {
      fetchCategories();
      setValue("month", new Date().toISOString().slice(0, 7)); // Set current month
    }
  }, [isBudgetModalOpen]);

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) {
      setCategories(data);
      if (data.length > 0) {
        setValue("category_id", data[0].id);
      }
    }
  }

  async function onSubmit(data: BudgetInput) {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        formData.append(k, String(v));
      }
    });

    const result = await createBudget(null, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      reset();
      closeBudgetModal();
      setLoading(false);
    }
  }

  if (!isBudgetModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeBudgetModal}
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
              <h3 className="text-2xl font-black font-headline tracking-tighter">Atur Anggaran</h3>
              <p className="text-[10px] text-[#899295] font-black uppercase tracking-widest mt-1">THE DIGITAL CURATOR FLOW</p>
            </div>
            <button 
              onClick={closeBudgetModal}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#899295] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2">BATAS ANGGARAN (RP)</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[#899295] group-focus-within:text-[#86d2e5]">Rp</span>
                <input 
                  type="number"
                  {...register("amount", { valueAsNumber: true })}
                  placeholder="0"
                  className="w-full bg-[#181c1d] border border-white/5 rounded-3xl pl-16 pr-8 py-5 text-4xl font-black tracking-tighter focus:ring-4 focus:ring-[#86d2e5]/10 focus:border-[#86d2e5]/30 outline-none transition-all"
                />
              </div>
              {errors.amount && <p className="text-red-400 text-[10px] font-bold px-2">{errors.amount.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2 flex items-center gap-2">
                  <Tag size={12} /> Kategori
                </label>
                <select 
                  {...register("category_id")}
                  className="w-full bg-[#181c1d] border border-white/5 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#86d2e5]/20"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-400 text-[10px] font-bold px-2">{errors.category_id.message}</p>}
              </div>

              {/* Month */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2 flex items-center gap-2">
                  <Calendar size={12} /> Bulan
                </label>
                <input 
                  type="month"
                  {...register("month")}
                  className="w-full bg-[#181c1d] border border-white/5 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#86d2e5]/20"
                />
                {errors.month && <p className="text-red-400 text-[10px] font-bold px-2">{errors.month.message}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={closeBudgetModal}
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
                    <span>SIMPAN ANGGARAN</span>
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
