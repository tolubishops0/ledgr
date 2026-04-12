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

test("does forgot password takes user to forgot password", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("link", { name: /Forgot password/i }).click();

  await expect(page).toHaveURL("/forgot-password");
});

test("does create account takes user to create account", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("link", { name: /Create one/i }).click();

  await expect(page).toHaveURL("/register");
});

test("login button is disabled when fields are empty", async ({ page }) => {
  await page.goto("/login");

  await expect(page.locator('button[type="submit"]')).toBeDisabled();
});

test("login button enables when fields are filled", async ({ page }) => {
  await page.goto("/login");

  const button = page.locator('button[type="submit"]');

  await expect(button).toBeDisabled();

  await page.fill("#email", "test@example.com");
  await page.fill("#password", "password123");

  await expect(button).toBeEnabled();
});
