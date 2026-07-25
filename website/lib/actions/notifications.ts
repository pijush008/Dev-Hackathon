"use server";

import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

export async function getNotifications(limit = 20) {
  try {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase
      .from("notifications")
      .select("id, title, body, type, read, data, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return { success: true, data: data ?? [] } as const;
  } catch (error) {
    console.error("Get notifications error:", error);
    return { success: false, data: [] } as const;
  }
}

export async function markNotificationRead(id: string) {
  try {
    const { supabase } = await requireAuth();
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    return { success: false } as const;
  }
}

export async function markAllNotificationsRead() {
  try {
    const { supabase, user } = await requireAuth();
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    return { success: false } as const;
  }
}
