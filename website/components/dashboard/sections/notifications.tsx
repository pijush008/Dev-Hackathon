"use client";

import { useState, useEffect, useCallback } from "react";
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
import { getNotifications, markAllNotificationsRead } from "@/lib/actions/notifications";
import Link from "next/link";

const typeStyles: Record<string, { icon: typeof Bell; bg: string; color: string }> = {
  appointment: { icon: Calendar, bg: "bg-blue-500/10", color: "text-blue-600 dark:text-blue-400" },
  medication: { icon: Pill, bg: "bg-emerald-500/10", color: "text-emerald-600 dark:text-emerald-400" },
  alert: { icon: AlertTriangle, bg: "bg-red-500/10", color: "text-red-600 dark:text-red-400" },
  message: { icon: MessageSquare, bg: "bg-violet-500/10", color: "text-violet-600 dark:text-violet-400" },
  report: { icon: FileText, bg: "bg-amber-500/10", color: "text-amber-600 dark:text-amber-400" },
  crisis: { icon: AlertTriangle, bg: "bg-red-500/10", color: "text-red-600 dark:text-red-400" },
  system: { icon: Bell, bg: "bg-gray-500/10", color: "text-gray-600 dark:text-gray-400" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function DashboardNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    const res = await getNotifications(10);
    if (res.success) setNotifications([...res.data]);
    setLoading(false);
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

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
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="py-6 text-center text-xs text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">No notifications yet.</div>
        ) : (
          notifications.slice(0, 5).map((n, i) => {
            const s = typeStyles[n.type] || typeStyles.system;
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
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{n.body}</p>
                  <span className="mt-1.5 block text-[10px] text-muted-foreground">{timeAgo(n.created_at)}</span>
                </div>
              </motion.div>
            );
          })
        )}

        <Link href="/notifications">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            View all notifications
            <ChevronRight className="size-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
