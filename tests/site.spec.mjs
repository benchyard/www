import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { policies } from "../content/legal.mjs";
const routes = [
  "/",
  "/guides/",
  "/guides/getting-started/",
  "/guides/agents/",
  "/guides/workspaces/",
  "/guides/security/",
];
for (const theme of ["light", "dark"])
  test(`responsive layout and accessibility: ${theme}`, async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    const report = [];
    for (const width of [320, 360, 390, 768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        const r = await page.goto(route);
        expect(r.status()).toBe(200);
        await page.evaluate(() => document.fonts.ready);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `${route} overflows at ${width}`,
        ).toBe(true);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("script")).toHaveCount(route === "/" ? 3 : 1);
        if (width === 360 || width === 390 || width === 1280) {
          if (route === "/") {
            await mkdir(
              browserName === "chromium"
                ? "docs/screenshots"
                : "studio/output/validation",
              { recursive: true },
            );
            await page.screenshot({
              path:
                browserName === "chromium"
                  ? `docs/screenshots/home-${width}-${theme}.png`
                  : `studio/output/validation/home-${width}-${theme}-${browserName}.png`,
              fullPage: true,
            });
          }
          const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          expect(
            results.violations.map((x) => ({
              id: x.id,
              nodes: x.nodes.map((n) => n.target),
            })),
          ).toEqual([]);
        }
      }
      report.push({ width, routes: routes.length, overflow: false });
    }
    await mkdir("docs/validation", { recursive: true });
    await writeFile(
      `docs/validation/layout-${browserName}-${theme}.json`,
      JSON.stringify(report, null, 2),
    );
  });
test("navigation and keyboard", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
  await page.keyboard.press("Enter");
  const menu = page.locator(".mobile-nav");
  await menu.locator(":scope > summary").click();
  await expect(
    menu.getByRole("link", { name: "Workspace", exact: true }),
  ).toBeVisible();
  await menu.getByRole("link", { name: "Workspace", exact: true }).click();
  await expect(page).toHaveURL(/#workspace$/);
  await page.goto("/#faq");
  await page.locator(".faq summary").first().click();
  await expect(page.locator(".faq details").first()).toHaveAttribute(
    "open",
    "",
  );
});
for (const [name, width, where] of [
  ["a desktop", 1440, "phone"],
  ["a phone", 390, "desktop"],
])
  test(`the replay waits for approval, then opens its parts: ${name}`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#demo");
    const replay = page.locator("[data-replay]");
    const status = replay.getByRole("status");
    await expect(status).toContainText("Press Play");
    await expect(replay.locator(".rp-log > :visible")).toHaveCount(0);
    await expect(replay.getByRole("tab", { name: "Files" })).toBeDisabled();
    await replay.getByRole("button", { name: "Play the task" }).click();
    // It stops at the request and goes no further by itself.
    await expect(status).toContainText("Waiting for you", { timeout: 20000 });
    await page.waitForTimeout(1500);
    await expect(replay.locator("[data-output]")).toBeHidden();
    await expect(replay.locator("[data-phone]")).toBeVisible({
      visible: width > 760,
    });
    // Denied: the command is not run, and it can be asked for again.
    await replay.locator('[data-deny="desktop"]').click();
    await expect(status).toContainText("was not run");
    await expect(replay.getByText("Denied from MacBook")).toBeVisible();
    await expect(replay.locator("[data-output]")).toBeHidden();
    await replay.getByRole("button", { name: "Ask again" }).click();
    await replay.locator(`[data-approve="${where}"]`).click();
    await expect(status).toContainText("has finished", { timeout: 20000 });
    await expect(
      replay.getByText(
        `Approved from ${where === "phone" ? "iPhone" : "MacBook"}`,
      ),
    ).toBeVisible();
    await expect(replay.locator("[data-output]")).toContainText("# pass 4");
    // Changes: each file opens its own diff.
    if (width <= 760)
      await replay.getByRole("tab", { name: /Changes/ }).click();
    await replay.getByRole("button", { name: /filter\.test\.mjs/ }).click();
    await expect(
      replay.getByRole("region", { name: "Changes to filter.test.mjs" }),
    ).toContainText("empty board stays empty");
    await replay.getByRole("tab", { name: "Files" }).click();
    await replay.getByRole("button", { name: "package.json" }).click();
    await expect(replay.getByLabel("package.json")).toContainText(
      "issue-board",
    );
    await replay.getByRole("tab", { name: "Terminal" }).click();
    await expect(replay.getByLabel("Recorded terminal output")).toContainText(
      "# fail 0",
    );
    // Ports: the board of the recorded run, whose filters really filter.
    await replay.getByRole("tab", { name: "Ports" }).click();
    await replay.getByRole("button", { name: "Open in browser" }).click();
    const board = replay.frameLocator("iframe");
    for (const [filter, count] of [
      ["In progress", 3],
      ["Done", 3],
      ["All issues", 6],
    ]) {
      await board.getByRole("button", { name: filter, exact: true }).click();
      await expect(board.locator("article:visible")).toHaveCount(count);
    }
    await replay.getByRole("button", { name: "Close the preview" }).click();
    await expect(replay.locator("[data-browser]")).toBeHidden();
    await replay.getByRole("button", { name: "Replay" }).click();
    await expect(status).toContainText("working");
    expect(errors).toEqual([]);
  });
