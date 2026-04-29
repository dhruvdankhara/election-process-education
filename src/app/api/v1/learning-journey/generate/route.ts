import { NextResponse } from "next/server";
import { GenerateJourneyService } from "@/modules/learning-journey/service/create-journey.service";
import { asyncHandler } from "@/core/utils/async-handler";
import { auth } from "@/core/auth/auth";
import { ApiResponse } from "@/core/utils/api-response";
import { generateJourneySchema } from "@/modules/learning-journey/validation/journey.schema";

const generateService = new GenerateJourneyService();

export const POST = asyncHandler(async (req: Request) => {
  const session = await auth();

  const body = await generateJourneySchema.parseAsync(await req.json());

  // Assuming Zod validation passed correctly
  const result = await generateService.execute(session?.user?.id, {
    age: body.age,
    isFirstTimeVoter: body.isFirstTimeVoter,
    location: body.location,
    preferredLanguage: body.preferredLanguage,
  });

  return NextResponse.json(ApiResponse.success(result, "Journey Generated Successfully"));
});
