import { BaseEntity, BaseRepository } from "@/core/database/base.repository";

export interface UserProfile extends BaseEntity {
  userId: string;
  age: number;
  isFirstTimeVoter: boolean;
  location: string;
  preferredLanguage: string;
  voiceEnabled: boolean;
}

export class UserProfileRepository extends BaseRepository<UserProfile> {
  constructor() {
    super("userProfiles");
  }

  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.findOneByField("userId", userId);
  }
}
