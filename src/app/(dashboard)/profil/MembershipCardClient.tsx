"use client";

import { Award, Loader2 } from "lucide-react";
import { useState } from "react";
import { togglePremiumStatus } from "@/actions/profile";
import { toast } from "sonner";

export default function MembershipCardClient({ profile }: any) {
  const [isTogglingPremium, setIsTogglingPremium] = useState(false);

  const handleTogglePremium = async () => {
    setIsTogglingPremium(true);
    const result = await togglePremiumStatus(!profile?.is_premium);
    if (result.error) toast.error(result.error);
    else toast.success(result.success);
    setIsTogglingPremium(false);
  };

  return (
    <div className="bg-[#272b2c] rounded-[2.5rem] p-10 border border-[#899295]/10 shadow-inner relative overflow-hidden group premium-glow w-full" style={{ '--card-glow-rgb': profile?.is_premium ? '255, 184, 112' : '134, 210, 229' } as React.CSSProperties}>
       <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
       
       <h4 className="text-sm font-black text-[#e0e3e4] mb-8 flex items-center gap-3 relative z-10">
         <Award size={20} className={profile?.is_premium ? "text-[#ffb870]" : "text-[#86d2e5]"}/> 
         STATUS KEANGGOTAAN
       </h4>
       
       <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#899295]/10 pb-8 mb-8 gap-6 relative z-10">
         <div>
           <p className={`text-3xl font-black font-headline mb-2 ${profile?.is_premium ? 'text-[#ffb870]' : 'text-[#86d2e5]'}`}>
             {profile?.is_premium ? 'Zenith Premium' : 'Zenith Standard'}
           </p>
           <p className="text-sm text-[#bec8cb] font-medium leading-relaxed max-w-md">
             {profile?.is_premium 
              ? 'Status teratas finansial. Anda memiliki akses tanpa batas ke semua wawasan AI, pelaporan otomatis, dan pelacakan tak terhingga.' 
              : 'Akun dasar dengan fungsionalitas pencatatan esensial. Optimalkan perjalanan finansial Anda dengan paket berkelanjutan.'}
           </p>
         </div>
         <button 
           onClick={handleTogglePremium}
           disabled={isTogglingPremium}
           className="bg-gradient-to-r from-[#86d2e5] to-[#006778] text-[#003842] px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(134,210,229,0.2)] hover:scale-105 active:scale-95 transition-all outline-none border-none shrink-0 w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50"
         >
           {isTogglingPremium ? <Loader2 size={16} className="animate-spin" /> : null}
           {profile?.is_premium ? "Downgrade Standard" : "Upgrade Premium"}
         </button>
       </div>
       <div className="flex justify-between items-center text-[10px] text-[#899295] font-black uppercase tracking-[0.2em] relative z-10">
          <span>SIKLUS TAGIHAN AKTIF</span>
          <span className="text-[#e0e3e4] bg-[#323537] px-4 py-2 rounded-xl">{profile?.is_premium ? 'Tahun Pertama (Selesai)' : 'Akses Dasar (Permanen)'}</span>
       </div>
    </div>
  );
}
