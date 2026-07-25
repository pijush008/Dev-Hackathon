"use server";

import { createClient } from "@/lib/supabase/server";
import { moodCheckInSchema, type MoodCheckInInput } from "@/lib/validations/mood";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

export async function logMood(input: MoodCheckInInput) {
  try {
    const { supabase, user } = await requireAuth();
    const parsed = moodCheckInSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Invalid mood data" } as const;
    }
    const { error } = await supabase.from("mental_health_logs").insert({
      user_id: user.id,
      mood: parsed.data.mood,
      energy: parsed.data.energy ?? null,
      anxiety: parsed.data.anxiety ?? null,
      sleep_hours: parsed.data.sleepHours ?? null,
      note: parsed.data.note ?? null,
      tags: parsed.data.tags ?? [],
      factors: parsed.data.factors ?? {},
    });
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    console.error("Log mood error:", error);
    return { success: false, error: "Failed to log mood" } as const;
  }
}

export async function getMoodHistory(limit = 30) {
  try {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase
      .from("mental_health_logs")
      .select("id, mood, energy, anxiety, sleep_hours, note, tags, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return { success: true, data: data ?? [] } as const;
  } catch (error) {
    console.error("Get mood history error:", error);
    return { success: false, data: [] } as const;
  }
}

export async function getMoodStats() {
  try {
    const { supabase, user } = await requireAuth();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data, error } = await supabase
      .from("mental_health_logs")
      .select("mood, energy, anxiety, sleep_hours, created_at")
      .eq("user_id", user.id)
      .gte("created_at", weekAgo.toISOString())
      .order("created_at", { ascending: true });
    if (error) throw error;
    return { success: true, data: data ?? [] } as const;
  } catch (error) {
    console.error("Get mood stats error:", error);
    return { success: false, data: [] } as const;
  }
}

export async function deleteMoodEntry(id: string) {
  try {
    const { supabase, user } = await requireAuth();
    const { error } = await supabase
      .from("mental_health_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    console.error("Delete mood error:", error);
    return { success: false, error: "Failed to delete entry" } as const;
  }
}
