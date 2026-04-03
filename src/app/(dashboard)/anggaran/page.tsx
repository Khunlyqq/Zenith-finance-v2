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
    <div className="space-y-12 pb-12">
      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-gradient-to-br from-[#86d2e5] to-[#006778] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group premium-glow"
          style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-white font-bold text-[10px] uppercase tracking-widest mb-1">TOTAL ANGGARAN {monthName}</p>
          <div className="mt-2">
            <h2 className="text-4xl font-black text-white leading-none">
              Rp {new Intl.NumberFormat('id-ID').format(totalBudget)}
            </h2>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-white/70 uppercase tracking-widest bg-white/10 px-2 py-1 rounded w-fit">
               <TrendingUp size={12} /> TERKELOLA
            </div>
          </div>
        </div>

        <div 
          className="bg-[#181c1d] p-8 rounded-[2.5rem] border border-[#899295]/10 hover:bg-[#1c2021] transition-all premium-glow"
          style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#78dc77]/10 rounded-xl text-[#78dc77]">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full border ${totalSpent > totalBudget ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-[#78dc77] bg-[#78dc77]/10 border-[#78dc77]/20'}`}>
              {totalSpent > totalBudget ? 'OVER BUDGET' : 'DALAM BATAS'}
            </span>
          </div>
          <p className="text-[#899295] text-xs font-bold uppercase tracking-widest mb-1">TERPAKAI</p>
          <h2 className="text-2xl font-bold font-headline">
            Rp {new Intl.NumberFormat('id-ID').format(totalSpent)}
          </h2>
          <p className="text-[10px] text-[#899295] mt-2 tracking-widest">
            {Math.round((totalSpent / totalBudget) * 100) || 0}% DARI TOTAL
          </p>
        </div>

        <div 
          className="bg-[#181c1d] p-8 rounded-[2.5rem] border border-[#899295]/10 hover:bg-[#1c2021] transition-all premium-glow"
          style={{ '--card-glow-rgb': '255, 184, 112' } as React.CSSProperties}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#ffb870]/10 rounded-xl text-[#ffb870]">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
          </div>
          <p className="text-[#899295] text-xs font-bold uppercase tracking-widest mb-1">SISA ANGGARAN</p>
          <h2 className="text-2xl font-bold font-headline">
            Rp {new Intl.NumberFormat('id-ID').format(Math.max(0, remainingBudget))}
          </h2>
          <div className="flex items-center gap-1 text-[#78dc77] text-[10px] font-bold mt-2 uppercase tracking-wide">
             <span className="material-symbols-outlined text-xs">check_circle</span>
             {remainingBudget > 0 ? "Anggaran masih tersedia" : "Batas anggaran terlampaui"}
          </div>
        </div>
      </section>

      {/* Budget Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex justify-between items-baseline mb-4 px-2 shrink-0">
            <h3 className="text-3xl font-black font-headline tracking-tighter">Pos Pengeluaran</h3>
            <button className="text-[#86d2e5] text-xs font-bold uppercase tracking-widest hover:underline">Atur Budget</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.length === 0 ? (
              <div className="col-span-full">
                <EmptyState 
                  title="Kategori Kosong"
                  description="Belum ada kategori yang tersedia di sistem Anda."
                />
              </div>
            ) : budgets.length === 0 ? (
              <div className="col-span-full">
                <EmptyState 
                  title="Anggaran Masih Kosong"
                  description="Sepertinya kamu belum mengatur pos anggaran untuk bulan ini. Yuk, mulai catat rencana keuanganmu!"
                />
              </div>
            ) : (
              categories
                .filter(cat => budgetPerCategory[cat.id] !== undefined) // Only show categories that have a budget set
                .map((cat) => {
                  const spent = spendingPerCategory[cat.id] || 0;
                  const limit = budgetPerCategory[cat.id] || 0;
                  
                  const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
                  const isOver = limit > 0 && spent > limit;

                  return (
                    <div 
                      key={cat.id}
                      className={`bg-[#181c1d] p-6 rounded-3xl border-l-4 hover:bg-[#1c2021] transition-all premium-glow ${isOver ? 'border-red-400' : 'border-[#86d2e5]'}`}
                      style={{ '--card-glow-rgb': isOver ? '255, 180, 171' : '134, 210, 229' } as React.CSSProperties}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl bg-[#323537] flex items-center justify-center shadow-inner ${isOver ? 'text-red-400' : 'text-[#86d2e5]'}`}>
                            <span className="material-symbols-outlined">{cat.icon || 'category'}</span>
                          </div>
                          <div>
                            <h4 className="font-bold">{cat.name}</h4>
                            <p className="text-[10px] text-[#899295] font-bold tracking-widest uppercase">
                              Batas: Rp {new Intl.NumberFormat('id-ID').format(limit)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-[#e0e3e4]">Rp {new Intl.NumberFormat('id-ID').format(spent)}</p>
                          <p className={`text-[10px] font-black tracking-widest uppercase ${isOver ? 'text-red-400' : 'text-[#86d2e5]'}`}>
                            {percent}% TERPAKAI
                          </p>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-[#323537] rounded-full overflow-hidden shadow-inner">
                         <div 
                            className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-red-400 shadow-[0_0_8px_rgba(255,68,68,0.4)]' : 'bg-[#86d2e5] shadow-[0_0_8px_rgba(134,210,229,0.4)]'}`} 
                            style={{ width: `${percent}%` }}
                          ></div>
                      </div>
                    </div>
                  );
                })
            )}
            
            {categories.length > 0 && budgets.length > 0 && categories.some(cat => budgetPerCategory[cat.id] === undefined) && (
              <div className="col-span-full py-4 text-center">
                <p className="text-[#899295] font-headline text-[10px] uppercase tracking-widest opacity-50 italic">
                  Kategori lain belum memiliki anggaran
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Insights Sidebar */}
        <div className="lg:col-span-4 flex flex-col min-h-0">
          <div 
            className="bg-[#272b2c] p-8 rounded-[2.5rem] relative overflow-hidden border border-[#899295]/10 premium-glow"
            style={{ '--card-glow-rgb': '255, 184, 112' } as React.CSSProperties}
          >
            <h3 className="text-lg font-bold font-headline mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-[#ffb870]" />
              Wawasan Pintar
            </h3>
            <div className="space-y-8">
              {totalSpent > totalBudget * 0.8 ? (
                <div className="flex gap-4 group">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-red-400/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                    <AlertTriangle size={18} />
                  </div>
                  <p className="text-sm leading-relaxed text-[#bec8cb]">
                    Waspada! Total pengeluaran Anda sudah mencapai <span className="font-bold text-red-400">{Math.round((totalSpent/totalBudget)*100)}%</span> dari anggaran bulan ini.
                  </p>
                </div>
              ) : (
                <div className="flex gap-4 group">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[#78dc77]/20 flex items-center justify-center text-[#78dc77] group-hover:scale-110 transition-transform">
                    <Smile size={18} />
                  </div>
                  <p className="text-sm leading-relaxed text-[#bec8cb]">
                    Bagus! Pengeluaran Anda masih sangat aman di bawah batas anggaran. Terus pertahankan!
                  </p>
                </div>
              )}
              
              <div className="flex gap-4 group">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#86d2e5]/20 flex items-center justify-center text-[#86d2e5] group-hover:scale-110 transition-transform">
                  <Receipt size={18} />
                </div>
                <p className="text-sm leading-relaxed text-[#bec8cb]">
                  Anda telah mencatat <span className="font-bold text-[#86d2e5]">{monthlyTransactions.length} transaksi</span> di bulan {monthName.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

