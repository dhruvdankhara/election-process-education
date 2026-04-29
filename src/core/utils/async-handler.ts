// This utility acts as a wrapper for API route handlers to catch exceptions natively
import { NextResponse } from "next/server";
import { ApiError, ApiResponse } from "@/core/utils/api-response";
import { z } from "zod";

type NextRouteHandler<TArgs extends unknown[] = unknown[]> = (
  req: Request,
  ...args: TArgs
) => Promise<Response | NextResponse> | Response | NextResponse;

export const asyncHandler =
  <TArgs extends unknown[]>(handler: NextRouteHandler<TArgs>) =>
  async (req: Request, ...args: TArgs) => {
    try {
      return await handler(req, ...args);
    } catch (error: unknown) {
      console.error("API Error:", error);

      if (error instanceof ApiError) {
        return NextResponse.json(ApiResponse.error(error.code, error.message), {
          status: error.statusCode,
        });
      }

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          ApiResponse.error("VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid input"),
          { status: 400 }
        );
      }

      return NextResponse.json(
        ApiResponse.error(
          "INTERNAL_SERVER_ERROR",
          error instanceof Error ? error.message : "An unexpected error occurred"
        ),
        { status: 500 }
      );
    }
  };
