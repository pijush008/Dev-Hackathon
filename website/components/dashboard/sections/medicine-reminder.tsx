"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getMedications, logMedicationTaken } from "@/lib/actions/medications";
import Link from "next/link";

const colorCycle = [
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-cyan-400 to-teal-500",
];

function formatFrequency(freq: string) {
  const map: Record<string, string> = {
    once_daily: "Once daily",
    twice_daily: "Twice daily",
    three_times: "3x daily",
    four_times: "4x daily",
    as_needed: "As needed",
  };
  return map[freq] || freq;
}

export function MedicineReminder() {
  const [meds, setMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMeds = useCallback(async () => {
    const res = await getMedications();
    if (res.success) setMeds([...res.data]);
    setLoading(false);
  }, []);

  useEffect(() => { loadMeds(); }, [loadMeds]);

  const toggleTaken = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "taken" ? "skipped" : "taken";
    await logMedicationTaken(id, newStatus as "taken" | "missed" | "skipped");
    setMeds((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: newStatus === "taken" ? "active" : m.status }
          : m
      )
    );
  };

  const takenCount = meds.filter((m) => m.status === "completed").length;
  const totalCount = meds.length;
  const progress = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">Medicine Reminder</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {takenCount}/{totalCount}
          </Badge>
        </div>
        <Link href="/care">
          <Button variant="ghost" size="icon" className="size-7">
            <Plus className="size-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Daily progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
          </div>
        </div>

        {/* Medication list */}
        {loading ? (
          <div className="py-6 text-center text-xs text-muted-foreground">Loading medications...</div>
        ) : meds.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No medications added yet.
            <Link href="/care" className="ml-1 text-primary hover:underline">Add one</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {meds.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border p-3 transition-all hover:bg-muted/50",
                  med.status === "completed" && "opacity-60"
                )}
              >
                <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white", colorCycle[i % colorCycle.length])}>
                  <Pill className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={cn("text-sm font-medium", med.status === "completed" && "line-through")}>
                      {med.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">{med.dosage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{med.time_of_day || "Any time"}</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span>{formatFrequency(med.frequency)}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleTaken(med.id, med.status)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    med.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                  )}
                >
                  {med.status === "completed" ? (
                    <>
                      <CheckCircle2 className="size-3.5" />
                      Taken
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-3.5" />
                      Take
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <Link href="/care">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            View all medications
            <ChevronRight className="size-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
