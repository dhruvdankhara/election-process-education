import { BaseEntity, BaseRepository } from "@/core/database/base.repository";

export interface Election extends BaseEntity {
  title: string;
  country: string;
  state: string;
  type: string;
  description: string;
  createdBy: string;
}

export class ElectionRepository extends BaseRepository<Election> {
  constructor() {
    super("elections");
  }

  async list(): Promise<Election[]> {
    const elections = await this.listAll();
    return elections.sort((a, b) => {
      const aDate =
        a.updatedAt instanceof Date
          ? a.updatedAt.getTime()
          : a.createdAt instanceof Date
            ? a.createdAt.getTime()
            : 0;
      const bDate =
        b.updatedAt instanceof Date
          ? b.updatedAt.getTime()
          : b.createdAt instanceof Date
            ? b.createdAt.getTime()
            : 0;
      return bDate - aDate;
    });
  }
}
