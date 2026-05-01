import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiError, ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";
import { requireAdminSession } from "@/core/auth/authorization";
import { electionDataService } from "@/modules/election/service/election-data.service";

const patchSchema = z
  .object({
    title: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().min(2).max(2000).optional(),
    date: z.string().trim().min(4).max(40).optional(),
    type: z.string().trim().min(2).max(80).optional(),
    importance: z.enum(["low", "medium", "high", "critical"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field required");

export const PATCH = asyncHandler(
  async (req: Request, context: { params: Promise<{ timelineId: string; eventId: string }> }) => {
    const session = await requireAdminSession();
    const body = await parseRequestBody(req, patchSchema);
    const { timelineId, eventId } = await context.params;
    const updated = await electionDataService.updateTimelineEvent(
      session.user.id,
      timelineId,
      eventId,
      body
    );
    if (!updated) {
      throw new ApiError("NOT_FOUND", "Timeline not found", 404);
    }
    return Response.json(ApiResponse.success(updated, "Timeline event updated"));
  }
);

export const DELETE = asyncHandler(
  async (_req: Request, context: { params: Promise<{ timelineId: string; eventId: string }> }) => {
    const session = await requireAdminSession();
    const { timelineId, eventId } = await context.params;
    const updated = await electionDataService.deleteTimelineEvent(
      session.user.id,
      timelineId,
      eventId
    );
    if (!updated) {
      throw new ApiError("NOT_FOUND", "Timeline not found", 404);
    }
    return Response.json(ApiResponse.success(updated, "Timeline event deleted"));
  }
);
