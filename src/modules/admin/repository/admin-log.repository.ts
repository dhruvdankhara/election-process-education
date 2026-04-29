import { BaseEntity, BaseRepository } from "@/core/database/base.repository";

export interface AdminLog extends BaseEntity {
  adminId: string;
  action: string;
  targetId: string;
  targetType: string;
  timestamp: string;
}

export class AdminLogRepository extends BaseRepository<AdminLog> {
  constructor() {
    super("adminLogs");
  }

  async list(): Promise<AdminLog[]> {
    const logs = await this.listAll();
    return logs.sort((a, b) =>
      a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0
    );
  }
}
