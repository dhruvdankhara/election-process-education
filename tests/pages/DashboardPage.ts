import { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly editProfileButton: Locator;
  readonly continueLearningButton: Locator;
  readonly viewTimelinesButton: Locator;
  readonly openChatButton: Locator;
  readonly startSimulationButton: Locator;
  readonly verifyClaimButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editProfileButton = page.getByRole("link", { name: "Edit Profile" });
    this.continueLearningButton = page.getByRole("link", { name: "Continue Learning" });
    this.viewTimelinesButton = page.getByRole("link", { name: "View Timelines" });
    this.openChatButton = page.getByRole("link", { name: "Open Chat" });
    this.startSimulationButton = page.getByRole("link", { name: "Start Simulation" });
    this.verifyClaimButton = page.getByRole("link", { name: "Verify a claim" });
  }

  async goto() {
    await this.page.goto("/dashboard");
  }
}
