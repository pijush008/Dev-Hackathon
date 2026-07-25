import { z } from "zod";

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(4000),
  sessionId: z.string().uuid().optional(),
  parentMessageId: z.string().uuid().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createSessionSchema = z.object({
  title: z.string().max(200).optional(),
  sessionType: z.enum(["ai_assistant", "provider_chat", "support_group"]).default("ai_assistant"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;