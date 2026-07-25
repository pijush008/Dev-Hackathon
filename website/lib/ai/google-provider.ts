import { createGoogle } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import type {
  AIProvider,
  AICompletionOptions,
  AICompletionResponse,
  AIStreamChunk,
} from "./provider";

export interface GoogleProviderConfig {
  apiKey?: string;
  defaultModel?: string;
}

const DEFAULT_MODEL = "gemini-2.5-flash";

export class GoogleProvider implements AIProvider {
  private provider;
  private defaultModel: string;

  constructor(config: GoogleProviderConfig = {}) {
    const apiKey = config.apiKey ?? process.env.GOOGLE_API_KEY ?? "";
    this.provider = createGoogle({ apiKey });
    this.defaultModel = config.defaultModel ?? DEFAULT_MODEL;
  }

  async complete(options: AICompletionOptions): Promise<AICompletionResponse> {
    const { messages, model, temperature = 0.7, maxTokens = 4096 } = options;

    const systemMessage = messages.find((m) => m.role === "system");
    const nonSystemMessages = messages.filter((m) => m.role !== "system");

    const modelName = model ?? this.defaultModel;

    const result = await generateText({
      model: this.provider(modelName),
      system: systemMessage?.content,
      messages: nonSystemMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      temperature,
      maxOutputTokens: maxTokens,
    });

    return {
      content: result.text,
      model: modelName,
      usage: {
        promptTokens: result.usage.inputTokens ?? 0,
        completionTokens: result.usage.outputTokens ?? 0,
        totalTokens: result.usage.totalTokens ?? 0,
      },
    };
  }

  async *stream(
    options: AICompletionOptions,
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const { messages, model, temperature = 0.7, maxTokens = 4096 } = options;

    const systemMessage = messages.find((m) => m.role === "system");
    const nonSystemMessages = messages.filter((m) => m.role !== "system");

    const modelName = model ?? this.defaultModel;

    const result = streamText({
      model: this.provider(modelName),
      system: systemMessage?.content,
      messages: nonSystemMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      temperature,
      maxOutputTokens: maxTokens,
    });

    for await (const chunk of result.textStream) {
      yield { content: chunk, done: false };
    }
    yield { content: "", done: true };
  }
}
