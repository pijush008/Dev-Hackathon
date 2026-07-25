import OpenAI from "openai";
import type {
  AIProvider,
  AICompletionOptions,
  AICompletionResponse,
  AIStreamChunk,
} from "./provider";
import { GoogleProvider } from "./google-provider";

export interface OpenAIProviderConfig {
  apiKey?: string;
  baseURL?: string;
  defaultModel?: string;
}

const DEFAULT_MODEL = "gpt-4o";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private defaultModel: string;

  constructor(config: OpenAIProviderConfig = {}) {
    this.client = new OpenAI({
      apiKey: config.apiKey ?? process.env.OPENAI_API_KEY,
      baseURL: config.baseURL ?? process.env.OPENAI_BASE_URL,
    });
    this.defaultModel = config.defaultModel ?? DEFAULT_MODEL;
  }

  async complete(options: AICompletionOptions): Promise<AICompletionResponse> {
    const response = await this.client.chat.completions.create({
      model: options.model ?? this.defaultModel,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
    });

    const choice = response.choices[0];

    return {
      content: choice.message.content ?? "",
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0,
      },
    };
  }

  async *stream(
    options: AICompletionOptions,
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const response = await this.client.chat.completions.create({
      model: options.model ?? this.defaultModel,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      stream: true,
    });

    for await (const chunk of response) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      const done = chunk.choices[0]?.finish_reason != null;
      yield { content: delta, done };
    }
  }
}

let _defaultProvider: AIProvider | null = null;

export function getAIProvider(config?: OpenAIProviderConfig): AIProvider {
  if (!_defaultProvider) {
    const provider = (process.env.AI_PROVIDER ?? "openai").toLowerCase();

    if (provider === "google" || provider === "gemini") {
      _defaultProvider = new GoogleProvider({
        apiKey: process.env.GOOGLE_API_KEY,
        defaultModel: process.env.AI_MODEL,
      });
    } else {
      _defaultProvider = new OpenAIProvider(config);
    }
  }
  return _defaultProvider;
}

export function setAIProvider(provider: AIProvider): void {
  _defaultProvider = provider;
}
