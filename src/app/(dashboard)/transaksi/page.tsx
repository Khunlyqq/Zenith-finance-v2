import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUp, 
  ArrowDown, 
  Search,
  Calendar,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EmptyState from "@/components/shared/EmptyState";
import { getServerTranslation } from "@/lib/i18n/server";


export default async function TransactionsPage() {
  const { t, lang } = await getServerTranslation();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all transactions for summary
  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("*, categories(*), wallets(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  const transactions = allTransactions || [];

  // Calculate stats
  const totalInflow = transactions
    .filter((tx: any) => tx.type === 'income')
    .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);
  
  const totalOutflow = transactions
    .filter((tx: any) => tx.type === 'expense')
    .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);

  const netBalance = totalInflow - totalOutflow;

  const locale = lang === 'id' ? 'id-ID' : 'en-US';

  // Current month for summary
  const now = new Date();
  const monthName = now.toLocaleString(locale, { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div className="space-y-8 md:space-y-12 pb-12">
      {/* Header Cards — Snap-Scrolling for Mobile */}
      <section className="flex md:grid md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div 
          className="min-w-[85%] md:min-w-0 snap-center bg-[#181c1d] p-6 md:p-8 rounded-3xl relative overflow-hidden group border-l-8 border-[#78dc77]/40 shadow-xl hover:bg-[#1c2021] transition-all premium-glow flex flex-col justify-center"
          style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform hidden md:block">
            <TrendingUp size={96} className="text-[#78dc77]" />
          </div>
          <div className="relative z-10">
            <p className="text-[#899295] text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t("transactions.inflow_log")}</p>
            <h3 className="text-2xl md:text-3xl font-black font-headline text-[#78dc77] tracking-tighter">
               + {new Intl.NumberFormat(locale).format(totalInflow)}
            </h3>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[9px] font-black text-[#78dc77] bg-[#78dc77]/10 px-3 py-1 rounded-full w-fit uppercase tracking-widest border border-[#78dc77]/10">
               <ArrowUp size={12} /> <span className="hidden sm:inline">{t("transactions.net_allocation")}:</span> {new Intl.NumberFormat(locale, { notation: 'compact' }).format(netBalance)}
            </div>
          </div>
        </div>

        <div 
          className="min-w-[85%] md:min-w-0 snap-center bg-[#181c1d] p-6 md:p-8 rounded-3xl relative overflow-hidden group border-l-8 border-[#ffb4ab]/40 shadow-xl hover:bg-[#1c2021] transition-all premium-glow flex flex-col justify-center"
          style={{ '--card-glow-rgb': '255, 180, 171' } as React.CSSProperties}
        >
           <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform hidden md:block">
              <TrendingDown size={96} className="text-[#ffb4ab]" />
           </div>
           <div className="relative z-10">
              <p className="text-[#899295] text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t("transactions.outflow_log")}</p>
              <h3 className="text-2xl md:text-3xl font-black font-headline text-[#ffb4ab] tracking-tighter">
                 - {new Intl.NumberFormat(locale).format(totalOutflow)}
              </h3>
              <div className="mt-4 inline-flex items-center gap-1.5 text-[9px] font-black text-[#ffb4ab] bg-[#ffb4ab]/10 px-3 py-1 rounded-full w-fit uppercase tracking-widest border border-[#ffb4ab]/10">
                 <ArrowDown size={12} /> <span className="hidden sm:inline uppercase">{t("transactions.currently_used_text")}</span>
              </div>
           </div>
        </div>

        <div 
          className="min-w-[85%] md:min-w-0 snap-center lg:col-span-4 bg-gradient-to-br from-[#86d2e5] to-[#006778] p-6 md:p-8 rounded-3xl shadow-2xl border border-white/10 premium-glow flex flex-col justify-between"
          style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
        >
           <div>
             <p className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-2 opacity-80">{t("transactions.est_net_balance")}</p>
             <h3 className="text-3xl md:text-4xl font-black font-headline text-white tracking-tighter leading-none">
               Rp {new Intl.NumberFormat(locale).format(netBalance)}
             </h3>
           </div>
           <div className="mt-6">
             <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-white/40 w-[100%] rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)]"></div>
             </div>
             <p className="text-[9px] mt-3 text-white/70 font-black uppercase tracking-[0.2em]">{t("transactions.sync_active")}</p>
           </div>
        </div>
      </section>

      {/* Advanced Filters */}
      <div className="bg-[#181c1d] p-3 md:p-4 rounded-2xl md:rounded-3xl flex flex-col sm:flex-row items-center gap-3 md:gap-4 border border-[#899295]/5 shadow-2xl">
         <div className="w-full sm:flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#899295]"><Search size={16} /></span>
            <input type="text" placeholder={t("transactions.search_placeholder")} className="w-full bg-[#323537]/50 border-none rounded-xl pl-11 pr-4 py-3 text-xs font-bold tracking-tight focus:ring-2 focus:ring-[#86d2e5]/20 placeholder:text-[#899295]/40 outline-none text-[#e0e3e4]"/>
         </div>
         <div className="w-full sm:w-auto flex items-center gap-3">
            <div className="relative w-full sm:w-auto">
               <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#899295]"><Calendar size={12} /></span>
               <select className="w-full appearance-none bg-[#1c2021] border border-[#899295]/10 rounded-xl px-4 py-3 pr-10 text-[9px] md:text-[10px] font-black uppercase tracking-widest focus:ring-[#86d2e5]/20 cursor-pointer outline-none text-[#BEC8CB]">
                  <option>{monthName}</option>
               </select>
            </div>
         </div>
      </div>

      {/* Transactions Container */}
      <section 
        className="bg-[#181c1d] rounded-2xl md:rounded-4xl border border-[#899295]/5 premium-glow relative overflow-hidden flex flex-col"
        style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
      >
        <div className="p-5 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#181c1d]/50 backdrop-blur-md relative z-10 shrink-0">
          <h3 className="text-xl md:text-2xl font-black font-headline tracking-tight text-[#e0e3e4]">{t("transactions.history_log")}</h3>
          <p className="text-[10px] font-black text-[#899295] uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            {transactions.length} {t("transactions.total_text")}
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#899295] uppercase text-[10px] tracking-[0.2em] font-black border-b border-white/5">
                <th className="px-8 py-6">{t("transactions.date")}</th>
                <th className="px-8 py-6">{t("transactions.description")}</th>
                <th className="px-8 py-6 text-center">{t("transactions.type")}</th>
                <th className="px-8 py-6 text-center">{t("transactions.wallet")}</th>
                <th className="px-8 py-6 text-right">{t("transactions.amount")}</th>
                <th className="px-8 py-6 text-center">{t("transactions.options")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#899295]/5">
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="group hover:bg-[#1c2021] transition-all cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black">
                        {new Date(tx.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] font-bold text-[#899295] tracking-wider lowercase opacity-60">
                        {new Date(tx.date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} {lang === 'id' ? 'WIB' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-[#86d2e5]/10 flex items-center justify-center text-[#86d2e5] group-hover:scale-110 transition-transform border border-[#86d2e5]/10 shadow-lg shadow-[#86d2e5]/5">
                        <span className="material-symbols-outlined">{tx.categories?.icon || 'payments'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight truncate max-w-[240px] text-[#e0e3e4]">{tx.note || tx.categories?.name || (lang === 'id' ? 'Transaksi' : 'Transaction')}</p>
                        <p className="text-[10px] font-black text-[#899295] uppercase tracking-widest opacity-60">{tx.categories?.name || (lang === 'id' ? 'Umum' : 'General')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 bg-[#323537] text-[9px] font-black rounded-full uppercase tracking-widest border border-[#899295]/10 ${tx.type === 'income' ? 'text-[#78dc77] border-[#78dc77]/20 shadow-lg shadow-[#78dc77]/5' : 'text-[#ffb4ab] border-[#ffb4ab]/20 shadow-lg shadow-[#ffb4ab]/5'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-[10px] font-black text-[#899295] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">{tx.wallets?.name || (lang === 'id' ? 'Utama' : 'Primary')}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`text-base font-black ${tx.type === 'expense' ? 'text-[#ffb4ab]' : 'text-[#78dc77]'}`}>
                      {tx.type === 'expense' ? '-' : '+'} Rp {new Intl.NumberFormat(locale).format(Math.abs(tx.amount))}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                      <button className="p-2.5 bg-white/5 hover:bg-[#86d2e5] hover:text-[#006778] rounded-xl transition-all border border-white/5"><Edit3 size={16} /></button>
                      <button className="p-2.5 bg-white/5 hover:bg-red-400/20 hover:text-red-400 rounded-xl transition-all border border-white/5"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Grid View (Cards) — 2 Columns Premium */}
        <div className="lg:hidden grid grid-cols-2 gap-3 p-4 relative z-10">
          {transactions.map((tx: any) => (
            <div 
              key={tx.id} 
              className="bg-[#1c2021] p-4 rounded-2xl border border-white/5 flex flex-col justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-[#86d2e5]/10 flex items-center justify-center text-[#86d2e5] border border-[#86d2e5]/10">
                  <span className="material-symbols-outlined text-[18px]">{tx.categories?.icon || 'payments'}</span>
                </div>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${tx.type === 'income' ? 'text-[#78dc77] border-[#78dc77]/20 bg-[#78dc77]/5' : 'text-[#ffb4ab] border-[#ffb4ab]/20 bg-[#ffb4ab]/5'}`}>
                  {tx.type.toUpperCase()}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="text-[11px] font-black line-clamp-1 text-[#e0e3e4] mb-0.5">{tx.note || tx.categories?.name || (lang === 'id' ? 'Transaksi' : 'Transaction')}</h4>
                <p className="text-[8px] font-black text-[#899295] uppercase tracking-wider">{new Date(tx.date).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</p>
              </div>

              <div className="flex justify-between items-end mt-auto">
                <p className={`text-sm font-black ${tx.type === 'expense' ? 'text-[#ffb4ab]' : 'text-[#78dc77]'}`}>
                  {tx.type === 'expense' ? '-' : '+'} 
                  {Number(tx.amount) >= 1000000 
                    ? `${(Number(tx.amount) / 1000000).toFixed(1)}jt` 
                    : new Intl.NumberFormat(locale, { notation: 'compact' }).format(Math.abs(tx.amount))}
                </p>
                <div className="flex gap-1">
                   <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center opacity-40">
                      <Trash2 size={10} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="px-8 py-20 relative z-10 text-center">
            <EmptyState 
              title={t("transactions.empty_title")}
              description={t("transactions.empty_desc")}
            />
          </div>
        )}

        {/* Global Pagination */}
        <div className="p-5 md:p-8 border-t border-[#899295]/10 flex items-center justify-between bg-[#323537]/10 shrink-0 relative z-10">
          <p className="text-[8px] md:text-[10px] font-black text-[#899295] uppercase tracking-widest hidden sm:block">
            {t("transactions.showing")} <span className="text-white">{transactions.length}</span> {t("transactions.total_text").toUpperCase()}
          </p>
          <div className="flex gap-2 mx-auto sm:mx-0">
            <button className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-[#1c2021] border border-[#899295]/15 rounded-xl text-[#899295] opacity-40 cursor-not-allowed transition-all">
              <ChevronLeft size={16} />
            </button>
            <button className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-[#86d2e5] text-[#006778] font-black rounded-xl text-[10px] md:text-xs shadow-lg shadow-[#86d2e5]/10">1</button>
            <button className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-[#1c2021] border border-[#899295]/15 rounded-xl text-[#899295] opacity-40 cursor-not-allowed transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
