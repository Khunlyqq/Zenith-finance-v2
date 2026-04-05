import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  FileDown, 
  BrainCircuit,
  Sparkles,
  Lock,
  Search,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import MonthlyTren from "@/components/charts/MonthlyTren";
import { createClient } from "@/lib/supabase/server";
import { getCachedUser } from "@/lib/supabase/user";
import { redirect } from "next/navigation";
import EmptyState from "@/components/shared/EmptyState";


export default async function ReportsPage() {
  const user = await getCachedUser();
  const supabase = await createClient();

  if (!user) {
    redirect("/login");
  }

  // Fetch all transactions for aggregated report
  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type, date, categories(name)")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single();
  const isPremium = profile?.is_premium || false;

  const monthlyData: Record<string, { income: number; expense: number }> = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  
  (transactions || []).forEach(tx => {
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthlyData[key]) {
      monthlyData[key] = { income: 0, expense: 0 };
    }
    if (tx.type === 'income') monthlyData[key].income += Number(tx.amount);
    else monthlyData[key].expense += Number(tx.amount);
  });

  // Get last 6 months for chart
  const now = new Date();
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    chartData.push({
      month: monthNames[d.getMonth()],
      income: monthlyData[key]?.income || 0,
      expense: monthlyData[key]?.expense || 0
    });
  }

  // Current month vs Last month stats
  const currentKey = `${now.getFullYear()}-${now.getMonth()}`;
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastKey = `${lastMonth.getFullYear()}-${lastMonth.getMonth()}`;

  const currentIncome = monthlyData[currentKey]?.income || 0;
  const currentExpense = monthlyData[currentKey]?.expense || 0;
  const lastIncome = monthlyData[lastKey]?.income || 1; // Avoid div by zero
  const lastExpense = monthlyData[lastKey]?.expense || 1;

  const incomeChange = Math.round(((currentIncome - lastIncome) / lastIncome) * 100);
  const expenseChange = Math.round(((currentExpense - lastExpense) / lastExpense) * 100);
  const netSavings = currentIncome - currentExpense;
  const savingsRatio = currentIncome > 0 ? Math.round((netSavings / currentIncome) * 100) : 0;

  // Deep Audit Data Preparation
  const categoryLoss: Record<string, number> = {};
  let totalExpenseAllTime = 0;
  
  (transactions || []).filter(tx => tx.type === 'expense').forEach(tx => {
    const catName = (tx.categories as any)?.name || 'Lainnya';
    categoryLoss[catName] = (categoryLoss[catName] || 0) + Number(tx.amount);
    totalExpenseAllTime += Number(tx.amount);
  });

  const topLosses = Object.entries(categoryLoss)
    .map(([name, amount]) => ({ name, amount, perc: totalExpenseAllTime > 0 ? Math.round((amount / totalExpenseAllTime) * 100) : 0 }))
    .sort((a,b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="space-y-8 md:space-y-12 pb-12">
      {/* Deep Audit Section */}
      <section className="col-span-12">
        <div 
          className="relative overflow-hidden bg-[#181c1d] rounded-2xl md:rounded-[2.5rem] border border-[#ffb870]/20 p-6 md:p-8 flex flex-col premium-glow group shadow-2xl"
          style={{ '--card-glow-rgb': isPremium ? '255, 184, 112' : '134, 210, 229'} as React.CSSProperties}
        >
          <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10 w-full border-b border-white/5 pb-4 md:pb-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`w-10 h-10 md:w-14 md:h-14 shrink-0 flex items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br ${isPremium ? 'from-[#ffb870] to-[#ff9838]' : 'from-[#323537] to-[#181c1d]'} text-[#101415] shadow-xl border border-white/5`}>
                <Search size={18} className={isPremium ? "text-[#101415]" : "text-[#899295]"} />
              </div>
              <div>
                 <h2 className="text-lg md:text-xl font-black font-headline tracking-tight text-[#e0e3e4]">Deep Audit</h2>
                 <p className="text-[8px] md:text-[10px] text-[#899295] font-black uppercase tracking-widest mt-0.5 md:mt-1">Diagnosis Laju Pemborosan</p>
              </div>
            </div>
          </div>

          <div className="relative w-full z-10">
            {!isPremium ? (
               <div className="relative overflow-hidden rounded-xl md:rounded-2xl p-6 md:p-8 bg-[#101415] border border-white/5 flex flex-col items-center justify-center min-h-[140px] md:min-h-[160px]">
                 <div className="absolute inset-0 bg-[#181c1d]/50 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4 md:p-6 text-center">
                    <Lock size={24} className="text-[#86d2e5] mb-3" />
                    <h3 className="text-white font-black tracking-tight mb-2 text-sm md:text-base">Anatomi Pengeluaran Terkunci</h3>
                    <p className="text-[10px] text-[#899295] max-w-sm mb-4 leading-relaxed line-clamp-2 md:line-clamp-none">Upgrade ke Zenith Premium untuk melihat persentase kebocoran dompet secara otomatis.</p>
                    <Link href="/profil" className="bg-[#86d2e5] text-[#101415] hover:bg-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-xs uppercase font-black tracking-widest transition-all">Upgrade Sekarang</Link>
                 </div>
                 <div className="w-full flex justify-between opacity-10 filter blur-sm">
                   <div className="h-16 bg-white/10 rounded-xl w-[30%]"></div>
                   <div className="h-16 bg-white/10 rounded-xl w-[30%]"></div>
                   <div className="h-16 bg-white/10 rounded-xl w-[30%]"></div>
                 </div>
               </div>
            ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                 {topLosses.map((loss, idx) => (
                   <div key={loss.name} className="bg-[#101415] p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/5 relative overflow-hidden group/item hover:border-[#ffb870]/30 transition-colors">
                     <span className="text-[7px] md:text-[10px] font-black text-[#899295] uppercase tracking-widest mb-2 block">Peringkat {idx + 1}</span>
                     <h3 className="text-sm md:text-2xl font-black font-headline tracking-tighter text-[#e0e3e4] truncate mb-1">{loss.name}</h3>
                     <p className="text-[11px] md:text-xl font-bold text-[#ffb4ab] mb-3 md:mb-4">
                        {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(loss.amount)}
                     </p>
                     <div className="w-full bg-[#323537] h-1 md:h-2 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-[#ffb4ab] to-[#ffb870] rounded-full" style={{ width: `${loss.perc}%` }}></div>
                     </div>
                   </div>
                 ))}
                 {topLosses.length === 0 && (
                   <div className="col-span-2 md:col-span-3 text-center py-8 text-[#899295] text-[10px] font-black uppercase">Data belum memadai</div>
                 )}
               </div>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Section — 2nd column grid on mobile */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <div 
          className="col-span-1 bg-[#181c1d] p-5 md:p-8 rounded-2xl md:rounded-3xl border-l-4 border-[#78dc77]/40 shadow-sm relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
        >
          <div className="relative z-10">
            <p className="text-[#899295] text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">INCOME</p>
            <div className="text-lg md:text-3xl font-black font-headline tracking-tighter line-clamp-1 text-[#e0e3e4]">
              {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(currentIncome)}
            </div>
            <div className={`mt-2 flex items-center gap-1 text-[7px] md:text-[9px] font-black uppercase px-1.5 py-0.5 rounded w-fit ${incomeChange >= 0 ? 'text-[#78dc77] bg-[#78dc77]/10' : 'text-[#ffb4ab] bg-[#ffb4ab]/10'}`}>
              {Math.abs(incomeChange)}% VS LALU
            </div>
          </div>
        </div>
        <div 
          className="col-span-1 bg-[#181c1d] p-5 md:p-8 rounded-2xl md:rounded-3xl border-l-4 border-[#ffb870]/40 shadow-sm relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '255, 184, 112' } as React.CSSProperties}
        >
           <div className="relative z-10">
              <p className="text-[#899295] text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">EXPENSE</p>
              <div className="text-lg md:text-3xl font-black font-headline tracking-tighter line-clamp-1 text-[#ffb870]">
                {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(currentExpense)}
              </div>
              <div className={`mt-2 flex items-center gap-1 text-[7px] md:text-[9px] font-black uppercase px-1.5 py-0.5 rounded w-fit ${expenseChange <= 0 ? 'text-[#78dc77] bg-[#78dc77]/10' : 'text-[#ffb4ab] bg-[#ffb4ab]/10'}`}>
                 {Math.abs(expenseChange)}% VS LALU
              </div>
           </div>
        </div>
        <div 
          className="col-span-2 md:col-span-1 bg-gradient-to-br from-[#86d2e5] to-[#006778] p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-xl relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
        >
           <div className="relative z-10">
              <p className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest mb-1 opacity-80">NET SAVINGS</p>
              <div className="text-xl md:text-3xl font-black font-headline text-white tracking-tighter">
                Rp {new Intl.NumberFormat('id-ID').format(netSavings)}
              </div>
              <p className="mt-2 text-[8px] md:text-[10px] font-black text-white/70 uppercase tracking-widest">RASIO: {savingsRatio}%</p>
           </div>
        </div>
      </section>

      {(!transactions || transactions.length === 0) ? (
        <div className="py-20">
          <EmptyState 
            title="Laporan Belum Tersedia"
            description="Belum ada data transaksi yang terkumpul."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
          <div 
            className="lg:col-span-8 bg-[#181c1d] p-6 md:p-8 rounded-2xl md:rounded-4xl border border-[#899295]/5 premium-glow flex flex-col min-h-0"
            style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
          >
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h3 className="text-lg md:text-xl font-black font-headline tracking-tighter text-[#e0e3e4]">Tren Bulanan</h3>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                      <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#86d2e5]"></span>
                      <span className="text-[8px] md:text-[10px] font-black text-[#899295] uppercase tracking-widest">In</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#ffb870]"></span>
                      <span className="text-[8px] md:text-[10px] font-black text-[#899295] uppercase tracking-widest">Out</span>
                   </div>
                </div>
             </div>
             <MonthlyTren data={chartData} />
          </div>

          {/* AI Insight Card */}
          <div 
            className="lg:col-span-4 bg-[#181c1d] p-6 md:p-8 rounded-2xl md:rounded-4xl flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/5 premium-glow flex-1 min-h-[220px]"
            style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
          >
             <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10">
                <BrainCircuit size={64} className="text-[#86d2e5]" />
             </div>
             <div className="relative z-10">
                <span className="bg-[#86d2e5]/10 text-[#86d2e5] text-[8px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block border border-[#86d2e5]/10 backdrop-blur-md">Skor AI</span>
                <p className="text-sm md:text-xl font-headline font-medium leading-relaxed text-white tracking-tight">
                  {savingsRatio > 20 ? (
                    <>"Anda menghemat <span className="text-[#78dc77] font-black underline decoration-2 underline-offset-4">{savingsRatio}%</span>. Performa sehat!"</>
                  ) : (
                    <>"Pengeluaran mencapai <span className="text-[#ffb4ab] font-black underline decoration-2 underline-offset-4">{100 - savingsRatio}%</span>. Tinjau ulang anggaran Anda."</>
                  )}
                </p>
             </div>
             <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-[8px] md:text-[10px] font-black text-[#899295] uppercase tracking-widest">Kesehatan</div>
                <div className="text-2xl md:text-4xl font-black text-[#86d2e5] tracking-tighter">{savingsRatio + 50}<span className="text-xs md:text-lg opacity-50">/100</span></div>
             </div>
          </div>
        </div>
      )}
    </div>

  );
}
