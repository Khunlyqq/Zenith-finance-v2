"use client";

import React from "react";
import { 
  PlusCircle, 
  Sparkles, 
  BarChart3, 
  Plus, 
  Calendar, 
  Target,
  Trash2,
  ArrowRight
} from "lucide-react";
import SavingsGrowth from "@/components/charts/SavingsGrowth";
import { useModal } from "@/components/providers/ModalProvider";
import EmptyState from "@/components/shared/EmptyState";
import { deleteSavingsGoal } from "@/actions/savings";

interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

interface SavingsClientProps {
  goals: SavingsGoal[];
  totalSavings: number;
  totalTarget: number;
  totalCollected: number;
  overallProgress: number;
  historyData: any[];
  months: string[];
  now: Date;
}

export default function SavingsClient({
  goals,
  totalSavings,
  totalTarget,
  totalCollected,
  overallProgress,
  historyData,
  months,
  now
}: SavingsClientProps) {
  const { openSavingsModal, openAddFundModal } = useModal();

  async function handleDelete(id: string) {
    if (confirm("Apakah Anda yakin ingin menghapus target ini?")) {
      await deleteSavingsGoal(id);
    }
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
            <div className="flex items-center gap-2 text-white mb-4 uppercase tracking-[0.2em] text-[10px] font-black opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>TOTAL SALDO TABUNGAN</span>
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter -ml-1">
              Rp {new Intl.NumberFormat('id-ID').format(totalSavings)}
            </h3>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div className="flex gap-12">
              <div>
                <p className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-2">Target Terkumpul</p>
                <p className="text-2xl font-black text-white">
                  {overallProgress}% <span className="text-xs font-normal opacity-70 ml-2">dari Rp {new Intl.NumberFormat('id-ID').format(totalTarget)}</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-2">Total Goal</p>
                <p className="text-2xl font-black text-white">{goals.length} Target</p>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Bento */}
        <div className="min-w-[85vw] lg:min-w-0 lg:col-span-5 snap-center flex flex-col gap-6">
          <div 
            className="bg-[#181c1d] p-7 rounded-[2rem] flex items-start gap-6 border border-white/5 hover:bg-[#1c2021] transition-all premium-glow group/info"
            style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
          >
            <div className="w-14 h-14 bg-[#78dc77]/15 flex items-center justify-center rounded-2xl shrink-0 border border-[#78dc77]/10 text-[#78dc77] group-hover/info:scale-110 transition-transform">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-headline font-black text-lg mb-1 tracking-tight">Wawasan Tabungan</h4>
              <p className="text-sm text-[#bec8cb] leading-relaxed tracking-tight font-medium opacity-80">
                {goals.length > 0 ? (
                  <>Kamu memiliki <span className="text-[#86d2e5] font-black underline decoration-[#86d2e5]/30 underline-offset-4">{goals.length} target</span> aktif. Tetap konsisten menabung setiap bulan!</>
                ) : (
                  <>Belum ada target tabungan aktif. Mulai buat target pertamamu sekarang!</>
                )}
              </p>
            </div>
          </div>
          <div 
            className="bg-[#181c1d] p-8 rounded-[2.5rem] flex-1 flex flex-col justify-between border border-white/5 relative overflow-hidden group premium-glow"
            style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-headline font-black text-xl text-[#e0e3e4] tracking-tight">Pertumbuhan Bulanan</h4>
                <p className="text-[10px] text-[#899295] font-black tracking-[0.2em] uppercase mt-1">ESTIMASI TREND {months[now.getMonth()].toUpperCase()}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <BarChart3 className="text-[#86d2e5]" size={18} />
              </div>
            </div>
            <div className="flex-1 min-h-[120px]">
              <SavingsGrowth data={historyData} />
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Goals Grid */}
      <section className="mt-4">
        <div className="flex items-baseline justify-between mb-10 px-2 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
              <Target className="text-[#86d2e5]" size={20} />
            </div>
            <div>
              <h3 className="text-3xl font-black font-headline tracking-tighter">Target Strategis</h3>
              <p className="text-[10px] text-[#899295] font-black uppercase tracking-widest mt-1">MANAJEMEN ALOKASI DANA</p>
            </div>
          </div>
          <button 
            onClick={openSavingsModal}
            className="group flex items-center gap-3 bg-white/5 hover:bg-[#86d2e5] px-6 py-3 rounded-2xl border border-white/5 transition-all active:scale-95"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#899295] group-hover:text-[#006778]">TAMBAH TARGET</span>
            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#006778]/10 transition-colors">
              <Plus size={14} className="text-[#86d2e5] group-hover:text-[#006778]" />
            </div>
          </button>
        </div>
        
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {goals.map((goal) => {
            const progress = Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100);
            return (
              <div 
                key={goal.id}
                className="min-w-[80vw] md:min-w-0 snap-center bg-[#181c1d] p-8 rounded-[2.5rem] flex flex-col group hover:bg-[#1c2021] transition-all border border-white/5 relative overflow-hidden premium-glow"
                style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
              >
                <div className="absolute top-8 right-8 flex gap-2">
                   <button 
                    onClick={() => handleDelete(goal.id)}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#899295] hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>

                <div className="mb-10">
                  <span className="bg-[#86d2e5]/10 text-[#86d2e5] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-[#86d2e5]/10 inline-block">TARGET AKTIF</span>
                  <h4 className="text-2xl font-black font-headline mt-6 mb-2 tracking-tight group-hover:text-[#86d2e5] transition-colors">{goal.name}</h4>
                  <p className="text-[10px] text-[#899295] font-black tracking-widest uppercase flex items-center gap-2">
                     <Calendar size={12} className="opacity-50" /> TENGGAT: {new Date(goal.deadline).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }).toUpperCase()}
                  </p>
                </div>

                <div className="mt-auto space-y-8">
                  <div className="flex justify-between items-end">
                     <div>
                       <p className="text-[10px] text-[#899295] font-black uppercase tracking-widest mb-2 opacity-60">Terkumpul</p>
                       <p className="text-2xl font-black tracking-tight">Rp {new Intl.NumberFormat('id-ID').format(goal.current_amount)}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[10px] text-[#899295] font-black uppercase tracking-widest mb-2 opacity-60">Target</p>
                       <p className="text-sm font-bold text-[#bec8cb]">Rp {new Intl.NumberFormat('id-ID').format(goal.target_amount)}</p>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-gradient-to-r from-[#86d2e5] to-[#006778] rounded-full shadow-[0_0_15px_rgba(134,210,229,0.2)] transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#899295]">
                       <span>Progress</span>
                       <span className="text-[#86d2e5]">{progress}%</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => openAddFundModal(goal.id, goal.name)}
                    className="w-full py-4 bg-white/5 hover:bg-gradient-to-br from-[#86d2e5] to-[#006778] hover:text-white group/btn font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] border border-white/5 shadow-xl hover:shadow-[#86d2e5]/10 active:scale-95"
                  >
                     <Plus size={16} className="text-[#86d2e5] group-hover/btn:text-white transition-colors" /> 
                     <span>TAMBAH DANA</span>
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

      {/* Version Indicator */}
      <div className="flex justify-center opacity-20 hover:opacity-100 transition-opacity pb-8">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#899295]">ZENITH.OS v2.1.4 — REVALIDATION READY</span>
      </div>
    </div>
  );
}
