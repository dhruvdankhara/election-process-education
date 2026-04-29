import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { electionDataService } from "@/modules/election/service/election-data.service";

export const GET = asyncHandler(async () => {
  const elections = await electionDataService.listElections();
  return Response.json(ApiResponse.success(elections, "Elections fetched"));
});
