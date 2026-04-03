import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#101415]/80 backdrop-blur-md">
      <div className="relative">
        {/* Exterior pulsing ring */}
        <div className="absolute inset-[-12px] rounded-full border-2 border-[#86d2e5]/20 animate-ping opacity-20"></div>
        
        {/* Rotating modern segments */}
        <div className="w-16 h-16 border-4 border-[#86d2e5]/10 border-t-[#86d2e5] rounded-full animate-spin"></div>
        
        {/* Center branding dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-[#86d2e5] rounded-full shadow-[0_0_15px_rgba(134,210,229,0.8)]"></div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#86d2e5] animate-pulse">Zenith Finance</h2>
        <p className="text-[10px] text-[#899295] font-bold uppercase tracking-widest opacity-60">Mensikronkan Data Keuangan...</p>
      </div>
    </div>
  );
}
