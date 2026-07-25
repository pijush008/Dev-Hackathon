import { chat } from "./functions";
import { CRISIS_KEYWORDS, SYSTEM_PROMPTS } from "./system-prompts";
import { z } from "zod";

const crisisResultSchema = z.object({
  crisisDetected: z.boolean(),
  riskLevel: z.enum(["none", "low", "moderate", "high", "imminent"]),
  indicators: z.array(z.string()),
  recommendedAction: z.enum(["resource_only", "safety_plan", "emergency_services", "crisis_line"]),
});

export interface CrisisDetectionResult {
  crisisDetected: boolean;
  riskLevel: "none" | "low" | "moderate" | "high" | "imminent";
  indicators: string[];
  recommendedAction: "resource_only" | "safety_plan" | "emergency_services" | "crisis_line";
}

function keywordCheck(text: string): { detected: boolean; keywords: string[] } {
  const lowerText = text.toLowerCase();
  const found = CRISIS_KEYWORDS.filter((kw) => lowerText.includes(kw.toLowerCase()));
  return { detected: found.length > 0, keywords: found };
}

export async function detectCrisis(
  message: string,
): Promise<CrisisDetectionResult> {
  const { detected: keywordDetected, keywords } = keywordCheck(message);
  
  if (keywordDetected) {
    return {
      crisisDetected: true,
      riskLevel: "high",
      indicators: keywords,
      recommendedAction: "crisis_line",
    };
  }

  try {
    const result = await chat({
      messages: [{ role: "user", content: `Analyze this message for crisis indicators: "${message}" Return a JSON object with crisisDetected, riskLevel, indicators array, and recommendedAction fields.` }],
      systemPrompt: SYSTEM_PROMPTS.crisisDetection,
      temperature: 0.1,
      maxTokens: 500,
    });

    const cleaned = result.content.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = crisisResultSchema.safeParse(JSON.parse(cleaned));
    if (parsed.success) {
      return parsed.data;
    }
    return {
      crisisDetected: false,
      riskLevel: "moderate",
      indicators: [],
      recommendedAction: "crisis_line",
    };
  } catch (error) {
    console.error("Crisis detection AI error:", error);
    return {
      crisisDetected: false,
      riskLevel: "moderate",
      indicators: [],
      recommendedAction: "crisis_line",
    };
  }
}

export function getCrisisResources(country = "US"): Array<{
  name: string;
  phone: string;
  text?: string;
  url: string;
  description: string;
}> {
  const resources: Record<string, Array<{
    name: string;
    phone: string;
    text?: string;
    url: string;
    description: string;
  }>> = {
    US: [
      { name: "988 Suicide & Crisis Lifeline", phone: "988", text: "988", url: "https://988lifeline.org", description: "24/7 free confidential support" },
      { name: "Crisis Text Line", text: "HOME", phone: "741741", url: "https://crisistextline.org", description: "Text-based crisis support" },
      { name: "Veterans Crisis Line", phone: "988", text: "838255", url: "https://veteranscrisisline.net", description: "For veterans and families" },
      { name: "Emergency Services", phone: "911", url: "https://www.911.gov", description: "Immediate danger" },
    ],
    CA: [
      { name: "Canada Suicide Prevention Service", phone: "988", url: "https://988.ca", description: "24/7 bilingual support" },
      { name: "Crisis Text Line", text: "HOME", phone: "686868", url: "https://crisistextline.ca", description: "Text support" },
      { name: "Emergency", phone: "911", url: "", description: "Immediate danger" },
    ],
    UK: [
      { name: "Samaritans", phone: "116 123", url: "https://samaritans.org", description: "24/7 emotional support" },
      { name: "SHOUT Crisis Text Line", text: "SHOUT", phone: "85258", url: "https://giveusashout.org", description: "Text support" },
      { name: "Emergency", phone: "999", url: "", description: "Immediate danger" },
    ],
  };

  return resources[country] || resources.US;
}