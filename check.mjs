// Checks the built pages without a browser: every link inside the page
// leads to something that is there (or is the console, or a mail to the
// contact address), every picture is WebP and has its file, its size and a
// text, the social card is there under its fixed name, everything a page
// loads that can change (stylesheet, fonts, pictures) is in assets/ under a
// name whose hash is its content's, no file in dist/ is left over,
// headings don't skip a level, ids are unique, nothing is loaded from another
// site, and the page names no repository and doesn't call the product open
// source. Run after `npm run build`.
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { consoleAddress, contactAddress, site } from "./src/page.mjs";

const root = fileURLToPath(new URL("./dist/", import.meta.url));
const problems = [];
const pages = [];
for (const name of await readdir(root, { recursive: true })) if (name.endsWith("index.html")) pages.push(name);

const exists = async (p) => stat(p).then(() => true, () => false);
// Files that keep their names from one build to the next: pages, what other
// sites and browsers ask for by name, and what public/ holds for people.
const fixed = new Set(["robots.txt", "sitemap.xml", "_headers", "favicon.ico", "favicon.svg", "favicon-96x96.png", "apple-touch-icon.png", "icon-512.png", "social-card.png", "fonts/LICENSES.md"]);
// Every file some page or the stylesheet loads, as a path under dist/.
const loaded = new Set();
const hashedName = /^assets\/[^/]+\.([0-9a-f]{8})\.[a-z0-9]+$/;
// A file that can change must be in assets/ under its content's hash.
async function changing(path, say) {
  const m = hashedName.exec(path);
  if (!m) return say(`${path} can change and has no hash of its content in its name`);
  if (!(await exists(join(root, path)))) return; // said elsewhere
  const is = createHash("sha256").update(await readFile(join(root, path))).digest("hex").slice(0, 8);
  if (is !== m[1]) say(`${path} is named for content it no longer has (its hash is ${is})`);
}
for (const page of pages) {
  const html = await readFile(join(root, page), "utf8");
  const dir = join(root, page, "..");
  const say = (m) => problems.push(`${page}: ${m}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) if (ids.filter((x) => x === id).length > 1) say(`id "${id}" is used more than once`);
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    if (href.startsWith("#")) { if (!ids.includes(href.slice(1))) say(`link to ${href}, which is not on the page`); }
    else if (href.startsWith("mailto:")) { if (href.split("?")[0] !== `mailto:${contactAddress}`) say(`mail link "${href}" is not to ${contactAddress}`); }
    else if (href !== consoleAddress && !href.startsWith(`${site}/`)) say(`link "${href}" leads somewhere other than the page, the console or the contact address`);
  }
  for (const [tag] of html.matchAll(/<(?:img|source|link|script)\b[^>]*>/g)) {
    // The page's own address (its canonical link) loads nothing.
    if (/rel="canonical"/.test(tag) || /rel="alternate"/.test(tag)) continue;
    // Everything the tag can make the browser fetch: src, href, and each
    // candidate of a srcset.
    const loads = [];
    for (const [, attr, value] of tag.matchAll(/\s(src|href|srcset)="([^"]+)"/g)) {
      if (attr === "srcset") loads.push(...value.split(",").map((c) => c.trim().split(/\s+/)[0]));
      else loads.push(value);
    }
    for (const src of loads) {
      if (/^(https?:)?\/\//.test(src)) say(`loads ${src} from another site`);
      else if (!(await exists(join(dir, src)))) say(`${src} is missing`);
      const path = relative(root, join(dir, src));
      loaded.add(path);
      // The icons keep their names; a stylesheet, a font and a picture don't.
      if (!fixed.has(path)) await changing(path, say);
      // The pictures the page shows are WebP (the build makes them).
      if (/^<(img|source)/.test(tag) && !src.endsWith(".webp")) say(`picture ${src} is not WebP`);
    }
    if (tag.startsWith("<img")) {
      const src = loads[0];
      if (!/\salt="[^"]{20,}"/.test(tag)) say(`picture ${src} has no describing text`);
      if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) say(`picture ${src} has no size`);
      if (/\ssrcset=/.test(tag) && !/\ssizes=/.test(tag)) say(`picture ${src} has sizes to choose from and doesn't say how wide it is shown`);
    }
  }
  // The social card is a PNG under a name that never changes.
  const cardAt = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
  if (cardAt !== `${site}/social-card.png`) say(`the social card is at "${cardAt}", not ${site}/social-card.png`);
  else if (!(await exists(join(root, "social-card.png")))) say("social-card.png is missing");
  let last = 0;
  for (const [, level] of html.matchAll(/<h([1-6])\b/g)) {
    if (+level > last + 1) say(`a heading jumps from h${last} to h${level}`);
    last = +level;
  }
  if ((html.match(/<h1\b/g) || []).length !== 1) say("there must be exactly one h1");
  if (!/<html lang="[a-zA-Z-]+"/.test(html)) say("the page doesn't say its language");
  if (/<script\b/.test(html)) say("the page has a script; it is meant to have none");
  // The product's code is not public: the page links to no repository and
  // doesn't say otherwise.
  if (/github\.com/i.test(html)) say("the page contains github.com");
  if (/open[\s-]*source/i.test(html)) say('the page contains the words "open source"');
  if (/\u2026/.test(html)) say("the page has the single ellipsis character; write three dots, or none");
}
// The stylesheets' own files (fonts), which are beside them in assets/.
for (const sheet of [...loaded].filter((p) => p.endsWith(".css"))) {
  if (!(await exists(join(root, sheet)))) continue;
  const css = await readFile(join(root, sheet), "utf8");
  const say = (m) => problems.push(`${sheet}: ${m}`);
  for (const [, , src] of css.matchAll(/url\((["']?)([^"')]+)\1\)/g)) {
    if (/^(https?:)?\/\//.test(src)) { say(`loads ${src} from another site`); continue; }
    if (src.startsWith("data:")) continue;
    const path = relative(root, join(root, sheet, "..", src));
    if (!(await exists(join(root, path)))) say(`${src} is missing`);
    loaded.add(path);
    await changing(path, say);
  }
}
// Nothing is published that nothing uses: an asset no page loads is a
// leftover, and a file outside assets/ is a page or has a fixed name.
for (const name of await readdir(root, { recursive: true })) {
  const path = name.split("\\").join("/");
  if (!(await stat(join(root, path))).isFile()) continue;
  if (path.endsWith("index.html") || fixed.has(path) || loaded.has(path)) continue;
  problems.push(`${path} is in dist/ and nothing loads it`);
}
// The rules for hosts that read _headers cover the pages and assets/.
const headers = await readFile(join(root, "_headers"), "utf8").catch(() => "");
if (!/^\/assets\/\*\n {2}Cache-Control: public, max-age=31536000, immutable$/m.test(headers)) problems.push("_headers doesn't let assets/ be kept for a year");
for (const page of pages) {
  const at = `/${page}`;
  if (!headers.includes(`${at}\n  Cache-Control: no-cache\n`)) problems.push(`_headers doesn't say ${at} is asked for again each time`);
}
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log(`${pages.length} page(s) checked: nothing wrong`);
