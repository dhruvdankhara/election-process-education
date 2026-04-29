import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { requireAuthSession } from "@/core/auth/authorization";
import { ProgressRepository } from "@/modules/progress/repository/progress.repository";

const progressRepository = new ProgressRepository();

export const GET = asyncHandler(async () => {
  const session = await requireAuthSession();
  const progress = await progressRepository.listByUserId(session.user.id);
  return Response.json(ApiResponse.success(progress, "Progress fetched"));
});
