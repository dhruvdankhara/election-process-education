/**
 * @jest-environment node
 */
import { requireAuthSession, requireAdminSession } from "@/core/auth/authorization";
import { auth } from "@/core/auth/auth";
import { ApiError } from "@/core/utils/api-response";

// Mock the auth module
jest.mock("@/core/auth/auth", () => ({
  auth: jest.fn(),
}));

describe("Authorization Utilities", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("requireAuthSession", () => {
    it("should return session when user is authenticated", async () => {
      const mockSession = { user: { id: "user-123", role: "user" }, expires: "date" };
      (auth as jest.Mock).mockResolvedValue(mockSession);

      const session = await requireAuthSession();
      expect(session).toEqual(mockSession);
      expect(auth).toHaveBeenCalledTimes(1);
    });

    it("should throw ApiError when session is missing", async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      await expect(requireAuthSession()).rejects.toThrow(ApiError);
      await expect(requireAuthSession()).rejects.toMatchObject({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "You must be logged in",
      });
    });

    it("should throw ApiError when session user ID is missing", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { role: "user" }, expires: "date" }); // Missing id

      await expect(requireAuthSession()).rejects.toThrow(ApiError);
      await expect(requireAuthSession()).rejects.toMatchObject({
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    });
  });

  describe("requireAdminSession", () => {
    it("should return session when user is admin", async () => {
      const mockSession = { user: { id: "admin-123", role: "admin" }, expires: "date" };
      (auth as jest.Mock).mockResolvedValue(mockSession);

      const session = await requireAdminSession();
      expect(session).toEqual(mockSession);
    });

    it("should throw ApiError when user is authenticated but not an admin", async () => {
      const mockSession = { user: { id: "user-123", role: "user" }, expires: "date" };
      (auth as jest.Mock).mockResolvedValue(mockSession);

      await expect(requireAdminSession()).rejects.toThrow(ApiError);
      await expect(requireAdminSession()).rejects.toMatchObject({
        statusCode: 403,
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    });

    it("should throw ApiError when user is not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      // It should fail at the requireAuthSession level
      await expect(requireAdminSession()).rejects.toMatchObject({
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    });
  });
});
