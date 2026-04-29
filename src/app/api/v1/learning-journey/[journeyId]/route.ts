import { asyncHandler } from "@/core/utils/async-handler";
import { ApiError, ApiResponse } from "@/core/utils/api-response";
import { requireAuthSession } from "@/core/auth/authorization";
import { LearningJourneyRepository } from "@/modules/learning-journey/repository/learning.repository";

const learningRepository = new LearningJourneyRepository();

export const GET = asyncHandler(
  async (_req: Request, context: { params: Promise<{ journeyId: string }> }) => {
    const session = await requireAuthSession();
    const { journeyId } = await context.params;
    const journey = await learningRepository.findById(journeyId);

    if (!journey || journey.userId !== session.user.id) {
      throw new ApiError("NOT_FOUND", "Journey not found", 404);
    }

    return Response.json(ApiResponse.success(journey, "Journey fetched"));
  }
);
