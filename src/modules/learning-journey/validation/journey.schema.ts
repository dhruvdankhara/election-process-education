import { z } from "zod";

export const generateJourneySchema = z.object({
  age: z.number().min(18, "Must be 18 to vote").max(120),
  isFirstTimeVoter: z.boolean(),
  location: z.string().min(2, "Provide a valid state/city"),
  preferredLanguage: z.string().min(2).optional().default("en"),
});
