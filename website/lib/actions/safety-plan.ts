"use server";

import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

export async function getEmergencyContacts() {
  try {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("id, name, phone, relationship, is_primary")
      .eq("user_id", user.id)
      .order("is_primary", { ascending: false });
    if (error) throw error;
    return { success: true, data: data ?? [] } as const;
  } catch (error) {
    console.error("Get emergency contacts error:", error);
    return { success: false, data: [] } as const;
  }
}

export async function addEmergencyContact(contact: {
  name: string;
  phone: string;
  relationship: string;
  isPrimary?: boolean;
}) {
  try {
    const { supabase, user } = await requireAuth();
    const { error } = await supabase.from("emergency_contacts").insert({
      user_id: user.id,
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      is_primary: contact.isPrimary ?? false,
    });
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    console.error("Add emergency contact error:", error);
    return { success: false, error: "Failed to add contact" } as const;
  }
}

export async function deleteEmergencyContact(id: string) {
  try {
    const { supabase } = await requireAuth();
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    return { success: false } as const;
  }
}

export async function getSafetyPlan() {
  try {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase
      .from("safety_plans")
      .select("id, warning_signs, coping_strategies, social_contacts, professional_contacts, environment_safety, reasons_to_live, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return { success: true, data } as const;
  } catch (error) {
    console.error("Get safety plan error:", error);
    return { success: false, data: null } as const;
  }
}

export async function saveSafetyPlan(plan: {
  warningSigns: string[];
  copingStrategies: string[];
  socialContacts: Array<{ name: string; phone: string; relationship: string }>;
  professionalContacts: Array<{ name: string; phone: string; type: string }>;
  environmentSafety?: string[];
  reasonsToLive?: string[];
}) {
  try {
    const { supabase, user } = await requireAuth();
    await supabase
      .from("safety_plans")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);
    const { error } = await supabase.from("safety_plans").insert({
      user_id: user.id,
      warning_signs: plan.warningSigns,
      coping_strategies: plan.copingStrategies,
      social_contacts: plan.socialContacts,
      professional_contacts: plan.professionalContacts,
      environment_safety: plan.environmentSafety ?? [],
      reasons_to_live: plan.reasonsToLive ?? [],
      is_active: true,
    });
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    console.error("Save safety plan error:", error);
    return { success: false, error: "Failed to save safety plan" } as const;
  }
}
