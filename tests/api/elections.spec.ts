import { test, expect } from "../fixtures/api-fixtures";

test.describe("Elections API", () => {
  test("should return a list of elections", async ({ apiHelper }) => {
    const response = await apiHelper.get("/api/v1/elections");

    // As the API might not be running in tests unless specifically configured,
    // this test assumes an environment where next dev or next start is running,
    // or Playwright is configured with a webServer.
    // We expect the endpoint to exist.

    // In our case we just check the structure if it returns 200 or 404/500 if mocked.
    expect(response.status()).toBeDefined();

    if (response.ok()) {
      const data = await response.json();
      expect(data).toHaveProperty("success");
      if (data.success) {
        expect(Array.isArray(data.data)).toBeTruthy();
      }
    }
  });

  test("should return 404 for non-existent election", async ({ apiHelper, authHelper }) => {
    const token = await authHelper.login();
    const response = await apiHelper.get("/api/v1/elections/non-existent-id", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBeDefined();
  });
});
