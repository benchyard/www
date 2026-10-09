// Record evidence close-ups: actual test output, then the Ports-to-preview interaction.
import { chromium, expect } from "@playwright/test";
import { readFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
export async function refineEvidence(page, context, out) {
  async function clip(name, seconds, current, action) {
    const dir = `${out}/frames/${name}`;
    await mkdir(dir, { recursive: true });
    let error;
    const work = (async () => {
      await page.waitForTimeout(700);
      await action();
    })().catch((e) => (error = e));
    const start = Date.now();
    for (let i = 0; i < seconds * 10; i++) {
      await current().screenshot({
        path: `${dir}/${String(i).padStart(4, "0")}.png`,
      });
      const left = start + (i + 1) * 100 - Date.now();
      if (left > 0) await new Promise((r) => setTimeout(r, left));
    }
    await work;
    if (error) throw error;
  }
  if (!(await page.getByTestId("dock").isVisible()))
    await page.getByTestId("layout-dock").click();
  await page.getByTestId("dock-tab-changes").click();
  await page
    .getByTestId("change-row")
    .filter({ hasText: "filter.mjs" })
    .click();
  const shell = page.getByTestId("tool-card").filter({ hasText: "npm test" });
  if (!(await shell.locator("pre").last().isVisible()))
    await shell.getByRole("button").first().click();
  await expect(shell.locator("pre").last()).toContainText("pass 4");
  await shell.locator("pre").last().scrollIntoViewIfNeeded();
  await clip(
    "06-results",
    9,
    () => page,
    async () => {
      await shell
        .locator("pre")
        .last()
        .evaluate((el) => (el.scrollTop = el.scrollHeight));
      await page.waitForTimeout(2800);
      await page
        .getByTestId("change-row")
        .filter({ hasText: "filter.test.mjs" })
        .click();
    },
  );
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (t) => (document.documentElement.dataset.theme = t),
      theme,
    );
    await page.waitForTimeout(180);
    await page.screenshot({
      path: new URL(`../src-img/session-done-${theme}.png`, import.meta.url)
        .pathname,
    });
  }
  await page.evaluate(() => (document.documentElement.dataset.theme = "light"));
  await page.getByTestId("dock-tab-ports").click();
  let current = page;
  await clip(
    "07-preview",
    8,
    () => current,
    async () => {
      await page.waitForTimeout(600);
      const popup = context.waitForEvent("page");
      await page
        .locator('[data-testid="port-row"][data-port="4173"]')
        .getByTestId("port-preview")
        .click();
      const preview = await popup;
      await preview.setViewportSize({ width: 1440, height: 900 });
      await expect(
        preview.getByRole("heading", { name: "A little more shipped." }),
      ).toBeVisible();
      current = preview;
      await preview.waitForTimeout(700);
      await preview
        .getByRole("button", { name: "In progress", exact: true })
        .click();
      await expect(preview.locator("article:visible")).toHaveCount(3);
      await preview.waitForTimeout(1400);
      await preview.getByRole("button", { name: "Done", exact: true }).click();
      await expect(preview.locator("article:visible")).toHaveCount(3);
      await preview.waitForTimeout(1400);
      await preview
        .getByRole("button", { name: "All issues", exact: true })
        .click();
      await expect(preview.locator("article:visible")).toHaveCount(6);
    },
  );
  console.log(
    "Recorded test stdout and the actual Open in browser transition.",
  );
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const out = new URL("./output/", import.meta.url).pathname;
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
  });
  const page = await context.newPage();
  try {
    const { session } = JSON.parse(await readFile(out + "/session.json"));
    await page.goto(new URL("/", session).href);
    await page.getByLabel("Username").fill("alice");
    await page.getByLabel("Password").fill("demo-password");
    await page.getByLabel("Name this device").fill("MacBook");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Sign in", exact: true }),
    ).toBeHidden();
    await page.goto(session);
    await expect(page.getByTestId("tool-card").last()).toBeVisible();
    await refineEvidence(page, context, out);
  } finally {
    await browser.close();
  }
}
