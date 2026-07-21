"use client";

import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Video,
  MoreHorizontal,
  Calendar,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: "in-person" | "video" | "follow-up";
  status: "upcoming" | "completed" | "cancelled" | "in-progress";
  location?: string;
  onCancel?: () => void;
  onReschedule?: () => void;
  onJoin?: () => void;
}

const statusConfig = {
  upcoming: {
    label: "Upcoming",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500 animate-pulse",
  },
};

const typeConfig = {
  "in-person": { icon: MapPin, label: "In-Person" },
  video: { icon: Video, label: "Video Call" },
  "follow-up": { icon: Calendar, label: "Follow-Up" },
};

export function AppointmentCard({
  patientName,
  doctorName,
  specialty,
  date,
  time,
  type,
  status,
  location,
  onCancel,
  onReschedule,
  onJoin,
}: AppointmentCardProps) {
  const s = statusConfig[status];
  const t = typeConfig[type];
  const TypeIcon = t.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/5">
        {/* Left accent */}
        <div className="flex">
          <div
            className={cn(
              "w-1 shrink-0",
              status === "upcoming" && "bg-blue-500",
              status === "completed" && "bg-emerald-500",
              status === "cancelled" && "bg-red-500",
              status === "in-progress" && "bg-amber-500",
            )}
          />
          <CardContent className="flex-1 p-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TypeIcon className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{doctorName}</h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.className}`}
                    >
                      <span className={`size-1 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{specialty}</p>
                </div>
              </div>
              <button className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                <MoreHorizontal className="size-4" />
              </button>
            </div>

            {/* Patient + Time */}
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="size-3" />
                {patientName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3" />
                {date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3" />
                {time}
              </span>
            </div>

            {location && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {location}
              </p>
            )}

            {/* Actions */}
            {(status === "upcoming" || status === "in-progress") && (
              <div className="mt-3 flex gap-2 border-t pt-3">
                {status === "in-progress" && type === "video" && (
                  <button
                    onClick={onJoin}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
                  >
                    <Video className="size-3" />
                    Join Call
                  </button>
                )}
                <button
                  onClick={onReschedule}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Reschedule
                </button>
                <button
                  onClick={onCancel}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
                >
                  Cancel
                </button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
