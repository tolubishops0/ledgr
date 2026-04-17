import { test, expect } from "@playwright/test";
import { mockOverview } from "../helpers/data";

test.describe("Overview Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockOverview(page);

    await page.addStyleTag({
      content: `
      .backdrop-blur-sm, 
      [role="dialog"], 
      [class*="toast"] { 
        display: none !important; 
        pointer-events: none !important; 
      }
    `,
    });
  });

  test("overview page loads successfully", async ({ page }) => {
    await page.goto("/overview");

    await expect(page).toHaveURL("/overview");
    await expect(page.getByText(/total balance/i)).toBeVisible();
  });

  test("summary cards are visible", async ({ page }) => {
    await page.goto("/overview");

    await expect(page.getByText(/total balance/i)).toBeVisible();
    await expect(page.getByText(/income this month/i)).toBeVisible();
    await expect(page.getByText(/expenses this month/i)).toBeVisible();
  });

  test("spending by category section renders", async ({ page }) => {
    await page.goto("/overview");

    await expect(page.getByText(/spending by category/i)).toBeVisible();
  });

  test("recent transactions section renders", async ({ page }) => {
    await page.goto("/overview");

    await expect(page.getByText(/recent transactions/i)).toBeVisible();
  });

  test("budget empty state is shown", async ({ page }) => {
    await page.goto("/overview");

    await expect(page.getByText(/no budgets set/i)).toBeVisible();
  });

  // test("view all takes user to transactions page", async ({ page }) => {
  //   await page.goto("/overview");

  //   await page.getByRole("link", { name: /view all/i }).click();
  //   await expect(page).toHaveURL("/transactions");
  // });
});
