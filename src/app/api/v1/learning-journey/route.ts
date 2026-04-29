import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { requireAuthSession } from "@/core/auth/authorization";
import { LearningJourneyRepository } from "@/modules/learning-journey/repository/learning.repository";

const learningRepository = new LearningJourneyRepository();

export const GET = asyncHandler(async () => {
  const session = await requireAuthSession();
  const journeys = await learningRepository.getUserJourneys(session.user.id);
  return Response.json(ApiResponse.success(journeys, "Journeys fetched"));
});
