import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

test.describe("Home Page Tests", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should display the main heading and navigation buttons", async () => {
    await expect(homePage.heading).toBeVisible();
    await expect(homePage.getStartedButton).toBeVisible();
    await expect(homePage.signInButton).toBeVisible();
    await expect(homePage.exploreTimelineButton).toBeVisible();
  });

  test('should navigate to register page on "Start onboarding" click', async ({ page }) => {
    await homePage.clickGetStarted();
    await expect(page).toHaveURL(/.*\/register/);
  });

  test('should navigate to login page on "Sign in" click', async ({ page }) => {
    await homePage.clickSignIn();
    await expect(page).toHaveURL(/.*\/login/);
  });
});
