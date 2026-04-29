import { BaseEntity, BaseRepository } from "@/core/database/base.repository";

export interface UserProgress extends BaseEntity {
  userId: string;
  journeyId: string;
  completedSteps: number;
  totalSteps: number;
  percentage: number;
  lastAccessedAt: string;
}

export class ProgressRepository extends BaseRepository<UserProgress> {
  constructor() {
    super("progress");
  }

  async listByUserId(userId: string): Promise<UserProgress[]> {
    return this.findManyByField("userId", userId);
  }

  async findByJourney(userId: string, journeyId: string): Promise<UserProgress | null> {
    const rows = await this.findManyByField("userId", userId);
    return rows.find((row) => row.journeyId === journeyId) ?? null;
  }
}
