import { test, expect } from "@playwright/test";
import { SimulationPage } from "./pages/SimulationPage";

test.describe("Simulation Page Tests", () => {
  let simulationPage: SimulationPage;

  test.beforeEach(async ({ page }) => {
    simulationPage = new SimulationPage(page);
    await simulationPage.goto();
  });

  test("should render the simulation wizard properly", async ({ page }) => {
    await expect(simulationPage.heading).toBeVisible();
    await expect(page.getByText("Document Check")).toBeVisible();
  });

  test("should require valid documents to verify in step 1", async ({ page }) => {
    // Select an invalid document initially
    await simulationPage.selectDocument("Phone screenshot");
    await simulationPage.verifyDocumentsButton.click();
    await expect(page.getByText("Remove the phone screenshot. It is not accepted.")).toBeVisible();

    // Select valid documents
    await simulationPage.selectDocument("Phone screenshot"); // deselect
    await simulationPage.selectDocument("EPIC voter ID");
    await simulationPage.selectDocument("Polling booth slip");
    await simulationPage.verifyDocumentsButton.click();

    await expect(page.getByText("Documents verified. Move to the ink desk.")).toBeVisible();
    await expect(simulationPage.nextButton).toBeEnabled();
  });

  test("should be able to complete the entire simulation flow", async ({ page }) => {
    // Step 1: Documents
    await simulationPage.selectDocument("Passport");
    await simulationPage.selectDocument("Polling booth slip");
    await simulationPage.verifyDocumentsButton.click();
    await simulationPage.nextButton.click();

    // Step 2: Ink
    await expect(page.getByText("Indelible Ink Stage")).toBeVisible();
    // Try wrong finger
    await simulationPage.markFinger("Left thumb");
    await expect(page.getByText("Use the left index finger.")).toBeVisible();
    // Use correct finger
    await simulationPage.markFinger("Left index finger");
    await expect(page.getByText("Ink applied correctly. Proceed to the EVM.")).toBeVisible();
    await simulationPage.nextButton.click();

    // Step 3: EVM
    await expect(page.getByText("EVM And VVPAT")).toBeVisible();
    await simulationPage.castVote("Asha Verma");
    await expect(page.getByText("Vote locked for Asha Verma. Check the VVPAT slip.")).toBeVisible();
    await expect(page.getByText("Printed Slip")).toBeVisible();
    await simulationPage.confirmVvpatButton.click();
    await expect(page.getByText("VVPAT confirmed. The voting sequence is complete.")).toBeVisible();
    await simulationPage.nextButton.click();

    // Step 4: Completion
    await expect(page.getByText("Full sequence completed")).toBeVisible();
    await expect(page.getByRole("button", { name: "Run Again" })).toBeVisible();
  });
});
