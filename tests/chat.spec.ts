import { test, expect } from "@playwright/test";
import { ChatPage } from "./pages/ChatPage";

test.describe("Chat Page Tests", () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.goto();
  });

  test("should display the initial assistant message", async ({ page }) => {
    await expect(chatPage.heading).toBeVisible();
    await expect(page.getByText("Hi! I'm your Election Assistant.")).toBeVisible();
  });

  test("should allow user to send a message and receive a response", async ({ page }) => {
    await page.route("/api/v1/ai/chat/ask", async (route) => {
      await route.fulfill({
        json: {
          data: {
            reply: "This is a mocked AI response.",
          },
        },
      });
    });

    await chatPage.sendMessage("How do I register to vote?");

    // Verify user message is displayed
    await expect(page.getByText("How do I register to vote?")).toBeVisible();

    // Verify mocked AI response is displayed
    await expect(page.getByText("This is a mocked AI response.")).toBeVisible();
  });

  test("should handle API errors gracefully", async ({ page }) => {
    await page.route("/api/v1/ai/chat/ask", async (route) => {
      await route.abort("failed");
    });

    await chatPage.sendMessage("Hello?");

    await expect(
      page.getByText("Chat is temporarily unavailable. Please try again shortly.")
    ).toBeVisible();
  });
});
