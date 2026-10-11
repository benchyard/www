import { chromium, expect } from "@playwright/test";
import { installAgentBranding } from "./agent-branding.mjs";
import { mkdir, writeFile } from "node:fs/promises";
const baseURL = process.env.DEMO_URL || "http://localhost:18080";
const out = new URL("./output/", import.meta.url).pathname;
const images = new URL("../src-img/", import.meta.url).pathname;
await mkdir(images, { recursive: true });
const browser = await chromium.launch({ headless: true });
const desktop = await browser.newContext({
  baseURL,
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "light",
});
const mobile = await browser.newContext({
  baseURL,
  viewport: { width: 390, height: 740 },
  deviceScaleFactor: 1,
  colorScheme: "light",
  isMobile: true,
  hasTouch: true,
});
await installAgentBranding(desktop);
await installAgentBranding(mobile);
const page = await desktop.newPage();
const phone = await mobile.newPage();
page.setDefaultTimeout(30000);
phone.setDefaultTimeout(30000);
async function login(p, device) {
  await p.goto("/");
  await p.getByLabel("Username").fill("alice");
  await p.getByLabel("Password").fill("demo-password");
  await p.getByLabel("Name this device").fill(device);
  await p.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    p.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeHidden();
  await p.goto("/workspaces");
  await expect(p.getByTestId("new-ws")).toBeVisible();
  await p.request.patch("/api/prefs", { data: { push_prompt: "later" } });
}
async function choose(p, id, val) {
  await p.getByTestId(id).click();
  await p.getByTestId(`${id}-option-${val}`).click();
}
async function themed(p, name) {
  for (const theme of ["light", "dark"]) {
    await p.evaluate(
      (t) => (document.documentElement.dataset.theme = t),
      theme,
    );
    await p.waitForTimeout(200);
    await p.screenshot({ path: `${images}/${name}-${theme}.png` });
  }
  await p.evaluate(() => (document.documentElement.dataset.theme = "light"));
}
const scenes = [];
async function record(p, name, seconds, action = async () => {}) {
  console.log("Recording", name);
  const folder = `${out}/frames/${name}`;
  await mkdir(folder, { recursive: true });
  let failure;
  const pending = (async () => {
    await p.waitForTimeout(600);
    await action();
  })().catch((e) => (failure = e));
  const start = Date.now();
  for (let i = 0; i < seconds * 10; i++) {
    await p.screenshot({ path: `${folder}/${String(i).padStart(4, "0")}.png` });
    const wait = start + (i + 1) * 100 - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  }
  await pending;
  if (failure) throw failure;
  scenes.push({ name, seconds, ...p.viewportSize() });
  await writeFile(`${out}/scenes.json`, JSON.stringify(scenes, null, 2));
}
try {
  await login(page, "MacBook");
  await login(phone, "iPhone");
  await page.getByTestId("new-ws").click();
  await page.getByTestId("ws-name").fill("issue-board");
  await page.getByTestId("create-ws").click();
  const card = page.getByTestId("ws-card").filter({ hasText: "issue-board" });
  await expect(card.getByText("Running", { exact: true })).toBeVisible({
    timeout: 90000,
  });
  const wsURL = await card
    .getByRole("link", { name: "issue-board", exact: true })
    .getAttribute("href");
  // Seed distinct sessions; no claim that the agents collaborate on this task.
  for (const [agent, prompt, title] of [
    ["claude", "Review the API error handling.", "Review API error handling"],
    ["cursor", "Check keyboard navigation.", "Check keyboard navigation"],
    ["gemini", "Outline the onboarding guide.", "Outline the onboarding guide"],
  ]) {
    await page.goto(wsURL);
    await choose(page, "agent-select", agent);
    await page.getByTestId("new-prompt").fill(prompt);
    await page.getByTestId("create-session").click();
    await expect(page.getByTestId("msg-assistant").last()).toBeVisible();
    await page.getByTestId("session-title-rename").click();
    await page.getByTestId("session-title-input").fill(title);
    await page.getByTestId("session-title-input").press("Enter");
  }
  await page.goto(wsURL);
  await choose(page, "agent-select", "codex");
  await choose(page, "mode-select", "ask");
  await page
    .getByTestId("new-prompt")
    .fill("Add a status filter to the issue board and test it.");
  await record(page, "01-start", 5);
  await record(page, "02-task", 8, async () => {
    await page.getByTestId("create-session").click();
    await expect(page.getByTestId("approve")).toBeVisible();
    await page.getByTestId("open-diff").first().click();
  });
  const session = page.url();
  await page.getByTestId("session-title-rename").click();
  await page.getByTestId("session-title-input").fill("Add a status filter");
  await page.getByTestId("session-title-input").press("Enter");
  await expect(page.getByTestId("diff-view")).toBeVisible();
  await themed(page, "session-approval");
  await record(page, "03-diff", 8, async () => {
    await page
      .getByTestId("change-row")
      .filter({ hasText: "filter.test.mjs" })
      .click();
  });
  await phone.goto(session);
  await expect(phone.getByTestId("approve")).toBeVisible();
  await themed(phone, "phone-approval");
  // The lock-screen is explicitly a simulated device surface, not a native push recording.
  const shell = await browser.newPage({
    viewport: { width: 390, height: 740 },
  });
  const notification = await import("./surfaces.mjs");
  await shell.setContent(notification.lockScreen());
  await record(shell, "04-notification", 7);
  await shell.close();
  await record(phone, "05-approve", 10, async () => {
    await phone.waitForTimeout(2500);
    await phone.getByTestId("approve").click();
    await expect(
      phone.getByText("Four filter tests passed", { exact: false }),
    ).toBeVisible();
  });
  await expect(
    page.getByText("Four filter tests passed", { exact: false }),
  ).toBeVisible();
  await themed(page, "session-done");
  await record(page, "06-results", 9, async () => {
    await page
      .getByTestId("change-row")
      .filter({ hasText: "filter.mjs" })
      .click();
  });
  await page.getByTestId("dock-tab-ports").click();
  const open = page
    .locator('[data-testid="port-row"][data-port="4173"]')
    .getByTestId("port-preview");
  await expect(open).toBeVisible();
  await themed(page, "ports");
  const popup = desktop.waitForEvent("page");
  await open.click();
  const preview = await popup;
  await expect(
    preview.getByRole("heading", { name: "A little more shipped." }),
  ).toBeVisible();
  await preview.setViewportSize({ width: 1440, height: 900 });
  await themed(preview, "preview");
  await record(preview, "07-preview", 8, async () => {
    await preview
      .getByRole("button", { name: "In progress", exact: true })
      .click();
    await expect(preview.locator("article:visible")).toHaveCount(3);
    await preview.waitForTimeout(2300);
    await preview.getByRole("button", { name: "Done", exact: true }).click();
    await expect(preview.locator("article:visible")).toHaveCount(3);
    await preview.waitForTimeout(1700);
    await preview
      .getByRole("button", { name: "All issues", exact: true })
      .click();
  });
  const end = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await end.setContent(notification.endCard());
  await record(end, "08-end", 5);
  await end.close();
  const { refineEvidence } = await import("./refine-capture.mjs");
  await refineEvidence(page, desktop, out);
  await page.goto("/workspaces");
  await expect(page.getByTestId("ws-card")).toBeVisible();
  await themed(page, "workspaces");
  await page.goto("/settings/security");
  await page.getByRole("heading", { name: "Password", exact: true }).waitFor();
  await themed(page, "security");
  await writeFile(`${out}/session.json`, JSON.stringify({ session, wsURL }));
  console.log(
    "Captured real UI, tested filter behavior, and recorded 60 seconds.",
  );
} catch (e) {
  await page.screenshot({ path: `${out}/capture-error.png` });
  await writeFile(
    `${out}/capture-error.txt`,
    await page.locator("body").innerText(),
  );
  throw e;
} finally {
  await browser.close();
}
