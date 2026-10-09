// Makes the pictures the page shows from the originals in src-img/ (PNG
// screenshots of the app), as part of the build: each as WebP at its own
// size, for screens with two device pixels to one, and at half of it, and
// the social card as a PNG. Conversions are kept in .cache/ under a name
// made from the original's content and how it was converted, so a build
// converts only what is new or changed.
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const from = new URL("../src-img/", import.meta.url);
const cache = new URL("../.cache/pictures/", import.meta.url);

// The full size keeps every pixel: lossless WebP is smaller than a lossy one
// for flat screenshots, and their text stays exact. The half size is
// resampled, where a high lossy quality is the smaller and reads the same.
const full = { lossless: true, effort: 6 };
const half = { quality: 90, effort: 6, smartSubsample: true };
// The card other sites show beside a link to the page. Crawlers don't
// reliably take WebP, so it is a PNG.
export const card = { of: "session-approval-light", width: 1280, height: 800 };

async function kept(source, how, make) {
  const key = createHash("sha256").update(source).update(JSON.stringify(how)).update(sharp.versions.sharp).digest("hex").slice(0, 32);
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
  for (const name of (await readdir(from)).filter((n) => n.endsWith(".png")).sort()) {
    const source = await readFile(new URL(name, from));
    const stem = name.slice(0, -4);
    const { width } = await sharp(source).metadata();
    for (const [w, how] of [[width, full], [Math.round(width / 2), half]]) {
      const bytes = await kept(source, { webp: how, w }, () => sharp(source).resize({ width: w }).webp(how).toBuffer());
      out.push({ path: `img/${stem}-${w}.webp`, bytes });
    }
    if (stem === card.of) {
      const how = { compressionLevel: 9, palette: true, quality: 95 };
      const bytes = await kept(source, { png: how, w: card.width }, () => sharp(source).resize({ width: card.width }).png(how).toBuffer());
      out.push({ path: "social-card.png", bytes });
    }
  }
  return out;
}
