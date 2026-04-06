"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ReceiptText, 
  Wallet, 
  PiggyBank, 
  BarChart3, 
  PlusCircle,
  FileDown 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { downloadCSV } from "@/lib/utils/export";
import { toast } from "sonner";
import { useModal } from "@/components/providers/ModalProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const { openTransactionModal, openWalletModal, openBudgetModal, openSavingsModal } = useModal();
  const { t, lang } = useLanguage();

  const navItems = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: "dashboard" },
    { name: t("nav.transactions"), href: "/transaksi", icon: "receipt_long" },
    { name: t("nav.budgets"), href: "/anggaran", icon: "account_balance_wallet" },
    { name: t("nav.savings"), href: "/tabungan", icon: "savings" },
    { name: t("nav.reports"), href: "/laporan", icon: "analytics" },
  ];

  return (
    <aside className="h-screen fixed left-0 top-0 w-72 hidden md:flex flex-col bg-[#101415] font-['Plus_Jakarta_Sans'] antialiased tracking-tight shadow-[32px_0_32px_-4px_rgba(0,0,0,0.06)] z-50">
      <div className="flex flex-col h-full p-6 space-y-2">
        {/* Brand */}
        <div className="mb-10 px-4">
          <h1 className="text-2xl font-bold tracking-tighter text-[#86d2e5]">Zenith</h1>
          <p className="text-xs text-[#899295] font-medium tracking-widest uppercase mt-1">THE DIGITAL CURATOR</p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 ease-in-out active:scale-95 ${
                  isActive 
                    ? "bg-[#006778]/20 text-[#86d2e5] font-semibold" 
                    : "text-[#bec8cb] hover:text-[#86d2e5] hover:bg-[#1c2021]"
                }`}
              >
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA Section */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={openWalletModal}
            className="group flex items-center justify-center gap-2 bg-[#1c2021] border border-white/5 text-[#899295] hover:text-[#86d2e5] hover:border-[#86d2e5]/30 py-4 px-6 rounded-xl transition-all active:scale-95 text-xs font-black uppercase tracking-widest"
          >
            <Wallet size={18} className="group-hover:scale-110 transition-transform" />
            <span>{t("common.add_wallet")}</span>
          </button>
          <button 
            onClick={async () => {
              if (pathname === "/laporan") {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                  .from("transactions")
                  .select("*, categories(name), wallets(name)")
                  .eq("user_id", user.id)
                  .order("date", { ascending: false });

                if (error) {
                  toast.error(t("common.download_error"));
                  return;
                }

                if (!data || data.length === 0) {
                  toast.error(t("common.no_data"));
                  return;
                }

                // Flatten data for CSV
                const locale = lang === "id" ? "id-ID" : "en-US";
                const flattenedData = data.map((tx: any) => ({
                  [t("common.date")]: new Date(tx.date).toLocaleDateString(locale),
                  [t("common.note")]: tx.note || "",
                  [t("common.category")]: tx.categories?.name || "",
                  [t("common.wallet")]: tx.wallets?.name || "",
                  [t("common.type")]: tx.type === "income" ? t("common.income") : t("common.expense"),
                  [t("common.amount")]: tx.amount
                }));

                downloadCSV(flattenedData, `Zenith_Report_${new Date().toISOString().split('T')[0]}`);
                toast.success(t("common.download_success"));
              } else if (pathname === "/anggaran") {
                openBudgetModal();
              } else if (pathname === "/tabungan") {
                openSavingsModal();
              } else {
                openTransactionModal();
              }
            }}
            className="bg-gradient-to-br from-[#86d2e5] to-[#006778] text-[#97e3f6] font-black py-4 px-6 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
          >
            {pathname === "/laporan" ? <FileDown size={18} /> : <PlusCircle size={18} />}
            <span>
              {pathname === "/anggaran" ? t("common.add_budget") : 
               pathname === "/tabungan" ? t("common.add_savings") : 
               pathname === "/laporan" ? t("common.download_report") : t("common.add_transaction")}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

