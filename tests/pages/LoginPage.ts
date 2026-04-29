import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly description: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Log In" });
    this.description = page.getByText(
      "Choose a method to continue learning about the election process."
    );
    this.loginButton = page.getByRole("button", { name: "Log in with Google" });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async clickLoginWithGoogle() {
    await this.loginButton.click();
  }
}
