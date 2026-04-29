import type { Session } from "next-auth";
import { auth } from "@/core/auth/auth";
import { ApiError } from "@/core/utils/api-response";

export async function requireAuthSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ApiError("UNAUTHORIZED", "You must be logged in", 401);
  }
  return session;
}

export async function requireAdminSession(): Promise<Session> {
  const session = await requireAuthSession();
  if (session.user.role !== "admin") {
    throw new ApiError("FORBIDDEN", "Admin access required", 403);
  }
  return session;
}
