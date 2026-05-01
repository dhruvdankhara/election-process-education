import { z } from "zod";
import { ApiError } from "@/core/utils/api-response";

const parseJsonBody = async (req: Request) => {
  try {
    return await req.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError("INVALID_JSON", "Invalid JSON payload", 400);
    }
    throw error;
  }
};

export const parseRequestBody = async <T>(req: Request, schema: z.ZodSchema<T>) => {
  const body = await parseJsonBody(req);

  try {
    return await schema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError("VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid input", 400);
    }

    throw error;
  }
};

export const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request) => parseRequestBody(req, schema);
};
