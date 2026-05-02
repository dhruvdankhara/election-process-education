import { GoogleGenAI } from "@google/genai";
import type { GenerateContentParameters } from "@google/genai";
import { z } from "zod";
import type { MisinformationResult } from "@/core/services/ai/fallback.service";
import { env } from "@/core/config/env";
import { logger } from "@/core/utils/logger";

const DEFAULT_MODEL = "gemini-2.5-flash";
const GEMINI_API_VERSION = "v1alpha";
const MISSING_VERTEX_CREDENTIALS_CODE = "VERTEX_MISSING_CREDENTIALS";
const VERTEX_API_VERSION = "v1";
const VERTEX_UNIMPLEMENTED_CODE = "VERTEX_UNIMPLEMENTED";
const VERTEX_INVALID_OUTPUT_CODE = "VERTEX_INVALID_OUTPUT";

type VertexRequestError = Error & {
  code?: string;
  status?: number;
  detail?: string;
  endpoint?: string;
};

type AiBackend = "gemini" | "vertex";

type ClientBinding = {
  backend: AiBackend;
  client: GoogleGenAI;
};

const LearningJourneySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  steps: z
    .array(
      z.object({
        order: z.number().int().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        isCompleted: z.boolean(),
      })
    )
    .min(1),
});

const MisinformationSchema = z.object({
  verdict: z.enum(["true", "false", "uncertain"]),
  confidence: z.number().min(0).max(1),
  explanation: z.string().min(1),
});

export type LearningJourneyPlan = z.infer<typeof LearningJourneySchema>;

type GenAiContentRequest = GenerateContentParameters;

function shouldUseVertexAi(projectId: string | undefined) {
  if (typeof env.GOOGLE_GENAI_USE_VERTEXAI === "boolean") {
    return env.GOOGLE_GENAI_USE_VERTEXAI;
  }

  return Boolean(projectId);
}

function resolveConfiguredModel(model: string | undefined) {
  if (!model || model.trim().length === 0) {
    return DEFAULT_MODEL;
  }

  // The repo shipped with this older default. Normalize it to the current
  // recommended alias so requests work across Vertex and Gemini API clients.
  if (model === "gemini-2.0-flash-001") {
    return DEFAULT_MODEL;
  }

  return model;
}

function extractJsonPayload(text: string) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw createInvalidOutputError("Vertex output did not contain a JSON object.", text);
  }

  return text.slice(firstBrace, lastBrace + 1);
}

function createInvalidOutputError(message: string, rawOutput?: string) {
  const suffix = rawOutput
    ? ` Raw output preview: ${rawOutput.slice(0, 240).replaceAll("\n", " ")}`
    : "";

  const error = new Error(`${message}${suffix}`) as VertexRequestError;
  error.code = VERTEX_INVALID_OUTPUT_CODE;
  return error;
}

function isUnimplementedResponse(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('"status": "unimplemented"') ||
    normalized.includes("operation is not implemented") ||
    normalized.includes("not implemented")
  );
}

function extractTextFromCandidates(candidates: unknown[]) {
  const parts: string[] = [];

  for (const candidate of candidates) {
    const content = (candidate as { content?: { parts?: unknown[] } })?.content;
    const contentParts = content?.parts ?? [];
    for (const part of contentParts) {
      const text = (part as { text?: unknown })?.text;
      if (typeof text === "string") {
        parts.push(text);
      }
    }
  }

  return parts.join("");
}

function extractTextFromResponse(response: unknown): string {
  if (!response) {
    return "";
  }

  if (typeof response === "string") {
    return response;
  }

  const responseObj = response as {
    text?: string | (() => string);
    response?: unknown;
    candidates?: unknown[];
  };

  if (typeof responseObj.text === "string") {
    return responseObj.text;
  }

  if (typeof responseObj.text === "function") {
    try {
      const value = responseObj.text();
      if (typeof value === "string") {
        return value;
      }
    } catch {
      // Ignore and keep digging.
    }
  }

  if (responseObj.response) {
    return extractTextFromResponse(responseObj.response);
  }

  if (Array.isArray(responseObj.candidates)) {
    return extractTextFromCandidates(responseObj.candidates);
  }

  return "";
}

function createMissingCredentialsError() {
  const error = new Error(
    "Vertex AI credentials are missing or could not be resolved."
  ) as VertexRequestError;
  error.code = MISSING_VERTEX_CREDENTIALS_CODE;
  return error;
}

