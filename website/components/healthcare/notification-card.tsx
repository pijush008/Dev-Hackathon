"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  Pill,
  AlertTriangle,
  MessageSquare,
  FileText,
  CheckCircle2,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  type: "appointment" | "medication" | "alert" | "message" | "report";
  title: string;
  message: string;
  time: string;
  isRead?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const typeConfig: Record<
  NotificationCardProps["type"],
  { icon: LucideIcon; color: string; bg: string }
> = {
  appointment: {
    icon: Calendar,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  medication: {
    icon: Pill,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
  },
  message: {
    icon: MessageSquare,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  report: {
    icon: FileText,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
};

const mockNotifications: NotificationCardProps[] = [
  {
    type: "appointment",
    title: "Upcoming Appointment",
    message: "You have an appointment with Dr. Sarah Chen tomorrow at 10:30 AM.",
    time: "5 min ago",
    isRead: false,
    actionLabel: "View Details",
  },
  {
    type: "medication",
    title: "Medication Reminder",
    message: "Time to take Metformin 500mg. Take with food.",
    time: "30 min ago",
    isRead: false,
    actionLabel: "Mark Taken",
  },
  {
    type: "alert",
    title: "Lab Results Ready",
    message: "Your blood test results from Jan 15 are now available for review.",
    time: "1 hr ago",
    isRead: true,
    actionLabel: "View Results",
  },
  {
    type: "message",
    title: "Message from Dr. Rivera",
    message: "Your recent X-ray results look normal. No follow-up needed at this time.",
    time: "2 hrs ago",
    isRead: true,
    actionLabel: "Reply",
  },
  {
    type: "report",
    title: "Report Uploaded",
    message: "Your prescription for January has been uploaded successfully.",
    time: "3 hrs ago",
    isRead: true,
  },
];

function NotificationItem({ notification }: { notification: NotificationCardProps }) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "group flex gap-3 rounded-xl border p-3.5 transition-all hover:bg-muted/50",
        !notification.isRead && "border-primary/20 bg-primary/5",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          config.bg,
        )}
      >
        <Icon className={cn("size-5", config.color)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">{notification.title}</h4>
            {!notification.isRead && (
              <span className="size-2 rounded-full bg-primary" />
            )}
          </div>
          <button
            onClick={notification.onDismiss}
            className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
          >
            <X className="size-3.5" />
          </button>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {notification.message}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">
            {notification.time}
          </span>
          {notification.actionLabel && (
            <button
              onClick={notification.onAction}
              className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
            >
              <CheckCircle2 className="size-3" />
              {notification.actionLabel}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationCard({
  notifications = mockNotifications,
}: {
  notifications?: NotificationCardProps[];
}) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        <button className="text-xs font-medium text-primary hover:underline">
          Mark all read
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {notifications.map((n, i) => (
          <NotificationItem key={i} notification={n} />
        ))}
      </div>
    </div>
  );
}
