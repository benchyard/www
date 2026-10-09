// Checks the built pages without a browser: every link inside the page
// leads to something that is there, every picture has its file, its size
// and a text, headings don't skip a level, ids are unique, and nothing is
// loaded from another site. Run after `npm run build`.
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./dist/", import.meta.url));
const problems = [];
const pages = [];
for (const name of await readdir(root, { recursive: true })) if (name.endsWith("index.html")) pages.push(name);

const exists = async (p) => stat(p).then(() => true, () => false);
for (const page of pages) {
  const html = await readFile(join(root, page), "utf8");
  const dir = join(root, page, "..");
  const say = (m) => problems.push(`${page}: ${m}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) if (ids.filter((x) => x === id).length > 1) say(`id "${id}" is used more than once`);
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    if (href.startsWith("#")) { if (!ids.includes(href.slice(1))) say(`link to ${href}, which is not on the page`); }
    else if (!/^https:\/\//.test(href)) say(`link "${href}" is neither on the page nor an https address`);
  }
  for (const [tag] of html.matchAll(/<(?:img|source|link|script)\b[^>]*>/g)) {
    const src = /\s(?:src|srcset|href)="([^"]+)"/.exec(tag)?.[1];
    if (!src) continue;
    if (/^(https?:)?\/\//.test(src)) say(`loads ${src} from another site`);
    else if (!/rel="alternate"/.test(tag) && !(await exists(join(dir, src)))) say(`${src} is missing`);
    if (tag.startsWith("<img")) {
      if (!/\salt="[^"]{20,}"/.test(tag)) say(`picture ${src} has no describing text`);
      if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) say(`picture ${src} has no size`);
    }
  }
  let last = 0;
  for (const [, level] of html.matchAll(/<h([1-6])\b/g)) {
    if (+level > last + 1) say(`a heading jumps from h${last} to h${level}`);
    last = +level;
  }
  if ((html.match(/<h1\b/g) || []).length !== 1) say("there must be exactly one h1");
  if (!/<html lang="[a-zA-Z-]+"/.test(html)) say("the page doesn't say its language");
  if (/<script\b/.test(html)) say("the page has a script; it is meant to have none");
}
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log(`${pages.length} page(s) checked: nothing wrong`);
