import type { AIProvider, AIMessage, AICompletionResponse } from "./provider";
import { getAIProvider } from "./openai-provider";

function resolveProvider(provider?: AIProvider): AIProvider {
  return provider ?? getAIProvider();
}

// ─── chat ────────────────────────────────────────────────────────────────────

export interface ChatOptions {
  messages: AIMessage[];
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  provider?: AIProvider;
}

export async function chat(options: ChatOptions): Promise<AICompletionResponse> {
  const { messages, systemPrompt, model, temperature, maxTokens, provider } = options;
  const ai = resolveProvider(provider);

  const fullMessages: AIMessage[] = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages;

  return ai.complete({
    messages: fullMessages,
    model,
    temperature,
    maxTokens,
  });
}

// ─── summarize ───────────────────────────────────────────────────────────────

export interface SummarizeOptions {
  text: string;
  maxLength?: number;
  style?: "brief" | "detailed" | "bullet-points";
  language?: string;
  model?: string;
  provider?: AIProvider;
}

export async function summarize(options: SummarizeOptions): Promise<string> {
  const { text, maxLength = 200, style = "brief", language = "English", model, provider } = options;
  const ai = resolveProvider(provider);

  const styleInstructions = {
    brief: `Summarize the following text in ${maxLength} words or fewer.`,
    detailed: `Provide a detailed summary of the following text in approximately ${maxLength} words.`,
    "bullet-points": `Summarize the following text as concise bullet points (max ${maxLength} words total). Use "- " prefix for each point.`,
  };

  const response = await ai.complete({
    messages: [
      {
        role: "system",
        content: `You are a precise summarization assistant. Respond in ${language}. ${styleInstructions[style]}`,
      },
      { role: "user", content: text },
    ],
    model,
    temperature: 0.3,
  });

  return response.content;
}

// ─── analyzeSymptoms ─────────────────────────────────────────────────────────

export interface SymptomInput {
  name: string;
  severity: "mild" | "moderate" | "severe" | "very-severe";
  duration: string;
  location?: string;
  description?: string;
  triggers?: string;
  associatedSymptoms?: string[];
}

export interface SymptomAnalysis {
  possibleConditions: Array<{
    name: string;
    likelihood: "low" | "medium" | "high";
    description: string;
  }>;
  urgency: "low" | "medium" | "high" | "emergency";
  recommendations: string[];
  whenToSeekHelp: string;
  disclaimer: string;
}

export async function analyzeSymptoms(
  symptoms: SymptomInput[],
  patientInfo?: { age?: number; gender?: string; medicalHistory?: string },
  provider?: AIProvider,
): Promise<SymptomAnalysis> {
  const ai = resolveProvider(provider);

  const symptomsText = symptoms
    .map(
      (s) =>
        `- ${s.name} (severity: ${s.severity}, duration: ${s.duration}${s.location ? `, location: ${s.location}` : ""}${s.description ? `, description: ${s.description}` : ""}${s.triggers ? `, triggers: ${s.triggers}` : ""}${s.associatedSymptoms?.length ? `, associated: ${s.associatedSymptoms.join(", ")}` : ""})`,
    )
    .join("\n");

  const patientText = patientInfo
    ? `Patient info: ${patientInfo.age ? `${patientInfo.age} years old` : ""}${patientInfo.gender ? `, ${patientInfo.gender}` : ""}${patientInfo.medicalHistory ? `, history: ${patientInfo.medicalHistory}` : ""}`
    : "No patient info provided.";

  const response = await ai.complete({
    messages: [
      {
        role: "system",
        content: `You are a medical symptom analysis assistant. Analyze the provided symptoms and return a JSON response with this exact structure:
{
  "possibleConditions": [
    { "name": "Condition Name", "likelihood": "low|medium|high", "description": "Brief description" }
  ],
  "urgency": "low|medium|high|emergency",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "whenToSeekHelp": "When to seek professional help",
  "disclaimer": "Medical disclaimer"
}
Return ONLY valid JSON, no markdown, no code blocks. Include 2-4 possible conditions. Always include a medical disclaimer stating this is not a diagnosis.`,
      },
      {
        role: "user",
        content: `Symptoms:\n${symptomsText}\n\n${patientText}`,
      },
    ],
    temperature: 0.3,
    maxTokens: 1500,
  });

  try {
    const cleaned = response.content.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned) as SymptomAnalysis;
  } catch {
    return {
      possibleConditions: [],
      urgency: "medium",
      recommendations: ["Please consult a healthcare professional for accurate diagnosis."],
      whenToSeekHelp: "Please consult a doctor for proper evaluation.",
      disclaimer:
        "This is an AI-generated analysis and should not be considered medical advice. Always consult a qualified healthcare professional.",
    };
  }
}

