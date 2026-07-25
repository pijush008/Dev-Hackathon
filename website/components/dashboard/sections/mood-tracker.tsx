"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const weekData = [
  { day: "Mon", mood: 3 },
  { day: "Tue", mood: 4 },
  { day: "Wed", mood: 3 },
  { day: "Thu", mood: 4 },
  { day: "Fri", mood: 5 },
  { day: "Sat", mood: 4 },
  { day: "Sun", mood: null },
];

export function MoodTracker() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Mood Tracker</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
          History
          <ChevronRight className="size-3" />
        </Button>
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
        </div>

        {/* Weekly chart */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">This Week</p>
            <span className="flex items-center gap-1 text-[10px] text-emerald-500">
              <TrendingUp className="size-3" />
              +15% better
            </span>
          </div>
          <div className="flex items-end gap-2">
            {weekData.map((d, i) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="h-16 w-full rounded-lg bg-muted/50">
                  {d.mood !== null && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.mood / 5) * 100}%` }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                      className={cn(
                        "w-full rounded-lg",
                        d.mood <= 2 && "bg-red-400",
                        d.mood === 3 && "bg-amber-400",
                        d.mood === 4 && "bg-emerald-400",
                        d.mood === 5 && "bg-blue-400"
                      )}
                    />
                  )}
                </div>
                <span className={cn("text-[10px]", d.mood === null ? "font-bold text-primary" : "text-muted-foreground")}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
