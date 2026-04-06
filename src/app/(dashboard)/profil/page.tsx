import { 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  CreditCard, 
  Activity, 
  Calendar, 
  Award, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { getCachedUser, getCachedProfile } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileCardClient from "./ProfileCardClient";
import MembershipCardClient from "./MembershipCardClient";
import ProfileStatsClient from "./ProfileStatsClient"; 
import { getServerTranslation } from "@/lib/i18n/server";

export default async function ProfilePage() {
  const { t } = await getServerTranslation();
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const profile = await getCachedProfile(user.id);
  const supabase = await createClient();

  // Get total stats
  const { count: txCount } = await supabase
    .from("transactions")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id);

  const { count: walletCount } = await supabase
    .from("wallets")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id);

  return (
    <div className="space-y-12 pb-12">
      {/* Header Profile Section */}
      <section className="relative px-2">
        {/* Profile Card Dynamic Client */}
        < ProfileCardClient profile={profile} user={user} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-2">
         {/* Stats — Snap-Scrolling for Mobile */}
         <div className="lg:col-span-8 flex flex-col gap-6">
            <ProfileStatsClient txCount={txCount || 0} walletCount={walletCount || 0} />
            <MembershipCardClient profile={profile} />
         </div>

         {/* Quick Account Settings Link */}
         <div className="lg:col-span-4 flex flex-col min-h-0 gap-6">
            <Link href="/pengaturan" className="bg-[#181c1d] rounded-[2rem] p-8 flex items-center justify-between group hover:bg-[#1c2021] border border-[#899295]/5 transition-all h-[120px]">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#323537] rounded-[1.2rem] flex items-center justify-center text-[#899295] group-hover:text-[#86d2e5] transition-colors shrink-0">
                     <Settings size={24} />
                  </div>
                  <div className="text-left">
                     <p className="text-base font-bold text-[#e0e3e4]">{t("profile.account_settings")}</p>
                     <p className="text-[10px] font-black text-[#899295] uppercase tracking-widest mt-1">{t("profile.security_prec")}</p>
                  </div>
               </div>
               <ChevronRight size={20} className="text-[#899295] group-hover:translate-x-1 group-hover:text-[#86d2e5] transition-all" />
            </Link>

            <div className="mt-auto bg-red-400/5 border border-red-400/20 rounded-[2rem] p-8 flex flex-col gap-6 relative overflow-hidden group">
               <div className="absolute right-4 top-4 text-red-500/10 group-hover:scale-125 transition-transform duration-500">
                  <ShieldCheck size={100} />
               </div>
               <div className="text-left relative z-10">
                  <p className="text-base font-black text-red-400">{t("profile.danger_zone")}</p>
                  <p className="text-[9px] font-black text-red-400/60 uppercase tracking-[0.2em] mt-1 mb-2">{t("profile.danger_desc")}</p>
               </div>
               <button className="w-full relative z-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-red-400 border border-red-400/20 rounded-xl hover:bg-red-400 hover:text-[#101415] transition-all flex items-center justify-center gap-3">
                 <LogOut size={16} /> {t("profile.logout_now")}
               </button>
            </div>
         </div>
      </section>
    </div>
  );
}
