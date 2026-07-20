import { test, expect } from "@playwright/test";

test.describe("Authentication Pages", () => {
  test("login page has required elements", async ({ page }) => {
    await page.goto("/auth/login");

    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: /sign up/i })).toBeVisible();
  });

  test("login page has Google sign-in button", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("button", { name: "Google" })).toBeVisible();
  });

  test("login link navigates to signup", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("link", { name: /sign up/i }).click();
    await expect(page).toHaveURL("/auth/signup");
  });

  test("signup page has required elements", async ({ page }) => {
    await page.goto("/auth/signup");

    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });

  test("signup page has Google sign-in button", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.getByRole("button", { name: "Google" })).toBeVisible();
  });

  test("signup link navigates to login", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.getByRole("link", { name: /sign in/i }).click();
    await expect(page).toHaveURL("/auth/login");
  });

  test("unauthenticated access to dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("unauthenticated access to profile redirects to login", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
