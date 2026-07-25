import { z } from "zod";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/tiff",
  "image/bmp",
];

export const reportUploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  reportType: z.enum([
    "blood_test",
    "lipid_panel",
    "thyroid",
    "xray",
    "mri",
    "ct_scan",
    "ultrasound",
    "pathology",
    "prescription",
    "vaccination",
    "other",
  ]),
  reportDate: z.string().optional(),
});

export type ReportUploadInput = z.infer<typeof reportUploadSchema>;

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type "${file.type}". Accepted: PDF, JPEG, PNG, WebP, TIFF, BMP.`,
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 20MB.`,
    };
  }
  return { valid: true };
}

export const REPORT_TYPE_LABELS: Record<string, string> = {
  blood_test: "Blood Test",
  lipid_panel: "Lipid Panel",
  thyroid: "Thyroid",
  xray: "X-Ray",
  mri: "MRI",
  ct_scan: "CT Scan",
  ultrasound: "Ultrasound",
  pathology: "Pathology",
  prescription: "Prescription",
  vaccination: "Vaccination",
  other: "Other",
};
