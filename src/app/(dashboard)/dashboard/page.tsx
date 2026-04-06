import { 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal, 
  Utensils, 
  Wallet, 
  Car,
  Receipt,
  Sparkles,
  Lock
} from "lucide-react";
import CategoryDonut from "@/components/charts/CategoryDonut";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCachedUser } from "@/lib/supabase/user";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import EmptyState from "@/components/shared/EmptyState";
import { getServerTranslation } from "@/lib/i18n/server";
import WalletCard from "@/components/dashboard/WalletCard";


// Fast Section: Hero Stats & Budget
async function HeroStats() {
  const { t, lang } = await getServerTranslation();
  const user = await getCachedUser();
  const supabase = await createClient();
  
  // Current month range
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [walletsRes, transactionsRes] = await Promise.all([
    supabase.from("wallets").select("*").eq("user_id", user?.id),
    supabase.from("transactions").select("amount, type").eq("user_id", user?.id).gte("date", firstDay)
  ]);

  const wallets = walletsRes.data || [];
  const monthlyTransactions = transactionsRes.data || [];
  const isPremium = true; // Premium for All (v2.3.3)

  const totalBalance = wallets.reduce((sum: number, w: any) => sum + (Number(w.balance) || 0), 0);
  const monthlyInflow = monthlyTransactions
    .filter((tx: any) => tx.type === 'income')
    .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);
  const monthlyOutflow = monthlyTransactions
    .filter((tx: any) => tx.type === 'expense')
    .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);

  const locale = lang === "id" ? "id-ID" : "en-US";

  let insightText = "";
  if (monthlyInflow === 0 && monthlyOutflow === 0) {
    insightText = lang === "id" 
      ? "Sistem AI sedang menunggu transaksi pertama Anda bulan ini untuk memulai pemetaan prediktif pola arus kas."
      : "AI system is waiting for your first transaction this month to begin predictive cash flow mapping.";
  } else if (monthlyOutflow > monthlyInflow) {
    const ratio = Math.round((monthlyOutflow / monthlyInflow) * 100);
    insightText = lang === "id"
      ? `Peringatan Burn Rate: Laju tagihan Anda mencapai ${ratio}% dari perolehan bulan ini. Kurasi ulang dana pasif Anda minggu ini untuk menghindari penyusutan aset.`
      : `Burn Rate Warning: Your burn rate has reached ${ratio}% of this month's income. Refactor your passive funds this week to avoid asset depletion.`;
  } else {
    const savings = monthlyInflow - monthlyOutflow;
    const ratio = Math.round((savings / monthlyInflow) * 100);
    insightText = lang === "id"
      ? `Akselerasi Kurasi Positif: Algoritma Zenith mendeteksi Anda sukses menyelamatkan ${ratio}% potensi likuiditas. Pertahankan struktur ini!`
      : `Positive Curation Acceleration: Zenith algorithms detected you successfully saved ${ratio}% of liquidity potential. Maintain this structure!`;
  }

  return (
    <section className="flex flex-col gap-8">
      <WalletCard 
        initialBalance={totalBalance}
        wallets={wallets}
        lang={lang}
        title={t("dashboard.wallet_title")}
      />

      {/* 📊 Horizontal Snap Stats — Mobile-First */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-2 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div 
          className="min-w-full md:min-w-0 snap-center bg-[#181c1d] rounded-3xl p-6 md:p-8 flex flex-col justify-center border-l-8 border-[#78dc77] shadow-xl hover:bg-[#1c2021] transition-all relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform hidden md:block">
              <TrendingUp size={96} className="text-[#78dc77]" />
          </div>
          <p className="text-[#899295] text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">{t("dashboard.inflow")}</p>
          <p className="text-[#78dc77] text-2xl md:text-4xl font-black tracking-tighter relative z-10">
            + {new Intl.NumberFormat(locale).format(monthlyInflow)}
          </p>
        </div>

        <div 
          className="min-w-full md:min-w-0 snap-center bg-[#181c1d] rounded-3xl p-6 md:p-8 flex flex-col justify-center border-l-8 border-[#ffb4ab] shadow-xl hover:bg-[#1c2021] transition-all relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '255, 180, 171' } as React.CSSProperties}
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform hidden md:block">
              <TrendingDown size={96} className="text-[#ffb4ab]" />
          </div>
          <p className="text-[#899295] text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">{t("dashboard.outflow")}</p>
          <p className="text-[#ffb4ab] text-2xl md:text-4xl font-black tracking-tighter relative z-10">
            - {new Intl.NumberFormat(locale).format(monthlyOutflow)}
          </p>
        </div>
      </div>

      {/* 🤖 Premium AI Insights Segment */}
      <div 
        className="relative overflow-hidden bg-[#181c1d] rounded-[2.5rem] border border-white/5 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 premium-glow group"
        style={{ '--card-glow-rgb': isPremium ? '255, 184, 112' : '134, 210, 229'} as React.CSSProperties}
      >
        <div className={`w-16 h-16 shrink-0 flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${isPremium ? 'from-[#ffb870] to-[#ff9838]' : 'from-[#323537] to-[#181c1d] border border-white/5'} shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
          <Sparkles size={28} className={isPremium ? "text-[#101415]" : "text-[#899295]"} />
        </div>
        
        <div className="flex-1 relative w-full text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
             <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${isPremium ? 'text-[#ffb870]' : 'text-[#899295]'}`}>{lang === "id" ? "Intelijen AI Zenith" : "Zenith AI Intelligence"}</h4>
             <span className="w-1.5 h-1.5 rounded-full bg-[#ffb870] animate-pulse"></span>
          </div>
          <p className="text-[#e0e3e4] text-sm md:text-lg leading-relaxed font-medium">
            {insightText}
          </p>
        </div>


        {isPremium && (
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#ffb870]/5 rounded-full blur-3xl group-hover:bg-[#ffb870]/10 transition-all pointer-events-none -translate-y-1/2 translate-x-1/2 duration-700"></div>
        )}
      </div>
    </section>
  )
}


