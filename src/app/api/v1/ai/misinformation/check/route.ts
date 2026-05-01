import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";

import { fallbackAiService } from "@/core/services/ai/fallback.service";
import { VertexService } from "@/core/services/ai/vertex.service";

const vertexService = new VertexService();

const schema = z.object({
  content: z.string().trim().min(5).max(2000),
});

export const POST = asyncHandler(async (req: Request) => {
  const body = await parseRequestBody(req, schema);

  if (vertexService.isEnabled()) {
    try {
      const result = await vertexService.generateMisinformationCheck(body.content);
      return Response.json(ApiResponse.success(result, "Misinformation check completed"));
    } catch (error) {
      console.error(
        "Misinformation analysis failed. Falling back to deterministic response.",
        error
      );
    }
  }

  const result = fallbackAiService.checkMisinformation(body.content);
  return Response.json(ApiResponse.success(result, "Misinformation check completed"));
});
