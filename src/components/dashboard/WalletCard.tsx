"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Wallet, Check, X } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface WalletCardProps {
  wallets: any[];
  lang: string;
  title: string;
}

export default function WalletCard({ wallets, lang, title }: WalletCardProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string | "all">("all");

  const totalBalance = wallets.reduce((sum, w) => sum + (Number(w.balance) || 0), 0);
  
  const selectedWallet = selectedWalletId === "all" 
    ? { name: title, balance: totalBalance }
    : wallets.find(w => w.id === selectedWalletId);

  const locale = lang === "id" ? "id-ID" : "en-US";

  return (
    <div className="relative">
      {/* 💳 Digital Wallet Hero Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-br from-[#86d2e5] to-[#006778] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 flex flex-col justify-between min-h-[200px] md:min-h-[300px] shadow-2xl relative overflow-hidden group premium-glow glow-pulse cursor-pointer transition-all"
        style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
      >
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="flex items-center gap-2 opacity-70">
              <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">{selectedWallet?.name}</span>
            </div>
            <div className="bg-white/10 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronDown size={16} className="text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 md:gap-3">
            <span className="text-white/80 text-xl md:text-2xl font-bold">Rp</span>
            <h3 className="text-white text-4xl md:text-6xl font-black tracking-tighter -ml-1">
              {new Intl.NumberFormat(locale).format(selectedWallet?.balance || 0)}
            </h3>
          </div>
        </div>

        <div className="relative z-10 mt-6 md:mt-10 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">
              {t("transactions.sync_active")}
            </span>
            <h4 className="text-white font-headline text-base md:text-lg font-black">
              {wallets?.length || 0} {lang === "id" ? "Dompet" : "Wallets"}
            </h4>
          </div>
          <div className="hidden md:flex">
            <span className="bg-[#78dc77]/20 text-[#78dc77] px-4 py-2 rounded-full text-[10px] font-black flex items-center gap-2 border border-[#78dc77]/20 backdrop-blur-md uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> 
              {t("dashboard.protection_active")}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Wallet Selector Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#0a0c0d]/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[#181c1d] border border-white/5 rounded-[2.5rem] shadow-3xl overflow-hidden p-6"
            >
               <div className="flex justify-between items-center mb-6 px-2">
                  <div>
                    <h3 className="text-lg font-black font-headline tracking-tighter uppercase">{t("transactions.choose_wallet")}</h3>
                    <p className="text-[9px] text-[#899295] font-black uppercase tracking-[0.2em]">{t("dashboard.asset_management")}</p>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#899295] hover:text-white transition-colors">
                    <X size={20} />
                  </button>
               </div>

               <div className="space-y-4 pb-2">
                  {/* Option: All Wallets */}
                  <button 
                    onClick={() => { setSelectedWalletId("all"); setIsOpen(false); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedWalletId === "all" ? "bg-gradient-to-r from-[#86d2e5]/20 to-[#006778]/10 border-[#86d2e5]/30 shadow-lg" : "bg-white/5 border-transparent hover:bg-white/10"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#86d2e5] to-[#006778] flex items-center justify-center text-white">
                        <Wallet size={20} />
                      </div>
                      <div className="text-left">
                        <p className={`text-xs font-black ${selectedWalletId === "all" ? "text-white" : "text-[#899295]"}`}>{title}</p>
                        <p className="text-[10px] text-[#86d2e5] font-black">Rp {new Intl.NumberFormat(locale).format(totalBalance)}</p>
                      </div>
                    </div>
                    {selectedWalletId === "all" && <Check size={18} className="text-[#86d2e5]" />}
                  </button>

                  <div className="h-px bg-white/5 mx-2 my-2"></div>

                  <div className="max-h-[220px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                    {wallets.map((w) => (
                      <button 
                        key={w.id}
                        onClick={() => { setSelectedWalletId(w.id); setIsOpen(false); }}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedWalletId === w.id ? "bg-white/10 border-[#86d2e5]/30 shadow-lg" : "bg-white/5 border-transparent hover:bg-white/10"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#323537] flex items-center justify-center text-[#ffb870]">
                            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                          </div>
                          <div className="text-left">
                            <p className={`text-xs font-black ${selectedWalletId === w.id ? "text-white" : "text-[#899295]"}`}>{w.name}</p>
                            <p className="text-[10px] text-[#78dc77] font-black">Rp {new Intl.NumberFormat(locale).format(w.balance)}</p>
                          </div>
                        </div>
                        {selectedWalletId === w.id && <Check size={18} className="text-[#86d2e5]" />}
                      </button>
                    ))}
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
