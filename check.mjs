// Check the complete public route and asset graph. No browser or server needed.
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { site, consoleAddress, contactAddress } from "./src/page.mjs";
import { card } from "./src/pictures.mjs";
const root = new URL("./dist/", import.meta.url).pathname;
const names = (await readdir(root, { recursive: true })).filter(
  (x) => !x.includes(".."),
);
const pageNames = names.filter((x) => x.endsWith("index.html"));
const pages = new Map(
  await Promise.all(
    pageNames.map(async (name) => [
      "/" + name.replace(/index.html$/, ""),
      { name, html: await readFile(join(root, name), "utf8") },
    ]),
  ),
);
const errors = [],
  loaded = new Set();
const fixed = new Set([
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "favicon.ico",
  "favicon.svg",
  "favicon-96x96.png",
  "apple-touch-icon.png",
  "icon-512.png",
  "social-card.png",
  "fonts/LICENSES.md",
]);
const exists = (p) =>
  stat(join(root, p)).then(
    (s) => s.isFile(),
    () => false,
  );
const seenHash = new Set();
async function asset(path, say) {
  if (!(await exists(path))) {
    say(`missing asset ${path}`);
    return;
  }
  loaded.add(path);
  if (fixed.has(path) || seenHash.has(path)) return;
  seenHash.add(path);
  const hash = /^assets\/[^/]+\.([0-9a-f]{8})\.[a-z0-9]+$/.exec(path);
  if (!hash) return say(`asset has no content hash: ${path}`);
  if (
    createHash("sha256")
      .update(await readFile(join(root, path)))
      .digest("hex")
      .slice(0, 8) !== hash[1]
  )
    say(`incorrect hash: ${path}`);
}
const titles = new Set(),
  descriptions = new Set();
