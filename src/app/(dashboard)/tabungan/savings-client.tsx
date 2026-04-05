"use client";

import React from "react";
import { 
  Sparkles, 
  BarChart3, 
  Plus, 
  Calendar, 
  Target,
  Trash2,
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
    <div className="space-y-8 pb-12">
      
      {/* ─── Hero Section ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        
        {/* Hero Balance Card */}
        <div 
          className="lg:col-span-7 bg-gradient-to-br from-[#86d2e5] to-[#006778] p-7 md:p-10 rounded-3xl flex flex-col justify-between min-h-[220px] md:min-h-[300px] shadow-2xl relative overflow-hidden group premium-glow glow-pulse"
          style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
        >
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white mb-3 uppercase tracking-[0.2em] text-[9px] md:text-[10px] font-black opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Total Saldo Tabungan</span>
            </div>
            <h3 className="text-3xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter -ml-0.5">
              Rp {new Intl.NumberFormat('id-ID').format(totalSavings)}
            </h3>
          </div>
          <div className="relative z-10 flex items-end justify-between mt-6">
            <div className="flex gap-6 md:gap-12">
              <div>
                <p className="text-[9px] md:text-[10px] text-white/70 font-black uppercase tracking-widest mb-1 md:mb-2">Terkumpul</p>
                <p className="text-lg md:text-2xl font-black text-white">
                  {overallProgress}%{" "}
                  <span className="text-[10px] md:text-xs font-normal opacity-70 ml-1">
                    dari Rp {new Intl.NumberFormat('id-ID').format(totalTarget)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] text-white/70 font-black uppercase tracking-widest mb-1 md:mb-2">Total Goal</p>
                <p className="text-lg md:text-2xl font-black text-white">{goals.length} Target</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Right */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Insights */}
          <div 
            className="bg-[#181c1d] p-5 md:p-7 rounded-2xl md:rounded-[2rem] flex items-start gap-4 md:gap-6 border border-white/5 hover:bg-[#1c2021] transition-all premium-glow group/info"
            style={{ '--card-glow-rgb': '120, 220, 119' } as React.CSSProperties}
          >
            <div className="w-11 h-11 md:w-14 md:h-14 bg-[#78dc77]/15 flex items-center justify-center rounded-xl md:rounded-2xl shrink-0 border border-[#78dc77]/10 text-[#78dc77] group-hover/info:scale-110 transition-transform">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-headline font-black text-base md:text-lg mb-1 tracking-tight">Wawasan Tabungan</h4>
              <p className="text-xs md:text-sm text-[#bec8cb] leading-relaxed font-medium opacity-80">
                {goals.length > 0 ? (
                  <>Kamu memiliki <span className="text-[#86d2e5] font-black">{goals.length} target</span> aktif. Tetap konsisten menabung!</>
                ) : (
                  <>Belum ada target aktif. Buat target pertamamu sekarang!</>
                )}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div 
            className="bg-[#181c1d] p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] flex-1 flex flex-col border border-white/5 relative overflow-hidden group premium-glow"
            style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
          >
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div>
                <h4 className="font-headline font-black text-base md:text-xl text-[#e0e3e4] tracking-tight">Pertumbuhan Bulanan</h4>
                <p className="text-[9px] md:text-[10px] text-[#899295] font-black tracking-[0.2em] uppercase mt-0.5">Estimasi Trend {months[now.getMonth()].toUpperCase()}</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <BarChart3 className="text-[#86d2e5]" size={16} />
              </div>
            </div>
            <div className="flex-1 min-h-[100px] md:min-h-[120px]">
              <SavingsGrowth data={historyData} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Strategic Goals ─── */}
      <section>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
              <Target className="text-[#86d2e5]" size={18} />
            </div>
            <div>
              <h3 className="text-xl md:text-3xl font-black font-headline tracking-tighter">Target Strategis</h3>
              <p className="text-[9px] md:text-[10px] text-[#899295] font-black uppercase tracking-widest mt-0.5">Manajemen Alokasi Dana</p>
            </div>
          </div>
          <button 
            onClick={openSavingsModal}
            className="group flex items-center gap-2 md:gap-3 bg-white/5 hover:bg-[#86d2e5] px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-white/5 transition-all active:scale-95"
          >
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#899295] group-hover:text-[#006778] hidden sm:block">Tambah</span>
            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#006778]/10 transition-colors">
              <Plus size={14} className="text-[#86d2e5] group-hover:text-[#006778]" />
            </div>
          </button>
        </div>

        {/* Goals Grid — 2 cols on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
          {goals.map((goal) => {
            const progress = Math.min(
              Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100),
              100
            );
            return (
              <div
                key={goal.id}
                className="bg-[#181c1d] p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col group hover:bg-[#1c2021] transition-all border border-white/5 relative overflow-hidden premium-glow"
                style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
              >
                {/* Delete button — visible on hover desktop, always visible on mobile */}
                <button 
                  onClick={() => handleDelete(goal.id)}
                  className="absolute top-3 right-3 md:top-6 md:right-6 w-7 h-7 md:w-9 md:h-9 rounded-lg bg-white/5 flex items-center justify-center text-[#899295] hover:text-red-400 hover:bg-red-400/10 transition-all md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 size={12} className="md:hidden" />
                  <Trash2 size={14} className="hidden md:block" />
                </button>

                {/* Badge + Name + Date */}
                <div className="mb-4 md:mb-8 pr-8">
                  <span className="bg-[#86d2e5]/10 text-[#86d2e5] text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] px-2.5 md:px-4 py-1 md:py-1.5 rounded-full border border-[#86d2e5]/10 inline-block">
                    Aktif
                  </span>
                  <h4 className="text-sm md:text-2xl font-black font-headline mt-3 md:mt-6 mb-1 md:mb-2 tracking-tight group-hover:text-[#86d2e5] transition-colors leading-tight line-clamp-2">
                    {goal.name}
                  </h4>
                  <p className="text-[8px] md:text-[10px] text-[#899295] font-black tracking-wider uppercase flex items-center gap-1 md:gap-2">
                    <Calendar size={9} className="opacity-50 shrink-0 md:w-3 md:h-3" />
                    {new Date(goal.deadline).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }).toUpperCase()}
                  </p>
                </div>

                {/* Progress + Amounts */}
                <div className="mt-auto space-y-3 md:space-y-6">
                  {/* Amounts */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[7px] md:text-[10px] text-[#899295] font-black uppercase tracking-wider mb-0.5 md:mb-2 opacity-60">Terkumpul</p>
                      <p className="text-sm md:text-2xl font-black tracking-tight">
                        {/* Short format on mobile */}
                        <span className="md:hidden">
                          {Number(goal.current_amount) >= 1_000_000
                            ? `${(Number(goal.current_amount) / 1_000_000).toFixed(1)}jt`
                            : `${(Number(goal.current_amount) / 1_000).toFixed(0)}rb`}
                        </span>
                        <span className="hidden md:block">
                          Rp {new Intl.NumberFormat('id-ID').format(goal.current_amount)}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[7px] md:text-[10px] text-[#899295] font-black uppercase tracking-wider mb-0.5 md:mb-2 opacity-60">Target</p>
                      <p className="text-[10px] md:text-sm font-bold text-[#bec8cb]">
                        <span className="md:hidden">
                          {Number(goal.target_amount) >= 1_000_000
                            ? `${(Number(goal.target_amount) / 1_000_000).toFixed(1)}jt`
                            : `${(Number(goal.target_amount) / 1_000).toFixed(0)}rb`}
                        </span>
                        <span className="hidden md:block">
                          Rp {new Intl.NumberFormat('id-ID').format(goal.target_amount)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 md:space-y-3">
                    <div className="w-full h-2 md:h-3 bg-white/5 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-[#86d2e5] to-[#006778] rounded-full shadow-[0_0_15px_rgba(134,210,229,0.2)] transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[8px] md:text-[9px] font-black uppercase tracking-wider text-[#899295]">
                      <span>Progress</span>
                      <span className="text-[#86d2e5]">{progress}%</span>
                    </div>
                  </div>

                  {/* Add Fund Button */}
                  <button
                    onClick={() => openAddFundModal(goal.id, goal.name)}
                    className="w-full py-2.5 md:py-4 bg-white/5 hover:bg-gradient-to-br from-[#86d2e5] to-[#006778] hover:text-white group/btn font-black rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-1.5 md:gap-3 uppercase tracking-[0.15em] md:tracking-[0.2em] text-[8px] md:text-[10px] border border-white/5 active:scale-95"
                  >
                    <Plus size={12} className="text-[#86d2e5] group-hover/btn:text-white transition-colors md:w-4 md:h-4" />
                    <span>Tambah Dana</span>
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
      <div className="flex justify-center opacity-20 hover:opacity-100 transition-opacity pb-4">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#899295]">ZENITH.OS v2.1.4 — MOBILE GRID</span>
      </div>
    </div>
  );
}
