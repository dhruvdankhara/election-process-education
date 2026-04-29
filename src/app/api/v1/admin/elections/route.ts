import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { requireAdminSession } from "@/core/auth/authorization";
import { electionDataService } from "@/modules/election/service/election-data.service";

const schema = z.object({
  title: z.string().min(2),
  country: z.string().min(2),
  state: z.string().min(2),
  type: z.string().min(2),
  description: z.string().min(2),
});

export const GET = asyncHandler(async () => {
  await requireAdminSession();
  const elections = await electionDataService.listElections();
  return Response.json(ApiResponse.success(elections, "Admin elections fetched"));
});

export const POST = asyncHandler(async (req: Request) => {
  const session = await requireAdminSession();
  const body = await schema.parseAsync(await req.json());
  const created = await electionDataService.createElection(session.user.id, body);
  return Response.json(ApiResponse.success(created, "Election created"));
});
