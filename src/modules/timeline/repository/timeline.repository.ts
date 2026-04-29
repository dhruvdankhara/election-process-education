import { BaseEntity, BaseRepository } from "@/core/database/base.repository";

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  importance: "low" | "medium" | "high" | "critical";
}

export interface ElectionTimeline extends BaseEntity {
  electionId: string;
  title: string;
  description: string;
  isDummy: boolean;
  createdBy: string;
  events: TimelineEvent[];
}

export class TimelineRepository extends BaseRepository<ElectionTimeline> {
  constructor() {
    super("timelines");
  }

  async listByElectionId(electionId: string): Promise<ElectionTimeline[]> {
    return this.findManyByField("electionId", electionId);
  }
}
