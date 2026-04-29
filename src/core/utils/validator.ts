import { z } from "zod";
import { ApiResponse } from "@/core/utils/api-response";

export const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return async (req: Request) => {
    try {
      const body = await req.json();
      return schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ApiResponse.error("VALIDATION_ERROR", error.issues[0].message);
      }
      throw error;
    }
  };
};
