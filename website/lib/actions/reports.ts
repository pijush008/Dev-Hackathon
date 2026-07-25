"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { explainMedicalReport } from "@/lib/ai/functions";
import { validateFile, type ReportUploadInput } from "@/lib/validations/report";
import { revalidatePath } from "next/cache";

const BUCKET = "medical-reports";

// ─── Extract text from PDF ──────────────────────────────────────────────────

async function extractPdfText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text || "";
}

// ─── Extract text from Image via OCR ────────────────────────────────────────

async function extractImageText(buffer: Buffer, mimeType: string): Promise<string> {
  const Tesseract = (await import("tesseract.js"));
  const ext = mimeType.split("/")[1] || "png";
  const filename = `report.${ext}`;

  const { data } = await Tesseract.recognize(buffer, filename, {
    logger: () => {},
  });

  return data.text || "";
}

// ─── Get file type category ─────────────────────────────────────────────────

function getFileCategory(mimeType: string): "pdf" | "image" | "other" {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  return "other";
}

// ─── Upload Report ──────────────────────────────────────────────────────────

export async function uploadReport(
  file: File,
  metadata: ReportUploadInput,
) {
  try {
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error } as const;
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" } as const;

    // Get patient record
    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!patient) {
      return { success: false, error: "No patient profile found. Complete onboarding first." } as const;
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop() || "bin";
    const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const admin = createAdminClient();
    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { success: false, error: `Upload failed: ${uploadError.message}` } as const;
    }

    // Get public URL
    const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(filePath);
    const fileUrl = urlData.publicUrl;

    // Extract text from file
    let extractedText = "";
    const category = getFileCategory(file.type);

    try {
      if (category === "pdf") {
        extractedText = await extractPdfText(fileBuffer);
      } else if (category === "image") {
        extractedText = await extractImageText(fileBuffer, file.type);
      }
    } catch (extractError) {
      console.error("Text extraction error:", extractError);
      // Continue without extracted text — AI can still work with metadata
    }

    // Run AI analysis on extracted text
    let aiSummary = null;
    if (extractedText.trim().length > 20) {
      try {
        const analysis = await explainMedicalReport(extractedText, metadata.reportType);
        aiSummary = analysis;
      } catch (aiError) {
        console.error("AI analysis error:", aiError);
        // Continue without AI analysis
      }
    }

    // Store metadata in database
    const { data: report, error: dbError } = await supabase
      .from("medical_reports")
      .insert({
        patient_id: patient.id,
        title: metadata.title,
        description: metadata.description || null,
        file_url: fileUrl,
        file_type: category === "pdf" ? "pdf" : category === "image" ? "image" : "other",
        file_size: file.size,
        report_date: metadata.reportDate || null,
        uploaded_by: user.id,
        ai_summary: aiSummary,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      return { success: false, error: `Failed to save report: ${dbError.message}` } as const;
    }

    revalidatePath("/");
    revalidatePath("/care/reports");

    return {
      success: true,
      data: {
        report,
        extractedText: extractedText.slice(0, 5000),
        aiSummary,
      },
    } as const;
  } catch (error) {
    console.error("Upload report error:", error);
    return { success: false, error: "An unexpected error occurred." } as const;
  }
}

// ─── Fetch Reports ──────────────────────────────────────────────────────────

export async function getReports(limit = 50, offset = 0) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" } as const;

    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!patient) return { success: true, data: [] } as const;

    const { data, error } = await supabase
      .from("medical_reports")
      .select("*")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return { success: false, error: error.message } as const;
    return { success: true, data: data || [] } as const;
  } catch (error) {
    console.error("Get reports error:", error);
    return { success: false, error: "Failed to fetch reports." } as const;
  }
}

// ─── Fetch Single Report ────────────────────────────────────────────────────

