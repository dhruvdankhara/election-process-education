import { VertexService } from "@/core/services/ai/vertex.service";
import { requireAuthSession } from "@/core/auth/authorization";
import { ApiError, ApiResponse } from "@/core/utils/api-response";
import { asyncHandler } from "@/core/utils/async-handler";
import { fallbackAiService } from "@/core/services/ai/fallback.service";

const vertexService = new VertexService();

export const POST = asyncHandler(async (req: Request) => {
  await requireAuthSession();
  const body = (await req.json()) as { message?: string };
  const message = body.message?.trim();
  if (!message) {
    throw new ApiError("VALIDATION_ERROR", "Message is required", 400);
  }

  if (vertexService.isEnabled()) {
    try {
      const stream = await vertexService.generateChatStream(
        `You are an Indian Election Expert chatbot. ${message}`
      );

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } catch (error) {
      console.error(
        "Streaming chat generation failed. Falling back to deterministic response.",
        error
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
