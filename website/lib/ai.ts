import { generateText, type LanguageModel } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";

type Provider = "openai" | "google" | "anthropic";

function getModel(provider?: Provider): LanguageModel {
  const p = provider ?? (process.env.AI_PROVIDER as Provider) ?? "openai";
  const model = process.env.AI_MODEL ?? "gpt-4o";
  switch (p) {
    case "google":
      return google(model);
    case "anthropic":
      return anthropic(model);
    default:
      return openai(model);
  }
}

export async function generateCompletion(prompt: string, options?: { provider?: Provider; system?: string }) {
  return generateText({
    model: getModel(options?.provider),
    prompt,
    system: options?.system,
  });
}

export async function generateJSON<T>(prompt: string, schema: string) {
  const { text } = await generateText({
    model: getModel(),
    prompt,
    system: `You generate valid JSON matching this schema: ${schema}. Return only JSON.`,
  });
  return JSON.parse(text) as T;
}