export function isMissingVertexCredentialsError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const codedError = error as VertexRequestError;
  if (codedError.code === MISSING_VERTEX_CREDENTIALS_CODE) {
    return true;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("could not load the default credentials") ||
    message.includes("application default credentials") ||
    message.includes("google cloud credentials") ||
    message.includes("access token")
  );
}

export function isVertexUnimplementedError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const codedError = error as VertexRequestError;
  if (codedError.code === VERTEX_UNIMPLEMENTED_CODE) {
    return true;
  }

  return isUnimplementedResponse(error.message);
}

export function isVertexInvalidOutputError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const codedError = error as VertexRequestError;
  if (codedError.code === VERTEX_INVALID_OUTPUT_CODE) {
    return true;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("did not contain a json object") ||
    message.includes("unexpected token") ||
    message.includes("invalid json") ||
    message.includes("raw output preview")
  );
}

export class VertexService {
  private primaryClient: ClientBinding | null;
  private secondaryClient: ClientBinding | null;
  private model: string;
  private enabled: boolean;
  private location: string;
  private projectId: string | undefined;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    this.projectId = env.GOOGLE_CLOUD_PROJECT || env.GOOGLE_CLOUD_PROJECT_ID;
    this.location = env.GOOGLE_CLOUD_LOCATION || "us-central1";
    this.model = resolveConfiguredModel(env.GOOGLE_VERTEX_MODEL);
    const useVertexAi = shouldUseVertexAi(this.projectId);

    const vertexClient =
      useVertexAi && this.projectId ? this.buildVertexClient(this.projectId, this.location) : null;
    const geminiClient = apiKey ? this.buildGeminiClient(apiKey) : null;

