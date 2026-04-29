import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { requireAuthSession } from "@/core/auth/authorization";
import { fallbackAiService } from "@/core/services/ai/fallback.service";

export const POST = asyncHandler(async () => {
  await requireAuthSession();
  return Response.json(
    ApiResponse.success({ steps: fallbackAiService.getSimulationSteps() }, "Simulation started")
  );
});
