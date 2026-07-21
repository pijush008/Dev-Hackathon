"use client";

import { motion } from "framer-motion";
import {
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MedicineCardProps {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  duration: string;
  withFood: "before" | "after" | "any";
  sideEffects?: string[];
  status: "active" | "completed" | "missed" | "paused";
  notes?: string;
  onMarkTaken?: () => void;
  onSnooze?: () => void;
}

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: CheckCircle2,
  },
  missed: {
    label: "Missed",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: AlertTriangle,
  },
  paused: {
    label: "Paused",
    className: "bg-muted text-muted-foreground",
    icon: RotateCcw,
  },
};

const pillColors: Record<string, string> = {
  tablet: "from-blue-400 to-blue-600",
  capsule: "from-amber-400 to-orange-500",
  syrup: "from-pink-400 to-rose-500",
  injection: "from-violet-400 to-purple-500",
  drops: "from-cyan-400 to-teal-500",
};

export function MedicineCard({
  name,
  dosage,
  frequency,
  time,
  duration,
  withFood,
  sideEffects = [],
  status,
  notes,
  onMarkTaken,
  onSnooze,
}: MedicineCardProps) {
  const s = statusConfig[status];
  const StatusIcon = s.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3.5">
            {/* Pill icon */}
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                pillColors.tablet,
              )}
            >
              <Pill className="size-5" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{name}</h3>
                  <p className="text-xs text-muted-foreground">{dosage}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.className}`}
                >
                  <StatusIcon className="size-3" />
                  {s.label}
                </span>
              </div>

              {/* Schedule */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {frequency} · {time}
                </span>
                <span>Duration: {duration}</span>
                <span className="capitalize">With food: {withFood}</span>
              </div>

              {/* Side effects */}
              {sideEffects.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {sideEffects.map((se) => (
                    <span
                      key={se}
                      className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
                    >
                      {se}
                    </span>
                  ))}
                </div>
              )}

              {notes && (
                <p className="mt-2 text-xs text-muted-foreground italic">
                  {notes}
                </p>
              )}

              {/* Actions */}
              {status === "active" && (
                <div className="mt-3 flex gap-2 border-t pt-3">
                  <button
                    onClick={onMarkTaken}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="size-3" />
                    Mark Taken
                  </button>
                  <button
                    onClick={onSnooze}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <RotateCcw className="size-3" />
                    Snooze
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
