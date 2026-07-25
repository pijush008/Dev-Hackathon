"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "Medication Reminder", body: "Time to take Lisinopril 10mg", type: "medication_reminder", read: false, createdAt: new Date().toISOString() },
  { id: "2", title: "Appointment Confirmed", body: "Cardiology follow-up confirmed for tomorrow at 2 PM", type: "appointment_confirmed", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", title: "Lab Results Ready", body: "Your CBC results are available", type: "report_ready", read: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
];

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-popover text-popover-foreground shadow-lg border ring-1 ring-border"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={() => {}}>
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "border-b p-4 hover:bg-accent/50 transition-colors",
                    !notification.read && "bg-accent/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.body}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            {mockNotifications.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No notifications
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}