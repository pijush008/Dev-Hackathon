import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatCards } from "@/components/dashboard/stat-cards";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const displayName =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User";

  const avatarUrl =
    user.user_metadata?.avatar_url ?? null;

  return (
    <div className="space-y-6">
      <WelcomeHeader name={displayName} email={user.email ?? ""} avatarUrl={avatarUrl} />

      <StatCards />

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <OverviewChart />
        </div>
        <div className="lg:col-span-3">
          <ActivityFeed />
        </div>
      </div>

      <QuickActions />
    </div>
  );
}
