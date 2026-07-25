"use client";

import dynamic from "next/dynamic";

const WelcomeHeader = dynamic(
  () => import("@/components/dashboard/welcome-header").then((m) => ({ default: m.WelcomeHeader })),
  { ssr: false }
);

const HealthOverview = dynamic(
  () => import("@/components/dashboard/sections").then((m) => ({ default: m.HealthOverview })),
  { ssr: false }
);

const MedicineReminder = dynamic(
  () => import("@/components/dashboard/sections").then((m) => ({ default: m.MedicineReminder })),
  { ssr: false }
);

const AppointmentsSection = dynamic(
  () => import("@/components/dashboard/sections").then((m) => ({ default: m.Appointments })),
  { ssr: false }
);

const MedicalReports = dynamic(
  () => import("@/components/dashboard/sections").then((m) => ({ default: m.MedicalReports })),
  { ssr: false }
);

const AIAssistant = dynamic(
  () => import("@/components/dashboard/sections").then((m) => ({ default: m.AIAssistant })),
  { ssr: false }
);

const MoodTracker = dynamic(
  () => import("@/components/dashboard/sections").then((m) => ({ default: m.MoodTracker })),
  { ssr: false }
);

const EmergencySOS = dynamic(
  () => import("@/components/dashboard/sections").then((m) => ({ default: m.EmergencySOS })),
  { ssr: false }
);

const DashboardNotifications = dynamic(
  () => import("@/components/dashboard/sections").then((m) => ({ default: m.DashboardNotifications })),
  { ssr: false }
);

const DashboardTimeline = dynamic(
  () => import("@/components/dashboard/sections").then((m) => ({ default: m.DashboardTimeline })),
  { ssr: false }
);

interface DashboardContentProps {
  name: string;
  email: string;
  avatarUrl: string | null;
}

export function DashboardContent({ name, email, avatarUrl }: DashboardContentProps) {
  return (
    <div className="space-y-6">
      <WelcomeHeader name={name} email={email} avatarUrl={avatarUrl} />

      <div className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-xs text-muted-foreground">
        Some sections display sample data for demonstration. Connect your health devices to see real data.
      </div>

      {/* Row 1: Health Overview — full width */}
      <HealthOverview />

      {/* Row 2: Medicine + Appointments + AI Assistant */}
      <div className="grid gap-6 xl:grid-cols-3">
        <MedicineReminder />
        <AppointmentsSection />
        <AIAssistant />
      </div>

      {/* Row 3: Mood + Reports + Notifications */}
      <div className="grid gap-6 lg:grid-cols-3">
        <MoodTracker />
        <MedicalReports />
        <DashboardNotifications />
      </div>

      {/* Row 4: Health Timeline — full width */}
      <DashboardTimeline />

      {/* Emergency SOS — floating component */}
      <EmergencySOS />
    </div>
  );
}
