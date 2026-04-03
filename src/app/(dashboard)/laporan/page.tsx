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
    <div className="space-y-12 pb-12">
      {/* Deep Audit Section */}
      <section className="col-span-12">
        <div 
          className="relative overflow-hidden bg-[#181c1d] rounded-[2.5rem] border border-[#ffb870]/20 p-8 flex flex-col premium-glow group shadow-2xl"
          style={{ '--card-glow-rgb': isPremium ? '255, 184, 112' : '134, 210, 229'} as React.CSSProperties}
        >
          <div className="flex items-center justify-between mb-8 relative z-10 w-full border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br ${isPremium ? 'from-[#ffb870] to-[#ff9838]' : 'from-[#323537] to-[#181c1d]'} text-[#101415] shadow-xl border border-white/5`}>
                <Search size={22} className={isPremium ? "text-[#101415]" : "text-[#899295]"} />
              </div>
              <div>
                 <h2 className="text-xl font-black font-headline tracking-tight text-[#e0e3e4]">Deep Audit Analytics</h2>
                 <p className="text-[10px] text-[#899295] font-black uppercase tracking-widest mt-1">Diagnosis Laju Pemborosan Bulan Berlalu</p>
              </div>
            </div>
          </div>

          <div className="relative w-full z-10">
            {!isPremium ? (
               <div className="relative overflow-hidden rounded-2xl p-8 bg-[#101415] border border-white/5 flex flex-col items-center justify-center min-h-[160px]">
                 <div className="absolute inset-0 bg-[#181c1d]/50 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
                    <Lock size={28} className="text-[#86d2e5] mb-4" />
                    <h3 className="text-white font-black tracking-tight mb-2">Akses Deep Audit (Anatomi Pengeluaran) Terkunci</h3>
                    <p className="text-xs text-[#899295] max-w-sm mb-6 leading-relaxed">Upgrade ke Zenith Premium untuk melihat persentase kebocoran dompet Anda secara langsung tanpa harus meninjau satu per satu.</p>
                    <Link href="/profil" className="bg-[#86d2e5] text-[#101415] hover:bg-white px-6 py-3 rounded-xl text-xs uppercase font-black tracking-widest transition-all shadow-lg shadow-[#86d2e5]/20 hover:scale-105 active:scale-95">Upgrade Sekarang</Link>
                 </div>
                 {/* Dummy Background To suggest Content exists */}
                 <div className="w-full flex justify-between opacity-20 filter blur-sm">
                   <div className="h-20 bg-white/10 rounded-2xl w-[30%]"></div>
                   <div className="h-20 bg-white/10 rounded-2xl w-[30%]"></div>
                   <div className="h-20 bg-white/10 rounded-2xl w-[30%]"></div>
                 </div>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {topLosses.map((loss, idx) => (
                   <div key={loss.name} className="bg-[#101415] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group/item hover:border-[#ffb870]/30 transition-colors">
                     <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-black text-[#899295] uppercase tracking-widest">Peringkat {idx + 1}</span>
                       <AlertTriangle size={16} className={idx === 0 ? "text-[#ffb4ab]" : "text-[#ffb870]"} />
                     </div>
                     <h3 className="text-2xl font-black font-headline tracking-tighter text-[#e0e3e4] truncate mb-1">{loss.name}</h3>
                     <p className="text-xl font-bold text-[#ffb4ab] mb-4">Rp {new Intl.NumberFormat('id-ID').format(loss.amount)}</p>
                     
                     <div className="w-full bg-[#323537] h-2 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-[#ffb4ab] to-[#ffb870] rounded-full" style={{ width: `${loss.perc}%` }}></div>
                     </div>
                     <p className="text-right mt-2 text-[10px] font-bold text-[#899295] uppercase tracking-widest">{loss.perc}% DARI TOTAL KELUAR</p>
                   </div>
                 ))}
                 {topLosses.length === 0 && (
                   <div className="col-span-3 text-center py-8 text-[#899295] text-sm">Tidak ada cukup data pengeluaran untuk dianalisis komputasi.</div>
                 )}
               </div>
            )}
          </div>
          {isPremium && (
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#ffb870]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          )}
        </div>
      </section>

      {/* Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-[#181c1d] p-8 rounded-3xl border-l-4 border-[#78dc77]/40 shadow-sm relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
        >
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
             <TrendingUp size={96} className="text-[#78dc77]" />
          </div>
          <div className="relative z-10">
            <p className="text-[#899295] text-[10px] font-black uppercase tracking-widest mb-1">TOTAL PEMASUKAN</p>
            <div className="text-3xl font-black font-headline tracking-tighter">
              Rp {new Intl.NumberFormat('id-ID').format(currentIncome)}
            </div>
            <div className={`mt-3 flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded w-fit ${incomeChange >= 0 ? 'text-[#78dc77] bg-[#78dc77]/10' : 'text-[#ffb4ab] bg-[#ffb4ab]/10'}`}>
              {incomeChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} 
              {Math.abs(incomeChange)}% VS BULAN LALU
            </div>
          </div>
        </div>
        <div 
          className="bg-[#181c1d] p-8 rounded-3xl border-l-4 border-[#ffb870]/40 shadow-sm relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '255, 184, 112' } as React.CSSProperties}
        >
           <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingDown size={96} className="text-[#ffb870]" />
           </div>
           <div className="relative z-10">
              <p className="text-[#899295] text-[10px] font-black uppercase tracking-widest mb-1">TOTAL PENGELUARAN</p>
              <div className="text-3xl font-black font-headline tracking-tighter text-[#ffb870]">
                Rp {new Intl.NumberFormat('id-ID').format(currentExpense)}
              </div>
              <div className={`mt-3 flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded w-fit ${expenseChange <= 0 ? 'text-[#78dc77] bg-[#78dc77]/10' : 'text-[#ffb4ab] bg-[#ffb4ab]/10'}`}>
                 {expenseChange <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />} 
                 {Math.abs(expenseChange)}% VS BULAN LALU
              </div>
           </div>
        </div>
        <div 
          className="bg-gradient-to-br from-[#86d2e5] to-[#006778] p-8 rounded-3xl shadow-xl relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
        >
           <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:rotate-12 transition-transform">
              <BarChart3 size={112} />
           </div>
           <div className="relative z-10">
              <p className="text-white font-bold text-[10px] uppercase tracking-widest mb-1">TABUNGAN BERSIH</p>
              <div className="text-3xl font-black font-headline text-white tracking-tighter">
                Rp {new Intl.NumberFormat('id-ID').format(netSavings)}
              </div>
              <p className="mt-4 text-[10px] font-black text-white/70 uppercase tracking-widest">RASIO TABUNGAN: {savingsRatio}%</p>
           </div>
        </div>
      </section>

      {(!transactions || transactions.length === 0) ? (
        <div className="py-20">
          <EmptyState 
            title="Laporan Belum Tersedia"
            description="Belum ada data transaksi yang terkumpul untuk dianalisis. Mulai catat transaksi Anda untuk melihat tren keuangan."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div 
            className="lg:col-span-8 bg-[#181c1d] p-8 rounded-4xl border border-[#899295]/5 premium-glow flex flex-col min-h-0"
            style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
          >
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black font-headline tracking-tight">Tren Bulanan</h3>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#86d2e5]"></span>
                      <span className="text-[10px] font-black text-[#899295] uppercase tracking-widest">Pemasukan</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffb870]"></span>
                      <span className="text-[10px] font-black text-[#899295] uppercase tracking-widest">Pengeluaran</span>
                   </div>
                </div>
             </div>
             <MonthlyTren data={chartData} />
          </div>

          {/* AI Insight Card */}
          <div 
            className="lg:col-span-4 bg-[#181c1d] p-8 rounded-4xl flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/5 premium-glow flex-1 overflow-y-auto"
            style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
          >
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <BrainCircuit size={84} className="text-[#86d2e5]" />
             </div>
             <div className="relative z-10">
                <span className="bg-[#86d2e5]/10 text-[#86d2e5] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-8 inline-block border border-[#86d2e5]/10 backdrop-blur-md">Wawasan Pintar AI</span>
                <p className="text-xl font-headline font-medium leading-relaxed text-white tracking-tight">
                  {savingsRatio > 20 ? (
                    <>"Anda menghemat <span className="text-[#78dc77] font-black underline decoration-2 underline-offset-4">{savingsRatio}% dari pendapatan</span>. Ini adalah performa yang sangat sehat!"</>
                  ) : (
                    <>"Pengeluaran Anda bulan ini mencapai <span className="text-[#ffb4ab] font-black underline decoration-2 underline-offset-4">{100 - savingsRatio}%</span>. Pertimbangkan untuk meninjau kembali anggaran belanja Anda."</>
                  )}
                </p>
             </div>
             <div className="mt-12 pt-10 border-t border-white/10 flex items-center justify-between">
                <div className="text-[10px] font-black text-[#899295] uppercase tracking-widest">Skor Kesehatan</div>
                <div className="text-4xl font-black text-[#86d2e5] tracking-tighter">{savingsRatio + 50}<span className="text-lg opacity-50">/100</span></div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
