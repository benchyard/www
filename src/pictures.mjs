// Makes the pictures the page shows from the originals in src-img/ (PNG
// screenshots of the app), as part of the build. Each published width is
// one the source actually covers — a 1× capture stays at half and full, a
// denser capture also feeds 2× and 3× — and nothing is upscaled. The social
// card is a PNG. Conversions are kept in .cache/ under a name made from the
// original's content and how it was converted, so a build converts only
// what is new or changed.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const from = new URL("../src-img/", import.meta.url);
const cache = new URL("../.cache/pictures/", import.meta.url);

// A size the layout shows at 1 CSS pixel per pixel stays lossless: for flat
// screenshots that is smaller than a lossy file, and the text stays exact.
// Anything below that layout width is resampled, where a high lossy quality
// is the smaller and reads the same. Widths above the layout width stay
// lossless so a dense screen does not get a second resampling.
const full = { lossless: true, effort: 6 };
const half = { quality: 90, effort: 6, smartSubsample: true };
const candidates = {
  "hero-detail": [280, 560, 1120, 2240],
  "phone-approval": [195, 390, 780, 1170],
};
const desktopCandidates = [720, 1120, 1440, 2880, 4320];

function layoutWidth(name) {
  if (name.startsWith("hero-detail")) return 560;
  if (name.startsWith("phone-approval")) return 390;
  return 1440;
}

function pngWidth(name) {
  const bytes = readFileSync(
    new URL(`../src-img/${name}-light.png`, import.meta.url),
  );
  return bytes.readUInt32BE(16);
}

// Actual pixel widths, shared with the HTML srcsets. Never upscale a capture.
export function pictureWidths(name) {
  const wanted = candidates[name] ?? desktopCandidates;
  const width = pngWidth(name);
  const fit = wanted.filter((w) => w <= width);
  if (fit.length === 0)
    throw new Error(
      `${name}-light.png: ${width}px source is too small for ${wanted[0]}px output; recapture the UI`,
    );
  return fit;
}

function webpOptions(name, width) {
  return width >= layoutWidth(name) ? full : half;
}
// The card other sites show beside a link to the page. Crawlers don't
// reliably take WebP, so it is a PNG.
export const card = { of: "demo-poster-light", width: 1200, height: 630 };

async function kept(source, how, make) {
  const key = createHash("sha256")
    .update(source)
    .update(JSON.stringify(how))
    .update(sharp.versions.sharp)
    .digest("hex")
    .slice(0, 32);
  const at = new URL(key, cache);
  try {
    return await readFile(at);
  } catch {
    const made = await make();
    await mkdir(cache, { recursive: true });
    await writeFile(at, made);
    return made;
  }
}

/** Every picture to publish: its path under the site and its bytes. */
export async function pictures() {
  const out = [];
  for (const name of (await readdir(from))
    .filter((n) => n.endsWith(".png"))
    .sort()) {
    const source = await readFile(new URL(name, from));
    const stem = name.slice(0, -4);
    const base = stem.replace(/-(?:light|dark)$/, "");
    const { width } = await sharp(source).metadata();
    // The card's artwork is published as the card only.
    for (const w of stem === card.of ? [] : pictureWidths(base)) {
      if (w > width)
        throw new Error(
          `${name}: ${width}px source is too small for ${w}px output; recapture the UI`,
        );
      const how = webpOptions(base, w);
      const bytes = await kept(source, { webp: how, w }, () =>
        sharp(source).resize({ width: w }).webp(how).toBuffer(),
      );
      out.push({ path: `img/${stem}-${w}.webp`, bytes });
    }
    if (stem === card.of) {
      const how = { compressionLevel: 9, palette: true, quality: 95 };
      const bytes = await kept(
        source,
        { png: how, w: card.width, h: card.height },
        () =>
          sharp(source)
            .resize({ width: card.width, height: card.height, fit: "cover" })
            .png(how)
            .toBuffer(),
      );
      out.push({ path: "social-card.png", bytes });
    }
  }
  return out;
}
