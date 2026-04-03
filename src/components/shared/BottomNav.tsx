"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Beranda", href: "/dashboard", icon: "dashboard" },
  { name: "Mutasi", href: "/transaksi", icon: "receipt_long" },
  { name: "Anggaran", href: "/anggaran", icon: "account_balance_wallet" },
  { name: "Tabungan", href: "/tabungan", icon: "savings" },
  { name: "Laporan", href: "/laporan", icon: "analytics" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#181c1d]/80 backdrop-blur-3xl border-t border-white/5 z-50 md:hidden flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-200 active:scale-90 ${
              isActive ? "text-[#86d2e5]" : "text-[#899295]"
            }`}
          >
            <span 
              className="material-symbols-outlined text-[24px]" 
              style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
            {isActive && (
              <span className="w-1 h-1 bg-[#86d2e5] rounded-full absolute bottom-3"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
