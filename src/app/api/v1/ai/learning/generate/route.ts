import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";
import { logger } from "@/core/utils/logger";

import { fallbackAiService } from "@/core/services/ai/fallback.service";
import { VertexService } from "@/core/services/ai/vertex.service";

const vertexService = new VertexService();

const schema = z.object({
  age: z.number().min(18).max(120),
  isFirstTimeVoter: z.boolean(),
  location: z.string().trim().min(2).max(120),
});

export const POST = asyncHandler(async (req: Request) => {
  const body = await parseRequestBody(req, schema);

  if (vertexService.isEnabled()) {
    try {
      const prompt = `Generate a concise 4-step election learning plan in JSON for age ${body.age}, first-time voter: ${body.isFirstTimeVoter}, location: ${body.location}.`;
      const generated = await vertexService.generateStructuredPlan(prompt);
      return Response.json(ApiResponse.success(generated, "Learning journey generated"));
    } catch (error) {
      logger.error(
        { error },
        "Learning journey generation failed. Falling back to deterministic response."
      );
    }
  }

  return Response.json(
    ApiResponse.success(
      fallbackAiService.buildLearningJourney(body),
      "Fallback learning journey generated"
    )
  );
});
