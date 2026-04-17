import test, { expect } from "@playwright/test";

test("middleware redirects to login", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("http://localhost:3000");

  await expect(page).toHaveURL(/login/);
});