export async function getReport(reportId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" } as const;

    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!patient) return { success: false, error: "No patient profile found." } as const;

    const { data, error } = await supabase
      .from("medical_reports")
      .select("*")
      .eq("id", reportId)
      .eq("patient_id", patient.id)
      .single();

    if (error) return { success: false, error: error.message } as const;
    return { success: true, data } as const;
  } catch (error) {
    console.error("Get report error:", error);
    return { success: false, error: "Failed to fetch report." } as const;
  }
}

// ─── Re-analyze Report ──────────────────────────────────────────────────────

export async function reanalyzeReport(reportId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" } as const;

    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!patient) return { success: false, error: "No patient profile found." } as const;

    const { data: report, error: fetchError } = await supabase
      .from("medical_reports")
      .select("*")
      .eq("id", reportId)
      .eq("patient_id", patient.id)
      .single();

    if (fetchError || !report) {
      return { success: false, error: "Report not found." } as const;
    }

    // Re-run AI analysis using the report title/type as context
    const analysis = await explainMedicalReport(
      `Medical report: ${report.title}\nType: ${report.file_type}\nDate: ${report.report_date || "unknown"}\nDescription: ${report.description || "none"}`,
      report.file_type,
    );

    // Update the ai_summary
    const { error: updateError } = await supabase
      .from("medical_reports")
      .update({ ai_summary: analysis })
      .eq("id", reportId);

    if (updateError) {
      return { success: false, error: updateError.message } as const;
    }

    revalidatePath("/care/reports");
    return { success: true, data: analysis } as const;
  } catch (error) {
    console.error("Reanalyze error:", error);
    return { success: false, error: "Failed to re-analyze." } as const;
  }
}

// ─── Delete Report ──────────────────────────────────────────────────────────

export async function deleteReport(reportId: string, fileUrl: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" } as const;

    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!patient) return { success: false, error: "No patient profile found." } as const;

    const { error: dbError } = await supabase
      .from("medical_reports")
      .delete()
      .eq("id", reportId)
      .eq("patient_id", patient.id);

    if (dbError) return { success: false, error: dbError.message } as const;

    const admin = createAdminClient();
    const urlParts = fileUrl.split(`${BUCKET}/`);
    if (urlParts.length > 1) {
      const storagePath = urlParts[1].split("?")[0];
      await admin.storage.from(BUCKET).remove([storagePath]);
    }

    revalidatePath("/");
    revalidatePath("/care/reports");
    return { success: true } as const;
  } catch (error) {
    console.error("Delete report error:", error);
    return { success: false, error: "Failed to delete report." } as const;
  }
}

// ─── Generate Health Summary ────────────────────────────────────────────────

export async function getHealthSummary() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" } as const;

    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!patient) return { success: true, data: null } as const;

    const { data: reports } = await supabase
      .from("medical_reports")
      .select("id, title, file_type, report_date, ai_summary, created_at")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!reports || reports.length === 0) {
      return { success: true, data: { reports: [], summary: null } } as const;
    }

    // Aggregate findings from AI summaries
    const allFindings: Array<{ term: string; explanation: string; status: string }> = [];
    const allRecommendations: string[] = [];
    let hasAbnormal = false;

    for (const report of reports) {
      if (report.ai_summary && typeof report.ai_summary === "object") {
        const summary = report.ai_summary as any;
        if (summary.keyFindings) allFindings.push(...summary.keyFindings);
        if (summary.recommendations) allRecommendations.push(...summary.recommendations);
        if (summary.keyFindings?.some((f: any) => f.status === "abnormal")) hasAbnormal = true;
      }
    }

    return {
      success: true,
      data: {
        reports,
        stats: {
          total: reports.length,
          withAI: reports.filter((r) => r.ai_summary).length,
          abnormalFindings: allFindings.filter((f) => f.status === "abnormal").length,
          recommendations: [...new Set(allRecommendations)].slice(0, 10),
        },
        hasAbnormal,
      },
    } as const;
  } catch (error) {
    console.error("Health summary error:", error);
    return { success: false, error: "Failed to generate summary." } as const;
  }
}
