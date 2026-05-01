import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";
import { fallbackAiService } from "@/core/services/ai/fallback.service";
import { electionDataService } from "@/modules/election/service/election-data.service";

const schema = z.object({
  electionId: z.string().min(1),
});

export const POST = asyncHandler(async (req: Request) => {
  const body = await parseRequestBody(req, schema);
  const timelines = await electionDataService.listTimelines(body.electionId);
  const events = timelines.flatMap((timeline) => timeline.events);
  const summary = fallbackAiService.buildTimelineSummary(events);
  return Response.json(ApiResponse.success(summary, "Timeline summary generated"));
});
