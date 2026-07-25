"use server";

import { createClient } from "@/lib/supabase/server";
import {
  analyzeSymptoms,
  explainMedicalReport,
  generateHealthAdvice,
  chat,
  type SymptomInput,
} from "@/lib/ai/functions";
import { detectCrisis } from "@/lib/ai/crisis-detection";
import { SYSTEM_PROMPTS } from "@/lib/ai/system-prompts";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

// ─── Symptom Check ──────────────────────────────────────────────────────────

export async function checkSymptoms(
  symptoms: SymptomInput[],
  patientInfo?: { age?: number; gender?: string; medicalHistory?: string },
) {
  try {
    await requireAuth();
    const result = await analyzeSymptoms(symptoms, patientInfo);
    return { success: true, data: result } as const;
  } catch (error) {
    console.error("Symptom check error:", error);
    return {
      success: false,
      error: error instanceof Error && error.message === "Not authenticated"
        ? "Not authenticated"
        : "Failed to analyze symptoms. Please try again.",
    } as const;
  }
}

// ─── Explain Report ─────────────────────────────────────────────────────────

export async function explainReport(reportText: string, reportType?: string) {
  try {
    await requireAuth();
    const result = await explainMedicalReport(reportText, reportType);
    return { success: true, data: result } as const;
  } catch (error) {
    console.error("Report explanation error:", error);
    return {
      success: false,
      error: error instanceof Error && error.message === "Not authenticated"
        ? "Not authenticated"
        : "Failed to explain report. Please try again.",
    } as const;
  }
}

// ─── Medication Guidance ────────────────────────────────────────────────────

export async function getMedicationGuidance(
  question: string,
  context?: { medications?: string[]; conditions?: string[] },
) {
  try {
    await requireAuth();
    const result = await generateHealthAdvice({
      topic: question,
      patientContext: context
        ? { conditions: context.conditions, medications: context.medications }
        : undefined,
      detailLevel: "comprehensive",
    });
    return { success: true, data: result } as const;
  } catch (error) {
    console.error("Medication guidance error:", error);
    return {
      success: false,
      error: error instanceof Error && error.message === "Not authenticated"
        ? "Not authenticated"
        : "Failed to generate guidance. Please try again.",
    } as const;
  }
}

// ─── Wellness Suggestions ───────────────────────────────────────────────────

export async function getWellnessSuggestions(
  topic: string,
  context?: { age?: number; conditions?: string[] },
) {
  try {
    await requireAuth();
    const result = await generateHealthAdvice({
      topic,
      patientContext: context,
      detailLevel: "comprehensive",
    });
    return { success: true, data: result } as const;
  } catch (error) {
    console.error("Wellness suggestions error:", error);
    return {
      success: false,
      error: error instanceof Error && error.message === "Not authenticated"
        ? "Not authenticated"
        : "Failed to generate suggestions. Please try again.",
    } as const;
  }
}

// ─── Health Chat ────────────────────────────────────────────────────────────

export async function sendChatMessage(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = [],
) {
  try {
    await requireAuth();

    const messages = [
      ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: message },
    ];

    const result = await chat({
      messages,
      systemPrompt: SYSTEM_PROMPTS.therapeutic,
      temperature: 0.7,
      maxTokens: 1024,
    });

    return {
      success: true,
      data: { content: result.content, crisis: null },
    } as const;
  } catch (error) {
    console.error("Chat error:", error);
    return {
      success: false,
      error: error instanceof Error && error.message === "Not authenticated"
        ? "Not authenticated"
        : "Failed to send message. Please try again.",
    } as const;
  }
}

export async function detectCrisisInMessage(message: string) {
  try {
    await requireAuth();
    return await detectCrisis(message);
  } catch {
    return {
      crisisDetected: false,
      riskLevel: "none" as const,
      indicators: [],
      recommendedAction: "resource_only" as const,
    };
  }
}