// ─── explainMedicalReport ────────────────────────────────────────────────────

export interface MedicalReportExplanation {
  summary: string;
  keyFindings: Array<{
    term: string;
    explanation: string;
    status: "normal" | "abnormal" | "borderline";
  }>;
  recommendations: string[];
  disclaimer: string;
}

export async function explainMedicalReport(
  reportText: string,
  reportType?: string,
  provider?: AIProvider,
): Promise<MedicalReportExplanation> {
  const ai = resolveProvider(provider);

  const response = await ai.complete({
    messages: [
      {
        role: "system",
        content: `You are a medical report interpretation assistant. Explain the provided ${reportType ?? "medical"} report in patient-friendly language. Return a JSON response with this exact structure:
{
  "summary": "Plain-language summary of the report",
  "keyFindings": [
    { "term": "Medical term", "explanation": "What it means in plain language", "status": "normal|abnormal|borderline" }
  ],
  "recommendations": ["Recommendation 1"],
  "disclaimer": "Medical disclaimer"
}
Return ONLY valid JSON, no markdown, no code blocks. Use simple language a non-medical person can understand. Always include a disclaimer.`,
      },
      {
        role: "user",
        content: reportText,
      },
    ],
    temperature: 0.3,
    maxTokens: 2000,
  });

  try {
    const cleaned = response.content.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned) as MedicalReportExplanation;
  } catch {
    return {
      summary: "Unable to parse the report. Please consult your healthcare provider.",
      keyFindings: [],
      recommendations: ["Please discuss this report with your doctor for proper interpretation."],
      disclaimer:
        "This is an AI-generated explanation and should not be considered medical advice. Always consult a qualified healthcare professional.",
    };
  }
}

// ─── generateHealthAdvice ────────────────────────────────────────────────────

export interface HealthAdviceOptions {
  topic: string;
  patientContext?: {
    age?: number;
    gender?: string;
    conditions?: string[];
    medications?: string[];
  };
  detailLevel?: "brief" | "moderate" | "comprehensive";
  provider?: AIProvider;
}

export interface HealthAdvice {
  advice: string;
  keyPoints: string[];
  actionableSteps: string[];
  precautions: string[];
  disclaimer: string;
}

export async function generateHealthAdvice(
  options: HealthAdviceOptions,
): Promise<HealthAdvice> {
  const { topic, patientContext, detailLevel = "moderate", provider } = options;
  const ai = resolveProvider(provider);

  const contextText = patientContext
    ? [
        patientContext.age ? `Age: ${patientContext.age}` : "",
        patientContext.gender ? `Gender: ${patientContext.gender}` : "",
        patientContext.conditions?.length
          ? `Conditions: ${patientContext.conditions.join(", ")}`
          : "",
        patientContext.medications?.length
          ? `Medications: ${patientContext.medications.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join(", ")
    : "No patient context provided.";

  const detailInstructions = {
    brief: "Provide concise advice in 2-3 sentences.",
    moderate: "Provide moderate detail with explanations.",
    comprehensive: "Provide comprehensive, detailed advice with thorough explanations.",
  };

  const response = await ai.complete({
    messages: [
      {
        role: "system",
        content: `You are a health information assistant. Provide evidence-based health advice about the given topic. ${detailInstructions[detailLevel]} Return a JSON response with this exact structure:
{
  "advice": "Main advice paragraph",
  "keyPoints": ["Point 1", "Point 2"],
  "actionableSteps": ["Step 1", "Step 2"],
  "precautions": ["Precaution 1"],
  "disclaimer": "Medical disclaimer"
}
Return ONLY valid JSON, no markdown, no code blocks. Always emphasize that this is general information and not a substitute for professional medical advice.`,
      },
      {
        role: "user",
        content: `Topic: ${topic}\nPatient context: ${contextText}`,
      },
    ],
    temperature: 0.5,
    maxTokens: 2000,
  });

  try {
    const cleaned = response.content.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned) as HealthAdvice;
  } catch {
    return {
      advice: "Unable to generate advice at this time. Please consult a healthcare professional.",
      keyPoints: [],
      actionableSteps: [],
      precautions: [],
      disclaimer:
        "This is AI-generated health information and should not be considered medical advice. Always consult a qualified healthcare professional.",
    };
  }
}
