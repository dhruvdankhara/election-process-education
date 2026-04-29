import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly getStartedButton: Locator;
  readonly signInButton: Locator;
  readonly exploreTimelineButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: "Learn the election process clearly, confidently, and step by step.",
    });
    this.getStartedButton = page.getByRole("link", { name: "Start onboarding" });
    this.signInButton = page.getByRole("link", { name: "Sign in with Google" });
    this.exploreTimelineButton = page.getByRole("link", { name: "Explore timelines" });
  }

  async goto() {
    await this.page.goto("/");
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }

  async clickSignIn() {
    await this.signInButton.click();
  }
}
