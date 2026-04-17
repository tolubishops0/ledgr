import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.fill("#email", "toluo@gmail.com");
  await page.fill("#password", "qwerty1234");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/overview");

  await page.context().storageState({ path: authFile });
});
