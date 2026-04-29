import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { requireAdminSession } from "@/core/auth/authorization";
import { electionDataService } from "@/modules/election/service/election-data.service";

export const GET = asyncHandler(async () => {
  await requireAdminSession();
  const logs = await electionDataService.listAdminLogs();
  return Response.json(ApiResponse.success(logs, "Admin logs fetched"));
});
