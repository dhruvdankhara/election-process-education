import { Page, Locator } from "@playwright/test";

export class MisinformationPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly claimTextarea: Locator;
  readonly verifyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Misinformation detector" });
    this.claimTextarea = page.getByLabel("Claim to verify");
    this.verifyButton = page.getByRole("button", { name: "Verify claim" });
  }

  async goto() {
    await this.page.goto("/misinformation");
  }

  async enterClaim(claim: string) {
    await this.claimTextarea.fill(claim);
  }

  async submitVerification() {
    await this.verifyButton.click();
  }
}
