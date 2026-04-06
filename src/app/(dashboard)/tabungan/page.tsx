import { createClient } from "@/lib/supabase/server";
import { getCachedUser } from "@/lib/supabase/user";
import { redirect } from "next/navigation";
import SavingsClient from "./savings-client";

export default async function SavingsPage() {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  // Fetch Savings Goals & Wallets
  const [goalsRes, walletsRes] = await Promise.all([
    supabase.from("savings_goals").select("*").eq("user_id", user.id).order("deadline"),
    supabase.from("wallets").select("balance").eq("user_id", user.id)
  ]);

  const goals = goalsRes.data || [];
  const totalSavings = walletsRes.data?.reduce((sum, w) => sum + Number(w.balance), 0) || 0;
  
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
  const totalCollected = goals.reduce((sum, g) => sum + Number(g.current_amount), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  // Fetch all transactions to calculate historical balance
  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const now = new Date();
  const historyData = [];
  
  const allTxs = transactions || [];

  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    // Move to end of that month
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    
    // Calculate balance at that point in time
    // Current totalSavings is the balance NOW.
    // To get balance then: totalSavings - net_change(from then until now)
    const netChangeSinceThen = allTxs
      .filter(tx => new Date(tx.date) > endOfMonth)
      .reduce((sum, tx) => {
        const amt = Number(tx.amount);
        return tx.type === 'income' ? sum + amt : sum - amt;
      }, 0);

    historyData.push({
      month: months[endOfMonth.getMonth()],
      balance: Math.max(0, totalSavings - netChangeSinceThen)
    });
  }

  return (
    <SavingsClient 
      goals={goals}
      totalSavings={totalSavings}
      totalTarget={totalTarget}
      totalCollected={totalCollected}
      overallProgress={overallProgress}
      historyData={historyData}
      months={months}
      now={now}
    />
  );
}
