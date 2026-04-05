import { 
  Plus, 
  Search, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  TrendingDown, 
  ArrowUp, 
  ArrowDown,
  Receipt
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EmptyState from "@/components/shared/EmptyState";


export default async function TransactionsPage() {
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
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  
  const totalOutflow = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const netBalance = totalInflow - totalOutflow;

  // Current month for summary
  const now = new Date();
  const monthName = now.toLocaleString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div className="space-y-8 md:space-y-12 pb-12">
      {/* Header Cards — 2nd column grid on mobile */}
      <section className="grid grid-cols-2 lg:grid-cols-12 gap-3 md:gap-6">
        <div 
          className="col-span-1 lg:col-span-4 bg-[#181c1d] p-5 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden group border-l-4 border-[#78dc77]/40 shadow-sm hover:bg-[#1c2021] transition-all premium-glow"
          style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform hidden md:block">
            <TrendingUp size={96} className="text-[#78dc77]" />
          </div>
          <div className="relative z-10">
            <p className="text-[#899295] text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">INFLOW</p>
            <h3 className="text-lg md:text-3xl font-black font-headline text-[#78dc77] tracking-tighter line-clamp-1">
               {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(totalInflow)}
            </h3>
            <div className="mt-2 md:mt-4 inline-flex items-center gap-1 text-[7px] md:text-[10px] font-black text-[#78dc77] bg-[#78dc77]/10 px-2 py-0.5 md:py-1 rounded w-fit uppercase tracking-widest">
               <ArrowUp size={10} className="md:w-3 md:h-3" /> <span className="hidden sm:inline">BERSIH:</span> {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(netBalance)}
            </div>
          </div>
        </div>

        <div 
          className="col-span-1 lg:col-span-4 bg-[#181c1d] p-5 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden group border-l-4 border-[#ffb4ab]/40 shadow-sm hover:bg-[#1c2021] transition-all premium-glow"
          style={{ '--card-glow-rgb': '255, 180, 171' } as React.CSSProperties}
        >
           <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform hidden md:block">
              <TrendingDown size={96} className="text-[#ffb4ab]" />
           </div>
           <div className="relative z-10">
              <p className="text-[#899295] text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">OUTFLOW</p>
              <h3 className="text-lg md:text-3xl font-black font-headline text-[#ffb4ab] tracking-tighter line-clamp-1">
                 {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(totalOutflow)}
              </h3>
              <div className="mt-2 md:mt-4 inline-flex items-center gap-1 text-[7px] md:text-[10px] font-black text-[#ffb4ab] bg-[#ffb4ab]/10 px-2 py-0.5 md:py-1 rounded w-fit uppercase tracking-widest">
                 <ArrowDown size={10} className="md:w-3 md:h-3" /> <span className="hidden sm:inline">TERPAKAI</span>
              </div>
           </div>
        </div>

        <div 
          className="col-span-2 lg:col-span-4 bg-gradient-to-br from-[#86d2e5] to-[#006778] p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-xl border border-white/10 premium-glow"
          style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
        >
           <p className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest mb-1 opacity-80">SALDO AKTIF SAAT INI</p>
           <h3 className="text-2xl md:text-3xl font-black font-headline text-white tracking-tighter">
             Rp {new Intl.NumberFormat('id-ID').format(netBalance)}
           </h3>
           <div className="mt-3 md:mt-4 h-1.5 md:h-2 w-full bg-black/20 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-[#86d2e5] w-[100%] rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)]"></div>
           </div>
           <p className="text-[7px] md:text-[10px] mt-2 md:mt-3 text-white/70 font-black uppercase tracking-widest">REAL-TIME SINKRONISASI</p>
        </div>
      </section>

      {/* Advanced Filters */}
      <div className="bg-[#181c1d] p-3 md:p-4 rounded-2xl md:rounded-3xl flex flex-col sm:flex-row items-center gap-3 md:gap-4 border border-[#899295]/5 shadow-2xl">
         <div className="w-full sm:flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#899295]"><Search size={16} /></span>
            <input type="text" placeholder="Cari catatan..." className="w-full bg-[#323537]/50 border-none rounded-xl pl-11 pr-4 py-3 text-xs font-bold tracking-tight focus:ring-2 focus:ring-[#86d2e5]/20 placeholder:text-[#899295]/40 outline-none text-[#e0e3e4]"/>
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
          <h3 className="text-xl md:text-2xl font-black font-headline tracking-tight text-[#e0e3e4]">Riwayat Log</h3>
          <p className="text-[10px] font-black text-[#899295] uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            {transactions.length} Total
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#899295] uppercase text-[10px] tracking-[0.2em] font-black border-b border-white/5">
                <th className="px-8 py-6">Tanggal</th>
                <th className="px-8 py-6">Keterangan</th>
                <th className="px-8 py-6 text-center">Tipe</th>
                <th className="px-8 py-6 text-center">Dompet</th>
                <th className="px-8 py-6 text-right">Jumlah</th>
                <th className="px-8 py-6 text-center">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#899295]/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-[#1c2021] transition-all cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black">
                        {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] font-bold text-[#899295] tracking-wider lowercase opacity-60">
                        {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-[#86d2e5]/10 flex items-center justify-center text-[#86d2e5] group-hover:scale-110 transition-transform border border-[#86d2e5]/10 shadow-lg shadow-[#86d2e5]/5">
                        <span className="material-symbols-outlined">{tx.categories?.icon || 'payments'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight truncate max-w-[240px] text-[#e0e3e4]">{tx.note || tx.categories?.name || 'Transaksi'}</p>
                        <p className="text-[10px] font-black text-[#899295] uppercase tracking-widest opacity-60">{tx.categories?.name || 'Umum'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 bg-[#323537] text-[9px] font-black rounded-full uppercase tracking-widest border border-[#899295]/10 ${tx.type === 'income' ? 'text-[#78dc77] border-[#78dc77]/20 shadow-lg shadow-[#78dc77]/5' : 'text-[#ffb4ab] border-[#ffb4ab]/20 shadow-lg shadow-[#ffb4ab]/5'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-[10px] font-black text-[#899295] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">{tx.wallets?.name || 'Utama'}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`text-base font-black ${tx.type === 'expense' ? 'text-[#ffb4ab]' : 'text-[#78dc77]'}`}>
                      {tx.type === 'expense' ? '-' : '+'} Rp {new Intl.NumberFormat('id-ID').format(Math.abs(tx.amount))}
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
          {transactions.map((tx) => (
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
                <h4 className="text-[11px] font-black line-clamp-1 text-[#e0e3e4] mb-0.5">{tx.note || tx.categories?.name}</h4>
                <p className="text-[8px] font-black text-[#899295] uppercase tracking-wider">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
              </div>

              <div className="flex justify-between items-end mt-auto">
                <p className={`text-sm font-black ${tx.type === 'expense' ? 'text-[#ffb4ab]' : 'text-[#78dc77]'}`}>
                  {tx.type === 'expense' ? '-' : '+'} 
                  {Number(tx.amount) >= 1000000 
                    ? `${(Number(tx.amount) / 1000000).toFixed(1)}jt` 
                    : new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(Math.abs(tx.amount))}
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
              title="Riwayat Transaksi Kosong"
              description="Sepertinya kamu belum mencatat pengeluaran atau pemasukan."
            />
          </div>
        )}

        {/* Global Pagination */}
        <div className="p-5 md:p-8 border-t border-[#899295]/10 flex items-center justify-between bg-[#323537]/10 shrink-0 relative z-10">
          <p className="text-[8px] md:text-[10px] font-black text-[#899295] uppercase tracking-widest hidden sm:block">
            MENAMPILKAN <span className="text-white">{transactions.length}</span> TRANSAKSI
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
