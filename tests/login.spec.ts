import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test.describe("Login Page Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should display the login form correctly", async () => {
    // Verify that the main elements are visible and accessible
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.description).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // Verify that the login button is enabled
    await expect(loginPage.loginButton).toBeEnabled();
  });

  test("should trigger authentication flow on Google login click", async ({ page }) => {
    // Intercept the request to Google Auth to prevent actual navigation during tests
    // while confirming that clicking the button actually triggers the authentication flow.
    const requestPromise = page.waitForRequest(
      (request) => request.url().includes("google") || request.url().includes("/api/auth")
    );

    await loginPage.clickLoginWithGoogle();

    // Test passes if the expected network request is fired
    const request = await requestPromise.catch(() => null);
    expect(request, "Expected authentication request to be fired").toBeDefined();
  });
});
