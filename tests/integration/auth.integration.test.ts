/**
 * @jest-environment node
 */
import { requireAuthSession, requireAdminSession } from "@/core/auth/authorization";
import { auth } from "@/core/auth/auth";

jest.mock("@/core/auth/auth", () => ({
  auth: jest.fn(),
}));

// This integration test verifies that the authorization module properly integrates with 
// the broader core logic and handles mocked real-world API request scenarios.
describe("Authorization Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Admin Session Access Flow", () => {
    it("should successfully pass an admin user through both auth gates", async () => {
      // Simulate real-world session scenario where a valid NextAuth session is returned
      (auth as jest.Mock).mockResolvedValue({
        user: { id: "admin-id-1", role: "admin", name: "Admin User", email: "admin@example.com" },
        expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hr from now
      });

      // Verify that requireAuthSession succeeds
      const sessionFromAuth = await requireAuthSession();
      expect(sessionFromAuth.user.id).toBe("admin-id-1");

      // Verify that requireAdminSession also succeeds for the same user
      const sessionFromAdmin = await requireAdminSession();
      expect(sessionFromAdmin.user.role).toBe("admin");
    });
  });
});
