import { z } from "zod";
import { VertexService } from "@/core/services/ai/vertex.service";
import { requireAuthSession } from "@/core/auth/authorization";
import { ApiResponse } from "@/core/utils/api-response";
import { asyncHandler } from "@/core/utils/async-handler";
import { fallbackAiService } from "@/core/services/ai/fallback.service";
import { parseRequestBody } from "@/core/utils/validator";
import { logger } from "@/core/utils/logger";

const vertexService = new VertexService();

const schema = z.object({
  message: z.string().trim().min(1, "Message is required"),
});

export const POST = asyncHandler(async (req: Request) => {
  await requireAuthSession();
  const body = await parseRequestBody(req, schema);
  const message = body.message;

  if (vertexService.isEnabled()) {
    try {
      const stream = await vertexService.generateChatStream(
        `You are an Indian Election Expert chatbot. ${message}`
      );

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } catch (error) {
      logger.error(
        { error },
        "Streaming chat generation failed. Falling back to deterministic response."
      );
    }
  }

  return Response.json(
    ApiResponse.success(
      { reply: fallbackAiService.buildChatReply(message) },
      "Fallback chat response"
    )
  );
});
