import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { requireAuthSession } from "@/core/auth/authorization";
import { UserRepository } from "@/modules/user/repository/user.repository";
import { UserProfileRepository } from "@/modules/user/repository/profile.repository";

const userRepository = new UserRepository();
const profileRepository = new UserProfileRepository();

export const GET = asyncHandler(async () => {
  const session = await requireAuthSession();
  const user = await userRepository.findById(session.user.id);
  const profile = await profileRepository.findByUserId(session.user.id);

  return Response.json(
    ApiResponse.success(
      {
        user,
        profile,
      },
      "User data fetched"
    )
  );
});
