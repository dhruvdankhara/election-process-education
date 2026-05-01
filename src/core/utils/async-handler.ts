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
      const isMutatingMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
      if (isMutatingMethod) {
        const fetchSite = req.headers.get("sec-fetch-site");
        if (fetchSite === "cross-site") {
          throw new ApiError("FORBIDDEN", "Cross-site requests are not allowed", 403);
        }

        const origin = req.headers.get("origin");
        if (origin && origin !== new URL(req.url).origin) {
          throw new ApiError("FORBIDDEN", "Origin mismatch", 403);
        }
      }

      return await handler(req, ...args);
    } catch (error: unknown) {
      console.error("API Error:", error);

      if (error instanceof ApiError) {
        return NextResponse.json(ApiResponse.error(error.code, error.message), {
          status: error.statusCode,
        });
      }

      if (error instanceof SyntaxError) {
        return NextResponse.json(ApiResponse.error("INVALID_JSON", "Invalid JSON payload"), {
          status: 400,
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
