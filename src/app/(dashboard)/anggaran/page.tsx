import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  Utensils, 
  Car, 
  Sparkles, 
  AlertTriangle, 
  Smile,
  Receipt
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCachedUser } from "@/lib/supabase/user";
import { redirect } from "next/navigation";
import { Budget } from "@/types";
import EmptyState from "@/components/shared/EmptyState";



export default async function BudgetPage() {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  // Current month range
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthName = now.toLocaleString('id-ID', { month: 'long' }).toUpperCase();

  // Fetch data
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const [categoriesRes, transactionsRes, budgetsRes] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("transactions")
      .select("amount, category_id, type")
      .eq("user_id", user.id)
      .gte("date", firstDay),
    supabase.from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", monthYear)
  ]);
  
  const categories: { id: string; name: string; icon?: string }[] = JSON.parse(JSON.stringify(categoriesRes.data || []));
  const monthlyTransactions: { type: string; amount: number | string; category_id: string }[] = JSON.parse(JSON.stringify(transactionsRes.data || []));
  const budgets = JSON.parse(JSON.stringify(budgetsRes.data || [])) as Budget[];



  // Logic: Sum spending per category
  const spendingPerCategory = monthlyTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc: any, tx) => {
      acc[tx.category_id] = (acc[tx.category_id] || 0) + Number(tx.amount);
      return acc;
    }, {});

  // Map budgets to categories for quick lookup
  const budgetPerCategory = budgets.reduce((acc: any, b) => {
    acc[b.category_id] = b.amount;
    return acc;
  }, {});

  const totalSpent = Object.values(spendingPerCategory).reduce((sum: any, val: any) => sum + val, 0) as number;
  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="space-y-8 md:space-y-12 pb-12">
      {/* Overview Cards — Premium 2-column Grid on Mobile */}
      <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        <div 
          className="col-span-2 lg:col-span-1 bg-gradient-to-br from-[#86d2e5] to-[#006778] p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-2xl relative overflow-hidden group premium-glow h-[160px] md:h-auto flex flex-col justify-center md:justify-start"
          style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest mb-1 opacity-80">ANGGARAN {monthName}</p>
          <div className="mt-1 md:mt-2">
            <h2 className="text-2xl md:text-4xl font-black text-white leading-none tracking-tighter">
              Rp {new Intl.NumberFormat('id-ID').format(totalBudget)}
            </h2>
            <div className="mt-3 md:mt-4 flex items-center gap-1 text-[8px] md:text-[10px] font-black text-white/70 uppercase tracking-widest bg-white/10 px-2 py-1 rounded w-fit">
               <TrendingUp size={12} /> TERMANTAU
            </div>
          </div>
        </div>

        <div 
          className="col-span-1 bg-[#181c1d] p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-[#899295]/10 hover:bg-[#1c2021] transition-all premium-glow h-[140px] md:h-auto flex flex-col justify-center md:justify-start"
          style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
        >
          <div className="flex justify-between items-start mb-3 md:mb-6">
            <div className="p-2 md:p-3 bg-[#78dc77]/10 rounded-xl text-[#78dc77]">
              <span className="material-symbols-outlined font-icon text-lg md:text-xl">payments</span>
            </div>
          </div>
          <p className="text-[#899295] text-[8px] md:text-xs font-black uppercase tracking-widest mb-1">TERPAKAI</p>
          <h2 className="text-lg md:text-2xl font-black font-headline text-[#e0e3e4] tracking-tight line-clamp-1">
            {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(totalSpent)}
          </h2>
          <p className={`text-[8px] md:text-[10px] mt-1 md:mt-2 font-black tracking-widest uppercase ${totalSpent > totalBudget ? 'text-red-400' : 'text-[#78dc77]/60'}`}>
            {Math.round((totalSpent / totalBudget) * 100) || 0}% TOTAL
          </p>
        </div>

        <div 
          className="col-span-1 bg-[#181c1d] p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-[#899295]/10 hover:bg-[#1c2021] transition-all premium-glow h-[140px] md:h-auto flex flex-col justify-center md:justify-start"
          style={{ '--card-glow-rgb': '255, 184, 112' } as React.CSSProperties}
        >
          <div className="flex justify-between items-start mb-3 md:mb-6">
            <div className="p-2 md:p-3 bg-[#ffb870]/10 rounded-xl text-[#ffb870]">
              <span className="material-symbols-outlined font-icon text-lg md:text-xl">account_balance</span>
            </div>
          </div>
          <p className="text-[#899295] text-[8px] md:text-xs font-black uppercase tracking-widest mb-1">SISA</p>
          <h2 className="text-lg md:text-2xl font-black font-headline text-[#ffb870] tracking-tight line-clamp-1">
            {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(Math.max(0, remainingBudget))}
          </h2>
          <div className="flex items-center gap-1 text-[#78dc77] text-[8px] md:text-[10px] font-black mt-1 md:mt-2 uppercase tracking-wide">
             <span className="material-symbols-outlined text-[10px] md:text-xs">check_circle</span>
             {remainingBudget > 0 ? "AMAN" : "OVER"}
          </div>
        </div>
      </section>

      {/* Budget Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
          <div className="flex justify-between items-baseline mb-2 md:mb-4 px-2 shrink-0">
            <h3 className="text-2xl md:text-3xl font-black font-headline tracking-tighter text-[#e0e3e4]">Pos Pengeluaran</h3>
            <button className="text-[#86d2e5] text-[10px] md:text-xs font-black uppercase tracking-widest hover:underline">Kelola Pantauan</button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-8">
            {categories.length === 0 ? (
              <div className="col-span-full">
                <EmptyState 
                  title="Kategori Kosong"
                  description="Belum ada kategori yang tersedia."
                />
              </div>
            ) : budgets.length === 0 ? (
              <div className="col-span-full">
                <EmptyState 
                  title="Belum Ada Anggaran"
                  description="Mulai catat rencana keuanganmu bulan ini."
                />
              </div>
            ) : (
              categories
                .filter(cat => budgetPerCategory[cat.id] !== undefined)
                .map((cat) => {
                  const spent = spendingPerCategory[cat.id] || 0;
                  const limit = budgetPerCategory[cat.id] || 0;
                  
                  const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
                  const isOver = limit > 0 && spent > limit;

                  return (
                    <div 
                      key={cat.id}
                      className={`bg-[#181c1d] p-4 md:p-6 rounded-2xl md:rounded-3xl border-l-4 hover:bg-[#1c2021] transition-all premium-glow flex flex-col justify-between ${isOver ? 'border-red-400' : 'border-[#86d2e5]'}`}
                      style={{ '--card-glow-rgb': isOver ? '255, 180, 171' : '134, 210, 229' } as React.CSSProperties}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl bg-[#323537] flex items-center justify-center shadow-inner ${isOver ? 'text-red-400' : 'text-[#86d2e5]'}`}>
                            <span className="material-symbols-outlined text-[18px] md:text-2xl">{cat.icon || 'category'}</span>
                          </div>
                          <div>
                            <h4 className="text-[11px] md:text-base font-black text-[#e0e3e4] line-clamp-1">{cat.name}</h4>
                            <p className="text-[7px] md:text-[10px] text-[#899295] font-black tracking-widest uppercase opacity-60">
                              LIMIT: {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(limit)}
                            </p>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-[11px] md:text-sm font-black text-[#e0e3e4]">{new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(spent)}</p>
                          <p className={`text-[7px] md:text-[10px] font-black tracking-widest uppercase ${isOver ? 'text-red-400' : 'text-[#86d2e5]'}`}>
                            {percent}%
                          </p>
                        </div>
                      </div>
                      <div className="w-full h-1 md:h-2 bg-[#323537] rounded-full overflow-hidden shadow-inner mt-2">
                         <div 
                            className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-red-400 shadow-[0_0_8px_rgba(255,68,68,0.4)]' : 'bg-[#86d2e5] shadow-[0_0_8px_rgba(134,210,229,0.4)]'}`} 
                            style={{ width: `${percent}%` }}
                          ></div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Insights Sidebar */}
        <div className="lg:col-span-4 flex flex-col min-h-0">
          <div 
            className="bg-[#272b2c] p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden border border-[#899295]/10 premium-glow"
            style={{ '--card-glow-rgb': '255, 184, 112' } as React.CSSProperties}
          >
            <h3 className="text-base md:text-lg font-black font-headline mb-4 md:mb-6 flex items-center gap-2 text-[#e0e3e4]">
              <Sparkles size={16} className="text-[#ffb870]" />
              Wawasan Pintar
            </h3>
            <div className="space-y-6 md:space-y-8">
              {totalSpent > totalBudget * 0.8 ? (
                <div className="flex gap-3 md:gap-4 group">
                  <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-400/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                    <AlertTriangle size={16} />
                  </div>
                  <p className="text-[11px] md:text-sm leading-relaxed text-[#bec8cb]">
                    Waspada! Pengunaan anggaran sudah mencapai <span className="font-black text-red-400">{Math.round((totalSpent/totalBudget)*100)}%</span>.
                  </p>
                </div>
              ) : (
                <div className="flex gap-3 md:gap-4 group">
                  <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#78dc77]/20 flex items-center justify-center text-[#78dc77] group-hover:scale-110 transition-transform">
                    <Smile size={16} />
                  </div>
                  <p className="text-[11px] md:text-sm leading-relaxed text-[#bec8cb]">
                    Bagus! Pengeluaran masih sangat aman di bawah batas. Terus pertahankan!
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 md:gap-4 group">
                <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#86d2e5]/20 flex items-center justify-center text-[#86d2e5] group-hover:scale-110 transition-transform">
                  <Receipt size={16} />
                </div>
                <p className="text-[11px] md:text-sm leading-relaxed text-[#bec8cb]">
                  Tercatat <span className="font-black text-[#86d2e5]">{monthlyTransactions.length} transaksi</span> terkurasi bulan ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

  );
}

