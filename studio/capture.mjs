// Runs the fictional task in the real application and takes from it what the
// site shows: the screenshots in src-img/ and the replay's data in
// content/demo.json. Needs the demo container of start.sh.
import { chromium, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
const baseURL = process.env.DEMO_URL || "http://localhost:18080";
const container = process.env.DEMO_CONTAINER || "benchyard-www-demo";
const out = new URL("./output/", import.meta.url).pathname;
const images = new URL("../src-img/", import.meta.url).pathname;
const reference = `${out}/reference`;
await mkdir(images, { recursive: true });
await mkdir(reference, { recursive: true });
const browser = await chromium.launch({ headless: true });
const desktop = await browser.newContext({
  baseURL,
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "light",
  // The Devices list says what each fictional device is.
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
});
const mobile = await browser.newContext({
  baseURL,
  viewport: { width: 390, height: 740 },
  deviceScaleFactor: 1,
  colorScheme: "light",
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
});
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
  await p.request.patch("/api/prefs", { data: { push_prompt: "off" } });
}
async function choose(p, id, val) {
  await p.getByTestId(id).click();
  await p.getByTestId(`${id}-option-${val}`).click();
}
async function themed(p, name, folder = images) {
  for (const theme of ["light", "dark"]) {
    await p.evaluate(
      (t) => (document.documentElement.dataset.theme = t),
      theme,
    );
    await p.waitForTimeout(200);
    await p.screenshot({ path: `${folder}/${name}-${theme}.png` });
  }
  await p.evaluate(() => (document.documentElement.dataset.theme = "light"));
}
// A picture that only helps to draw the replay: a failure to take it does not
// fail the capture.
async function look(name, action, p = page) {
  try {
    await action();
    await p.waitForTimeout(400);
    await themed(p, name, reference);
  } catch (e) {
    console.warn(`No reference picture ${name}: ${e.message.split("\n")[0]}`);
  }
}
const inContainer = (script) =>
  execFileSync("docker", ["exec", container, "sh", "-c", script], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
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
  const prompt = "Add a status filter to the issue board and test it.";
  await page.goto(wsURL);
  await choose(page, "agent-select", "codex");
  await choose(page, "mode-select", "ask");
  await page.getByTestId("new-prompt").fill(prompt);
  await themed(page, "new-session", reference);
  await page.getByTestId("create-session").click();
  await expect(page.getByTestId("approve")).toBeVisible();
  await page.getByTestId("open-diff").first().click();
  const session = page.url();
  await page.getByTestId("session-title-rename").click();
  await page.getByTestId("session-title-input").fill("Add a status filter");
  await page.getByTestId("session-title-input").press("Enter");
  await expect(page.getByTestId("diff-view")).toBeVisible();
  await themed(page, "session-approval");
  await phone.goto(session);
  await expect(phone.getByTestId("approve")).toBeVisible();
  await themed(phone, "phone-approval");
  // The approval is given on the phone; the desktop sees its result.
  await phone.getByTestId("approve").click();
  await expect(
    phone.getByText("Four filter tests passed", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("Four filter tests passed", { exact: false }),
  ).toBeVisible();
  await themed(phone, "phone-done", reference);
  const replies = await page.getByTestId("msg-assistant").allInnerTexts();
  const shell = page.getByTestId("tool-card").filter({ hasText: "npm test" });
  if (!(await shell.locator("pre").last().isVisible()))
    await shell.getByRole("button").first().click();
  await expect(shell.locator("pre").last()).toContainText("pass 4");
  const testOutput = await shell.locator("pre").last().innerText();
  await shell
    .locator("pre")
    .last()
    .evaluate((el) => (el.scrollTop = el.scrollHeight));
  await page
    .getByTestId("change-row")
    .filter({ hasText: "filter.test.mjs" })
    .click();
  await themed(page, "session-done");
  await look("files", () => page.getByTestId("dock-tab-files").click());
  await look("terminal", () => page.getByTestId("dock-tab-terminal").click());
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
  // The filters are tried for real: three in progress, three done, six in all.
  for (const [name, count] of [
    ["In progress", 3],
    ["Done", 3],
    ["All issues", 6],
  ]) {
    await preview.getByRole("button", { name, exact: true }).click();
    await expect(preview.locator("article:visible")).toHaveCount(count);
  }
  await preview.close();
  await page.goto("/workspaces");
  await expect(page.getByTestId("ws-card")).toBeVisible();
  await themed(page, "workspaces");
  await page.goto("/settings/security");
  await page.getByRole("heading", { name: "Password", exact: true }).waitFor();
  await themed(page, "security");
  // The small-screen hero picture is a piece of the real desktop diff.
  for (const theme of ["light", "dark"])
    await sharp(`${images}/session-approval-${theme}.png`)
      .extract({ left: 880, top: 0, width: 560, height: 400 })
      .png()
      .toFile(`${images}/hero-detail-${theme}.png`);

  // What the replay on the site shows comes from this run, not from a copy
  // written by hand.
  const project = inContainer("ls -d /data/workspaces/*/project").trim();
  const names = ["filter.mjs", "filter.test.mjs", "index.html"];
  const source = JSON.parse(await readFile(`${out}/source.json`, "utf8"));
  const demo = {
    source: { commit: source.commit, recorded: source.recorded },
    prompt,
    replies,
    project,
    changes: names.map((name) => {
      const [added, removed] = inContainer(
        `git -C ${project} diff --numstat -- ${name}`,
      ).split(/\s+/);
      return {
        name,
        added: +added,
        removed: +removed,
        diff: inContainer(`git -C ${project} diff -- ${name}`),
      };
    }),
    files: Object.fromEntries(
      inContainer(`git -C ${project} ls-files`)
        .trim()
        .split("\n")
        .map((name) => [name, inContainer(`cat ${project}/${name}`)]),
    ),
    test: {
      command: "npm test",
      reason: "Run the issue-board filter tests",
      output: testOutput,
    },
    port: 4173,
  };
  await writeFile(
    new URL("../content/demo.json", import.meta.url),
    JSON.stringify(demo, null, 2) + "\n",
  );
  await writeFile(`${out}/session.json`, JSON.stringify({ session, wsURL }));
  console.log(
    "Captured the real UI, tried the filters, and wrote content/demo.json.",
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
