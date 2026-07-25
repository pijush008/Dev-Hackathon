"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  ChevronRight,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAppointments } from "@/lib/actions/appointments";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
  "in-progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "no-show": "bg-red-500/10 text-red-600 dark:text-red-400",
};

const typeIcons: Record<string, typeof MapPin> = {
  "in-person": MapPin,
  video: Video,
  "follow-up": Calendar,
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    const res = await getAppointments();
    if (res.success) setAppointments([...res.data]);
    setLoading(false);
  }, []);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  const upcoming = appointments.filter((a) => ["scheduled", "confirmed"].includes(a.status));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">Appointments</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {upcoming.length} upcoming
          </Badge>
        </div>
        <Link href="/care/appointments">
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
            Book New
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {loading ? (
          <div className="py-6 text-center text-xs text-muted-foreground">Loading appointments...</div>
        ) : upcoming.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No upcoming appointments.
            <Link href="/care/appointments" className="ml-1 text-primary hover:underline">Book one</Link>
          </div>
        ) : (
          upcoming.slice(0, 3).map((apt, i) => {
            const TypeIcon = typeIcons[apt.type] || MapPin;
            const provider = apt.providers;
            return (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="group rounded-xl border bg-card p-3.5 transition-all hover:shadow-md hover:shadow-primary/5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <User className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold">{provider?.name || "Provider"}</h4>
                          <Badge
                            variant="secondary"
                            className={cn("text-[10px] px-1.5 py-0", statusStyles[apt.status] || statusStyles.scheduled)}
                          >
                            {apt.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {provider?.specialties?.[0] || "Healthcare Provider"}
                        </p>
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <TypeIcon className="size-4" />
                      </div>
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(apt.scheduled_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatTime(apt.scheduled_at)}
                      </span>
                      {apt.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {apt.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}

        <Link href="/care/appointments">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            View all appointments
            <ChevronRight className="size-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
