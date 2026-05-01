import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";
import { requireAdminSession } from "@/core/auth/authorization";
import { electionDataService } from "@/modules/election/service/election-data.service";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  isDummy: z.boolean().default(false),
});

export const POST = asyncHandler(
  async (req: Request, context: { params: Promise<{ electionId: string }> }) => {
    const session = await requireAdminSession();
    const body = await parseRequestBody(req, schema);
    const { electionId } = await context.params;
    const created = await electionDataService.createTimeline(session.user.id, electionId, body);

    return Response.json(ApiResponse.success(created, "Timeline created"));
  }
);
