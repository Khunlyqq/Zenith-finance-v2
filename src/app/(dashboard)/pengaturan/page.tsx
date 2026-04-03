import { getCachedUser, getCachedProfile } from "@/lib/supabase/user";
import { redirect } from "next/navigation";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const profile = await getCachedProfile(user.id);
  
  // We pass the profile fetched from the server down to the client component
  return <SettingsClient profile={profile} user={user} />;
}
