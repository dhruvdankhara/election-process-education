import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiError, ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";
import { requireAdminSession } from "@/core/auth/authorization";
import { electionDataService } from "@/modules/election/service/election-data.service";

const eventSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  date: z.string().min(4),
  type: z.string().min(2),
  importance: z.enum(["low", "medium", "high", "critical"]),
});

export const POST = asyncHandler(
  async (req: Request, context: { params: Promise<{ timelineId: string }> }) => {
    const session = await requireAdminSession();
    const body = await parseRequestBody(req, eventSchema);
    const { timelineId } = await context.params;
    const updated = await electionDataService.addTimelineEvent(session.user.id, timelineId, body);
    if (!updated) {
      throw new ApiError("NOT_FOUND", "Timeline not found", 404);
    }
    return Response.json(ApiResponse.success(updated, "Timeline event created"));
  }
);
