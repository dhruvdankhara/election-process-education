import { BaseEntity, BaseRepository } from "@/core/database/base.repository";

export interface JourneyStep {
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
}

export interface LearningJourney extends BaseEntity {
  userId: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  steps: JourneyStep[];
}

export class LearningJourneyRepository extends BaseRepository<LearningJourney> {
  constructor() {
    // Note: We use a root collection for simplicity, though the docs mention a subcollection.
    // We filter by userId instead of deep nesting for faster cross-queries in firestore
    super("learningJourneys");
  }

  async getUserJourneys(userId: string): Promise<LearningJourney[]> {
    return this.findManyByField("userId", userId);
  }
}
