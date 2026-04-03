"use client";

import { WifiOff, RotateCw } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#101415] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 rounded-full bg-[#323537]/50 flex items-center justify-center text-[#ffb870] mb-8 animate-pulse">
        <WifiOff size={48} strokeWidth={1.5} />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-[#e0e3e4] mb-4">
        Koneksi Planet Anda Terputus
      </h1>
      
      <p className="text-[#899295] max-w-md text-sm md:text-base mb-10 leading-relaxed">
        Zenith Engine tidak dapat mendeteksi sinyal internet di perangkat Anda. Sebagian antarmuka Zenith disematkan secara luring, namun akses penuh membutuhkan koneksi aktif.
      </p>

      <button 
        onClick={() => window.location.reload()}
        className="group relative flex items-center gap-3 bg-[#e0e3e4] hover:bg-white text-[#101415] px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_40px_rgba(224,227,228,0.3)]"
      >
        <RotateCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
        Hubungkan Ulang
      </button>
    </div>
  );
}