for (const [route, { name, html }] of pages) {
  const say = (m) => errors.push(`${name}: ${m}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length) say("duplicate id");
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    if (href.startsWith("mailto:")) {
      if (href.split("?")[0] !== `mailto:${contactAddress}`)
        say("unexpected mail address");
      continue;
    }
    if (href === consoleAddress) continue;
    const url = new URL(href, site + route);
    if (url.origin !== site) {
      // A legal page may cite the official instrument it names. Marketing
      // pages stay on this site, the console, and the contact address.
      if (route.startsWith("/legal/") && url.protocol === "https:") continue;
      say(`external link ${href}`);
      continue;
    }
    if (url.pathname.startsWith("/assets/")) {
      await asset(url.pathname.slice(1), say);
      continue;
    }
    const target = pages.get(url.pathname);
    if (!target) {
      say(`missing route ${href}`);
      continue;
    }
    if (
      url.hash &&
      !target.html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)
    )
      say(`missing anchor ${href}`);
  }
  for (const [tag] of html.matchAll(
    /<(?:img|source|link|script|video|track)\b[^>]*>/g,
  )) {
    if (/rel="(?:canonical|alternate)"/.test(tag)) continue;
    for (const [, attr, value] of tag.matchAll(
      /\s(src|href|srcset|poster)="([^"]+)"/g,
    )) {
      const candidates =
        attr === "srcset"
          ? value.split(",").map((x) => x.trim().split(/\s+/)[0])
          : [value];
      for (const src of candidates) {
        const u = new URL(src, site + route);
        if (u.origin !== site) {
          say(`external resource ${src}`);
          continue;
        }
        await asset(u.pathname.slice(1), say);
        if (
          (tag.startsWith("<img") ||
            tag.includes('type="image/webp"') ||
            attr === "poster") &&
          !src.endsWith(".webp")
        )
          say(`image is not WebP: ${src}`);
        if (tag.includes('type="video/mp4"') && !src.endsWith(".mp4"))
          say(`invalid video source: ${src}`);
        if (tag.startsWith("<track") && !src.endsWith(".vtt"))
          say(`invalid caption source: ${src}`);
      }
    }
    if (tag.startsWith("<img")) {
      if (!/\salt="[^"]{20,}"/.test(tag)) say("image needs descriptive alt");
      if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag))
        say("image needs dimensions");
      if (!tag.includes("srcset=") || !tag.includes("sizes="))
        say("image needs responsive sources and sizes");
    }
    if (
      tag.startsWith("<video") &&
      (!/\bcontrols\b/.test(tag) ||
        !/\bplaysinline\b/.test(tag) ||
        !tag.includes('preload="none"') ||
        /\b(?:autoplay|loop)\b/.test(tag))
    )
      say(
        "video must have controls, playsinline, preload=none, and no autoplay or loop",
      );
  }
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (canonical !== site + route) say("incorrect canonical");
  const title = /<title>(.*?)<\/title>/.exec(html)?.[1],
    description = /<meta name="description" content="([^"]+)"/.exec(html)?.[1];
  if (!title || titles.has(title)) say("missing or duplicate title");
  titles.add(title);
  if (!description || descriptions.has(description))
    say("missing or duplicate description");
  descriptions.add(description);
  if (!html.includes(`property="og:url" content="${site + route}"`))
    say("incorrect social URL");
  if (!html.includes(`property="og:image" content="${site}/social-card.png"`))
    say("incorrect social card URL");
  let last = 0;
  for (const [, level] of html.matchAll(/<h([1-6])\b/g)) {
    if (+level > last + 1) say(`heading jumps h${last} to h${level}`);
    last = +level;
  }
  if ((html.match(/<h1\b/g) || []).length !== 1) say("expected one h1");
  if (!/<html lang="en"/.test(html)) say("missing language");
  if (/<script\b/i.test(html)) say("client scripts are not allowed");
  if (/github\.com|\u2026/i.test(html)) say("forbidden public text");
  // People are not told which cloud a machine is at, and a person's own
  // machine is not offered publicly. The legal pages name their own providers.
  if (!route.startsWith("/legal/")) {
    const text = html.replace(/<[^>]+>/g, " ");
    const named =
      /Google Cloud|\bGCP\b|\bAWS\b|\bEC2\b|Amazon/.exec(text) ||
      /own (?:Linux )?machine|attach(?:es|ed)? a (?:Linux )?machine|machines (?:your )?people already/i.exec(
        text,
      );
    if (named) say(`text the site must not carry: ${named[0]}`);
  }
  // Marketing copy does not describe the product as open source. The legal
  // terms keep their own sentence about open-source component licenses.
  if (!route.startsWith("/legal/") && /open[\s-]*source/i.test(html))
    say("forbidden public text");
}
for (const path of [...loaded].filter((x) => x.endsWith(".css"))) {
  const css = await readFile(join(root, path), "utf8");
  for (const [, , src] of css.matchAll(/url\((["']?)([^"')]+)\1\)/g)) {
    if (src.startsWith("data:")) continue;
    const url = new URL(src, site + "/" + path);
    if (url.origin !== site) errors.push("external CSS resource " + src);
    else await asset(url.pathname.slice(1), (m) => errors.push(m));
  }
}
for (const name of names) {
  if (!(await exists(name))) continue;
  if (name.endsWith("index.html") || fixed.has(name) || loaded.has(name))
    continue;
  errors.push(`unused published file ${name}`);
}
const headers = await readFile(join(root, "_headers"), "utf8");
for (const [, p] of pages)
  if (!headers.includes(`/${p.name}\n  Cache-Control: no-cache\n`))
    errors.push(`missing HTML cache rule ${p.name}`);
if (
  !headers.includes(
    "/assets/*\n  Cache-Control: public, max-age=31536000, immutable",
  )
)
  errors.push("missing asset cache rule");
for (const name of fixed) {
  if (await exists(name)) {
    if (!headers.includes(`/${name}\n  Cache-Control: no-cache\n`))
      errors.push(`missing fixed-file cache rule ${name}`);
  }
}
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const listed = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (
  JSON.stringify(listed.sort()) !==
  JSON.stringify([...pages.keys()].map((p) => site + p).sort())
)
  errors.push("sitemap does not match routes");
const metadata = await sharp(join(root, "social-card.png")).metadata();
if (metadata.width !== card.width || metadata.height !== card.height)
  errors.push("social card dimensions mismatch");
if (!(await exists("robots.txt"))) errors.push("missing robots.txt");
const captions = [...loaded].find((x) => x.endsWith(".vtt"));
if (
  !captions ||
  !(await readFile(join(root, captions), "utf8")).startsWith("WEBVTT\n")
)
  errors.push("missing or invalid WebVTT captions");
const movie = [...loaded].find((x) => x.endsWith(".mp4"));
if (!movie || (await stat(join(root, movie))).size > 15 * 1024 * 1024)
  errors.push("missing video or exceeds 15MB budget");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `${pages.size} pages checked: routes, anchors, metadata, media, hashes and cache rules passed.`,
);
