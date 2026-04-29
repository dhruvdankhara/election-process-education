import { ElectionRepository } from "@/modules/election/repository/election.repository";
import {
  TimelineRepository,
  type TimelineEvent,
} from "@/modules/timeline/repository/timeline.repository";
import { AdminLogRepository } from "@/modules/admin/repository/admin-log.repository";

const electionRepository = new ElectionRepository();
const timelineRepository = new TimelineRepository();
const adminLogRepository = new AdminLogRepository();

let seeded = false;

async function writeAdminLog(input: {
  adminId: string;
  action: string;
  targetId: string;
  targetType: string;
}) {
  await adminLogRepository.create({
    ...input,
    timestamp: new Date().toISOString(),
  });
}

export const electionDataService = {
  async ensureSeedData() {
    if (seeded) return;
    const existing = await electionRepository.list();
    if (existing.length > 0) {
      seeded = true;
      return;
    }

    const election = await electionRepository.create({
      title: "State Assembly Election 2026",
      country: "India",
      state: "Delhi",
      type: "assembly",
      description: "General assembly election with voter registration and polling milestones.",
      createdBy: "system",
    });

    if (election.id) {
      await timelineRepository.create({
        electionId: election.id,
        title: "Delhi Assembly 2026 timeline",
        description: "Official dates for registration, campaign, polling, and results.",
        isDummy: true,
        createdBy: "system",
        events: [
          {
            id: "reg-deadline",
            title: "Voter registration deadline",
            description: "Last day to submit voter registration correction and inclusion requests.",
            date: "2026-05-01",
            type: "registration",
            importance: "high",
          },
          {
            id: "campaign-start",
            title: "Campaign period begins",
            description: "Public campaign period opens for candidates.",
            date: "2026-05-15",
            type: "campaign",
            importance: "medium",
          },
          {
            id: "polling-day",
            title: "Polling day",
            description: "Vote at your assigned polling station.",
            date: "2026-06-20",
            type: "voting",
            importance: "critical",
          },
          {
            id: "results-day",
            title: "Result declaration",
            description: "Official counting and declaration of results.",
            date: "2026-06-23",
            type: "results",
            importance: "high",
          },
        ],
      });
    }

    seeded = true;
  },

  async listElections() {
    await this.ensureSeedData();
    return electionRepository.list();
  },

  async getElection(electionId: string) {
    await this.ensureSeedData();
    return electionRepository.findById(electionId);
  },

  async listTimelines(electionId: string) {
    await this.ensureSeedData();
    return timelineRepository.listByElectionId(electionId);
  },

  async getTimeline(timelineId: string) {
    await this.ensureSeedData();
    return timelineRepository.findById(timelineId);
  },

  async createElection(
    adminId: string,
    payload: {
      title: string;
      country: string;
      state: string;
      type: string;
      description: string;
    }
  ) {
    const created = await electionRepository.create({
      ...payload,
      createdBy: adminId,
    });

    if (created.id) {
      await writeAdminLog({
        adminId,
        action: "election.create",
        targetId: created.id,
        targetType: "election",
      });
    }

    return created;
  },

  async updateElection(
    adminId: string,
    electionId: string,
    payload: Partial<{
      title: string;
      country: string;
      state: string;
      type: string;
      description: string;
    }>
  ) {
    const updated = await electionRepository.update(electionId, payload);
    if (updated) {
      await writeAdminLog({
        adminId,
        action: "election.update",
        targetId: electionId,
        targetType: "election",
      });
    }
    return updated;
  },

  async deleteElection(adminId: string, electionId: string) {
    const timelines = await timelineRepository.listByElectionId(electionId);
    await Promise.all(
      timelines
        .map((timeline) => timeline.id)
        .filter((id): id is string => Boolean(id))
        .map((id) => timelineRepository.delete(id))
    );

    const removed = await electionRepository.delete(electionId);
    if (removed) {
      await writeAdminLog({
        adminId,
        action: "election.delete",
        targetId: electionId,
        targetType: "election",
      });
    }
    return removed;
  },

  async createTimeline(
    adminId: string,
    electionId: string,
    payload: { title: string; description: string; isDummy: boolean }
  ) {
    const created = await timelineRepository.create({
      electionId,
      title: payload.title,
      description: payload.description,
      isDummy: payload.isDummy,
      createdBy: adminId,
      events: [],
    });

    if (created.id) {
      await writeAdminLog({
        adminId,
        action: "timeline.create",
        targetId: created.id,
        targetType: "timeline",
      });
    }

    return created;
  },

  async addTimelineEvent(adminId: string, timelineId: string, event: Omit<TimelineEvent, "id">) {
    const timeline = await timelineRepository.findById(timelineId);
    if (!timeline) return null;

    const eventId = crypto.randomUUID();
    const updatedEvents = [...timeline.events, { ...event, id: eventId }];
    const updated = await timelineRepository.update(timelineId, {
      events: updatedEvents,
    });

    await writeAdminLog({
      adminId,
      action: "timeline.event.create",
      targetId: eventId,
      targetType: "timeline-event",
    });

    return updated;
  },

  async updateTimelineEvent(
    adminId: string,
    timelineId: string,
    eventId: string,
    patch: Partial<Omit<TimelineEvent, "id">>
  ) {
    const timeline = await timelineRepository.findById(timelineId);
    if (!timeline) return null;

    const updatedEvents = timeline.events.map((event) =>
      event.id === eventId ? { ...event, ...patch } : event
    );
    const updated = await timelineRepository.update(timelineId, {
      events: updatedEvents,
    });

    await writeAdminLog({
      adminId,
      action: "timeline.event.update",
      targetId: eventId,
      targetType: "timeline-event",
    });

    return updated;
  },

  async deleteTimelineEvent(adminId: string, timelineId: string, eventId: string) {
    const timeline = await timelineRepository.findById(timelineId);
    if (!timeline) return null;

    const updated = await timelineRepository.update(timelineId, {
      events: timeline.events.filter((event) => event.id !== eventId),
    });

    await writeAdminLog({
      adminId,
      action: "timeline.event.delete",
      targetId: eventId,
      targetType: "timeline-event",
    });

    return updated;
  },

  async listAdminLogs() {
    return adminLogRepository.list();
  },
};
