"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "@/components/providers/ModalProvider";
import { createClient } from "@/lib/supabase/client";
import { createTransaction } from "@/actions/transactions";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionInput } from "@/lib/validations/transaction";
import { X, Plus, Wallet, Tag, Calendar, PenLine, Sparkles, Camera, Loader2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function TransactionModal() {
  const { isTransactionModalOpen, closeTransactionModal } = useModal();
  const [categories, setCategories] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingScan, setFetchingScan] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
    },
  });

  const transactionType = watch("type");

  useEffect(() => {
    if (isTransactionModalOpen) {
      fetchData();
    }
  }, [isTransactionModalOpen]);

  async function fetchData() {
    const [catRes, wallRes, userRes] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("wallets").select("*").order("name"),
      supabase.auth.getUser()
    ]);

    if (catRes.data) setCategories(catRes.data);
    if (wallRes.data) {
      setWallets(wallRes.data);
      if (wallRes.data.length > 0) {
        setValue("wallet_id", wallRes.data[0].id);
      }
    }
    
    if (userRes.data?.user) {
      const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', userRes.data.user.id).single();
      setIsPremium(profile?.is_premium || false);
    }
  }

  const handleSmartScan = () => {
    if (!isPremium) {
      toast.error("Fitur Pindai Struk Pintar dengan AI hanya tersedia untuk akun Zenith Premium.", { icon: <Lock size={16} /> });
      return;
    }
    setFetchingScan(true);
    // Simulate AI parsing a receipt
    setTimeout(() => {
      setValue("amount", 85000);
      setValue("note", "Makan Malam (Struk Terscan)");
      setValue("type", "expense");
      toast.success("Struk berhasil dipindai dan dikategorikan oleh AI!", { icon: <Sparkles size={16} className="text-[#ffb870]"/> });
      setFetchingScan(false);
    }, 2000);
  };

  const onSubmit: SubmitHandler<TransactionInput> = async (data) => {
    if (!navigator.onLine) {
      const pendingStr = localStorage.getItem('zenith_pending_tx') || '[]';
      const pending = JSON.parse(pendingStr);
      pending.push({ ...data, _id: crypto.randomUUID(), createdAt: new Date().toISOString() });
      localStorage.setItem('zenith_pending_tx', JSON.stringify(pending));
      
      toast.success("Tersimpan Luring! Menunggu koneksi kembali...");
      reset();
      closeTransactionModal();
      return;
    }

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        formData.append(k, String(v));
      }
    });

    const result = await createTransaction(null, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      reset();
      closeTransactionModal();
      setLoading(false);
    }
  }

  if (!isTransactionModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeTransactionModal}
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
              <h3 className="text-2xl font-black font-headline tracking-tighter">Catat Transaksi</h3>
              <p className="text-[10px] text-[#899295] font-black uppercase tracking-widest mt-1">THE DIGITAL CURATOR FLOW</p>
            </div>
            <button 
              onClick={closeTransactionModal}
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

            {/* AI Auto Scan Button */}
            <button
               type="button"
               onClick={handleSmartScan}
               disabled={fetchingScan}
               className={`w-full relative overflow-hidden group flex items-center justify-center gap-2 py-3.5 rounded-2xl border transition-all ${
                 isPremium 
                 ? "bg-gradient-to-r from-[#ffb870]/10 to-[#ff9838]/5 border-[#ffb870]/30 hover:border-[#ffb870]/50 text-[#ffb870]" 
                 : "bg-[#181c1d] border-white/5 text-[#899295] hover:bg-[#1c2021] hover:text-[#86d2e5]"
               }`}
            >
              {fetchingScan ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Camera size={16} className={isPremium ? "text-[#ffb870]" : "text-[#899295]"} />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest z-10">
                {fetchingScan ? "AI Membaca Struk..." : isPremium ? "Pindai Struk AI" : "Pindai Struk (Premium)"}
              </span>
              {isPremium && <Sparkles size={14} className="absolute right-4 text-[#ffb870]/50 group-hover:text-[#ffb870] transition-colors" />}
            </button>

            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-4 p-1.5 bg-[#181c1d] rounded-2xl border border-white/5">
              <button
                type="button"
                onClick={() => setValue("type", "expense")}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  transactionType === "expense" 
                    ? "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20" 
                    : "text-[#899295] hover:text-white"
                }`}
              >
                PENGELUARAN
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "income")}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  transactionType === "income" 
                    ? "bg-[#78dc77]/10 text-[#78dc77] border border-[#78dc77]/20" 
                    : "text-[#899295] hover:text-white"
                }`}
              >
                PEMASUKAN
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2">NOMINAL (RP)</label>
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
              {/* Wallet Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2 flex items-center gap-2">
                  <Wallet size={12} /> Dompet
                </label>
                <select 
                  {...register("wallet_id")}
                  className="w-full bg-[#181c1d] border border-white/5 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#86d2e5]/20"
                >
                  <option value="">Pilih Dompet</option>
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                {errors.wallet_id && <p className="text-red-400 text-[10px] font-bold">{errors.wallet_id.message}</p>}
              </div>

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
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2 flex items-center gap-2">
                  <Calendar size={12} /> Tanggal
                </label>
                <input 
                  type="date"
                  {...register("date")}
                  className="w-full bg-[#181c1d] border border-white/5 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#86d2e5]/20"
                />
                {errors.date && <p className="text-red-400 text-[10px] font-bold">{errors.date.message}</p>}
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#899295] uppercase tracking-widest px-2 flex items-center gap-2">
                  <PenLine size={12} /> Catatan
                </label>
                <input 
                  type="text"
                  {...register("note")}
                  placeholder="Kopi pagi ini..."
                  className="w-full bg-[#181c1d] border border-white/5 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#86d2e5]/20"
                />
                {errors.note && <p className="text-red-400 text-[10px] font-bold">{errors.note.message}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={closeTransactionModal}
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
                    <span>SIMPAN TRANSAKSI</span>
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
