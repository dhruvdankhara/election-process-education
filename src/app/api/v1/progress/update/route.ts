import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiError, ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";
import { requireAuthSession } from "@/core/auth/authorization";
import { ProgressRepository } from "@/modules/progress/repository/progress.repository";

const progressRepository = new ProgressRepository();

const updateSchema = z
  .object({
    journeyId: z.string().min(1),
    completedSteps: z.number().int().min(0),
    totalSteps: z.number().int().min(1),
  })
  .refine((data) => data.completedSteps <= data.totalSteps, {
    message: "Completed steps cannot exceed total steps",
  });

export const POST = asyncHandler(async (req: Request) => {
  const session = await requireAuthSession();
  const body = await parseRequestBody(req, updateSchema);
  const percentage = Math.round((body.completedSteps / body.totalSteps) * 100);

  const existing = await progressRepository.findByJourney(session.user.id, body.journeyId);
  if (existing?.id) {
    const updated = await progressRepository.update(existing.id, {
      completedSteps: body.completedSteps,
      totalSteps: body.totalSteps,
      percentage,
      lastAccessedAt: new Date().toISOString(),
    });

    if (!updated) {
      throw new ApiError("UPDATE_FAILED", "Unable to update progress", 500);
    }
    return Response.json(ApiResponse.success(updated, "Progress updated"));
  }

  const created = await progressRepository.create({
    userId: session.user.id,
    journeyId: body.journeyId,
    completedSteps: body.completedSteps,
    totalSteps: body.totalSteps,
    percentage,
    lastAccessedAt: new Date().toISOString(),
  });

  return Response.json(ApiResponse.success(created, "Progress created"));
});
