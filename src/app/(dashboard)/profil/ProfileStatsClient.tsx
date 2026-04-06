"use client";

import { Activity, CreditCard } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ProfileStatsClient({ 
  txCount, 
  walletCount 
}: { 
  txCount: number, 
  walletCount: number 
}) {
  const { t, lang } = useLanguage();

  return (
    <div className="flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      <div 
        className="min-w-[85%] md:min-w-0 snap-center bg-[#181c1d] rounded-[2.5rem] p-8 border border-[#899295]/5 hover:bg-[#1c2021] transition-all group premium-glow flex flex-col justify-center" 
        style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
      >
        <div className="w-14 h-14 bg-[#78dc77]/10 rounded-2xl flex items-center justify-center text-[#78dc77] mb-6 group-hover:scale-110 transition-transform">
          <Activity size={24} />
        </div>
        <p className="text-[10px] text-[#899295] font-black uppercase tracking-[0.2em] mb-2">{t("profile.activity")}</p>
        <h3 className="text-4xl font-black font-headline text-[#e0e3e4] tracking-tighter">
          {txCount}
          <span className="text-sm opacity-40 ml-2 uppercase">
            {lang === "id" ? "TRANSAKSI" : "TRANSACTIONS"}
          </span>
        </h3>
      </div>

      <div 
        className="min-w-[85%] md:min-w-0 snap-center bg-[#181c1d] rounded-[2.5rem] p-8 border border-[#899295]/5 hover:bg-[#1c2021] transition-all group premium-glow flex flex-col justify-center" 
        style={{ '--card-glow-rgb': '255, 184, 112' } as React.CSSProperties}
      >
        <div className="w-14 h-14 bg-[#ffb870]/10 rounded-2xl flex items-center justify-center text-[#ffb870] mb-6 group-hover:scale-110 transition-transform">
          <CreditCard size={24} />
        </div>
        <p className="text-[10px] text-[#899295] font-black uppercase tracking-[0.2em] mb-2">{t("profile.wallets")}</p>
        <h3 className="text-4xl font-black font-headline text-[#e0e3e4] tracking-tighter">
          {walletCount}
          <span className="text-sm opacity-40 ml-2 uppercase">
            {lang === "id" ? "AKUN" : "ACCOUNTS"}
          </span>
        </h3>
      </div>
    </div>
  );
}
