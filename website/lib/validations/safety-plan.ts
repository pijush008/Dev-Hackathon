import { z } from "zod";

export const safetyPlanSchema = z.object({
  warningSigns: z.array(z.string().min(1)).min(1, "At least one warning sign is required"),
  copingStrategies: z.array(z.string().min(1)).min(1, "At least one coping strategy is required"),
  socialContacts: z.array(z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    relationship: z.string().min(1),
  })).min(1, "At least one social contact is required"),
  professionalContacts: z.array(z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    type: z.string().min(1),
  })).min(1, "At least one professional contact is required"),
  environmentSafety: z.array(z.string()).optional(),
  reasonsToLive: z.array(z.string()).optional(),
});

export type SafetyPlanInput = z.infer<typeof safetyPlanSchema>;