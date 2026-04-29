import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { electionDataService } from "@/modules/election/service/election-data.service";

export const GET = asyncHandler(
  async (_req: Request, context: { params: Promise<{ electionId: string }> }) => {
    const { electionId } = await context.params;
    const timelines = await electionDataService.listTimelines(electionId);
    return Response.json(ApiResponse.success(timelines, "Timelines fetched"));
  }
);
