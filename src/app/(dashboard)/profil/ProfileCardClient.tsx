"use client";

import { User as UserIcon, Mail, Calendar, Award } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ProfileCardClient({ 
  profile, 
  user
}: { 
  profile: any;
  user: any;
}) {
  const { t, lang } = useLanguage();

  const joinDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { 
        month: 'long', 
        year: 'numeric' 
      }) 
    : t("common.unknown");

  return (
    <div 
      className="bg-[#181c1d] rounded-[3rem] p-12 border border-[#899295]/5 relative overflow-hidden group premium-glow" 
      style={{ '--card-glow-rgb': '134, 210, 229' } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 text-center md:text-left">
        {/* Avatar with Glow */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-[#86d2e5]/20 blur-3xl rounded-full group-hover:scale-125 transition-transform"></div>
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" 
            alt="Profile Avatar"
            className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] object-cover ring-4 ring-[#86d2e5]/10 relative z-10"
          />
          {profile?.is_premium && (
            <div className="absolute -bottom-2 -right-2 bg-[#86d2e5] text-[#101415] p-3 rounded-2xl shadow-xl z-20">
              <Award size={20} fill="currentColor" />
            </div>
          )}
        </div>

        {/* Info Area */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black font-headline text-[#e0e3e4] tracking-tighter mb-3 capitalize">
              {profile?.full_name || user?.email?.split('@')[0]}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <Mail size={14} className="text-[#899295]" />
                <span className="text-xs text-[#bec8cb] font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <Calendar size={14} className="text-[#899295]" />
                <span className="text-xs text-[#bec8cb] font-medium">{t("profile.joined_since")} {joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background accent */}
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#86d2e5]/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
}
