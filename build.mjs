// Builds the site into dist/: one page per language, the stylesheet, and
// everything in public/ as it is. No dependencies.
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { render } from "./src/page.mjs";

// The first language is served at /, the others at /<code>/.
const languages = ["en"];

const out = new URL("./dist/", import.meta.url);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(new URL("./public/", import.meta.url), out, { recursive: true });
await writeFile(new URL("styles.css", out), await readFile(new URL("./src/styles.css", import.meta.url)));

const alternates = languages.length > 1 ? languages.map((code, i) => ({ code, href: i === 0 ? "/" : `/${code}/` })) : [];
for (const [i, code] of languages.entries()) {
  const t = (await import(`./content/${code}.mjs`)).default;
  const dir = i === 0 ? out : new URL(`${code}/`, out);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL("index.html", dir), render(t, { base: i === 0 ? "" : "../", languages: alternates }));
}
console.log(`built dist/ (${languages.join(", ")})`);
