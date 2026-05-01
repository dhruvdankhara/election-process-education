import { z } from "zod";

export const generateJourneySchema = z.object({
  age: z.number().min(18, "Must be 18 to vote").max(120),
  isFirstTimeVoter: z.boolean(),
  location: z.string().trim().min(2, "Provide a valid state/city").max(120, "Location is too long"),
  preferredLanguage: z.string().trim().min(2).max(10).optional().default("en"),
});
