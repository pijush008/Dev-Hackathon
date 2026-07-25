"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, Calendar, Pill, AlertTriangle, MessageSquare, FileText, CheckCircle2, CheckCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";

const typeStyles: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  appointment: { icon: Calendar, bg: "bg-blue-500/10", color: "text-blue-600 dark:text-blue-400" },
  medication: { icon: Pill, bg: "bg-emerald-500/10", color: "text-emerald-600 dark:text-emerald-400" },
  alert: { icon: AlertTriangle, bg: "bg-red-500/10", color: "text-red-600 dark:text-red-400" },
  message: { icon: MessageSquare, bg: "bg-violet-500/10", color: "text-violet-600 dark:text-violet-400" },
  report: { icon: FileText, bg: "bg-amber-500/10", color: "text-amber-600 dark:text-amber-400" },
  crisis: { icon: AlertTriangle, bg: "bg-red-500/10", color: "text-red-600 dark:text-red-400" },
  system: { icon: Bell, bg: "bg-muted", color: "text-muted-foreground" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await getNotifications(50);
    if (res.success) setNotifications(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-1 size-4" />
            Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="h-20 animate-pulse bg-muted/50" /></Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Bell className="size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium">No notifications</p>
            <p className="mt-1 text-xs text-muted-foreground">You&apos;re all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => {
            const s = typeStyles[n.type] ?? typeStyles.system;
            const Icon = s.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className={cn(!n.read && "border-primary/20 bg-primary/5")}>
                  <CardContent className="flex gap-3 p-4">
                    <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", s.bg)}>
                      <Icon className={cn("size-4", s.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{n.title}</h4>
                        {!n.read && <span className="size-1.5 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(n.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {!n.read && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
                          >
                            <CheckCircle2 className="size-3" />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
