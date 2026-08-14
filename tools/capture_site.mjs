import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const origin = process.env.SITE_ORIGIN ?? "http://127.0.0.1:4173";
const output = process.env.SCREENSHOT_DIR ?? "artifacts/site-screenshots";
const viewports = [
  ["desktop", 1440, 1000],
  ["ipad", 820, 1180],
  ["iphone", 390, 844],
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const [name, width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
    await page.close();
  }
} finally {
  await browser.close();
}
