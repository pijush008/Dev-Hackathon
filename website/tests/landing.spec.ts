import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders all major sections", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /build faster/i })).toBeVisible();
    await expect(page.locator("#features")).toBeVisible();
    await expect(page.locator("#pricing")).toBeVisible();
    await expect(page.locator("#testimonials")).toBeVisible();
    await expect(page.locator("#faq")).toBeVisible();
  });

  test("header has navigation links", async ({ page }) => {
    const nav = page.locator("header nav");
    await expect(nav.getByRole("link", { name: "Features" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Pricing" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Testimonials" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "FAQ" })).toBeVisible();
  });

  test("header has sign in and get started links", async ({ page }) => {
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Get started", exact: true })).toBeVisible();
  });

  test("hero section CTA buttons navigate correctly", async ({ page }) => {
    const getStarted = page.getByRole("link", { name: /get started free/i });
    await expect(getStarted).toHaveAttribute("href", "/auth/signup");

    const seeFeatures = page.getByRole("link", { name: /see features/i });
    await expect(seeFeatures).toHaveAttribute("href", "#features");
  });

  test("pricing section displays three tiers", async ({ page }) => {
    const pricing = page.locator("#pricing");
    await pricing.scrollIntoViewIfNeeded();
    await expect(pricing.getByRole("heading", { name: "Starter" })).toBeVisible();
    await expect(pricing.getByRole("heading", { name: "Pro" })).toBeVisible();
    await expect(pricing.getByRole("heading", { name: "Enterprise" })).toBeVisible();
    await expect(pricing.getByText("Most popular")).toBeVisible();
  });

  test("pricing CTA links are correct", async ({ page }) => {
    const pricing = page.locator("#pricing");
    await pricing.scrollIntoViewIfNeeded();
    const starterCta = pricing.getByRole("link", { name: "Get started" }).first();
    await expect(starterCta).toHaveAttribute("href", "/auth/signup");

    const enterpriseCta = pricing.getByRole("link", { name: "Contact sales" });
    await expect(enterpriseCta).toHaveAttribute("href", "mailto:sales@example.com");
  });

  test("FAQ accordion opens and closes", async ({ page }) => {
    await page.locator("#faq").scrollIntoViewIfNeeded();
    const firstQuestion = page.getByText("How does the free trial work?");
    await firstQuestion.click();
    await expect(page.getByText(/full access to the Pro plan/i)).toBeVisible();
    await firstQuestion.click();
    await expect(page.getByText(/full access to the Pro plan/i)).not.toBeVisible();
  });

  test("footer has legal links", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.getByText("Privacy")).toBeVisible();
    await expect(footer.getByText("Terms")).toBeVisible();
    await expect(footer.getByText("Security")).toBeVisible();
    await expect(footer.getByText("Cookies")).toBeVisible();
  });
});

test.describe("Landing Page Responsive", () => {
  test("mobile menu toggles", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByLabel("Toggle menu").click();
    const mobilePanel = page.locator("header").last();
    await expect(mobilePanel.getByRole("link", { name: "Features" })).toBeVisible();
    await expect(mobilePanel.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(mobilePanel.getByRole("link", { name: "Get started", exact: true })).toBeVisible();
  });
});