// Heavy Section: Transactions
async function RecentTransactions() {
  const { t, lang } = await getServerTranslation();
  const user = await getCachedUser();
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, categories(*)")
    .eq("user_id", user?.id)
    .order("date", { ascending: false })
    .limit(5);

  const locale = lang === "id" ? "id-ID" : "en-US";

  return (
    <div 
      className="bg-[#181c1d] p-8 rounded-4xl border border-[#899295]/5 premium-glow relative overflow-hidden h-full"
      style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
    >
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h3 className="text-xl font-bold tracking-tight">{t("dashboard.recent_tx")}</h3>
        <Link href="/transaksi" className="text-[#86d2e5] text-xs font-bold uppercase tracking-widest hover:underline">{t("dashboard.see_all")}</Link>
      </div>
      
      <div className="space-y-6 relative z-10">
        {transactions?.map((tx: any) => (
          <div key={tx.id} className="flex items-center gap-4 hover:bg-[#272b2c] active:bg-[#272b2c] p-3 md:p-2 rounded-2xl transition-all cursor-pointer group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#323537] rounded-xl flex items-center justify-center text-[#ffb870] group-hover:scale-110 group-active:scale-95 transition-transform shrink-0">
              <span className="material-symbols-outlined text-[18px] md:text-[20px]">{tx.categories?.icon || 'payments'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[#e0e3e4] text-sm md:text-base truncate">{tx.note || tx.categories?.name || (lang === "id" ? 'Transaksi' : 'Transaction')}</h4>
              <p className="text-[9px] md:text-[10px] text-[#899295] font-black uppercase tracking-widest opacity-60">
                {new Date(tx.date).toLocaleDateString(locale, { day: 'numeric', month: 'short' })} • {tx.categories?.name || (lang === "id" ? 'Umum' : 'General')}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-black text-sm md:text-base ${tx.type === 'expense' ? 'text-[#ffb4ab]' : 'text-[#78dc77]'}`}>
                {tx.type === 'expense' ? '-' : '+'} Rp {new Intl.NumberFormat(locale, { notation: 'compact' }).format(Math.abs(tx.amount))}
              </p>
            </div>
          </div>
        ))}

        {(!transactions || transactions.length === 0) && (
          <div className="py-8">
            <EmptyState 
              title={lang === "id" ? "Belum Ada Transaksi" : "No Transactions Yet"}
              description={lang === "id" ? "Catatan keuanganmu masih kosong. Mari mulai dengan mencatat transaksi pertama hari ini!" : "Your financial records are empty. Let's start by recording your first transaction today!"}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Analysis Section: Category Spending
async function CategoryAnalysis() {
  const { t, lang } = await getServerTranslation();
  const user = await getCachedUser();
  const supabase = await createClient();
  
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, category_id, type, categories(name, icon)")
    .eq("user_id", user?.id)
    .eq("type", "expense")
    .gte("date", firstDay);

  const spendingMap: Record<string, { amount: number, name: string, icon: string }> = {};
  
  (transactions || []).forEach((tx: any) => {
    const catId = tx.category_id || 'unknown';
    if (!spendingMap[catId]) {
      spendingMap[catId] = { 
        amount: 0, 
        name: (tx.categories as any)?.name || (lang === "id" ? 'Lainnya' : 'Others'),
        icon: (tx.categories as any)?.icon || 'payments'
      };
    }
    spendingMap[catId].amount += Number(tx.amount);
  });

  const colors = ["#86d2e5", "#78dc77", "#ffb870", "#ffb4ab", "#bec8cb"];
  const sortedStats = Object.entries(spendingMap)
    .map(([id, info]) => ({
      category: id,
      amount: info.amount,
      label: info.name,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5) // Show top 5
    .map((item, idx) => ({
      ...item,
      fill: `url(#${item.category}Grad)`,
      color: colors[idx % colors.length]
    }));

  return (
    <div className="lg:col-span-6 bg-[#181c1d] rounded-3xl p-8 flex flex-col shadow-lg premium-glow cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300" style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}>
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-lg font-bold text-[#e0e3e4]">{lang === "id" ? "Analisis Kategori" : "Category Analysis"}</h3>
        <button className="text-[#86d2e5] hover:bg-[#86d2e5]/10 p-2 rounded-xl transition-all"><MoreHorizontal size={20} /></button>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {sortedStats.length > 0 ? (
          <CategoryDonut data={sortedStats} />
        ) : (
          <EmptyState 
            title={lang === "id" ? "Analisis Masih Kosong" : "Analysis is Empty"}
            description={lang === "id" ? "Lakukan beberapa pengeluaran bulan ini untuk mulai melihat analisis pintarmu!" : "Make some expenses this month to start seeing your smart analysis!"}
          />
        )}
      </div>
    </div>
  );
}

// Stats Summary Component
async function MonthlyBudgetStats() {
  const { t, lang } = await getServerTranslation();
  const user = await getCachedUser();
  const supabase = await createClient();
  
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const locale = lang === "id" ? "id-ID" : "en-US";
  const monthName = now.toLocaleString(locale, { month: 'long', year: 'numeric' }).toUpperCase();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", user?.id)
    .eq("type", "expense")
    .gte("date", firstDay);

  const totalSpent = (transactions || []).reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);
  const mockBudget = 15000000; // Mock budget: 15jt
  const percent = Math.min(100, Math.round((totalSpent / mockBudget) * 100));

  return (
    <section 
      className="bg-[#181c1d] rounded-3xl md:rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-[#899295]/5 premium-glow shrink-0 transition-all font-headline"
      style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-2 italic">{t("dashboard.budget_status")}</h3>
          <p className="text-[10px] md:text-xs text-[#899295] font-black uppercase tracking-[0.3em]">{lang === "id" ? "EKSEKUSI DATA" : "DATA EXECUTION"} {monthName}</p>
        </div>
        <div className="flex gap-4">
          <div className="text-left md:text-right">
            <p className="text-[10px] text-[#899295] font-black uppercase tracking-widest mb-1 opacity-50">{lang === "id" ? "TERPAKAI SAAT INI" : "CURRENTLY USED"}</p>
            <p className="text-xl md:text-3xl font-black text-[#e0e3e4]">
              Rp {new Intl.NumberFormat(locale).format(totalSpent)} 
              <span className="text-[10px] md:text-sm font-normal opacity-40 ml-3">/ Rp {new Intl.NumberFormat(locale, { notation: 'compact' }).format(mockBudget)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-2 md:h-3 bg-[#323537] rounded-full overflow-hidden shadow-inner relative">
        <div 
          className={`h-full transition-all duration-1000 ${percent > 90 ? 'bg-red-400 shadow-[0_0_12px_rgba(255,68,68,0.4)]' : 'bg-gradient-to-r from-[#86d2e5] to-[#006778] shadow-[0_0_12px_rgba(134,210,229,0.4)]'}`} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-[8px] md:text-[10px] text-[#899295] font-black uppercase tracking-widest">
           {lang === "id" ? "Eksekusi" : "Execution"} {percent}% {lang === "id" ? "Anggaran" : "Budget"}
        </p>
        <Link href="/anggaran" className="text-[#86d2e5] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:underline">{lang === "id" ? "Detail Analitik" : "Analytical Details"}</Link>
      </div>
    </section>
  );
}
function SectionSkeleton() {
  return (
    <div className="w-full h-64 bg-[#181c1d] rounded-3xl animate-pulse flex items-center justify-center border border-white/5">
       <div className="w-8 h-8 border-4 border-[#86d2e5] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default async function DashboardPage() {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-12 pb-12">
      <Suspense fallback={<SectionSkeleton />}>
        <HeroStats />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <MonthlyBudgetStats />
      </Suspense>

      {/* Main Grid — Responsive 2nd column grid on mobile, desktop 12-column */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-12">
        {/* Category Chart Section */}
        <div className="lg:col-span-6 h-full">
          <Suspense fallback={<SectionSkeleton />}>
            <CategoryAnalysis />
          </Suspense>
        </div>

        {/* Recent Transactions Section */}
        <div className="lg:col-span-6 h-full">
          <Suspense fallback={<SectionSkeleton />}>
            <RecentTransactions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

