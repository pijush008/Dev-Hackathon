import { z } from "zod";

export const moodCheckInSchema = z.object({
  mood: z.enum(["very_low", "low", "neutral", "good", "very_good"]),
  energy: z.number().min(1).max(10).optional(),
  anxiety: z.number().min(1).max(10).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  note: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
  factors: z.record(z.string(), z.unknown()).optional(),
});

export const moodLogSchema = moodCheckInSchema.extend({
  patientId: z.string().uuid(),
  scheduledAt: z.string().datetime().optional(),
});

export type MoodCheckInInput = z.infer<typeof moodCheckInSchema>;
export type MoodLogInput = z.infer<typeof moodLogSchema>;