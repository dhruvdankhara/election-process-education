import { VertexService } from "@/core/services/ai/vertex.service";
import { fallbackAiService } from "@/core/services/ai/fallback.service";
import { translationService } from "@/core/services/translation/translate.service";
import { LearningJourneyRepository } from "../repository/learning.repository";
import { logger } from "@/core/utils/logger";

const vertexService = new VertexService();
const journeyRepository = new LearningJourneyRepository();

interface GenerateRequest {
  age: number;
  isFirstTimeVoter: boolean;
  location: string;
  preferredLanguage?: string;
}

export class GenerateJourneyService {
  async execute(userId: string | undefined, input: GenerateRequest) {
    let result:
      | {
          title: string;
          description: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          steps: {
            order: number;
            title: string;
            description: string;
            isCompleted: boolean;
          }[];
        }
      | undefined;

    if (vertexService.isEnabled()) {
      const prompt = `
        You are an expert in the Indian Election process.
        Generate a 4-step personalized learning journey in JSON format for a user who is:
        - ${input.age} years old
        - ${input.isFirstTimeVoter ? "First-time voter" : "Experienced voter"}
        - Location: ${input.location}

        Return strictly JSON matching this structure:
        {
          "title": "...",
          "description": "...",
          "difficulty": "beginner|intermediate|advanced",
          "steps": [
            { "order": 1, "title": "...", "description": "...", "isCompleted": false }
          ]
        }
      `;

      try {
        result = await vertexService.generateStructuredPlan(prompt);
      } catch (error) {
        logger.error(error, "Journey generation failed. Falling back to deterministic response.");
        result = undefined;
      }
    }

    if (!result) {
      result = fallbackAiService.buildLearningJourney(input);
    }

    if (input.preferredLanguage && input.preferredLanguage !== "en") {
      result = {
        ...result,
        title: await translationService.translate(result.title, input.preferredLanguage),
        description: await translationService.translate(
          result.description,
          input.preferredLanguage
        ),
        steps: await Promise.all(
          result.steps.map(async (step) => ({
            ...step,
            title: await translationService.translate(
              step.title,
              input.preferredLanguage as string
            ),
            description: await translationService.translate(
              step.description,
              input.preferredLanguage as string
            ),
          }))
        ),
      };
    }

    if (!userId) {
      return {
        id: "guest-" + Date.now().toString(),
        userId: "guest",
        title: result.title,
        description: result.description,
        difficulty: result.difficulty,
        steps: result.steps,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // Save to Firestore
    const savedJourney = await journeyRepository.create({
      userId,
      title: result.title,
      description: result.description,
      difficulty: result.difficulty,
      steps: result.steps,
    });

    return savedJourney;
  }
}
