import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/server";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

const StatCards = dynamic(
  () => import("@/components/dashboard/stat-cards").then((m) => m.StatCards),
  { ssr: false },
);

const OverviewChart = dynamic(
  () =>
    import("@/components/dashboard/overview-chart").then(
      (m) => m.OverviewChart,
    ),
  { ssr: false },
);

const ActivityFeed = dynamic(
  () =>
    import("@/components/dashboard/activity-feed").then(
      (m) => m.ActivityFeed,
    ),
  { ssr: false },
);

const QuickActions = dynamic(
  () =>
    import("@/components/dashboard/quick-actions").then(
      (m) => m.QuickActions,
    ),
  { ssr: false },
);

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

  const avatarUrl = user.user_metadata?.avatar_url ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <WelcomeHeader
          name={displayName}
          email={user.email ?? ""}
          avatarUrl={avatarUrl}
        />
        <SignOutButton />
      </div>

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
