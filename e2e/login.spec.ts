import { test, expect } from "@playwright/test";

test("admin login page renders credentials form", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByPlaceholder("Email address")).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: /Sign in/i })).toBeVisible();
});
