"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: "dashboard" },
    { name: t("nav.transactions"), href: "/transaksi", icon: "receipt_long" },
    { name: t("nav.budgets"), href: "/anggaran", icon: "account_balance_wallet" },
    { name: t("nav.savings"), href: "/tabungan", icon: "savings" },
    { name: t("nav.reports"), href: "/laporan", icon: "analytics" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#181c1d]/90 backdrop-blur-3xl border-t border-white/5 z-50 md:hidden flex items-center justify-around px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1.5 w-full h-full transition-all duration-300 relative group ${
              isActive ? "text-[#86d2e5]" : "text-[#899295] hover:text-white/60"
            }`}
          >
            <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100 group-active:scale-90'}`}>
              <span 
                className="material-symbols-outlined text-[26px]" 
                style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}, 'wght' 400` }}
              >
                {item.icon}
              </span>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}>
              {item.name}
            </span>
            
            {isActive && (
              <motion.div 
                layoutId="bottomNavDot"
                className="absolute bottom-2 w-1.5 h-1.5 bg-[#86d2e5] rounded-full shadow-[0_0_12px_#86d2e5]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
