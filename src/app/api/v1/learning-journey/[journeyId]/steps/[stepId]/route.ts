import { asyncHandler } from "@/core/utils/async-handler";
import { ApiError, ApiResponse } from "@/core/utils/api-response";
import { requireAuthSession } from "@/core/auth/authorization";
import { LearningJourneyRepository } from "@/modules/learning-journey/repository/learning.repository";
import { ProgressRepository } from "@/modules/progress/repository/progress.repository";

const learningRepository = new LearningJourneyRepository();
const progressRepository = new ProgressRepository();

export const PATCH = asyncHandler(
  async (_req: Request, context: { params: Promise<{ journeyId: string; stepId: string }> }) => {
    const session = await requireAuthSession();
    const { journeyId, stepId } = await context.params;

    const journey = await learningRepository.findById(journeyId);
    if (!journey || journey.userId !== session.user.id) {
      throw new ApiError("NOT_FOUND", "Journey not found", 404);
    }

    const stepOrder = Number(stepId);
    if (!Number.isFinite(stepOrder)) {
      throw new ApiError("VALIDATION_ERROR", "Step id must be numeric order", 400);
    }

    const updatedSteps = journey.steps.map((step) =>
      step.order === stepOrder ? { ...step, isCompleted: true } : step
    );

    const updatedJourney = await learningRepository.update(journeyId, {
      steps: updatedSteps,
    });
    if (!updatedJourney) {
      throw new ApiError("UPDATE_FAILED", "Unable to update journey step", 500);
    }

    const completedSteps = updatedSteps.filter((step) => step.isCompleted).length;
    const totalSteps = updatedSteps.length;
    const percentage = Math.round((completedSteps / Math.max(totalSteps, 1)) * 100);

    const existingProgress = await progressRepository.findByJourney(session.user.id, journeyId);

    if (existingProgress?.id) {
      await progressRepository.update(existingProgress.id, {
        completedSteps,
        totalSteps,
        percentage,
        lastAccessedAt: new Date().toISOString(),
      });
    } else {
      await progressRepository.create({
        userId: session.user.id,
        journeyId,
        completedSteps,
        totalSteps,
        percentage,
        lastAccessedAt: new Date().toISOString(),
      });
    }

    return Response.json(ApiResponse.success(updatedJourney, "Journey step marked complete"));
  }
);
