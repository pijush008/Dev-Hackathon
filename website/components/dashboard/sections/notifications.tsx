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
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "appointment" | "medication" | "alert" | "message" | "report";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionLabel?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "appointment",
    title: "Appointment Tomorrow",
    message: "Dr. Sarah Chen at 10:30 AM — Heart Care Clinic",
    time: "5 min ago",
    read: false,
    actionLabel: "View",
  },
  {
    id: "2",
    type: "medication",
    title: "Medication Due",
    message: "Take Vitamin D3 2000 IU with lunch",
    time: "30 min ago",
    read: false,
    actionLabel: "Mark Taken",
  },
  {
    id: "3",
    type: "alert",
    title: "Lab Results Ready",
    message: "Your blood test from Jan 15 is available",
    time: "1 hr ago",
    read: true,
    actionLabel: "View",
  },
  {
    id: "4",
    type: "message",
    title: "Dr. Rivera",
    message: "Your X-ray results look normal. No follow-up needed.",
    time: "2 hrs ago",
    read: true,
  },
  {
    id: "5",
    type: "report",
    title: "Prescription Uploaded",
    message: "January prescription has been added to your records",
    time: "3 hrs ago",
    read: true,
  },
];

const typeStyles = {
  appointment: { icon: Calendar, bg: "bg-blue-500/10", color: "text-blue-600 dark:text-blue-400" },
  medication: { icon: Pill, bg: "bg-emerald-500/10", color: "text-emerald-600 dark:text-emerald-400" },
  alert: { icon: AlertTriangle, bg: "bg-red-500/10", color: "text-red-600 dark:text-red-400" },
  message: { icon: MessageSquare, bg: "bg-violet-500/10", color: "text-violet-600 dark:text-violet-400" },
  report: { icon: FileText, bg: "bg-amber-500/10", color: "text-amber-600 dark:text-amber-400" },
};

export function DashboardNotifications() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
          Mark all read
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {notifications.map((n, i) => {
          const s = typeStyles[n.type];
          const Icon = s.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className={cn(
                "group flex gap-3 rounded-xl border p-3 transition-all hover:bg-muted/50",
                !n.read && "border-primary/20 bg-primary/5"
              )}
            >
              <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", s.bg)}>
                <Icon className={cn("size-4", s.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">{n.title}</h4>
                  {!n.read && <span className="size-1.5 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{n.message}</p>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  {n.actionLabel && (
                    <button className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline">
                      <CheckCircle2 className="size-3" />
                      {n.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
          View all notifications
          <ChevronRight className="size-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
