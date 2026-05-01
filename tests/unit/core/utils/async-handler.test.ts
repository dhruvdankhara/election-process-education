/**
 * @jest-environment node
 */
import { asyncHandler } from "@/core/utils/async-handler";
import { ApiError } from "@/core/utils/api-response";
import { z } from "zod";
import { NextResponse } from "next/server";

// Mock Next.js Response
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, init })),
  },
}));

describe("asyncHandler", () => {
  const mockRequest = new Request("http://localhost/api");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the result of the handler if successful", async () => {
    const handler = async () => NextResponse.json({ success: true });
    const wrappedHandler = asyncHandler(handler);

    const result = await wrappedHandler(mockRequest);
    expect(NextResponse.json).toHaveBeenCalledWith({ success: true });
    expect(result).toEqual({ body: { success: true }, init: undefined });
  });

  it("should handle ApiError and return appropriate NextResponse", async () => {
    const handler = async () => {
      throw new ApiError("FORBIDDEN", "Access denied", 403);
    };
    const wrappedHandler = asyncHandler(handler);

    await wrappedHandler(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: { code: "FORBIDDEN", message: "Access denied" },
      }),
      { status: 403 }
    );
  });

  it("should handle ZodError and return 400 Bad Request", async () => {
    const handler = async () => {
      const schema = z.object({ id: z.string() });
      schema.parse({ id: 123 }); // Throws ZodError
      return NextResponse.json({}); // Dummy return to satisfy TS
    };
    const wrappedHandler = asyncHandler(handler);

    await wrappedHandler(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: "VALIDATION_ERROR",
        }),
      }),
      { status: 400 }
    );
  });

  it("should handle invalid JSON errors and return 400 Bad Request", async () => {
    const handler = async () => {
      throw new SyntaxError("Unexpected token");
    };
    const wrappedHandler = asyncHandler(handler);

    await wrappedHandler(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          code: "INVALID_JSON",
          message: "Invalid JSON payload",
        },
      }),
      { status: 400 }
    );
  });

  it("should reject cross-site mutating requests", async () => {
    const handler = async () => NextResponse.json({ ok: true });
    const wrappedHandler = asyncHandler(handler);
    const crossSiteRequest = new Request("http://localhost/api", {
      method: "POST",
      headers: {
        "sec-fetch-site": "cross-site",
        origin: "https://evil.example",
      },
    });

    await wrappedHandler(crossSiteRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Cross-site requests are not allowed",
        },
      }),
      { status: 403 }
    );
  });

  it("should handle generic Errors and return 500 Internal Server Error", async () => {
    const handler = async () => {
      throw new Error("Unexpected crash");
    };
    const wrappedHandler = asyncHandler(handler);

    await wrappedHandler(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected crash",
        },
      }),
      { status: 500 }
    );
  });
});
