import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
  const email = user.email || "";
  const avatarUrl = user.user_metadata?.avatar_url || null;

  return <DashboardContent name={name} email={email} avatarUrl={avatarUrl} />;
}
