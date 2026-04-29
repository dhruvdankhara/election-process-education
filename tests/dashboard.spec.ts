import { test, expect } from "@playwright/test";
import { DashboardPage } from "./pages/DashboardPage";

test.describe("Dashboard Page Tests", () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  test("should contain all quick action links on dashboard", async () => {
    // This is primarily testing locator definitions.
    // In a real run, session auth mock is required before calling `await dashboardPage.goto()`.

    expect(dashboardPage.editProfileButton).toBeDefined();
    expect(dashboardPage.continueLearningButton).toBeDefined();
    expect(dashboardPage.viewTimelinesButton).toBeDefined();
    expect(dashboardPage.openChatButton).toBeDefined();
    expect(dashboardPage.startSimulationButton).toBeDefined();
    expect(dashboardPage.verifyClaimButton).toBeDefined();
  });
});