test("the replay by keyboard, and with reduced motion", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "Tab reaches buttons only by an OS setting",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/#demo");
  const replay = page.locator("[data-replay]");
  await replay.getByRole("button", { name: "Play", exact: true }).focus();
  await page.keyboard.press("Enter");
  // With reduced motion nothing is drawn out: it is at the request at once,
  // and whoever started it from the controls is taken to the decision.
  await expect(replay.locator('[data-approve="desktop"]')).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(replay.getByRole("status")).toContainText("has finished");
  await replay.getByRole("tab", { name: /Changes/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(replay.getByRole("tab", { name: "Files" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
test("works without scripts and reflows at 200% text size", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 640, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(baseURL + "/");
  await page.locator(".mobile-nav summary").click();
  await expect(page.locator(".mobile-nav[open]")).toBeVisible();
  // Without scripts the replay is the finished session, there to be read.
  const replay = page.locator("[data-replay]");
  await expect(replay.getByText("Four filter tests passed")).toBeVisible();
  await expect(replay.locator("[data-output]")).toContainText("# pass 4");
  await expect(
    replay.getByRole("region", { name: "Changes to filter.mjs" }),
  ).toBeVisible();
  await expect(replay.locator("[data-controls]")).toBeHidden();
  await context.close();
  const normal = await browser.newPage({
    viewport: { width: 640, height: 900 },
  });
  await normal.goto(baseURL + "/");
  await normal.addStyleTag({
    content: "html {font-size:200%} body {font-size:200%}",
  });
  expect(
    await normal.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await normal.close();
});
test("the script, the board and cache headers", async ({ request }) => {
  const html = await (await request.get("/")).text();
  const script = /<script defer src="([^"]+)"/.exec(html)[1];
  const mark = /<script src="([^"]+)"/.exec(html)[1];
  const board = /data-board="([^"]+)"/.exec(html)[1];
  for (const [path, type] of [
    [script, "javascript"],
    [mark, "javascript"],
    [board, "text/html"],
  ]) {
    const got = await request.get(path);
    expect(got.status(), path).toBe(200);
    expect(got.headers()["content-type"]).toContain(type);
    expect(got.headers()["cache-control"]).toContain("immutable");
  }
  for (const path of [
    ...routes,
    ...policies.map((policy) => `/legal/${policy.slug}/`),
  ])
    expect((await request.get(path)).headers()["cache-control"]).toBe(
      "no-cache",
    );
  expect((await request.get("/does-not-exist/")).status()).toBe(404);
});
test("a business can contact Benchyard from the homepage", async ({ page }) => {
  for (const width of [1120, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `homepage overflows at ${width}`,
    ).toBe(true);
  }
  await page.goto("/#business");
  const contact = page.getByRole("link", { name: "Contact us", exact: true });
  await expect(contact).toBeVisible();
  const href = await contact.getAttribute("href");
  expect(href.startsWith("mailto:hello@benchyard.com?")).toBe(true);
  expect(decodeURIComponent(href)).toContain("your own infrastructure");
  await page.getByRole("link", { name: "contact us", exact: true }).click();
  await expect(page).toHaveURL(/#business$/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".mobile-nav summary").click();
  await expect(
    page
      .locator(".mobile-nav")
      .getByRole("link", { name: "For Business", exact: true }),
  ).toBeVisible();
});
test("legal policies fit the page and can be opened from the footer", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const policy of policies) {
      const route = `/legal/${policy.slug}/`;
      expect((await page.goto(route)).status(), route).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route} overflows at ${width}`,
      ).toBe(true);
      await expect(page.locator("h1")).toHaveCount(1);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("link", { name: "Terms of Service" }).click();
  await expect(page).toHaveURL(/\/legal\/terms\/$/);
  await expect(page.locator("h1")).toHaveText("Benchyard Terms of Service");
  await expect(
    page.getByRole("link", { name: "Privacy Policy" }).first(),
  ).toHaveAttribute("href", "/legal/privacy/");
  for (const route of ["/legal/terms/", "/legal/cookies/", "/legal/dpa/"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((x) => ({
        id: x.id,
        nodes: x.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([]);
  }
  await expect(
    page.getByRole("link", { name: "European Commission SCC resources" }),
  ).toHaveAttribute("href", /^https:\/\/commission\.europa\.eu\//);
});
