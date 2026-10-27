import sharp from "sharp";
import { fileURLToPath } from "node:url";

// Crop in capture pixels, retaining the density of the original app screenshot.
export async function cropHeroDetails({ dockWidth = 560 } = {}) {
  for (const theme of ["light", "dark"]) {
    const source = new URL(
      `../src-img/session-approval-${theme}.png`,
      import.meta.url,
    );
    const file = fileURLToPath(source);
    const { width } = await sharp(file).metadata();
    const scale = width / 1440;
    await sharp(file)
      .extract({
        left: Math.round((1440 - dockWidth) * scale),
        top: 0,
        width: Math.round(dockWidth * scale),
        height: Math.round((dockWidth / 1.4) * scale),
      })
      .toFile(
        fileURLToPath(
          new URL(`../src-img/hero-detail-${theme}.png`, import.meta.url),
        ),
      );
  }
}
