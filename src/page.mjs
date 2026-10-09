import { card } from "./pictures.mjs";

// The page as a function of its words (content/<language>.mjs). Plain
// strings: no framework, nothing to hydrate.

// The addresses the page points at. Each is written here once.
//
// The address the site is served at: the one canonical and social-card
// addresses are made from. benchyard.com sends people on to it.
export const site = "https://www.benchyard.com";
// The hosted console, where people who have an account sign in.
export const consoleAddress = "https://console.benchyard.com";
// Where "Request access" and "get in touch" send mail.
// TO CONFIRM BEFORE PUBLISHING: the owner must make sure this mailbox exists
// and is read. Every button on the page depends on it.
export const contactAddress = "hello@benchyard.com";

// A mailto: link with a subject and, if given, lines of text to start from.
const mailto = (subject, lines = []) =>
  `mailto:${contactAddress}?subject=${encodeURIComponent(subject)}${lines.length ? `&body=${encodeURIComponent(lines.join("\r\n\r\n") + "\r\n")}` : ""}`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// `code` in a sentence becomes <code> and {contact} the contact address as a
// link; everything else is escaped.
const rich = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\{contact\}/g, `<a href="mailto:${contactAddress}">${contactAddress}</a>`);
const ext = (href) => (/^https?:/.test(href) ? ' rel="noopener"' : "");
const link = ([href, text], cls = "") => `<a href="${esc(href)}"${cls ? ` class="${cls}"` : ""}${ext(href)}>${esc(text)}</a>`;

const mark = `<svg class="mark" viewBox="0 0 44 44" aria-hidden="true" focusable="false"><path d="M39 19.8612H41V31.4523L39 33.501V19.8612Z"/><path d="M30.0665 8.92773H28V24.1771H30.0665V8.92773Z"/><path d="M19.1054 8.92773H30.046L13.9405 20.5189H3L19.1054 8.92773Z"/><path d="M30.0595 19.8612H41L26.5387 31.4523H15.5982L30.0595 19.8612Z"/></svg>`;

// A screenshot in the theme the visitor's system asks for, as WebP in two
// sizes (the file's own, for screens with two device pixels to one, and half
// of it; the build makes both, src/pictures.mjs). `sizes` says how wide the
// picture is shown, so the browser takes the smaller file where that is
// enough. Width and height are the file's own, so the page doesn't move as
// it loads. `at` gives a file's published address.
const shot = (at, name, alt, w, h, { eager = false, dark = true, cls = "", sizes = "(min-width: 1220px) 1120px, 94vw" } = {}) => {
  const file = (theme, width) => at(`img/${name}-${theme}-${width}.webp`);
  const set = (theme) => `${file(theme, w / 2)} ${w / 2}w, ${file(theme, w)} ${w}w`;
  return `<picture>
  ${dark ? `<source type="image/webp" srcset="${set("dark")}" sizes="${sizes}" media="(prefers-color-scheme: dark)">` : ""}
  <img src="${file("light", w / 2)}" srcset="${set("light")}" sizes="${sizes}" alt="${esc(alt)}" width="${w}" height="${h}"${cls ? ` class="${cls}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
</picture>`;
};

// `asset` gives the name a changing file (the stylesheet, a font, a picture)
// is published under, which carries a hash of its content; the build passes
// it. Files whose names are fixed (the icons) are named as they are.
export function render(t, { base = "", languages = [], asset = (name) => name } = {}) {
  const at = (name) => base + asset(name);
  // The two things a visitor can do: ask for access (a mail), or sign in.
  const access = (cls) => link([mailto(t.access.subject, t.access.body), t.access.label], cls);
  const signIn = (cls) => link([consoleAddress, t.signIn], cls);
  // In the content, a link's address may be one of these names.
  const named = { "@access": mailto(t.access.subject, t.access.body), "@console": consoleAddress, "@contact": `mailto:${contactAddress}` };
  const listed = ([href, text]) => link([named[href] ?? href, text === "@contact" ? contactAddress : text]);
  return `<!doctype html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.meta.title)}</title>
