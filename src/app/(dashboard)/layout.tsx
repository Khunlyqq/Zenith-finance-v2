import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import BottomNav from "@/components/shared/BottomNav";
import MobileFab from "@/components/shared/MobileFab";
import PageTransition from "@/components/shared/PageTransition";
import TransactionModal from "@/components/shared/TransactionModal";
import WalletModal from "@/components/modals/WalletModal";
import BudgetModal from "@/components/modals/BudgetModal";
import SavingsModal from "@/components/modals/SavingsModal";
import { getCachedUser, getCachedProfile } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const [profileRes, transactionsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("transactions").select("*, categories(*)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3)
  ]);

  const profile = profileRes.data;
  const notifications = transactionsRes.data || [];

  // Fallback to a default profile object if missing
  const safeProfile = profile || {
    full_name: user.email?.split('@')[0] || "User",
    is_premium: false
  };

  return (
    <div className="min-h-screen bg-[#101415] text-[#e0e3e4] font-['Plus_Jakarta_Sans'] selection:bg-[#86d2e5]/30 antialiased flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative md:ml-72 transition-all duration-300">
        <Header userProfile={safeProfile} notifications={notifications} />
        <TransactionModal />
        <WalletModal />
        <BudgetModal />
        <SavingsModal />
        <main className="flex-1 pt-24 px-10 pb-28 md:pb-8 max-w-7xl w-full mx-auto relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <BottomNav />
        <MobileFab />
      </div>
    </div>
  );
}

