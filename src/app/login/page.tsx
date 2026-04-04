"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { login } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";


export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="h-screen flex flex-col editorial-gradient bg-surface text-on-surface font-body overflow-hidden">
      {/* Top Navigation */}
      <header className="w-full top-0 sticky bg-[#101415] flex justify-between items-center px-6 py-4 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-br from-[#86d2e5] to-[#006778] bg-clip-text text-transparent font-headline tracking-tight">
            Dompetku
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-2 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.07] pointer-events-none">
          <img 
            alt="abstract geometric 3D wireframe mesh" 
            className="w-full h-full object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmiJqrwTpfvh2M6IK1-3X8x1rS_29RyPCrbMUtTlDlHdxLO5ii9GipCWavK__e67IDcWUUNMUc-ppkfmbB8peBdEMhLLbEqU3UjjiUOpjkRgQs2xYzwoYAvFPNlcmijR0xZO986pnpfQD_r5S-docTYZWn72zVFt1NzDGNfDJc5RdFiO4Qmqa32P19j2hB6Vq0ruBtTxspuxTca1EHJkvwjIc5kPw_Wed9v3nEE8ckd9xieP17yZp2n-5I4j3CZ3g-2S4HpVxuNxY3"
          />
        </div>

        {/* Integrated Container */}
        <div 
          className="container max-w-5xl mx-auto flex flex-col md:flex-row glass-panel rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/20 z-10 premium-glow"
          style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
        >
          {/* Left Side: Informational Pane */}
          <div className="hidden md:flex w-2/5 bg-[#141819] border-r border-[#899295]/10 flex-col justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#86d2e5]/5 to-transparent pointer-events-none"></div>
            
            <div className="w-full relative z-10 space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#86d2e5] to-[#006778] rounded-[1.5rem] flex items-center justify-center text-[#101415] mb-8 shadow-2xl shadow-[#86d2e5]/20">
                <span className="material-symbols-outlined text-3xl">insights</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-headline font-extrabold text-[#e0e3e4] leading-tight">
                Zaman Baru<br/>Manajemen Aset.
              </h2>
              <p className="text-[#899295] text-sm leading-relaxed pr-4">
                Platform intelijen finansial yang memadukan keamanan level perbankan dengan antarmuka yang sangat premium dan terkurasi.
              </p>
              
              <div className="space-y-4 pt-8 mt-8 border-t border-white/5">
                <div className="flex items-center gap-4 bg-[#101415] p-3 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-[#78dc77]/10 flex items-center justify-center text-[#78dc77]">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#e0e3e4] tracking-wider uppercase">Keamanan Biometrik Lapis Baja</span>
                </div>
                <div className="flex items-center gap-4 bg-[#101415] p-3 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-[#ffb870]/10 flex items-center justify-center text-[#ffb870]">
                    <span className="material-symbols-outlined text-[18px]">sync_saved_locally</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#e0e3e4] tracking-wider uppercase">Sinkronisasi PWA Luring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form Pane */}
          <div className="w-full md:w-3/5 p-8 md:p-14">
            <div className="mb-10">
              <p className="text-primary font-headline font-bold text-xs tracking-[0.3em] mb-4 uppercase">The Digital Curator</p>
              <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight leading-tight mb-3">
                Selamat Datang Kembali
              </h1>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
                Silakan masuk untuk mengelola portofolio keuangan Anda dengan teknologi tercanggih.
              </p>
            </div>

            <form action={formAction} className="space-y-6">
              {state?.error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs py-3 px-4 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {state.error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary/80 ml-1 uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    alternate_email
                  </span>
                  <input 
                    name="email"
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com" 
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wider">Password</label>
                  <Link href="#" className="text-xs font-medium text-primary hover:text-primary-fixed-dim transition-colors">
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input 
                    name="password"
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary/40 transition-all font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <span 
                    onClick={() => setShowPassword(!showPassword)}
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer hover:text-on-surface transition-colors"
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold py-4 rounded-xl scale-100 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Memproses..." : "Masuk Sekarang"}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/20"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-[#181c1d] px-4 text-outline">ATAU LANJUTKAN DENGAN</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              type="button"
              className="w-full bg-surface-container-high border border-outline-variant/20 text-on-surface font-medium py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-surface-variant transition-colors group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Masuk dengan Google
            </button>

            <p className="mt-10 text-center text-sm text-on-surface-variant">
              Belum punya akun?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline transition-all">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-outline/50 gap-4">
        <div className="flex items-center gap-2">
          <p>© 2024 Dompetku. Dikurasi untuk Kebebasan Finansial.</p>
          <span className="px-2 py-0.5 bg-white/5 rounded-full text-[9px] font-bold text-primary/40 border border-white/5">v2.1.0</span>
        </div>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
          <Link href="#" className="hover:text-primary transition-colors">Syarat &amp; Ketentuan</Link>
        </div>
      </footer>
    </div>
  );
}
