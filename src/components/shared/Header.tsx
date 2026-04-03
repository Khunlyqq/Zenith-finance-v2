"use client";

import { Bell, Sparkles, TrendingUp, TrendingDown, Wallet, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
// import { logout } from "../../actions/auth";
const logout = async () => { console.log("Logout triggered"); window.location.href = "/login"; };


export default function Header({ 
  userProfile,
  notifications = []
}: { 
  userProfile?: any,
  notifications?: any[]
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  async function handleLogout() {
    await logout();
  }

  // Format notifications from real transactions
  const formattedNotifications = notifications.map((notif, idx) => ({
    id: notif.id,
    title: notif.type === 'income' ? 'Pemasukan Baru' : 'Pengeluaran Baru',
    desc: `${notif.note || (notif.categories?.name + ' (Kategori)')}: Rp ${new Intl.NumberFormat('id-ID').format(Math.abs(notif.amount))}`,
    time: new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    icon: notif.type === 'income' ? <TrendingUp size={14} className="text-[#78dc77]" /> : <TrendingDown size={14} className="text-[#ffb4ab]" />,
    color: notif.type === 'income' ? 'bg-[#78dc77]/10' : 'bg-[#ffb4ab]/10'
  }));

  return (
    <header className="fixed top-0 right-0 md:left-72 left-0 h-20 z-40 bg-[#101415]/60 backdrop-blur-2xl font-headline font-medium border-b border-white/5 transition-all duration-300">
      <div className="flex justify-between items-center px-4 md:px-10 h-full">
        {/* Removed Title Section */}
        <div className="flex-1"></div>

        <div className="flex items-center gap-6">
          {/* Notifications Trigger */}
          <div className="relative">
            <div 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className={`relative group cursor-pointer active:opacity-70 transition-all p-2 rounded-full ${isNotifOpen ? 'bg-[#86d2e5]/10' : 'hover:bg-[#1c2021]'}`}
            >
              <Bell className="text-[#86d2e5]" size={20} />
              {formattedNotifications.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#ffb870] rounded-full border border-[#101415]"></span>
              )}
            </div>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setIsNotifOpen(false)} />
                <div className="absolute right-0 mt-4 w-80 bg-[#181c1d] border border-white/5 rounded-[2rem] shadow-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-200 z-50 premium-glow">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#899295]">Aktivitas Terbaru</h4>
                    <span className="bg-[#86d2e5]/10 text-[#86d2e5] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Live</span>
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {formattedNotifications.length > 0 ? formattedNotifications.map((notif) => (
                      <div key={notif.id} className="flex gap-4 group cursor-pointer hover:bg-[#272b2c] p-2 -m-2 rounded-2xl transition-all">
                        <div className={`w-10 h-10 ${notif.color} rounded-xl shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          {notif.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-[#e0e3e4] leading-none mb-1 truncate">{notif.title}</p>
                          <p className="text-[10px] text-[#899295] font-medium leading-tight line-clamp-2">{notif.desc}</p>
                          <p className="text-[9px] text-[#86d2e5]/40 font-black uppercase tracking-widest mt-1.5">{notif.time}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-[10px] text-[#899295] text-center py-4 uppercase tracking-widest font-black">Belum ada aktivitas</p>
                    )}
                  </div>

                  <button className="w-full mt-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#86d2e5] border border-[#86d2e5]/20 rounded-xl hover:bg-[#86d2e5]/10 transition-all">
                    Lihat Semua Aktivitas
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <div 
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-1.5 pr-3 rounded-full transition-all active:scale-95"
            >
              <img 
                alt="Portrait" 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#86d2e5]/20 group-hover:ring-[#86d2e5] transition-all" 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
              />
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-[#e0e3e4] line-clamp-1">{userProfile?.full_name || 'User Profile'}</p>
                <div className="flex items-center gap-1.5 justify-end">
                   <p className="text-[9px] text-[#899295] uppercase tracking-widest font-black">
                    {userProfile?.is_premium ? 'Premium' : 'Standard'}
                  </p>
                  <ChevronDown size={10} className={`text-[#899295] transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>

            {/* Profile Settings Dropdown */}
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setIsProfileOpen(false)} />
                <div className="absolute right-0 mt-4 w-60 bg-[#181c1d] border border-white/5 rounded-3xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50 premium-glow">
                  <div className="space-y-1">
                    <Link 
                      href="/profil"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-[#899295] hover:text-[#86d2e5] hover:bg-[#86d2e5]/5 rounded-xl transition-all group uppercase tracking-widest"
                    >
                      <User size={16} className="group-hover:scale-110 transition-transform" />
                      <span>Profil Saya</span>
                    </Link>
                    <Link 
                      href="/pengaturan"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-[#899295] hover:text-[#86d2e5] hover:bg-[#86d2e5]/5 rounded-xl transition-all group uppercase tracking-widest"
                    >
                      <Settings size={16} className="group-hover:scale-110 transition-transform" />
                      <span>Pengaturan</span>
                    </Link>
                    <div className="h-px bg-white/5 my-2 mx-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-[#ffb4ab] hover:bg-[#ffb4ab]/5 rounded-xl transition-all group uppercase tracking-widest"
                    >
                      <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
