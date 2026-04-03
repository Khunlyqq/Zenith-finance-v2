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
    <div className="space-y-12 pb-12">
      {/* Header Cards */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div 
          className="md:col-span-4 bg-[#181c1d] p-8 rounded-3xl relative overflow-hidden group border-l-4 border-[#78dc77]/40 shadow-sm transition-all hover:bg-[#1c2021] premium-glow"
          style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
        >
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={96} className="text-[#78dc77]" />
          </div>
          <div className="relative z-10">
            <p className="text-[#899295] text-[10px] font-black uppercase tracking-widest mb-1">TOTAL INFLOW</p>
            <h3 className="text-3xl font-black font-headline text-[#78dc77] tracking-tighter">
              Rp {new Intl.NumberFormat('id-ID').format(totalInflow)}
            </h3>
            <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-black text-[#78dc77] bg-[#78dc77]/10 px-2 py-1 rounded w-fit uppercase tracking-widest">
               <ArrowUp size={12} /> BERSIH: Rp {new Intl.NumberFormat('id-ID').format(netBalance)}
            </div>
          </div>
        </div>

        <div 
          className="md:col-span-4 bg-[#181c1d] p-8 rounded-3xl relative overflow-hidden group border-l-4 border-[#ffb4ab]/40 shadow-sm transition-all hover:bg-[#1c2021] premium-glow"
          style={{ '--card-glow-rgb': '255, 180, 171' } as React.CSSProperties}
        >
           <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingDown size={96} className="text-[#ffb4ab]" />
           </div>
           <div className="relative z-10">
              <p className="text-[#899295] text-[10px] font-black uppercase tracking-widest mb-1">TOTAL OUTFLOW</p>
              <h3 className="text-3xl font-black font-headline text-[#ffb4ab] tracking-tighter">
                Rp {new Intl.NumberFormat('id-ID').format(totalOutflow)}
              </h3>
              <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-black text-[#ffb4ab] bg-[#ffb4ab]/10 px-2 py-1 rounded w-fit uppercase tracking-widest">
                 <ArrowDown size={12} /> TERKELOLA
              </div>
           </div>
        </div>

        <div 
          className="md:col-span-4 bg-gradient-to-br from-[#86d2e5] to-[#006778] p-8 rounded-3xl shadow-xl border border-white/10 premium-glow"
          style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
        >
           <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1">SISA SALDO AKTIF</p>
           <h3 className="text-3xl font-black font-headline text-white tracking-tighter">
             Rp {new Intl.NumberFormat('id-ID').format(netBalance)}
           </h3>
           <div className="mt-4 h-2 w-full bg-black/20 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-[#86d2e5] w-[100%] rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)]"></div>
           </div>
           <p className="text-[10px] mt-3 text-white/70 font-medium uppercase tracking-widest">BERDASARKAN TRANSAKSI TERCATAT</p>
        </div>
      </section>

      {/* Advanced Filters */}
      <div className="bg-[#181c1d] p-4 rounded-2xl flex flex-wrap items-center gap-4 border border-[#899295]/5 shadow-2xl">
         <div className="flex-1 min-w-[240px] relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#899295]"><Search size={18} /></span>
            <input type="text" placeholder="Cari catatan transaksi..." className="w-full bg-[#323537]/50 border-none rounded-xl pl-12 pr-4 py-3 text-xs font-bold tracking-tight focus:ring-2 focus:ring-[#86d2e5]/20 placeholder:text-[#899295]/40 outline-none"/>
         </div>
         <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
               <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#899295]"><Calendar size={14} /></span>
               <select className="appearance-none bg-[#1c2021] border border-[#899295]/10 rounded-xl px-5 py-3 pr-10 text-[10px] font-black uppercase tracking-widest focus:ring-[#86d2e5]/20 cursor-pointer outline-none">
                  <option>{monthName}</option>
               </select>
            </div>
         </div>
      </div>

      {/* Transaction Table */}
      <section 
        className="bg-[#181c1d] rounded-4xl border border-[#899295]/5 premium-glow relative overflow-hidden flex flex-col"
        style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#181c1d]/50 backdrop-blur-md relative z-10 shrink-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#899295] uppercase text-[10px] tracking-[0.2em] font-black">
                <th className="px-8 py-5">Tanggal</th>
                <th className="px-8 py-5">Keterangan</th>
                <th className="px-8 py-5 text-center">Tipe</th>
                <th className="px-8 py-5 text-center">Dompet</th>
                <th className="px-8 py-5 text-right">Jumlah</th>
                <th className="px-8 py-5 text-center">Opsi</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Table Body */}
        <div className="relative z-10">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-[#899295]/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-[#1c2021] transition-all cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black">
                        {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-[10px] font-bold text-[#899295] tracking-wider lowercase">
                        {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-[#86d2e5]/10 flex items-center justify-center text-[#86d2e5] group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">{tx.categories?.icon || 'payments'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight truncate max-w-[200px]">{tx.note || tx.categories?.name || 'Transaksi'}</p>
                        <p className="text-[10px] font-bold text-[#899295] uppercase tracking-widest">{tx.categories?.name || 'Umum'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 bg-[#323537] text-[10px] font-black rounded-full uppercase tracking-tighter border border-[#899295]/10 ${tx.type === 'income' ? 'text-[#78dc77]' : 'text-[#ffb4ab]'}`}>
                        {tx.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-[10px] font-black text-[#899295] uppercase tracking-widest">{tx.wallets?.name || 'Utama'}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`text-sm font-black ${tx.type === 'expense' ? 'text-[#ffb4ab]' : 'text-[#78dc77]'}`}>
                      {tx.type === 'expense' ? '-' : '+'} Rp {new Intl.NumberFormat('id-ID').format(Math.abs(tx.amount))}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-[#86d2e5]/20 hover:text-[#86d2e5] rounded-lg transition-all"><Edit3 size={16} /></button>
                      <button className="p-2 hover:bg-[#ffb4ab]/20 hover:text-[#ffb4ab] rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20">
                    <EmptyState 
                      title="Riwayat Transaksi Kosong"
                      description="Sepertinya kamu belum mencatat pengeluaran atau pemasukan. Mari mulai kelola keuanganmu sekarang!"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Integrated) */}
        <div className="px-8 py-6 border-t border-[#899295]/10 flex items-center justify-between bg-[#323537]/10 shrink-0">
          <p className="text-[10px] font-black text-[#899295] uppercase tracking-widest">
            MENAMPILKAN <span className="text-white">{transactions.length}</span> TRANSAKSI TERBARU
          </p>
          <div className="flex gap-2">
            <button className="p-2 bg-[#1c2021] border border-[#899295]/15 rounded-lg text-[#899295] opacity-40 cursor-not-allowed">
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#86d2e5] text-[#006778] font-black rounded-lg text-[10px]">1</button>
            <button className="p-2 bg-[#1c2021] border border-[#899295]/15 rounded-lg text-[#899295] opacity-40 cursor-not-allowed">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
