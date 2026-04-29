import { test, expect } from "@playwright/test";
import { MisinformationPage } from "./pages/MisinformationPage";

test.describe("Misinformation Page Tests", () => {
  let misinformationPage: MisinformationPage;

  test.beforeEach(async ({ page }) => {
    misinformationPage = new MisinformationPage(page);
    await misinformationPage.goto();
  });

  test("should render the misinformation verifier form", async () => {
    await expect(misinformationPage.heading).toBeVisible();
    await expect(misinformationPage.claimTextarea).toBeVisible();
    await expect(misinformationPage.verifyButton).toBeVisible();
    await expect(misinformationPage.verifyButton).toBeDisabled();
  });

  test("should enable verify button after entering a valid claim", async () => {
    await misinformationPage.enterClaim("This is a test claim to verify");
    await expect(misinformationPage.verifyButton).toBeEnabled();
  });

  test("should show checking status when verifying", async ({ page }) => {
    // Mock the API response to delay so we can see the checking state
    await page.route("/api/v1/ai/misinformation/check", async () => {
      // Don't fulfill immediately to capture the intermediate loading state
    });

    await misinformationPage.enterClaim("This is a test claim to verify");
    await misinformationPage.submitVerification();

    await expect(page.getByRole("button", { name: "Checking..." })).toBeVisible();
  });

  test("should display verification result from API", async ({ page }) => {
    // Mock successful verification response
    await page.route("/api/v1/ai/misinformation/check", async (route) => {
      await route.fulfill({
        json: {
          data: {
            verdict: "false",
            confidence: 0.95,
            explanation: "This claim is completely false.",
          },
        },
      });
    });

    await misinformationPage.enterClaim("Fake news here");
    await misinformationPage.submitVerification();

    await expect(page.getByText("Verification result")).toBeVisible();
    await expect(page.getByText("FALSE")).toBeVisible();
    await expect(page.getByText("This claim is completely false.")).toBeVisible();
  });
});
