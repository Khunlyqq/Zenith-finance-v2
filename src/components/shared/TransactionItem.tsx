"use client";

import React, { useState } from "react";
import { Trash2, Loader2, Edit3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteTransaction } from "@/actions/transactions";

interface TransactionItemProps {
  tx: any;
  lang: string;
  view: "mobile" | "desktop" | "dashboard";
}

export default function TransactionItem({ tx, lang, view }: TransactionItemProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const locale = lang === 'id' ? 'id-ID' : 'en-US';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(lang === 'id' ? "Hapus transaksi ini secara permanen?" : "Delete this transaction permanently?")) return;
    
    setIsDeleting(true);
    const res = await deleteTransaction(tx.id);
    if (res.success) {
      toast.success(lang === 'id' ? "Transaksi dihapus" : "Transaction deleted");
      router.refresh();
    } else {
      toast.error(res.error || "Gagal menghapus");
      setIsDeleting(false);
    }
  };

  if (view === "desktop") {
    return (
      <tr 
        onClick={() => setShowOptions(!showOptions)}
        className={`group hover:bg-[#1c2021] transition-all cursor-pointer ${showOptions ? 'bg-[#1c2021]/50' : ''}`}
      >
        <td className="px-8 py-6">
          <div className="flex flex-col">
            <span className="text-sm font-black">
              {new Date(tx.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </td>
        <td className="px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-[#86d2e5]/10 flex items-center justify-center text-[#86d2e5] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">{tx.categories?.icon || 'payments'}</span>
            </div>
            <div>
              <p className="text-sm font-black tracking-tight truncate max-w-[240px] text-[#e0e3e4]">{tx.note || tx.categories?.name || (lang === 'id' ? 'Transaksi' : 'Transaction')}</p>
              <p className="text-[10px] font-black text-[#899295] uppercase tracking-widest opacity-60">{tx.categories?.name || (lang === 'id' ? 'Umum' : 'General')}</p>
            </div>
          </div>
        </td>
        <td className="px-8 py-6 text-center">
            <span className={`px-4 py-1.5 bg-[#323537] text-[9px] font-black rounded-full uppercase tracking-widest border border-[#899295]/10 ${tx.type === 'income' ? 'text-[#78dc77]' : 'text-[#ffb4ab]'}`}>
                {tx.type}
            </span>
        </td>
        <td className="px-8 py-6 text-center">
            <span className="text-[10px] font-black text-[#899295] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">{tx.wallets?.name || (lang === 'id' ? 'Utama' : 'Primary')}</span>
        </td>
        <td className="px-8 py-6 text-right">
          <span className={`text-base font-black ${tx.type === 'expense' ? 'text-[#ffb4ab]' : 'text-[#78dc77]'}`}>
            {tx.type === 'expense' ? '-' : '+'} Rp {new Intl.NumberFormat(locale).format(Math.abs(tx.amount))}
          </span>
        </td>
        <td className="px-8 py-6">
           <AnimatePresence>
              {(showOptions || isDeleting) && (
                 <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex justify-center gap-2"
                 >
                    <button 
                       onClick={handleDelete}
                       disabled={isDeleting}
                       className="p-2.5 bg-red-400/10 hover:bg-red-400 hover:text-white text-red-400 rounded-xl transition-all border border-red-400/20"
                    >
                       {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                    <button onClick={() => setShowOptions(false)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"><X size={16} /></button>
                 </motion.div>
              )}
           </AnimatePresence>
        </td>
      </tr>
    );
  }

  // Mobile / Dashboard View
  return (
    <motion.div 
      layout
      onClick={() => setShowOptions(!showOptions)}
      className={`bg-[#1c2021] p-4 rounded-2xl border border-white/5 flex flex-col justify-between group active:scale-[0.98] transition-all relative overflow-hidden h-full ${showOptions ? 'ring-2 ring-red-400/20' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-9 w-9 rounded-xl bg-[#86d2e5]/10 flex items-center justify-center text-[#86d2e5] border border-[#86d2e5]/10">
          <span className="material-symbols-outlined text-[18px]">{tx.categories?.icon || 'payments'}</span>
        </div>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${tx.type === 'income' ? 'text-[#78dc77] border-[#78dc77]/20 bg-[#78dc77]/5' : 'text-[#ffb4ab] border-[#ffb4ab]/20 bg-[#ffb4ab]/5'}`}>
          {tx.type.toUpperCase()}
        </span>
      </div>
      
      <div className="mb-4">
        <h4 className="text-[11px] font-black line-clamp-1 text-[#e0e3e4] mb-0.5">{tx.note || tx.categories?.name || (lang === 'id' ? 'Transaksi' : 'Transaction')}</h4>
        <p className="text-[8px] font-black text-[#899295] uppercase tracking-wider">{new Date(tx.date).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</p>
      </div>

      <div className="flex justify-between items-end mt-auto gap-2">
        <p className={`text-sm font-black ${tx.type === 'expense' ? 'text-[#ffb4ab]' : 'text-[#78dc77]'}`}>
          {tx.type === 'expense' ? '-' : '+'} 
          {Number(tx.amount) >= 1000000 
            ? `${(Number(tx.amount) / 1000000).toFixed(1)}jt` 
            : new Intl.NumberFormat(locale, { notation: 'compact' }).format(Math.abs(tx.amount))}
        </p>
        
        <AnimatePresence>
           {showOptions && (
             <motion.button 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.8, opacity: 0 }}
               onClick={handleDelete}
               disabled={isDeleting}
               className="w-10 h-10 rounded-xl bg-red-400/20 text-red-400 flex items-center justify-center border border-red-400/30"
             >
               {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
             </motion.button>
           )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
