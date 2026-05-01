import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";
import { requireAdminSession } from "@/core/auth/authorization";
import { electionDataService } from "@/modules/election/service/election-data.service";

const schema = z.object({
  title: z.string().trim().min(2).max(120),
  country: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  type: z.string().trim().min(2).max(80),
  description: z.string().trim().min(2).max(2000),
});

export const GET = asyncHandler(async () => {
  await requireAdminSession();
  const elections = await electionDataService.listElections();
  return Response.json(ApiResponse.success(elections, "Admin elections fetched"));
});

export const POST = asyncHandler(async (req: Request) => {
  const session = await requireAdminSession();
  const body = await parseRequestBody(req, schema);
  const created = await electionDataService.createElection(session.user.id, body);
  return Response.json(ApiResponse.success(created, "Election created"));
});
