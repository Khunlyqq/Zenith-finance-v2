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


// Fast Section: Hero Stats & Budget
async function HeroStats() {
  const user = await getCachedUser();
  const supabase = await createClient();
  
  // Current month range
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [walletsRes, transactionsRes, profileRes] = await Promise.all([
    supabase.from("wallets").select("*").eq("user_id", user?.id),
    supabase.from("transactions").select("amount, type").eq("user_id", user?.id).gte("date", firstDay),
    supabase.from("profiles").select("is_premium").eq("id", user?.id).single()
  ]);

  const wallets = walletsRes.data || [];
  const monthlyTransactions = transactionsRes.data || [];
  const isPremium = profileRes.data?.is_premium || false;

  const totalBalance = wallets.reduce((sum, w) => sum + (Number(w.balance) || 0), 0);
  const monthlyInflow = monthlyTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const monthlyOutflow = monthlyTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  let insightText = "";
  if (monthlyInflow === 0 && monthlyOutflow === 0) {
    insightText = "Sistem AI sedang menunggu transaksi pertama Anda bulan ini untuk memulai pemetaan prediktif pola arus kas.";
  } else if (monthlyOutflow > monthlyInflow) {
    const ratio = Math.round((monthlyOutflow / monthlyInflow) * 100);
    insightText = `Peringatan Burn Rate: Laju tagihan Anda mencapai ${ratio}% dari perolehan bulan ini. Kurasi ulang dana pasif Anda minggu ini untuk menghindari penyusutan aset.`;
  } else {
    const savings = monthlyInflow - monthlyOutflow;
    const ratio = Math.round((savings / monthlyInflow) * 100);
    insightText = `Akselerasi Kurasi Positif: Algoritma Zenith mendeteksi Anda sukses menyelamatkan ${ratio}% potensi likuiditas. Pertahankan struktur ini!`;
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
      <div 
        className="lg:col-span-6 bg-gradient-to-br from-[#86d2e5] to-[#006778] rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between min-h-[220px] md:min-h-[320px] shadow-2xl relative overflow-hidden group premium-glow glow-pulse"
        style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
      >
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <h2 className="text-white font-black text-[9px] md:text-[10px] tracking-[0.2em] uppercase mb-3 opacity-80">TOTAL SALDO TERKURASI</h2>
          <div className="flex items-baseline gap-2 md:gap-3">
            <span className="text-white/80 text-xl font-medium">Rp</span>
            <h3 className="text-white text-3xl md:text-6xl font-black tracking-tighter -ml-1">
              {new Intl.NumberFormat('id-ID').format(totalBalance)}
            </h3>
          </div>
        </div>
        <div className="relative z-10 flex justify-between items-end mt-8">
          <div className="flex flex-col">
            <span className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">DOMPET AKTIF</span>
            <h4 className="text-white font-headline text-lg font-black">{wallets?.length || 0} Akun</h4>
          </div>
          <div className="flex flex-col">
            <span className="bg-[#78dc77]/20 text-[#78dc77] px-3 py-1 rounded-full text-[9px] font-black flex items-center gap-1 border border-[#78dc77]/20 backdrop-blur-md uppercase tracking-wider">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> 
              SINKRON
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Bento — 2 cols on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-1 lg:col-span-6 gap-3 md:gap-6">
        <div 
          className="bg-[#181c1d] rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col justify-center border-l-4 border-[#78dc77] shadow-sm hover:bg-[#1c2021] transition-all relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform hidden md:block">
              <TrendingUp size={96} className="text-[#78dc77]" />
          </div>
          <p className="text-[#899295] text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">PEMASUKAN</p>
          <p className="text-[#78dc77] text-lg md:text-2xl font-black tracking-tight relative z-10 line-clamp-1">
            + {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(monthlyInflow)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[#78dc77]/60 text-[9px] relative z-10 font-bold uppercase tracking-widest">
            <TrendingUp size={10} />
            <span>Live</span>
          </div>
        </div>
        <div 
          className="bg-[#181c1d] rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col justify-center border-l-4 border-[#ffb4ab] shadow-sm hover:bg-[#1c2021] transition-all relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '255, 180, 171' } as React.CSSProperties}
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform hidden md:block">
              <TrendingDown size={96} className="text-[#ffb4ab]" />
          </div>
          <p className="text-[#899295] text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">PENGELUARAN</p>
          <p className="text-[#ffb4ab] text-lg md:text-2xl font-black tracking-tight relative z-10 line-clamp-1">
            - {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(monthlyOutflow)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[#ffb4ab]/60 text-[9px] relative z-10 font-bold uppercase tracking-widest">
            <TrendingDown size={10} />
            <span>Live</span>
          </div>
        </div>
      </div>


      {/* Premium AI Insights Segment */}
      <div 
        className="lg:col-span-12 relative overflow-hidden bg-[#181c1d] rounded-[2.5rem] border border-white/5 p-8 flex flex-col md:flex-row items-center md:items-start gap-6 premium-glow group"
        style={{ '--card-glow-rgb': isPremium ? '255, 184, 112' : '134, 210, 229'} as React.CSSProperties}
      >
        <div className={`w-16 h-16 shrink-0 flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${isPremium ? 'from-[#ffb870] to-[#ff9838]' : 'from-[#323537] to-[#181c1d] border border-white/5'} shadow-xl`}>
          <Sparkles size={24} className={isPremium ? "text-[#101415]" : "text-[#899295]"} />
        </div>
        
        <div className="flex-1 relative w-full text-center md:text-left">
          <h4 className={`text-sm font-black uppercase tracking-widest mb-3 ${isPremium ? 'text-[#ffb870]' : 'text-[#899295]'}`}>Intelijen AI Zenith</h4>
          
          {!isPremium ? (
             <div className="relative overflow-hidden group/locked">
               <p className="text-[#e0e3e4] blur-[4px] select-none opacity-40 font-medium text-sm md:text-base leading-relaxed hidden sm:block">
                 Peringatan Burn Rate: Pengeluaran Anda mencapai 120% dari pemasukan. Pertimbangkan untuk merevisi dana pasif Anda minggu ini dan mengurangi porsi...
               </p>
               <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center gap-3 bg-gradient-to-r from-[#181c1d]/90 to-transparent">
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-[#86d2e5]" />
                    <span className="text-xs font-bold text-[#86d2e5]">Eksklusif Pengguna Zenith Premium</span>
                  </div>
                  <Link href="/profil" className="!bg-[#86d2e5]/10 hover:!bg-[#86d2e5]/20 text-[#86d2e5] px-4 py-2 rounded-full text-[10px] uppercase font-black tracking-widest transition-all border border-[#86d2e5]/20 shadow-sm hover:shadow-[#86d2e5]/10">Buka Akses</Link>
               </div>
             </div>
          ) : (
             <p className="text-[#e0e3e4] text-sm md:text-base leading-relaxed font-medium">
               {insightText}
             </p>
          )}
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
  const user = await getCachedUser();
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, categories(*)")
    .eq("user_id", user?.id)
    .order("date", { ascending: false })
    .limit(5);

  return (
    <div 
      className="bg-[#181c1d] p-8 rounded-4xl border border-[#899295]/5 premium-glow relative overflow-hidden h-full"
      style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
    >
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h3 className="text-xl font-bold tracking-tight">Transaksi Terbaru</h3>
        <Link href="/transaksi" className="text-[#86d2e5] text-xs font-bold uppercase tracking-widest hover:underline">View All</Link>
      </div>
      
      <div className="space-y-6 relative z-10">
        {transactions?.map((tx) => (
          <div key={tx.id} className="flex items-center gap-4 hover:bg-[#272b2c] p-2 rounded-2xl transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-[#323537] rounded-xl flex items-center justify-center text-[#ffb870] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">{tx.categories?.icon || 'payments'}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#e0e3e4] truncate max-w-[120px]">{tx.note || tx.categories?.name || 'Transaksi'}</h4>
              <p className="text-[10px] text-[#899295] font-bold uppercase tracking-wider">
                {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {tx.categories?.name || 'Umum'}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-black ${tx.type === 'expense' ? 'text-[#ffb4ab]' : 'text-[#78dc77]'}`}>
                {tx.type === 'expense' ? '-' : '+'} Rp {new Intl.NumberFormat('id-ID').format(Math.abs(tx.amount))}
              </p>
            </div>
          </div>
        ))}

        {(!transactions || transactions.length === 0) && (
          <div className="py-8">
            <EmptyState 
              title="Belum Ada Transaksi"
              description="Catatan keuanganmu masih kosong. Mari mulai dengan mencatat transaksi pertama hari ini!"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Analysis Section: Category Spending
async function CategoryAnalysis() {
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
  
  (transactions || []).forEach(tx => {
    const catId = tx.category_id || 'unknown';
    if (!spendingMap[catId]) {
      spendingMap[catId] = { 
        amount: 0, 
        name: (tx.categories as any)?.name || 'Lainnya',
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
        <h3 className="text-lg font-bold text-[#e0e3e4]">Analisis Kategori</h3>
        <button className="text-[#86d2e5] hover:bg-[#86d2e5]/10 p-2 rounded-xl transition-all"><MoreHorizontal size={20} /></button>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {sortedStats.length > 0 ? (
          <CategoryDonut data={sortedStats} />
        ) : (
          <EmptyState 
            title="Analisis Masih Kosong"
            description="Lakukan beberapa pengeluaran bulan ini untuk mulai melihat analisis pintarmu!"
          />
        )}
      </div>
    </div>
  );
}

// Stats Summary Component
async function MonthlyBudgetStats() {
  const user = await getCachedUser();
  const supabase = await createClient();
  
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthName = now.toLocaleString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", user?.id)
    .eq("type", "expense")
    .gte("date", firstDay);

  const totalSpent = (transactions || []).reduce((sum, tx) => sum + Number(tx.amount), 0);
  const mockBudget = 15000000; // Mock budget: 15jt
  const percent = Math.min(100, Math.round((totalSpent / mockBudget) * 100));

  return (
    <section 
      className="bg-[#181c1d] rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-lg border border-[#899295]/5 premium-glow shrink-0 transition-all font-headline"
      style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black tracking-tighter mb-1">Status Anggaran</h3>
          <p className="text-[9px] md:text-xs text-[#899295] font-black uppercase tracking-[0.2em]">PEMANTAUAN {monthName}</p>
        </div>
        <div className="flex gap-4">
          <div className="text-left md:text-right">
            <p className="text-[9px] md:text-[10px] text-[#899295] font-black uppercase tracking-widest mb-1 opacity-60">PENGGUNAAN AKTIF</p>
            <p className="text-lg md:text-xl font-black text-[#e0e3e4]">
              Rp {new Intl.NumberFormat('id-ID').format(totalSpent)} 
              <span className="text-[10px] md:text-xs font-normal opacity-50 ml-2">/ Rp {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(mockBudget)}</span>
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
           Eksekusi {percent}% Anggaran
        </p>
        <Link href="/anggaran" className="text-[#86d2e5] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:underline">Detail Analitik</Link>
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

