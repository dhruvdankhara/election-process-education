import { test, expect } from "@playwright/test";
import { TimelinePage } from "./pages/TimelinePage";

test.describe("Timeline Page Tests", () => {
  let timelinePage: TimelinePage;

  test.beforeEach(async ({ page }) => {
    timelinePage = new TimelinePage(page);
  });

  test("should display the timeline heading", async () => {
    await timelinePage.goto();
    await expect(timelinePage.heading).toBeVisible();
  });

  test("should load elections and display them", async ({ page }) => {
    // Mock the API response to avoid real network calls
    await page.route("/api/v1/elections", async (route) => {
      const json = {
        data: [{ id: "1", title: "General Election", state: "US" }],
      };
      await route.fulfill({ json });
    });

    await page.route("/api/v1/timelines/*", async (route) => {
      const json = { data: [] };
      await route.fulfill({ json });
    });

    await timelinePage.goto();

    const electionBtn = await timelinePage.getElectionButton("General Election");
    await expect(electionBtn).toBeVisible();
  });
});
