import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";

import { fallbackAiService } from "@/core/services/ai/fallback.service";
import { VertexService } from "@/core/services/ai/vertex.service";

const vertexService = new VertexService();

const schema = z.object({
  age: z.number().min(18).max(120),
  isFirstTimeVoter: z.boolean(),
  location: z.string().min(2),
});

export const POST = asyncHandler(async (req: Request) => {
  const body = await schema.parseAsync(await req.json());

  if (vertexService.isEnabled()) {
    try {
      const prompt = `Generate a concise 4-step election learning plan in JSON for age ${body.age}, first-time voter: ${body.isFirstTimeVoter}, location: ${body.location}.`;
      const generated = await vertexService.generateStructuredPlan(prompt);
      return Response.json(ApiResponse.success(generated, "Learning journey generated"));
    } catch (error) {
      console.error(
        "Learning journey generation failed. Falling back to deterministic response.",
        error
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
