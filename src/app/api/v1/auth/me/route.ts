import { asyncHandler } from "@/core/utils/async-handler";
import { ApiResponse } from "@/core/utils/api-response";
import { requireAuthSession } from "@/core/auth/authorization";

export const GET = asyncHandler(async () => {
  const session = await requireAuthSession();
  return Response.json(
    ApiResponse.success(
      {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      "Current user fetched"
    )
  );
});
