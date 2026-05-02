import { apiClient } from "@/lib/api-client";

export interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

export interface ChatResponse {
  reply: string;
}

export const chatService = {
  ask: (message: string, context: ChatMessage[]) =>
    apiClient.post<ChatResponse>("/api/v1/ai/chat/ask", { message, context }),
};
