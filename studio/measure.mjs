// Local lab measurements, never field/Core Web Vitals claims.
import { chromium } from "@playwright/test";
import { stat, mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const results = [];
for (const device of [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 },
])
  for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({
      viewport: device,
      colorScheme: "light",
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 93750,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      window.metrics = { lcp: 0, cls: 0 };
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.metrics.lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries())
          if (!e.hadRecentInput) window.metrics.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(process.env.WWW_TEST_URL || "http://localhost:4322/");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const first = await page.evaluate(() => ({
      ...window.metrics,
      resources: performance
        .getEntriesByType("resource")
        .map((r) => new URL(r.name).pathname),
      videoFetched: performance
        .getEntriesByType("resource")
        .some((r) => r.name.endsWith(".mp4")),
    }));
    const bytes = await Promise.all(
      [...new Set(first.resources)].map((p) =>
        stat("dist" + p).then(
          (s) => s.size,
          () => 0,
        ),
      ),
    );
    // Load all image sections, including the optional settings screenshot.
    await page.locator(".settings-detail").evaluate((d) => (d.open = true));
    for (
      let y = 0;
      y < (await page.evaluate(() => document.body.scrollHeight));
      y += 700
    ) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(300);
    const selected = await page
      .locator("img")
      .evaluateAll((imgs) => imgs.map((i) => i.currentSrc).filter(Boolean));
    selected.push(await page.locator("video").evaluate((v) => v.poster));
    const sizes = await Promise.all(
      [...new Set(selected)].map((u) =>
        stat("dist" + new URL(u).pathname).then(
          (s) => s.size,
          () => 0,
        ),
      ),
    );
    results.push({
      device: device.name,
      run,
      lcpMs: Math.round(first.lcp),
      cls: Number(first.cls.toFixed(4)),
      initialUncompressedResourceBytes: bytes.reduce((a, b) => a + b, 0),
      selectedPageImageBytes: sizes.reduce((a, b) => a + b, 0),
      videoFetchedBeforePlay: first.videoFetched,
    });
    await context.close();
    console.log(results.at(-1));
  }
await browser.close();
await mkdir("docs/validation", { recursive: true });
await writeFile(
  "docs/validation/performance.json",
  JSON.stringify(
    {
      method:
        "Local Chromium, cold browser context, 150ms network latency, 1.6Mbps download, 4x CPU throttle; uncompressed asset sizes; light theme. Lab data, not field p75 or INP.",
      results,
    },
    null,
    2,
  ),
);
if (
  results.some(
    (r) =>
      r.initialUncompressedResourceBytes > 1000000 ||
      r.selectedPageImageBytes > 3000000 ||
      r.videoFetchedBeforePlay,
  )
)
  process.exitCode = 1;
