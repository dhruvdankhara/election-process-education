import { Page, Locator } from "@playwright/test";

export class ChatPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Election Chat Assistant" });
    this.messageInput = page.getByLabel("Your message");
    this.sendButton = page.getByRole("button", { name: "Send" });
  }

  async goto() {
    await this.page.goto("/chat");
  }

  async sendMessage(message: string) {
    await this.messageInput.fill(message);
    await this.sendButton.click();
  }
}
