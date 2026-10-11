import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { mark } from "../src/brand.mjs";
import { agentMark } from "../src/agents.mjs";
import content from "../content/en.mjs";

const root = new URL("../", import.meta.url);
const data = async (path) =>
  (await readFile(new URL(path, root))).toString("base64");

// The artwork of the card other sites show beside a link to the homepage.
// Drawn at 2× so the type stays sharp when the card is scaled to 1200×630.
export async function renderPosters(parentPage) {
  const context = await parentPage
    .context()
    .browser()
    .newContext({
      deviceScaleFactor: 2,
      viewport: { width: 1920, height: 1080 },
    });
  const page = await context.newPage();
  try {
    const font = await data(
      "src/fonts/bricolage-grotesque-latin-wght-normal.woff2",
    );
    const sans = await data("src/fonts/ibm-plex-sans-latin-400-normal.woff2");
    for (const theme of ["light"]) {
      const dark = theme === "dark";
      const screen = await data(`src-img/session-approval-${theme}.png`);
      await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
      @font-face {font-family: Bricolage; src: url(data:font/woff2;base64,${font})}
      @font-face {font-family: Plex; src: url(data:font/woff2;base64,${sans})}
      * {box-sizing: border-box}
      body {margin: 0; width: 1920px; height: 1080px; background: ${dark ? "#111513" : "#f2f3ef"}; color: ${dark ? "#e6eae5" : "#1a1e1b"}; font: 24px Plex}
      header {position: absolute; inset: 48px 80px auto; display: flex; align-items: center; justify-content: space-between}
      .brand {display: flex; align-items: center; gap: 14px; font: 600 32px Bricolage}
      .mark {width: 44px; height: 44px; fill: currentColor}
      .duration, .eyebrow {font-size: 18px; letter-spacing: 2px; color: ${dark ? "#79ccc5" : "#1f6b6b"}}
      .copy {position: absolute; left: 80px; top: 250px; width: 600px}
      h1 {font: 600 76px/1.08 Bricolage; letter-spacing: -2px; margin: 48px 0}
      p {font-size: 28px; color: ${dark ? "#aab6ae" : "#5e655f"}}
      .agents {display: flex; gap: 28px; margin-top: 44px}
      .agent-mark {width: 44px; height: 44px}
      .planned {margin-top: 28px; display: flex; gap: 24px; align-items: center; font-size: 20px}
      .planned span {display: inline-flex; gap: 10px; align-items: center}
      .planned .agent-mark {width: 28px; height: 28px}
      .planned small {font-size: 16px; color: ${dark ? "#aab6ae" : "#5e655f"}}
      .screen {position: absolute; width: 1070px; left: 770px; top: 210px; border: 1px solid ${dark ? "#343e36" : "#d6dad2"}; border-radius: 16px; box-shadow: 0 24px 64px #0002}
      footer {position: absolute; bottom: 42px; left: 80px; font-size: 17px; color: ${dark ? "#aab6ae" : "#5e655f"}}
    </style></head><body>
      <header><div class="brand">${mark}<span>Benchyard</span></div></header>
      <main><div class="copy"><h1>From task<br>to preview.</h1><p>Wherever you are.</p><div class="agents">${content.agents.items.map(([id]) => agentMark(id)).join("")}</div><div class="planned"><small>Planned</small>${content.agents.planned.map(([id, name]) => `<span>${agentMark(id)}${name}</span>`).join("")}</div></div>
      <img class="screen" src="data:image/png;base64,${screen}" alt="Benchyard workspace showing a status filter task, approval request and file changes."></main>
      <footer>The real interface with fictional demo data.</footer>
    </body></html>`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((image) => image.decode()));
      });
      await page.screenshot({
        path: new URL(`src-img/demo-poster-${theme}.png`, root).pathname,
      });
    }
  } finally {
    await context.close();
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const browser = await chromium.launch();
  try {
    await renderPosters(await browser.newPage());
    console.log("The social card's artwork is ready.");
  } finally {
    await browser.close();
  }
}
