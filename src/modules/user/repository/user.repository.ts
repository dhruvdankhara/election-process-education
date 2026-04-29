import { BaseRepository, BaseEntity } from "@/core/database/base.repository";

export interface User extends BaseEntity {
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
}

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super("users");
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneByField("email", email);
  }

  async listAllUsers(): Promise<User[]> {
    return this.listAll();
  }
}
