"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Meh, TrendingUp, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { logMood, getMoodHistory, getMoodStats, deleteMoodEntry } from "@/lib/actions/mood";
import { cn } from "@/lib/utils";

const moodOptions = [
  { value: "very_low" as const, label: "Awful", emoji: Frown, color: "text-red-500", bg: "bg-red-500/10" },
  { value: "low" as const, label: "Bad", emoji: Frown, color: "text-orange-500", bg: "bg-orange-500/10" },
  { value: "neutral" as const, label: "Okay", emoji: Meh, color: "text-amber-500", bg: "bg-amber-500/10" },
  { value: "good" as const, label: "Good", emoji: Smile, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { value: "very_good" as const, label: "Great", emoji: Smile, color: "text-blue-500", bg: "bg-blue-500/10" },
];

const moodValues: Record<string, number> = { very_low: 1, low: 2, neutral: 3, good: 4, very_good: 5 };

export default function MoodPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [energy, setEnergy] = useState([5]);
  const [anxiety, setAnxiety] = useState([5]);
  const [sleep, setSleep] = useState([7]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    const [h, s] = await Promise.all([getMoodHistory(14), getMoodStats()]);
    if (h.success) setHistory(h.data);
    if (s.success) setStats(s.data);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    await logMood({
      mood: selected as any,
      energy: energy[0],
      anxiety: anxiety[0],
      sleepHours: sleep[0],
      note: note || undefined,
    });
    setSelected(null);
    setNote("");
    setSaving(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    await deleteMoodEntry(id);
    loadData();
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekData = weekDays.map((day, i) => {
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() - dayDate.getDay() + 1 + i);
    const dayStr = dayDate.toISOString().slice(0, 10);
    const entry = stats.find((s) => s.created_at?.slice(0, 10) === dayStr);
    return { day, mood: entry ? moodValues[entry.mood] ?? 3 : null };
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mood & Journal</h1>
        <p className="text-sm text-muted-foreground">Track your emotional wellbeing over time.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">How are you feeling?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {moodOptions.map((mood) => {
              const Icon = mood.emoji;
              const isActive = selected === mood.value;
              return (
                <button
                  key={mood.value}
                  onClick={() => setSelected(mood.value)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                    isActive ? "border-primary bg-primary/10 shadow-sm" : "hover:bg-muted/50"
                  )}
                >
                  <div className={cn("flex size-10 items-center justify-center rounded-lg", mood.bg)}>
                    <Icon className={cn("size-5", mood.color)} />
                  </div>
                  <span className="text-xs font-medium">{mood.label}</span>
                </button>
              );
            })}
          </div>

          {selected && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Energy</span>
                  <span className="font-medium">{energy[0]}/10</span>
                </div>
                <Slider value={energy} onValueChange={setEnergy} min={1} max={10} step={1} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Anxiety</span>
                  <span className="font-medium">{anxiety[0]}/10</span>
                </div>
                <Slider value={anxiety} onValueChange={setAnxiety} min={1} max={10} step={1} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sleep (hours)</span>
                  <span className="font-medium">{sleep[0]}h</span>
                </div>
                <Slider value={sleep} onValueChange={setSleep} min={0} max={24} step={0.5} />
              </div>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about your day (optional)"
                rows={3}
              />
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Entry"}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {stats.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              {weekData.map((d, i) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="h-20 w-full rounded-lg bg-muted/50">
                    {d.mood !== null && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.mood / 5) * 100}%` }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
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
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.slice(0, 10).map((entry) => {
              const moodOpt = moodOptions.find((m) => m.value === entry.mood);
              return (
                <div key={entry.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", moodOpt?.bg ?? "bg-muted")}>
                    {moodOpt && <moodOpt.emoji className={cn("size-4", moodOpt.color)} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{moodOpt?.label ?? entry.mood}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    {entry.note && <p className="mt-0.5 text-xs text-muted-foreground truncate">{entry.note}</p>}
                    <div className="mt-1 flex gap-3 text-[10px] text-muted-foreground">
                      {entry.energy && <span>Energy: {entry.energy}/10</span>}
                      {entry.anxiety && <span>Anxiety: {entry.anxiety}/10</span>}
                      {entry.sleep_hours && <span>Sleep: {entry.sleep_hours}h</span>}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(entry.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
