"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  Pill,
  TestTube,
  HeartPulse,
  FileText,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: "visit" | "medication" | "lab" | "vitals" | "report" | "procedure";
  title: string;
  description: string;
  date: string;
  time: string;
  doctor?: string;
  value?: string;
}

interface HealthTimelineProps {
  events: TimelineEvent[];
}

const eventConfig: Record<
  TimelineEvent["type"],
  { icon: LucideIcon; color: string; bg: string }
> = {
  visit: {
    icon: Stethoscope,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  medication: {
    icon: Pill,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  lab: {
    icon: TestTube,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  vitals: {
    icon: HeartPulse,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
  },
  report: {
    icon: FileText,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  procedure: {
    icon: Syringe,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
  },
};

const mockEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "visit",
    title: "Annual Health Checkup",
    description: "Routine physical examination. All vitals normal.",
    date: "Jan 15, 2026",
    time: "10:30 AM",
    doctor: "Dr. Sarah Chen",
  },
  {
    id: "2",
    type: "lab",
    title: "Blood Test Results",
    description: "Complete blood count and metabolic panel.",
    date: "Jan 15, 2026",
    time: "09:00 AM",
    value: "All normal",
  },
  {
    id: "3",
    type: "medication",
    title: "Prescribed Medication",
    description: "Vitamin D supplement started. 2000 IU daily.",
    date: "Jan 15, 2026",
    time: "11:00 AM",
    doctor: "Dr. Sarah Chen",
  },
  {
    id: "4",
    type: "vitals",
    title: "Vitals Recorded",
    description: "Blood pressure and heart rate checked.",
    date: "Jan 10, 2026",
    time: "02:15 PM",
    value: "120/80 mmHg",
  },
  {
    id: "5",
    type: "procedure",
    title: "Vaccination",
    description: "Annual flu vaccine administered.",
    date: "Dec 20, 2025",
    time: "03:00 PM",
    doctor: "Dr. Marcus Rivera",
  },
  {
    id: "6",
    type: "report",
    title: "X-Ray Report",
    description: "Chest X-ray. No abnormalities detected.",
    date: "Dec 15, 2025",
    time: "11:30 AM",
    value: "Normal",
  },
];

export function HealthTimeline({ events = mockEvents }: HealthTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-1">
        {events.map((event, index) => {
          const config = eventConfig[event.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="relative flex gap-4 pl-1"
            >
              {/* Dot */}
              <div
                className={cn(
                  "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-card",
                  config.bg,
                )}
              >
                <Icon className={cn("size-4", config.color)} />
              </div>

              {/* Content */}
              <div className="flex-1 rounded-xl border bg-card p-3.5 transition-colors hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">{event.title}</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                  {event.value && (
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {event.value}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>
                    {event.date} · {event.time}
                  </span>
                  {event.doctor && <span>{event.doctor}</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
