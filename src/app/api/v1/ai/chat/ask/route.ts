import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";

import { fallbackAiService } from "@/core/services/ai/fallback.service";
import { VertexService } from "@/core/services/ai/vertex.service";

const vertexService = new VertexService();

const schema = z.object({
  message: z.string().min(1),
  context: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        message: z.string(),
      })
    )
    .optional()
    .default([]),
});

export const POST = asyncHandler(async (req: Request) => {
  const body = await schema.parseAsync(await req.json());

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
