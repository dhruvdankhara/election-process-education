import { z } from "zod";
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiError, ApiResponse } from "@/core/utils/api-response";
import { parseRequestBody } from "@/core/utils/validator";
import { requireAuthSession } from "@/core/auth/authorization";
import { UserProfileRepository } from "@/modules/user/repository/profile.repository";

const profileRepository = new UserProfileRepository();

const profileSchema = z.object({
  age: z.number().min(18).max(120),
  isFirstTimeVoter: z.boolean(),
  location: z.string().min(2),
  preferredLanguage: z.string().min(2).default("en"),
  voiceEnabled: z.boolean().default(false),
});

export const GET = asyncHandler(async () => {
  const session = await requireAuthSession();
  const profile = await profileRepository.findByUserId(session.user.id);

  return Response.json(ApiResponse.success(profile, "Profile fetched successfully"));
});

export const POST = asyncHandler(async (req: Request) => {
  const session = await requireAuthSession();
  const body = await parseRequestBody(req, profileSchema);
  const existing = await profileRepository.findByUserId(session.user.id);

  if (existing?.id) {
    const updated = await profileRepository.update(existing.id, body);
    if (!updated) {
      throw new ApiError("UPDATE_FAILED", "Unable to update profile", 500);
    }
    return Response.json(ApiResponse.success(updated, "Profile updated successfully"));
  }

  const created = await profileRepository.create({
    userId: session.user.id,
    age: body.age,
    isFirstTimeVoter: body.isFirstTimeVoter,
    location: body.location,
    preferredLanguage: body.preferredLanguage,
    voiceEnabled: body.voiceEnabled,
  });

  return Response.json(ApiResponse.success(created, "Profile created successfully"));
});
