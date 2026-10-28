import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop disclosures support hover, focus, Escape and cross-page anchors", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/guides/");
  const nav = page.getByRole("navigation", {
    name: "Main navigation",
    exact: true,
  });
  const toggle = nav.getByRole("button", { name: "Workspace links" });
  const setup = nav.getByRole("link", { name: "Mac & iPhone setup" });
  await nav.getByRole("link", { name: "Workspace", exact: true }).hover();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await setup.hover();
  await expect(setup).toBeVisible();
  await page.mouse.move(10, 850);
  await expect(setup).toBeHidden();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(setup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await setup.click();
  await expect(page).toHaveURL(/\/#device-setup$/);
  await expect(page.locator(".device-docks-grid figure")).toHaveCount(2);
  await expect
    .poll(async () =>
      page
        .locator("#device-setup")
        .evaluate((el) => el.getBoundingClientRect().top),
    )
    .toBeGreaterThan(70);
  await nav.getByRole("link", { name: "Security", exact: true }).focus();
  await expect(
    nav.getByRole("button", { name: "Security links" }),
  ).toHaveAttribute("aria-expanded", "true");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.locator(".top-actions .account-entry").focus();
  await expect(
    nav.getByRole("button", { name: "Security links" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("touch-sized navigation and shared device walkthrough", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const menu = page.locator(".mobile-nav");
  await menu.locator(":scope > summary").click();
  await menu.getByRole("button", { name: "Workspace links" }).click();
  await menu.getByRole("link", { name: "Mac & iPhone setup" }).click();
  await expect(menu).not.toHaveAttribute("open");
  await page
    .getByRole("link", { name: "Set up notifications on your devices" })
    .click();
  const root = page.locator("#device-setup");
  await expect(root).toHaveAttribute("open", "");
  await root.getByRole("button", { name: "iPhone", exact: true }).click();
  const panel = root.locator('[data-device-panel="iphone"]');
  await expect(
    panel.getByRole("heading", { name: "Open the console in Safari" }),
  ).toBeVisible();
  await panel.getByRole("button", { name: "Next", exact: true }).click();
  await expect(
    panel.getByRole("heading", { name: "Add to Home Screen", exact: true }),
  ).toBeVisible();
  for (let n = 0; n < 3; n++)
    await panel.getByRole("button", { name: "Next", exact: true }).click();
  await expect(panel.locator("[data-step-status]")).toHaveText("Step 5 of 5");
  await expect(
    panel.getByRole("button", { name: "Next", exact: true }),
  ).toHaveAttribute("aria-disabled", "true");
  await panel.getByRole("button", { name: "Previous" }).click();
  await expect(
    panel.getByRole("heading", { name: "Enable notifications" }),
  ).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.goto("/guides/workspaces/#device-setup");
  await expect(page.locator("#device-setup")).toContainText(
    "Adding the icon does not grant permission",
  );
});

test("positioning, section order and no-script setup remain accurate", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator("h1")).toHaveText(
    "Secure cloud workspaces for agents and teams.",
  );
  await expect(page.locator(".lede .agent-strip")).not.toContainText("Planned");
  expect(
    await page
      .locator("main > section")
      .evaluateAll((els) => els.map((el) => el.id)),
  ).toEqual([
    "top",
    "workspace",
    "notifications",
    "agents",
    "security",
    "teams",
    "business",
    "faq",
    "pricing",
  ]);
  await page
    .getByRole("link", { name: "Set up notifications on your devices" })
    .click();
  for (const id of ["mac", "iphone"]) {
    const panel = page.locator(`[data-device-panel="${id}"]`);
    await expect(panel).toBeVisible();
    await expect(panel.locator("[data-setup-step]:visible")).toHaveCount(5);
  }
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .getByRole("link"),
  ).toHaveCount(6);
  await context.close();
});

test("touch events open the menu and select setup without hover", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  const menu = page.locator(".mobile-nav");
  await menu.locator(":scope > summary").tap();
  await menu.getByRole("button", { name: "Workspace links" }).tap();
  await menu.getByRole("link", { name: "Mac & iPhone setup" }).tap();
  await expect(page).toHaveURL(/#device-setup$/);
  await expect(page.locator(".device-docks-grid figure")).toHaveCount(2);
  await page
    .getByRole("link", { name: "Set up notifications on your devices" })
    .tap();
  await page
    .locator("#device-setup")
    .getByRole("button", { name: "iPhone", exact: true })
    .tap();
  await expect(page.locator('[data-device-panel="iphone"]')).toBeVisible();
  await context.close();
});
