import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

test("Agent Cloud navigation, concept controls, comparison and responsive access", async ({
  page,
}) => {
  const issues = [];
  page.on("pageerror", (error) => issues.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.locator(".footer-cloud-link").click();
  await expect(page).toHaveURL(/\/cloud-computers\/$/);
  await expect(page.locator("h1")).toContainText("Controlled by agents.");
  await page.evaluate(() => document.fonts.ready);
  expect(
    (await page.locator("[data-terminal-output]").boundingBox()).height,
  ).toBeGreaterThan(20);
  expect(
    await page.evaluate(
      () =>
        [...document.fonts].filter(
          (f) =>
            ["IBM Plex Mono", "IBM Plex Sans"].includes(f.family) &&
            f.status === "error",
        ).length,
    ),
  ).toBe(0);
  await expect(page.locator(".gd-desktop")).toBeVisible();
  await page.getByRole("button", { name: "Watch agent work" }).click();
  await expect(page.locator("[data-agent-progress]")).toContainText(
    "Demo complete",
  );
  await expect(page.locator("[data-terminal-output]")).toContainText(
    "cat progress.md",
  );
  await expect(page.locator('[data-app-window="browser"]')).toHaveClass(
    /gd-window-front/,
  );
  await page.getByRole("button", { name: "Replay agent demo" }).click();
  await page
    .getByRole("button", { name: "Pause computer", exact: true })
    .click();
  await expect(page.locator("[data-agent-demo]")).toBeDisabled();
  await expect(page.locator("[data-agent-progress]")).toContainText(
    "Demo stopped",
  );
  await page
    .getByRole("button", { name: "Resume computer", exact: true })
    .click();
  await expect(page.locator("[data-agent-demo]")).toBeEnabled();

  await page
    .locator(".gd-dock")
    .getByRole("button", { name: "Open Files", exact: true })
    .click();
  await expect(page.locator('[data-app-window="files"]')).toBeVisible();
  await page
    .getByRole("button", { name: "release-notes.md Markdown", exact: true })
    .click();
  await expect(page.locator("[data-file-preview]")).toContainText(
    "Release notes",
  );
  await page
    .locator(".gd-dock")
    .getByRole("button", { name: "Open Terminal", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Terminal command", exact: true })
    .fill("ls");
  await page
    .getByRole("textbox", { name: "Terminal command", exact: true })
    .press("Enter");
  await expect(page.locator("[data-terminal-output]")).toContainText(
    "progress.md",
  );
  const handle = page.locator(
    '[data-app-window="terminal"] [data-drag-window]',
  );
  const before = await handle.boundingBox();
  await page.mouse.move(before.x + 50, before.y + 12);
  await page.mouse.down();
  await page.mouse.move(before.x + 90, before.y - 8);
  await page.mouse.up();
  const after = await handle.boundingBox();
  expect(after.x).toBeGreaterThan(before.x + 20);
  await page
    .getByRole("button", {
      name: "Close Terminal — launch-studio",
      exact: true,
    })
    .click();
  await expect(page.locator('[data-app-window="terminal"]')).toBeHidden();
  await page
    .getByRole("button", { name: "Pause computer", exact: true })
    .click();
  await expect(page.locator("[data-computer-state]")).toHaveText("Sleeping");
  await expect(page.locator(".gd-sleep-overlay")).toBeVisible();
  await page
    .getByRole("button", { name: "Resume computer", exact: true })
    .click();
  await expect(page.locator("[data-computer-state]")).toHaveText("Working");
  await expect(page.locator(".gd-sleep-overlay")).toBeHidden();
  await page
    .getByRole("navigation", { name: "Cloud Computers", exact: true })
    .getByRole("link", { name: "Compare", exact: true })
    .click();
  await expect(page).toHaveURL(/#comparison$/);
  await expect(page.locator("#comparison table")).toContainText("Shardflux");
  await expect(page.locator("#comparison table")).toContainText("Planned");
  await page
    .getByRole("navigation", { name: "Cloud Computers", exact: true })
    .getByRole("link", { name: "Market", exact: true })
    .click();
  await expect(page).toHaveURL(/#market$/);
  await expect(page.locator(".cc-market-companies")).toContainText(
    "1,000+ teams",
  );
  await expect(page.locator(".cc-market-companies")).toContainText(
    "Not publicly verified",
  );
  await expect(page.locator(".cc-rounds")).toContainText(
    "Total funding after Series A",
  );
  await expect(page.locator(".cc-market-size")).toContainText(
    "not an estimate of the agent-computer market",
  );
  await expect(page.locator(".cc-scenarios")).toContainText(
    "not observed market size",
  );
  await page.locator(".cc-faq summary").last().click();
  await expect(page.locator(".cc-faq details").last()).toHaveAttribute(
    "open",
    "",
  );
  await expect(page.locator(".cc-faq details").last()).toContainText(
    "proposed launch packaging",
  );
  await expect(page.locator(".cc-plan-featured a")).toHaveAttribute(
    "href",
    /^mailto:hello@benchyard.com/,
  );
  await mkdir("studio/output/cloud-computers", { recursive: true });
  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/cloud-computers/");
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${theme} ${width}`,
      ).toBe(true);
      if ([390, 1440].includes(width)) {
        await page.screenshot({
          path: `studio/output/cloud-computers/${theme}-${width}.png`,
          fullPage: true,
        });
        const audit = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          audit.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        ).toEqual([]);
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/cloud-computers/");
  await page.getByRole("button", { name: "Watch agent work" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-agent-progress]")).toContainText(
    "Demo complete",
  );
  await page
    .locator(".gd-dock")
    .getByRole("button", { name: "Open Terminal", exact: true })
    .click();
  await expect(page.locator("[data-app-window=terminal]")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Terminal command", exact: true })
    .fill("pwd");
  await page
    .getByRole("textbox", { name: "Terminal command", exact: true })
    .press("Enter");
  await expect(page.locator("[data-terminal-output]")).toContainText(
    "/workspace/project",
  );
  await page
    .locator(".gd-dock")
    .getByRole("button", { name: "Open Browser", exact: true })
    .click();
  await expect(page.locator("[data-app-window=browser]")).toBeVisible();
  await page.goto("/guides/");
  await page.locator(".footer-cloud-link").click();
  await expect(page).toHaveURL(/\/cloud-computers\/$/);
  expect(issues).toEqual([]);
});

test("Cloud Computers replaces the offers link in the Product footer across all public routes", async ({
  page,
}) => {
  const response = await page.request.get("/sitemap.xml");
  const routes = [
    ...(await response.text()).matchAll(
      /<loc>https:\/\/www.benchyard.com([^<]+)<\/loc>/g,
    ),
  ].map((m) => m[1]);
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      const entry = page.locator('.top a[href="/cloud-computers/"]');
      await expect(entry).toHaveCount(0);
      await expect(page.locator("footer .footer-cloud-link")).toHaveCount(1);
      await expect(
        page
          .getByRole("navigation", { name: "Product", exact: true })
          .locator("li")
          .last()
          .getByRole("link"),
      ).toHaveAttribute("href", "/cloud-computers/");
      await expect(page.locator('footer a[href="/#offers"]')).toHaveCount(0);
      expect(
        await page
          .locator(".top")
          .evaluate((el) => el.scrollWidth <= innerWidth + 1),
        `${route} header at ${width}`,
      ).toBe(true);
    }
  }
});
