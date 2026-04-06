"use client";

import { Award, Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { togglePremiumStatus } from "@/actions/profile";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function MembershipCardClient({ profile }: any) {
  const [isTogglingPremium, setIsTogglingPremium] = useState(false);
  const { t, lang } = useLanguage();

  const handleTogglePremium = async () => {
    setIsTogglingPremium(true);
    const result = await togglePremiumStatus(!profile?.is_premium);
    if (result.error) toast.error(result.error);
    else toast.success(result.success);
    setIsTogglingPremium(false);
  };

  const isPremium = profile?.is_premium;

  return (
    <div className="bg-[#272b2c] rounded-[2.5rem] p-10 border border-[#899295]/10 shadow-inner relative overflow-hidden group premium-glow w-full" style={{ '--card-glow-rgb': isPremium ? '134, 210, 229' : '150, 150, 150' } as React.CSSProperties}>
       <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
       
       <h4 className="text-[10px] font-black text-[#899295] mb-8 flex items-center gap-3 relative z-10 uppercase tracking-[0.2em]">
         <Award size={18} className={isPremium ? "text-[#86d2e5]" : "text-[#899295]"}/> 
         {t("profile.membership_status")}
       </h4>
       
       <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#899295]/10 pb-8 mb-8 gap-10 relative z-10">
         <div>
            <p className={`text-4xl font-black font-headline mb-4 tracking-tighter ${isPremium ? 'text-[#86d2e5]' : 'text-[#e0e3e4]'}`}>
              {isPremium ? t("profile.membership_premium") : t("profile.membership_standard")}
            </p>
            <p className="text-xs text-[#899295] font-medium leading-relaxed max-w-md">
              {isPremium ? t("profile.membership_premium_desc") : t("profile.membership_standard_desc")}
            </p>
         </div>
         <button 
           onClick={handleTogglePremium}
           disabled={isTogglingPremium}
           className={`px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all outline-none border-none shrink-0 w-full md:w-auto flex items-center justify-center gap-3 disabled:opacity-50 ${
             isPremium 
               ? 'bg-[#1c2021] text-[#899295] border border-white/5 hover:text-white' 
               : 'bg-[#86d2e5] text-[#101415] hover:shadow-[0_0_20_rgba(134,210,229,0.3)] hover:scale-105 active:scale-95'
           }`}
         >
           {isTogglingPremium ? <Loader2 size={16} className="animate-spin" /> : (isPremium ? <Zap size={16} /> : <Award size={16} />)}
           {isPremium ? t("profile.downgrade") : t("profile.upgrade")}
         </button>
       </div>
       <div className="flex justify-between items-center text-[10px] text-[#899295] font-black uppercase tracking-[0.2em] relative z-10">
          <span>{lang === "id" ? "SIKLUS TAGIHAN AKTIF" : "ACTIVE BILLING CYCLE"}</span>
          <span className="text-[#e0e3e4] bg-[#323537] px-4 py-2 rounded-xl">
            {isPremium 
              ? (lang === "id" ? "Tahun Pertama (Selesai)" : "First Year (Completed)") 
              : (lang === "id" ? "Akses Dasar (Permanen)" : "Basic Access (Permanent)")}
          </span>
       </div>
    </div>
  );
}
