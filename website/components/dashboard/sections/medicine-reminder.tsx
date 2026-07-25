"use client";

import { useState } from "react";
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

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  taken: boolean;
  withFood: "before" | "after" | "any";
  color: string;
}

const medications: Medication[] = [
  { id: "1", name: "Metformin", dosage: "500mg", time: "8:00 AM", frequency: "Twice daily", taken: true, withFood: "after", color: "from-blue-400 to-blue-600" },
  { id: "2", name: "Lisinopril", dosage: "10mg", time: "8:00 AM", frequency: "Once daily", taken: true, withFood: "any", color: "from-emerald-400 to-emerald-600" },
  { id: "3", name: "Vitamin D3", dosage: "2000 IU", time: "12:00 PM", frequency: "Once daily", taken: false, withFood: "after", color: "from-amber-400 to-orange-500" },
  { id: "4", name: "Atorvastatin", dosage: "20mg", time: "9:00 PM", frequency: "Once daily", taken: false, withFood: "any", color: "from-violet-400 to-purple-500" },
];

export function MedicineReminder() {
  const [meds, setMeds] = useState(medications);

  const toggleTaken = (id: string) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  const takenCount = meds.filter((m) => m.taken).length;
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
        <Button variant="ghost" size="icon" className="size-7">
          <Plus className="size-4" />
        </Button>
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
        <div className="space-y-2">
          {meds.map((med, i) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={cn(
                "group flex items-center gap-3 rounded-xl border p-3 transition-all hover:bg-muted/50",
                med.taken && "opacity-60"
              )}
            >
              {/* Pill icon */}
              <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white", med.color)}>
                <Pill className="size-4" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={cn("text-sm font-medium", med.taken && "line-through")}>
                    {med.name}
                  </h4>
                  <span className="text-[10px] text-muted-foreground">{med.dosage}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>{med.time}</span>
                  <span className="text-muted-foreground/50">·</span>
                  <span>{med.frequency}</span>
                </div>
              </div>

              {/* Take button */}
              <button
                onClick={() => toggleTaken(med.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  med.taken
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                )}
              >
                {med.taken ? (
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

        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
          View all medications
          <ChevronRight className="size-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
