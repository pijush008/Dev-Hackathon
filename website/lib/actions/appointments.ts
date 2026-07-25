"use server";

import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

export async function getAppointments() {
  try {
    const { supabase, user } = await requireAuth();
    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (!patient) return { success: true, data: [] } as const;
    const { data, error } = await supabase
      .from("appointments")
      .select("id, scheduled_at, duration_minutes, type, status, reason, notes, location, meeting_url, providers(name, specialties)")
      .eq("patient_id", patient.id)
      .order("scheduled_at", { ascending: true });
    if (error) throw error;
    return { success: true, data: data ?? [] } as const;
  } catch (error) {
    console.error("Get appointments error:", error);
    return { success: false, data: [] } as const;
  }
}

export async function bookAppointment(input: {
  providerId: string;
  scheduledAt: string;
  durationMinutes?: number;
  type?: string;
  reason?: string;
}) {
  try {
    const { supabase, user } = await requireAuth();
    let { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (!patient) {
      const { data: newPatient } = await supabase
        .from("patients")
        .insert({ profile_id: user.id })
        .select("id")
        .single();
      patient = newPatient;
    }
    if (!patient) return { success: false, error: "Failed to create patient record" } as const;
    const { error } = await supabase.from("appointments").insert({
      patient_id: patient.id,
      provider_id: input.providerId,
      scheduled_at: input.scheduledAt,
      duration_minutes: input.durationMinutes ?? 30,
      type: input.type ?? "in-person",
      reason: input.reason ?? null,
    });
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    console.error("Book appointment error:", error);
    return { success: false, error: "Failed to book appointment" } as const;
  }
}

export async function cancelAppointment(id: string) {
  try {
    const { supabase } = await requireAuth();
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return { success: false, error: "Failed to cancel appointment" } as const;
  }
}
