"use server";

import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

export async function getProviders() {
  try {
    const { supabase } = await requireAuth();
    const { data, error } = await supabase
      .from("providers")
      .select("id, name, credentials, specialties, provider_type, bio, telehealth, in_person, address, avatar_url, rating_avg, rating_count, languages")
      .order("rating_avg", { ascending: false });
    if (error) throw error;
    return { success: true, data: data ?? [] } as const;
  } catch (error) {
    console.error("Get providers error:", error);
    return { success: false, data: [] } as const;
  }
}

export async function getProvider(id: string) {
  try {
    const { supabase } = await requireAuth();
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return { success: true, data } as const;
  } catch (error) {
    console.error("Get provider error:", error);
    return { success: false, data: null } as const;
  }
}
