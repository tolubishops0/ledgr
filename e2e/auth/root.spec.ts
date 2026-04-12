import { test, expect } from "@playwright/test";

test("middleware works to redirect to login?", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page).toHaveURL(/\/login/);
});
