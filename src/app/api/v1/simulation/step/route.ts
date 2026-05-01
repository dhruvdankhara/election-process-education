import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";
import { requireAuthSession } from "@/core/auth/authorization";
import { fallbackAiService } from "@/core/services/ai/fallback.service";

const schema = z.object({
  stepId: z.string().min(1),
  response: z.string().min(1),
});

export const POST = asyncHandler(async (req: Request) => {
  await requireAuthSession();
  const body = await parseRequestBody(req, schema);
  const feedback = fallbackAiService.evaluateSimulationStep(body.stepId, body.response);

  return Response.json(ApiResponse.success(feedback, "Simulation step evaluated"));
});
