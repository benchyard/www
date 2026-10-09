// Exercise full playback in each desktop engine, including native caption and fullscreen APIs.
import { chromium, firefox, webkit, expect } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
const results = [];
await Promise.all(
  [
    ["chromium", chromium],
    ["firefox", firefox],
    ["webkit", webkit],
  ].map(async ([name, engine]) => {
    const browser = await engine.launch(
      name === "firefox"
        ? { firefoxUserPrefs: { "network.proxy.type": 0 } }
        : {},
    );
    try {
      const page = await browser.newPage({
        viewport: { width: 1280, height: 900 },
      });
      await page.goto(
        process.env.WWW_TEST_URL || "http://localhost:4322/#demo",
      );
      const video = page.locator("video");
      await video.scrollIntoViewIfNeeded();
      await video.click();
      const fullscreen = await video.evaluate(async (v) => {
        try {
          await v.requestFullscreen();
          return document.fullscreenElement === v;
        } catch (e) {
          return String(e);
        }
      });
      if (fullscreen === true)
        await page.evaluate(() => document.exitFullscreen());
      await video.evaluate(async (v) => {
        v.muted = true;
        v.currentTime = 0;
        v.textTracks[0].mode = "showing";
        await v.play();
      });
      await expect
        .poll(() => video.evaluate((v) => v.currentTime), { timeout: 10000 })
        .toBeGreaterThan(0.1);
      await expect
        .poll(() => video.evaluate((v) => v.textTracks[0].cues?.length), {
          timeout: 10000,
        })
        .toBe(8);
      await expect
        .poll(() => video.evaluate((v) => v.ended), {
          timeout: 80000,
          intervals: [1000],
        })
        .toBe(true);
      const info = await video.evaluate((v) => ({
        duration: v.duration,
        ended: v.ended,
        error: v.error?.message || null,
        captionCount: v.textTracks[0].cues.length,
      }));
      results.push({ browser: name, fullscreen, ...info });
      console.log(results.at(-1));
    } finally {
      await browser.close();
    }
  }),
);
await mkdir("docs/validation", { recursive: true });
await writeFile(
  "docs/validation/media-playback.json",
  JSON.stringify(results, null, 2),
);
