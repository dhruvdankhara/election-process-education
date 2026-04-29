import { Page, Locator } from "@playwright/test";

export class TimelinePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly summaryTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Election Timeline" });
    this.summaryTitle = page.getByRole("heading", { name: "AI timeline summary" });
  }

  async goto() {
    await this.page.goto("/timeline");
  }

  async getElectionButton(title: string) {
    return this.page.getByRole("button", { name: new RegExp(title, "i") });
  }
}
