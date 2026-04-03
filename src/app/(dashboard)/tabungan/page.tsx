import { 
  PlusCircle, 
  Sparkles, 
  BarChart3, 
  Flame, 
  PlaneTakeoff, 
  Calendar, 
  Plus, 
  Search,
  Target
} from "lucide-react";
import SavingsGrowth from "@/components/charts/SavingsGrowth";
import { createClient } from "@/lib/supabase/server";
import { getCachedUser } from "@/lib/supabase/user";
import { redirect } from "next/navigation";
import EmptyState from "@/components/shared/EmptyState";
import { PiggyBank } from "lucide-react";


export default async function SavingsPage() {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  // Fetch Savings Goals & Wallets
  const [goalsRes, walletsRes] = await Promise.all([
    supabase.from("savings_goals").select("*").eq("user_id", user.id).order("deadline"),
    supabase.from("wallets").select("balance").eq("user_id", user.id)
  ]);

  const goals = goalsRes.data || [];
  const totalSavings = walletsRes.data?.reduce((sum, w) => sum + Number(w.balance), 0) || 0;
  
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
  const totalCollected = goals.reduce((sum, g) => sum + Number(g.current_amount), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  // Reconstruct 5 months of history (Mocking logic based on current balance for MVP)
  // In a real app, this would be fetched from a 'balance_snapshots' table
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const now = new Date();
  const historyData = [];
  
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    historyData.push({
      month: months[d.getMonth()],
      // Simple logic: current savings as the peak, previous months slightly less to show "growth"
      balance: totalSavings - (i * (totalSavings * 0.05)) 
    });
  }

  return (
    <div className="space-y-12 pb-12">
      <section className="flex lg:grid lg:grid-cols-12 gap-4 lg:gap-6 mb-0 shrink-0 overflow-x-auto lg:overflow-visible snap-x snap-mandatory hide-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        {/* Hero Balance */}
        <div 
          className="min-w-[85vw] lg:min-w-0 lg:col-span-7 snap-center bg-gradient-to-br from-[#86d2e5] to-[#006778] p-10 rounded-4xl flex flex-col justify-between min-h-[320px] shadow-2xl relative overflow-hidden group premium-glow glow-pulse"
          style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
        >
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white mb-2 uppercase tracking-widest text-xs font-bold">
              <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
              <span>TOTAL SALDO TABUNGAN</span>
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter -ml-1">
              Rp {new Intl.NumberFormat('id-ID').format(totalSavings)}
            </h3>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-1">Target Terkumpul</p>
                <p className="text-xl font-bold text-white">
                  {overallProgress}% <span className="text-xs font-normal opacity-70">dari Rp {new Intl.NumberFormat('id-ID').format(totalTarget)}</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-1">Total Goal</p>
                <p className="text-xl font-bold text-white">{goals.length} Target</p>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Bento */}
        <div className="min-w-[85vw] lg:min-w-0 lg:col-span-5 snap-center flex flex-col gap-6">
          <div 
            className="bg-[#181c1d] p-6 rounded-3xl flex items-start gap-5 border border-[#899295]/10 hover:bg-[#1c2021] transition-all premium-glow"
            style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
          >
            <div className="w-14 h-14 bg-[#78dc77]/15 flex items-center justify-center rounded-2xl shrink-0 border border-[#78dc77]/10 text-[#78dc77]">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-headline font-bold mb-1">Wawasan Tabungan</h4>
              <p className="text-sm text-[#bec8cb] leading-relaxed tracking-tight font-medium">
                {goals.length > 0 ? (
                  <>Kamu memiliki <span className="text-[#86d2e5] font-bold underline">{goals.length} target</span> aktif. Tetap konsisten menabung setiap bulan!</>
                ) : (
                  <>Belum ada target tabungan aktif. Mulai buat target pertamamu sekarang!</>
                )}
              </p>
            </div>
          </div>
          <div 
            className="bg-[#181c1d] p-6 rounded-3xl flex-1 flex flex-col justify-between border border-[#899295]/10 relative overflow-hidden group premium-glow"
            style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline font-bold text-[#e0e3e4] mb-0.5">Pertumbuhan Bulanan</h4>
                <p className="text-[10px] text-[#899295] font-bold tracking-widest uppercase">STATISTIK {months[now.getMonth()].toUpperCase()} {now.getFullYear()}</p>
              </div>
              <BarChart3 className="text-[#86d2e5]" size={20} />
            </div>
            <SavingsGrowth data={historyData} />
          </div>
        </div>
      </section>


      {/* Strategic Goals Grid */}
      <section className="mt-4">
        <div className="flex items-baseline justify-between mb-8 px-2 shrink-0">
          <h3 className="text-3xl font-black font-headline tracking-tighter">Target Strategis</h3>
          <button className="text-[#86d2e5] text-xs font-bold uppercase tracking-widest hover:underline">TAMBAH TARGET</button>
        </div>
        
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pb-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {goals.map((goal) => {
            const progress = Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100);
            return (
              <div 
                key={goal.id}
                className="min-w-[80vw] md:min-w-0 snap-center bg-[#181c1d] p-8 rounded-4xl flex flex-col group hover:bg-[#272b2c] transition-all border border-[#899295]/5 relative overflow-hidden premium-glow"
                style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
              >
                <div className="absolute top-8 right-8 text-[#899295]/10 group-hover:scale-110 group-hover:text-[#86d2e5] transition-all">
                   <Target size={48} />
                </div>
                <div className="mb-8">
                  <span className="bg-[#86d2e5]/15 text-[#86d2e5] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#86d2e5]/20">STRATEGIS</span>
                  <h4 className="text-2xl font-black font-headline mt-4 mb-2">{goal.name}</h4>
                  <p className="text-[10px] text-[#899295] font-bold tracking-widest uppercase flex items-center gap-2">
                     <Calendar size={12} /> TENGGAT: {new Date(goal.deadline).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }).toUpperCase()}
                  </p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-3">
                     <div>
                       <p className="text-[10px] text-[#899295] font-bold uppercase tracking-widest mb-1">Terkumpul</p>
                       <p className="text-lg font-bold">Rp {new Intl.NumberFormat('id-ID').format(goal.current_amount)}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[10px] text-[#899295] font-bold uppercase tracking-widest mb-1">Target</p>
                       <p className="text-sm font-medium text-[#bec8cb]">Rp {new Intl.NumberFormat('id-ID').format(goal.target_amount)}</p>
                     </div>
                  </div>
                  <div className="w-full h-3 bg-[#323537] rounded-full overflow-hidden mb-8 shadow-inner">
                     <div className="h-full bg-[#86d2e5] rounded-full shadow-[0_0_12px_rgba(134,210,229,0.3)]" style={{ width: `${progress}%` }}></div>
                  </div>
                  <button className="w-full py-3 bg-[#323537] hover:bg-[#86d2e5] hover:text-[#006778] font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[9px] border border-white/5">
                     <Plus size={14} /> TAMBAH DANA
                  </button>
                </div>
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="col-span-full">
              <EmptyState 
                title="Target Tabungan Belum Ada"
                description="Mulai siapkan masa depan Anda dengan membuat target tabungan strategis pertama hari ini."
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

