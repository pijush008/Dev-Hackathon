"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  MessageSquare,
  UserPlus,
  CreditCard,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New user signed up",
    description: "john@example.com created a new account",
    icon: UserPlus,
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "Payment received",
    description: "$299.00 payment from Acme Corp",
    icon: CreditCard,
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "New comment",
    description: "Sarah left a comment on your project",
    icon: MessageSquare,
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    title: "System alert",
    description: "CPU usage exceeded 90% threshold",
    icon: AlertTriangle,
    time: "1 day ago",
    read: true,
  },
];

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <h4 className="text-sm font-semibold">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <CheckCheck className="size-3" />
                    Mark all read
                  </button>
                )}
              </div>
              <Separator />
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification, i) => {
                  const Icon = notification.icon;
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <button
                        onClick={() => toggleRead(notification.id)}
                        className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50"
                      >
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                            notification.read
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="size-1.5 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {notification.description}
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
              <Separator />
              <div className="px-4 py-2">
                <button className="w-full text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
