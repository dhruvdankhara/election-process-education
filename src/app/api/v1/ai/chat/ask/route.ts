import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";

import { fallbackAiService } from "@/core/services/ai/fallback.service";
import { VertexService } from "@/core/services/ai/vertex.service";

const vertexService = new VertexService();

const schema = z.object({
  message: z.string().trim().min(1).max(2000),
  context: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        message: z.string().trim().min(1).max(2000),
      })
    )
    .max(20)
    .optional()
    .default([]),
});

export const POST = asyncHandler(async (req: Request) => {
  const body = await parseRequestBody(req, schema);

  if (vertexService.isEnabled()) {
    try {
      const renderedContext = body.context
        .map((item) => `${item.role}: ${item.message}`)
        .join("\n");
      const prompt = `${renderedContext}\nuser: ${body.message}`;
      const reply = await vertexService.generateChatReply(prompt);
      if (reply.trim().length > 0) {
        return Response.json(ApiResponse.success({ reply }, "AI response generated"));
      }
    } catch (error) {
      console.error("AI chat generation failed. Falling back to deterministic response.", error);
    }
  }

  return Response.json(
    ApiResponse.success(
      { reply: fallbackAiService.buildChatReply(body.message) },
      "Fallback AI response generated"
    )
  );
});
