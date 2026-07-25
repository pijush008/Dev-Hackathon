"use server";

import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

export async function getMedications() {
  try {
    const { supabase, user } = await requireAuth();
    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (!patient) return { success: true, data: [] } as const;
    const { data, error } = await supabase
      .from("medications")
      .select("id, name, dosage, frequency, time_of_day, with_food, start_date, end_date, status, notes")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { success: true, data: data ?? [] } as const;
  } catch (error) {
    console.error("Get medications error:", error);
    return { success: false, data: [] } as const;
  }
}

export async function addMedication(med: {
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay?: string;
  withFood?: string;
  notes?: string;
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
    const { error } = await supabase.from("medications").insert({
      patient_id: patient.id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time_of_day: med.timeOfDay ?? null,
      with_food: med.withFood ?? "any",
      notes: med.notes ?? null,
    });
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    console.error("Add medication error:", error);
    return { success: false, error: "Failed to add medication" } as const;
  }
}

export async function logMedicationTaken(medicationId: string, status: "taken" | "missed" | "skipped") {
  try {
    const { supabase } = await requireAuth();
    const { error } = await supabase.from("medicine_logs").insert({
      medication_id: medicationId,
      status,
    });
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    console.error("Log medication error:", error);
    return { success: false, error: "Failed to log medication" } as const;
  }
}

export async function deleteMedication(id: string) {
  try {
    const { supabase } = await requireAuth();
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) throw error;
    return { success: true } as const;
  } catch (error) {
    console.error("Delete medication error:", error);
    return { success: false, error: "Failed to delete medication" } as const;
  }
}
