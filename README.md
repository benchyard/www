# Benchyard's homepage

The public page for [Benchyard](https://github.com/benchyard/benchyard): persistent devservers where coding agents (Claude Code, Codex, Cursor, Gemini CLI) keep running, watched and steered from a browser or a phone.

A static site: one HTML page per language, one stylesheet, pictures and fonts. No backend, no JavaScript on the page, nothing loaded from another site, no trackers.

## Why this stack

Plain HTML and CSS, put together by a 30-line Node script with no dependencies. The page is a single document whose words change far more often than its structure; a framework would add a build chain and a dependency tree to maintain for no gain in what a visitor gets. If the site grows to many pages (docs, a blog), moving `src/page.mjs` and `content/` into Astro is a small step.

## Run, build, check

Needs Node 20 or later. There is nothing to install.

```sh
npm run dev     # build, then serve dist/ at http://localhost:4321 (PORT=... to change)
npm run build   # build into dist/
npm run check   # build, then check links, pictures, headings, and that nothing comes from another site
```

## Deploy

`dist/` is the whole site: upload it to any static host (Cloudflare Pages, GitHub Pages, Netlify, an S3 bucket behind a CDN, nginx). The build command is `npm run build` and the output folder is `dist`.

Worth setting at the host: long cache lifetimes for `fonts/` and `img/`, a short one for `index.html` and `styles.css` (their names don't change between builds).

## Where things are

| Path | What |
|---|---|
| `content/en.mjs` | Every word on the page. Edit text here, not in the template |
| `src/page.mjs` | The page's structure, as a function of the words |
| `src/styles.css` | The stylesheet. Colours and fonts are the app's own; light and dark follow the visitor's system |
| `public/` | Copied as it is: fonts (`fonts/LICENSES.md` has their licences), icons, screenshots (`img/`) |
| `build.mjs`, `serve.mjs`, `check.mjs` | Build, local preview, checks |
| `docs/screenshots/` | How the built page looks at 1280, 390 and 360 wide, light and dark |

## Changing the text

The page says only what Benchyard does today. Its sources are the product repository's `docs/features.md`, `docs/roadmap.md`, `docs/storage.md` and the Helm chart's README; a claim that isn't supported there doesn't belong here, and what is on the roadmap is called "planned". No invented numbers, quotes or customer names.

## Adding a language

Copy `content/en.mjs` to `content/<code>.mjs`, translate the values (keys and structure stay), and add the code to `languages` in `build.mjs`. The first language is served at `/`, the others at `/<code>/`. The fonts in `public/fonts` are Latin subsets: a language in another script needs its subsets added (or falls back to the system's fonts, which the stylesheet allows).

## The screenshots

`public/img/` holds screenshots of the real app, taken from a throwaway local server with stand-in agents and made-up data (the account "alice", the workspaces "api" and "web-app"). Nothing in them is a real account, address or host. To retake them after the app changes: run the product's local test server (`scripts/e2e-local.sh` in its repository shows how), drive it with Playwright at 1280×800 and at a phone's size in light and dark, and replace the files under the same names; `src/page.mjs` carries each picture's pixel size.

## To decide

- **Licence** for this repository: see `LICENSE.md`.
- **Domain**, and with it canonical and social-card addresses (none are set).
- **A contact address** for the footer (none is shown).
- **Analytics:** none. If wanted, a privacy-respecting, self-hosted one keeps the "nothing from another site" property.
- **Pricing wording** once hosted plans exist; today the section says it is self-hosted and that hosted plans are being prepared.
