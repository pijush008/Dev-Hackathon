"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  Pill,
  TestTube,
  HeartPulse,
  FileText,
  Syringe,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const events: TimelineEvent[] = [
  {
    id: "1",
    type: "visit",
    title: "Annual Health Checkup",
    description: "Routine physical examination. All vitals normal.",
    date: "Jan 15",
    time: "10:30 AM",
    doctor: "Dr. Sarah Chen",
  },
  {
    id: "2",
    type: "lab",
    title: "Blood Test Results",
    description: "Complete blood count and metabolic panel.",
    date: "Jan 15",
    time: "09:00 AM",
    value: "All normal",
  },
  {
    id: "3",
    type: "medication",
    title: "New Medication",
    description: "Vitamin D supplement started. 2000 IU daily.",
    date: "Jan 15",
    time: "11:00 AM",
    doctor: "Dr. Sarah Chen",
  },
  {
    id: "4",
    type: "vitals",
    title: "Vitals Recorded",
    description: "Blood pressure and heart rate checked.",
    date: "Jan 10",
    time: "02:15 PM",
    value: "120/80 mmHg",
  },
  {
    id: "5",
    type: "procedure",
    title: "Flu Vaccination",
    description: "Annual flu vaccine administered.",
    date: "Dec 20",
    time: "03:00 PM",
    doctor: "Dr. Marcus Rivera",
  },
];

const eventStyles: Record<TimelineEvent["type"], { icon: LucideIcon; color: string; bg: string }> = {
  visit: { icon: Stethoscope, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
  medication: { icon: Pill, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  lab: { icon: TestTube, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
  vitals: { icon: HeartPulse, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
  report: { icon: FileText, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  procedure: { icon: Syringe, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10" },
};

export function DashboardTimeline() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Health Timeline</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
          Full History
          <ChevronRight className="size-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative ml-2">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-1">
            {events.map((event, i) => {
              const style = eventStyles[event.type];
              const Icon = style.icon;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="relative flex gap-3"
                >
                  {/* Dot */}
                  <div className={cn(
                    "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-card",
                    style.bg
                  )}>
                    <Icon className={cn("size-3.5", style.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{event.description}</p>
                      </div>
                      {event.value && (
                        <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {event.value}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>{event.date} · {event.time}</span>
                      {event.doctor && <span>{event.doctor}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
