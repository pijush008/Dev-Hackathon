"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Smile,
  Frown,
  Meh,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMoodStats, logMood } from "@/lib/actions/mood";
import Link from "next/link";

interface MoodOption {
  value: string;
  label: string;
  emoji: React.ElementType;
  color: string;
  bg: string;
}

const moods: MoodOption[] = [
  { value: "very_low", label: "Awful", emoji: Frown, color: "text-red-500", bg: "bg-red-500/10" },
  { value: "low", label: "Bad", emoji: Frown, color: "text-orange-500", bg: "bg-orange-500/10" },
  { value: "neutral", label: "Okay", emoji: Meh, color: "text-amber-500", bg: "bg-amber-500/10" },
  { value: "good", label: "Good", emoji: Smile, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { value: "very_good", label: "Great", emoji: Smile, color: "text-blue-500", bg: "bg-blue-500/10" },
];

const moodScore: Record<string, number> = {
  very_low: 1,
  low: 2,
  neutral: 3,
  good: 4,
  very_good: 5,
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MoodTracker() {
  const [selected, setSelected] = useState<string | null>(null);
  const [weekData, setWeekData] = useState<(number | null)[]>([null, null, null, null, null, null, null]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadStats = useCallback(async () => {
    const res = await getMoodStats();
    if (res.success) {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const daily: (number | null)[] = [null, null, null, null, null, null, null];
      for (const entry of res.data) {
        const d = new Date(entry.created_at);
        if (d >= startOfWeek) {
          const dayIdx = d.getDay();
          daily[dayIdx] = moodScore[entry.mood] || null;
        }
      }
      setWeekData(daily);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    await logMood({ mood: selected as any });
    setSelected(null);
    await loadStats();
    setSubmitting(false);
  };

  const scoredDays = weekData.filter((d) => d !== null) as number[];
  const avg = scoredDays.length > 0 ? scoredDays.reduce((a, b) => a + b, 0) / scoredDays.length : 0;
  const prevAvg = 3; // baseline neutral

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Mood Tracker</CardTitle>
        <Link href="/mood">
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
            History
            <ChevronRight className="size-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* How are you feeling? */}
        <div>
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">How are you feeling today?</p>
          <div className="flex gap-2">
            {moods.map((mood, i) => {
              const Icon = mood.emoji;
              const isActive = selected === mood.value;
              return (
                <motion.button
                  key={mood.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setSelected(mood.value)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all",
                    isActive
                      ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className={cn("flex size-8 items-center justify-center rounded-lg", mood.bg)}>
                    <Icon className={cn("size-4", mood.color)} />
                  </div>
                  <span className="text-[10px] font-medium">{mood.label}</span>
                </motion.button>
              );
            })}
          </div>
          {selected && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full text-xs"
              >
                {submitting ? "Saving..." : "Log Mood"}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Weekly chart */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">This Week</p>
            {scoredDays.length > 0 && (
              <span className={cn(
                "flex items-center gap-1 text-[10px]",
                avg >= prevAvg ? "text-emerald-500" : "text-red-500"
              )}>
                {avg >= prevAvg ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {avg >= prevAvg ? "+" : ""}{Math.round(((avg - prevAvg) / prevAvg) * 100)}% vs baseline
              </span>
            )}
          </div>
          <div className="flex items-end gap-2">
            {dayNames.map((day, i) => {
              const moodVal = weekData[i];
              const today = new Date().getDay();
              return (
                <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="h-16 w-full rounded-lg bg-muted/50">
                    {moodVal !== null && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(moodVal / 5) * 100}%` }}
                        transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                        className={cn(
                          "w-full rounded-lg",
                          moodVal <= 2 && "bg-red-400",
                          moodVal === 3 && "bg-amber-400",
                          moodVal === 4 && "bg-emerald-400",
                          moodVal === 5 && "bg-blue-400"
                        )}
                      />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px]",
                    i === today ? "font-bold text-primary" : "text-muted-foreground"
                  )}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
