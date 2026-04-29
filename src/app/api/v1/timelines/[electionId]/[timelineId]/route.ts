import { asyncHandler } from "@/core/utils/async-handler";
import { ApiError, ApiResponse } from "@/core/utils/api-response";
import { electionDataService } from "@/modules/election/service/election-data.service";

export const GET = asyncHandler(
  async (
    _req: Request,
    context: { params: Promise<{ electionId: string; timelineId: string }> }
  ) => {
    const { electionId, timelineId } = await context.params;
    const timeline = await electionDataService.getTimeline(timelineId);
    if (!timeline || timeline.electionId !== electionId) {
      throw new ApiError("NOT_FOUND", "Timeline not found", 404);
    }
    return Response.json(ApiResponse.success(timeline, "Timeline fetched"));
  }
);
