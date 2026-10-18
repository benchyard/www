import { test, expect } from "@playwright/test";
import sharp from "sharp";

// Encoded pixels, not naturalWidth (the browser density-corrects that).
// The published set stops at what the capture covers, so a 1× original
// cannot fill a 3× screen; the check is that the page picked the largest
// candidate that this screen needs.
for (const colorScheme of ["light", "dark"])
  test(`software screenshots use the densest published source: ${colorScheme}`, async ({
    browser,
    baseURL,
  }) => {
    for (const width of [390, 700, 1440]) {
      const deviceScaleFactor = 3;
      const context = await browser.newContext({
        baseURL,
        viewport: { width, height: 900 },
        deviceScaleFactor,
        colorScheme,
      });
      try {
        const page = await context.newPage();
        await page.goto("/");
        await page.locator(".settings-detail").evaluate((details) => {
          details.open = true;
        });
        for (const img of await page.locator("picture img").all()) {
          // The desktop companion phone is intentionally absent on narrow screens.
          if (!(await img.isVisible())) continue;
          await img.scrollIntoViewIfNeeded();
          await expect
            .poll(() =>
              img.evaluate((image) => image.complete && image.naturalWidth > 0),
            )
            .toBe(true);
          const selected = await img.evaluate((image) => {
            const picture = image.parentElement;
            let set = image.getAttribute("srcset") || "";
            for (const source of picture.querySelectorAll("source")) {
              if (!source.media || window.matchMedia(source.media).matches) {
                set = source.getAttribute("srcset") || set;
                break;
              }
            }
            const candidates = set
              .split(",")
              .map((part) =>
                Number(part.trim().split(/\s+/)[1].replace("w", "")),
              )
              .filter((n) => n > 0);
            return {
              src: image.currentSrc,
              width: image.getBoundingClientRect().width,
              max: Math.max(...candidates),
            };
          });
          if (selected.width < 2) continue;
          const metadata = await sharp(
            "dist" + new URL(selected.src).pathname,
          ).metadata();
          const needed = Math.ceil(selected.width * deviceScaleFactor);
          expect(
            metadata.width,
            `${selected.src} at ${width}px / 3×`,
          ).toBeGreaterThanOrEqual(Math.min(needed, selected.max));
        }
      } finally {
        await context.close();
      }
    }
  });