    this.primaryClient = vertexClient ?? geminiClient;
    this.secondaryClient = vertexClient && geminiClient ? geminiClient : null;
    this.enabled = this.primaryClient !== null;
  }

  private buildGeminiClient(apiKey: string): ClientBinding {
    return {
      backend: "gemini",
      client: new GoogleGenAI({
        apiKey,
        apiVersion: GEMINI_API_VERSION,
      }),
    };
  }

  private buildVertexClient(project: string, location: string): ClientBinding {
    return {
      backend: "vertex",
      client: new GoogleGenAI({
        apiVersion: VERTEX_API_VERSION,
        location,
        project,
        vertexai: true,
      }),
    };
  }

  isEnabled() {
    return this.enabled && this.primaryClient !== null;
  }

  private getAttemptOrder() {
    if (!this.primaryClient) {
      return [];
    }

    return this.secondaryClient ? [this.primaryClient, this.secondaryClient] : [this.primaryClient];
  }

  private getPrimaryClientOrThrow() {
    if (!this.primaryClient) {
      throw createMissingCredentialsError();
    }

    return this.primaryClient;
  }

  private shouldRetryWithGlobal(backend: AiBackend, error: unknown, location: string) {
    return backend === "vertex" && location !== "global" && isVertexUnimplementedError(error);
  }

  private logBackendError(
    operation: "generateContent" | "generateContentStream",
    backend: AiBackend,
    error: unknown
  ) {
    logger.error({ operation, backend, error }, `[AI] ${operation} failed using ${backend}.`);
  }

  private async runRequest<T>(
    operation: "generateContent" | "generateContentStream",
    request: GenAiContentRequest,
    execute: (client: ClientBinding, request: GenAiContentRequest) => Promise<T>
  ) {
    const clients = this.getAttemptOrder();

    if (clients.length === 0) {
      throw createMissingCredentialsError();
    }

    let lastError: unknown;

    for (const client of clients) {
      try {
        return await execute(client, request);
      } catch (error) {
        lastError = error;
        this.logBackendError(operation, client.backend, error);
      }
    }

    throw lastError instanceof Error ? lastError : createMissingCredentialsError();
  }

  private async generateContentWithClient(
    binding: ClientBinding,
    request: GenAiContentRequest,
    location: string
  ) {
    try {
      return await binding.client.models.generateContent(request);
    } catch (error) {
      if (!this.shouldRetryWithGlobal(binding.backend, error, location)) {
        throw error;
      }

      if (!this.projectId) {
        throw createMissingCredentialsError();
      }

      const fallbackClient = this.buildVertexClient(this.projectId, "global");
      return await fallbackClient.client.models.generateContent(request);
    }
  }

  private async generateContent(request: GenAiContentRequest) {
    return this.runRequest("generateContent", request, async (client, next) =>
      this.generateContentWithClient(client, next, this.location)
    );
  }

  private async generateContentStreamWithClient(
    binding: ClientBinding,
    request: GenAiContentRequest,
    location: string
  ) {
    try {
      return await binding.client.models.generateContentStream(request);
    } catch (error) {
      if (!this.shouldRetryWithGlobal(binding.backend, error, location)) {
        throw error;
      }

      if (!this.projectId) {
        throw createMissingCredentialsError();
      }

      const fallbackClient = this.buildVertexClient(this.projectId, "global");
      return await fallbackClient.client.models.generateContentStream(request);
    }
  }

  private async generateContentStream(request: GenAiContentRequest) {
    return this.runRequest("generateContentStream", request, async (client, next) =>
      this.generateContentStreamWithClient(client, next, this.location)
    );
  }

  private getStreamIterator(result: unknown): AsyncIterable<unknown> {
    if (result && typeof (result as AsyncIterable<unknown>)[Symbol.asyncIterator] === "function") {
      return result as AsyncIterable<unknown>;
    }

    const stream = (result as { stream?: AsyncIterable<unknown> }).stream;
    if (stream && typeof stream[Symbol.asyncIterator] === "function") {
      return stream;
    }

    throw new Error("Vertex streaming response did not provide an async iterator.");
  }

  async generateStructuredPlan(prompt: string): Promise<LearningJourneyPlan> {
    const request: GenAiContentRequest = {
      model: this.model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        temperature: 0.2,
      },
    };

    const response = await this.generateContent(request);
    const text = extractTextFromResponse(response).trim();

    if (!text) {
      throw createInvalidOutputError("Vertex returned an empty response body.");
    }

    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(extractJsonPayload(text));
    } catch (error) {
      if (isVertexInvalidOutputError(error)) {
        throw error;
      }

      throw createInvalidOutputError(
        error instanceof Error
          ? `Vertex returned malformed JSON: ${error.message}`
          : "Vertex returned malformed JSON.",
        text
      );
    }

    try {
      return LearningJourneySchema.parse(parsedJson);
    } catch (error) {
      throw createInvalidOutputError(
        error instanceof Error
          ? `Vertex JSON did not match expected schema: ${error.message}`
          : "Vertex JSON did not match expected schema.",
        text
      );
    }
  }

  async generateMisinformationCheck(content: string): Promise<MisinformationResult> {
    const prompt = [
      "You are an election misinformation analyst.",
      "Analyze the claim and respond with strict JSON:",
      '{"verdict":"true|false|uncertain","confidence":0.0,"explanation":"..."}',
      "Rules:",
      "- verdict: true if correct, false if incorrect, uncertain if not enough evidence.",
      "- confidence: number between 0 and 1.",
      "- explanation: 1 to 2 concise sentences.",
      "Claim:",
      content,
    ].join("\n");

    const request: GenAiContentRequest = {
      model: this.model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 512,
        temperature: 0.2,
      },
    };

    const response = await this.generateContent(request);
    const text = extractTextFromResponse(response).trim();

    if (!text) {
      throw createInvalidOutputError("Vertex returned an empty response body.");
    }

    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(extractJsonPayload(text));
    } catch (error) {
      if (isVertexInvalidOutputError(error)) {
        throw error;
      }

      throw createInvalidOutputError(
        error instanceof Error
          ? `Vertex returned malformed JSON: ${error.message}`
          : "Vertex returned malformed JSON.",
        text
      );
    }

    try {
      return MisinformationSchema.parse(parsedJson);
    } catch (error) {
      throw createInvalidOutputError(
        error instanceof Error
          ? `Vertex JSON did not match expected schema: ${error.message}`
          : "Vertex JSON did not match expected schema.",
        text
      );
    }
  }

  async generateChatStream(prompt: string): Promise<ReadableStream> {
    const request: GenAiContentRequest = {
      model: this.model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 2048,
        temperature: 0.4,
      },
    };

    this.getPrimaryClientOrThrow();

    const result = await this.generateContentStream(request);
    const iterator = this.getStreamIterator(result);

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of iterator) {
          const text = extractTextFromResponse(chunk);
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });
  }

  async generateChatReply(prompt: string) {
    const request: GenAiContentRequest = {
      model: this.model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 2048,
        temperature: 0.4,
      },
    };

    const response = await this.generateContent(request);

    const text = extractTextFromResponse(response).trim();

    if (!text) {
      throw createInvalidOutputError("Vertex returned an empty response body.");
    }

    return text;
  }
}
