import { test, expect } from "@playwright/test";

test("forgot password page loads", async ({ page }) => {
  await page.goto("/forgot-password");

  await expect(page).toHaveURL("/forgot-password");
  await expect(page.getByText(/enter your email/i)).toBeVisible();
});

test("shows error if passwords do not match", async ({ page }) => {
  await page.goto("/reset-password");

  await page.fill("#password", "123456");
  await page.fill("#confirmPassword", "999999");

  await page.click('button[type="submit"]');

  await expect(page.getByText(/passwords do not match/i)).toBeVisible();
});

test("shows success UI after submitting email", async ({ page }) => {
  await page.goto("/forgot-password");

  await page.fill("#email", "test@example.com");
  await page.click('button[type="submit"]');

  await expect(page.getByText(/we've sent a password reset link/i)).toBeVisible(
    { timeout: 5000 },
  );
});

test("success UI allows retry", async ({ page }) => {
  await page.goto("/forgot-password");

  await page.fill("#email", "test@example.com");
  await page.click('button[type="submit"]');

  await expect(page.getByText(/we've sent/i)).toBeVisible();

  await page.click('button:has-text("Try again")');

  await expect(page.getByText(/enter your email/i)).toBeVisible();
});