<meta name="description" content="${esc(t.meta.description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f2f3ef" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#111513" media="(prefers-color-scheme: dark)">
<meta property="og:title" content="${esc(t.meta.title)}">
<meta property="og:description" content="${esc(t.meta.description)}">
<meta property="og:type" content="website">
<link rel="canonical" href="${site}/">
<meta property="og:url" content="${site}/">
<meta property="og:site_name" content="Benchyard">
<meta property="og:image" content="${site}/social-card.png">
<meta property="og:image:width" content="${card.width}">
<meta property="og:image:height" content="${card.height}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${base}favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">
<link rel="preload" href="${at("fonts/bricolage-grotesque-latin-wght-normal.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${at("fonts/ibm-plex-sans-latin-400-normal.woff2")}" as="font" type="font/woff2" crossorigin>
${languages.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${l.href}">`).join("\n")}
<link rel="stylesheet" href="${at("styles.css")}">
</head>
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="top">
  <div class="wrap top-in">
    <a class="brand" href="#top" aria-label="Benchyard">${mark}<span>Benchyard</span></a>
    <nav aria-label="${esc(t.nav.label)}">
      <ul>
        ${t.nav.items.map((i) => `<li>${link(i)}</li>`).join("\n        ")}
      </ul>
    </nav>
    <div class="top-actions">${signIn("signin")} ${access("btn btn-primary btn-quiet")}</div>
  </div>
</header>

<main id="main">
<section class="hero" id="top">
  <div class="wrap">
    <h1>${esc(t.hero.title)}</h1>
    <p class="lead">${esc(t.hero.lead)}</p>
    <p class="actions">${access("btn btn-primary")} ${signIn("btn")}</p>
    <p class="note">${esc(t.hero.note)}</p>
    <figure class="stage">
      <div class="frame frame-desktop">${shot(at, "session-approval", t.hero.desktopAlt, 2560, 1600, { eager: true, sizes: "(min-width: 1060px) 980px, 94vw" })}</div>
      <div class="frame frame-phone">${shot(at, "phone-approval", t.hero.phoneAlt, 1170, 1992, { eager: true, sizes: "(min-width: 721px) min(24vw, 260px), min(68vw, 300px)" })}</div>
      <figcaption>${esc(t.hero.caption)}</figcaption>
    </figure>
  </div>
</section>

<section id="how" aria-labelledby="how-h">
  <div class="wrap">
    <h2 id="how-h">${esc(t.how.title)}</h2>
    <p class="lead">${esc(t.how.lead)}</p>
    <ol class="steps">
      ${t.how.steps.map((s) => `<li><h3>${esc(s.title)}</h3><p>${rich(s.body)}</p></li>`).join("\n      ")}
    </ol>
    <div class="frame">${shot(at, "session-done", t.how.shotAlt, 2560, 1600, { dark: false })}</div>
  </div>
</section>

<section id="agents" class="band" aria-labelledby="agents-h">
  <div class="wrap">
    <h2 id="agents-h">${esc(t.agents.title)}</h2>
    <p class="lead">${esc(t.agents.lead)}</p>
    <ul class="cards cards-4">
      ${t.agents.items.map((a) => `<li class="card"><h3>${esc(a.name)}</h3><p>${rich(a.body)}</p></li>`).join("\n      ")}
    </ul>
    <p class="foot">${esc(t.agents.foot)}</p>
  </div>
</section>

<section id="workspace" aria-labelledby="workspace-h">
  <div class="wrap">
    <h2 id="workspace-h">${esc(t.workspace.title)}</h2>
    <p class="lead">${esc(t.workspace.lead)}</p>
    <dl class="grid">
      ${t.workspace.items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${rich(v)}</dd></div>`).join("\n      ")}
    </dl>
    <div class="frame">${shot(at, "workspaces", t.workspace.shotAlt, 2560, 1600)}</div>
  </div>
</section>

<section id="security" class="band" aria-labelledby="security-h">
  <div class="wrap">
    <h2 id="security-h">${esc(t.security.title)}</h2>
    <p class="lead">${esc(t.security.lead)}</p>
    <ul class="cards cards-2">
      ${t.security.points.map((p) => `<li class="card"><h3>${esc(p.title)}</h3><p>${rich(p.body)}</p></li>`).join("\n      ")}
    </ul>
    <aside class="plain" aria-labelledby="plain-h">
      <h3 id="plain-h">${esc(t.security.plain.title)}</h3>
      <ul>
        ${t.security.plain.items.map((i) => `<li>${rich(i)}</li>`).join("\n        ")}
      </ul>
    </aside>
  </div>
</section>

<section id="where" aria-labelledby="where-h">
  <div class="wrap">
    <h2 id="where-h">${esc(t.where.title)}</h2>
    <p class="lead">${esc(t.where.lead)}</p>
    <ul class="cards cards-3">
      ${t.where.items.map((p) => `<li class="card"><h3>${esc(p.title)}</h3><p>${rich(p.body)}</p></li>`).join("\n      ")}
    </ul>
    <p class="foot">${esc(t.where.foot)}</p>
  </div>
</section>

<section id="teams" class="band" aria-labelledby="teams-h">
  <div class="wrap">
    <h2 id="teams-h">${esc(t.teams.title)}</h2>
    <dl class="grid">
      ${t.teams.items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${rich(v)}</dd></div>`).join("\n      ")}
    </dl>
    <div class="frame">${shot(at, "security", t.teams.shotAlt, 2560, 1600)}</div>
  </div>
</section>

<section id="own-cluster" aria-labelledby="own-cluster-h">
  <div class="wrap narrow">
    <h2 id="own-cluster-h">${esc(t.ownCluster.title)}</h2>
    <p class="lead">${rich(t.ownCluster.body)}</p>
  </div>
</section>

<section id="pricing" class="band" aria-labelledby="pricing-h">
  <div class="wrap narrow">
    <h2 id="pricing-h">${esc(t.pricing.title)}</h2>
    <p class="lead">${esc(t.pricing.body)}</p>
    <p class="actions">${access("btn btn-primary")}</p>
  </div>
</section>

<section id="faq" aria-labelledby="faq-h">
  <div class="wrap narrow">
    <h2 id="faq-h">${esc(t.faq.title)}</h2>
    ${t.faq.items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${rich(a)}</p></details>`).join("\n    ")}
  </div>
</section>
</main>

<footer class="bottom">
  <div class="wrap bottom-in">
    <div class="about">
      <span class="brand">${mark}<span>Benchyard</span></span>
      <p>${esc(t.footer.tagline)}</p>
    </div>
    ${t.footer.groups.map((g) => `<nav aria-label="${esc(g.title)}"><h2>${esc(g.title)}</h2><ul>${g.links.map((l) => `<li>${listed(l)}</li>`).join("")}</ul></nav>`).join("\n    ")}
  </div>
  <div class="wrap"><p class="legal">${esc(t.footer.legal)}</p></div>
</footer>
</body>
</html>
`;
}
