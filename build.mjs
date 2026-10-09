// Builds the site into dist/:
//
// - one page per language (index.html), and what is in public/ as it is:
//   these keep their names;
// - in dist/assets/, everything a page loads that can change: the stylesheet
//   (minified), the fonts, and the pictures made from the originals in
//   src-img/ (src/pictures.mjs). Each is published under a name that carries
//   a hash of its content (styles.3f9a1c0b.css), and the pages and the
//   stylesheet refer to those names. A changed file is a new address, so a
//   host can let browsers keep assets/ for a year while a page is always
//   asked for again (dist/_headers says so to the hosts that read it).
//
// Needs `npm ci` once (the picture and stylesheet libraries).
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { transform } from "lightningcss";
import { render } from "./src/page.mjs";
import { pictures } from "./src/pictures.mjs";

// The first language is served at /, the others at /<code>/.
const languages = ["en"];

const here = (p) => new URL(p, import.meta.url);
const out = here("./dist/");
// Old assets would pile up under their old names: start from nothing.
await rm(out, { recursive: true, force: true });
await mkdir(new URL("assets/", out), { recursive: true });
await cp(here("./public/"), out, { recursive: true });

// What the pages call a file ("fonts/x.woff2") and where it is published
// ("assets/x.3f9a1c0b.woff2").
const published = new Map();
async function publish(name, bytes) {
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 8);
  const file = name.split("/").pop();
  const dot = file.lastIndexOf(".");
  const path = `assets/${file.slice(0, dot)}.${hash}${file.slice(dot)}`;
  await writeFile(new URL(path, out), bytes);
  published.set(name, path);
}
/** The published path of a file the pages name; a name nothing published is a mistake in the template. */
const asset = (name) => {
  const path = published.get(name);
  if (!path) throw new Error(`the page asks for ${name}, which the build doesn't publish`);
  return path;
};

for (const name of (await readdir(here("./src/fonts/"))).filter((n) => n.endsWith(".woff2")).sort()) {
  await publish(`fonts/${name}`, await readFile(here(`./src/fonts/${name}`)));
}
for (const { path, bytes } of await pictures()) {
  // The social card keeps its name: other sites keep its address.
  if (path.startsWith("img/")) await publish(path, bytes);
  else await writeFile(new URL(path, out), bytes);
}
// The stylesheet names its fonts as the pages do; in assets/ they are beside
// it. Then it is minified, and named by what it has become.
const css = (await readFile(here("./src/styles.css"), "utf8")).replace(/url\("([^"]+)"\)/g, (_, name) => `url("${asset(name).slice("assets/".length)}")`);
await publish("styles.css", transform({ filename: "styles.css", code: Buffer.from(css), minify: true }).code);

const alternates = languages.length > 1 ? languages.map((code, i) => ({ code, href: i === 0 ? "/" : `/${code}/` })) : [];
const pages = [];
for (const [i, code] of languages.entries()) {
  const t = (await import(`./content/${code}.mjs`)).default;
  const dir = i === 0 ? out : new URL(`${code}/`, out);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL("index.html", dir), render(t, { base: i === 0 ? "" : "../", languages: alternates, asset }));
  pages.push(i === 0 ? "/" : `/${code}/`);
}

// For the hosts that read a _headers file (Cloudflare Pages, Netlify); the
// others ignore it and are set by hand (README, "Caching"). No rule covers
// two of these paths, so no header is given twice.
const never = "  Cache-Control: no-cache\n";
await writeFile(
  new URL("_headers", out),
  pages.map((p) => `${p}\n${never}${p}index.html\n${never}`).join("") + "/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n",
);
console.log(`built dist/ (${languages.join(", ")}): ${published.size} assets`);
