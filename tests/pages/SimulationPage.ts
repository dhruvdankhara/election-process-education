import { Page, Locator } from "@playwright/test";

export class SimulationPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly restartButton: Locator;
  readonly verifyDocumentsButton: Locator;
  readonly confirmVvpatButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Real booth flow, one step at a time." });
    this.nextButton = page.getByRole("button", { name: "Next Step" });
    this.previousButton = page.getByRole("button", { name: "Previous" });
    this.restartButton = page.getByRole("button", { name: "Restart" });
    this.verifyDocumentsButton = page.getByRole("button", { name: /Verify Documents/i });
    this.confirmVvpatButton = page.getByRole("button", { name: /This Matches My Vote/i });
  }

  async goto() {
    await this.page.goto("/simulation");
  }

  async selectDocument(name: string) {
    await this.page.getByRole("button", { name: new RegExp(name, "i") }).click();
  }

  async markFinger(finger: string) {
    await this.page.getByRole("button", { name: new RegExp(finger, "i") }).click();
  }

  async castVote(candidate: string) {
    await this.page.getByRole("button", { name: new RegExp(`Vote for ${candidate}`, "i") }).click();
  }
}
