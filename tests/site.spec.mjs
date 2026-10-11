import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { policies } from "../content/legal.mjs";
const routes = [
  "/",
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
        const video = page.locator("video");
        if (route === "/")
          await expect(video).toHaveAttribute("preload", "none");
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
test("navigation, keyboard, captions and native video controls", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
  await page.keyboard.press("Enter");
  const menu = page.locator(".mobile-nav");
  await menu.locator("summary").click();
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
  const video = page.locator("video");
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("playsinline", "");
  await video.evaluate(async (v) => {
    v.muted = true;
    await v.play();
  });
  await expect
    .poll(() => video.evaluate((v) => v.currentTime))
    .toBeGreaterThan(0.1);
  await video.evaluate((v) => v.pause());
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
  await video.evaluate((v) => (v.currentTime = 29));
  await expect
    .poll(() => video.evaluate((v) => v.currentTime))
    .toBeGreaterThan(28);
  expect(await video.evaluate((v) => v.duration)).toBeCloseTo(60, 0);
  // Safari respects the OS subtitle preference; explicitly select the native track.
  await video.evaluate((v) => {
    v.textTracks[0].mode = "showing";
  });
  await expect
    .poll(() => video.evaluate((v) => v.textTracks[0]?.cues?.length || 0))
    .toBe(8);
  await video.screenshot({
    path: `studio/output/video-phone-${browserName}.png`,
  });
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
  await expect(page.locator("video")).toHaveAttribute("controls", "");
  await expect(page.locator("script")).toHaveCount(0);
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
test("media byte ranges, MIME and cache headers", async ({ request }) => {
  const html = await (await request.get("/")).text();
  const movie = /<source src="([^"]+)" type="video\/mp4"/.exec(html)[1];
  const partial = await request.get(movie, {
    headers: { Range: "bytes=0-99" },
  });
  expect(partial.status()).toBe(206);
  expect((await partial.body()).length).toBe(100);
  expect(partial.headers()["content-type"]).toBe("video/mp4");
  expect(partial.headers()["content-range"]).toMatch(/^bytes 0-99\/\d+$/);
  expect(partial.headers()["cache-control"]).toContain("immutable");
  const suffix = await request.get(movie, { headers: { Range: "bytes=-100" } });
  expect(suffix.status()).toBe(206);
  expect((await suffix.body()).length).toBe(100);
  expect(
    (
      await request.get(movie, { headers: { Range: "bytes=999999999-" } })
    ).status(),
  ).toBe(416);
  expect(
    (await request.get(movie, { headers: { Range: "bytes=-0" } })).status(),
  ).toBe(416);
  const head = await request.head(movie);
  expect(head.status()).toBe(200);
  expect((await head.body()).length).toBe(0);
  expect(Number(head.headers()["content-length"])).toBeGreaterThan(100);
  const track = /<track[^>]*src="([^"]+)"/.exec(html)[1];
  expect((await request.get(track)).headers()["content-type"]).toContain(
    "text/vtt",
  );
  for (const path of [
    ...routes,
    ...policies.map((policy) => `/legal/${policy.slug}/`),
  ])
    expect((await request.get(path)).headers()["cache-control"]).toBe(
      "no-cache",
    );
  expect((await request.get("/does-not-exist/")).status()).toBe(404);
});
test("a business can contact Benchyard from the homepage", async ({
  page,
}) => {
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
