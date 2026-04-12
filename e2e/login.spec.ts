import { test, expect } from "@playwright/test";

test("Is this the login page", async ({ page }) => {
  await page.goto("/login");

  await expect(page).toHaveURL("/login");
  await expect(page.getByText("Sign in to your account")).toBeVisible();
});

test("Can users login with thier email and password", async ({ page }) => {
  await page.goto("/login");

  await page.fill("#email", "toluo@gmail.com");
  await page.fill("#password", "qwerty1234");

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/overview");
});
