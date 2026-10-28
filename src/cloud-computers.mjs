import { desktop } from "./cloud-desktop.mjs";
import c from "../content/cloud-computers.mjs";
import { shell, esc } from "./page.mjs";
import { mark } from "./brand.mjs";
const e = esc;
const contact = `mailto:hello@benchyard.com?subject=${encodeURIComponent(c.contactSubject)}`;
const arrow = '<span aria-hidden="true">↗</span>';
const icon = (name) => {
  const paths = {
    drive: "M5 5h22v22H5z M10 21h1m5 0h6M9 10h14",
    screen: "M3 5h26v18H3z M11 28h10m-5-5v5",
    agents: "M16 3v5m-9 2h18v15H7zM3 14h4m18 0h4M12 16h1m6 0h1M12 21h8",
    shield: "M16 3 27 7v9c0 7-11 13-11 13S5 23 5 16V7z m-6 13 4 4 8-8",
    human: "M16 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10M6 28v-3a10 10 0 0 1 20 0v3",
    moon: "M25 21A12 12 0 0 1 11 5 12 12 0 1 0 25 21Z",
    api: "m10 8-8 8 8 8m12-16 8 8-8 8M19 4l-6 24",
    fleet: "M3 3h10v10H3zM19 3h10v10H19zM3 19h10v10H3zM19 19h10v10H19z",
  };
  return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]}"/></svg>`;
};
const heading = (x) =>
  `<p class="cc-eyebrow">${e(x.eyebrow)}</p><h2>${e(x.title).replaceAll("\n", "<br>")}</h2>${x.lead ? `<p class="cc-lead">${e(x.lead)}</p>` : ""}`;
const status = (value) => {
  const labels = Object.fromEntries(c.compare.legend);
  return `<span class="cc-cell cc-cell-${value}" role="img" aria-label="${e(labels[value])}">${value === "yes" ? '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>' : value === "unknown" ? '<span aria-hidden="true">—</span>' : e(labels[value])}</span>`;
};
function marketLandscape() {
  const m = c.market;
  const sources = (items) =>
    items
      .map(
        ([label, url]) =>
          `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ${arrow}</a>`,
      )
      .join("");
  return `<section class="cc-section cc-market" id="market"><div class="cc-wrap">${heading(m)}<div class="cc-market-companies">${m.companies.map((company) => `<article class="cc-company"><div class="cc-company-heading"><h3>${e(company.name)}</h3><span>${e(company.tag)}</span></div><p>${e(company.body)}</p><dl>${company.facts.map(([label, value, note]) => `<div><dt>${e(label)}</dt><dd><strong>${e(value)}</strong><small>${e(note)}</small></dd></div>`).join("")}</dl><div class="cc-sources">${sources(company.sources)}</div></article>`).join("")}</div><div class="cc-market-funding"><h3>${e(m.fundingTitle)}</h3><p class="cc-lead">${e(m.fundingLead)}</p><div class="cc-rounds">${m.rounds.map((round) => `<article><div class="cc-round-heading"><h4>${e(round.name)}</h4><time>${e(round.date)}</time></div><strong class="cc-round-amount">${e(round.amount)}</strong><span class="cc-round-label">${e(round.label)}</span><p>${e(round.body)}</p><div class="cc-sources">${sources([[round.sourceLabel, round.source]])}</div></article>`).join("")}</div></div><div class="cc-market-size"><h3>${e(m.size.title)}</h3><div class="cc-market-stats">${m.size.stats.map(([value, label]) => `<div><strong>${e(value)}</strong><span>${e(label)}</span></div>`).join("")}</div><p>${e(m.size.body)}</p><div class="cc-sources">${sources([[m.size.sourceLabel, m.size.source]])}</div></div><div class="cc-scenarios"><h3>${e(m.scenarios.title)}</h3><p>${e(m.scenarios.body)}</p><div class="cc-scenario-scroll" tabindex="0" role="region" aria-label="${e(m.scenarios.title)}"><table><thead><tr>${m.scenarios.columns.map((x) => `<th scope="col">${e(x)}</th>`).join("")}</tr></thead><tbody>${m.scenarios.rows.map((row) => `<tr>${row.map((x, i) => (i === 0 ? `<th scope="row">${e(x)}</th>` : `<td>${e(x)}</td>`)).join("")}</tr>`).join("")}</tbody></table></div><p class="cc-fine">${e(m.scenarios.note)}</p></div><p class="cc-fine">${e(m.note)}</p></div></section>`;
}

export function renderCloud(t, { asset }) {
  return shell(
    t,
    (name) => "/" + asset(name),
    `<div class="cc-page"><div class="cc-subnav"><div class="cc-wrap"><a href="#cloud-top" class="cc-product">${e(c.productName)} <span>${e(c.previewLabel)}</span></a><nav aria-label="${e(c.nav)}">${c.subnav.map(([id, label]) => `<a href="#${id}">${e(label)}</a>`).join("")}</nav></div></div><section class="cc-hero cc-wrap" id="cloud-top"><div class="cc-hero-copy"><p class="cc-eyebrow"><span class="cc-pulse" aria-hidden="true"></span>${e(c.eyebrow)}</p><h1>${e(c.title[0])}<br><span>${e(c.title[1])}</span></h1><p class="cc-lead">${e(c.lead)}</p><div class="cc-actions"><a class="cc-button" href="${contact}">${e(c.cta)} ${arrow}</a><a class="cc-text-link" href="#platform">${e(c.secondary)} <span aria-hidden="true">↓</span></a></div><p class="cc-preview">${e(c.preview)}</p></div>${desktop()}<div class="cc-proof">${c.strip.map((x, i) => `<span><b aria-hidden="true">0${i + 1}</b>${e(x)}</span>`).join("")}</div></section><section class="cc-section cc-thesis" id="platform"><div class="cc-wrap"><div class="cc-section-intro">${heading(c.thesis)}<p class="cc-lead">${e(c.thesis.body)}</p></div><div class="cc-three">${c.thesis.items.map(([n, title, body]) => `<article><span class="cc-number">${n}</span><h3>${e(title)}</h3><p>${e(body)}</p></article>`).join("")}</div></div></section><section class="cc-section cc-wrap cc-capabilities">${heading(c.platform)}<div class="cc-cap-grid">${c.platform.cards.map(([n, title, body, state, glyph]) => `<article><div class="cc-card-top">${icon(glyph)}<span class="cc-status cc-status-${state}">${e(c.platform.labels[state])}</span></div><h3>${e(title)}</h3><p>${e(body)}</p><span class="cc-card-number" aria-hidden="true">${n}</span></article>`).join("")}</div><p class="cc-fine">${e(c.platform.note)}</p></section><section class="cc-section cc-continuity"><div class="cc-wrap"><div>${heading(c.continuity)}</div><div class="cc-timeline">${c.continuity.steps.map(([day, title, body]) => `<article><span class="cc-day">${e(day)}</span><span class="cc-timeline-dot" aria-hidden="true"></span><h3>${e(title)}</h3><p>${e(body)}</p></article>`).join("")}</div><p class="cc-fine">${e(c.continuity.note)}</p></div></section><section class="cc-section cc-wrap" id="possibilities">${heading(c.usecases)}<div class="cc-usecases">${c.usecases.cards.map(([glyph, title, body, flow]) => `<article><span class="cc-usecase-icon" aria-hidden="true">${glyph}</span><h3>${e(title)}</h3><p>${e(body)}</p><span class="cc-flow">${e(flow)}</span></article>`).join("")}</div></section><section class="cc-section cc-compare" id="comparison"><div class="cc-wrap">${heading(c.compare)}<div class="cc-table-scroll" tabindex="0" role="region" aria-label="${e(c.compareLabel)}"><table><thead><tr>${c.compare.columns.map((x, i) => `<th scope="col" ${i === 1 ? 'class="cc-our-column"' : ""}>${e(x)}${i === 1 ? `<span class="cc-table-tag">${e(c.comparisonTag)}</span>` : ""}</th>`).join("")}</tr></thead><tbody>${c.compare.groups.map((g) => `<tr class="cc-group"><th colspan="4" scope="colgroup">${e(g.name)}</th></tr>${g.rows.map(([title, ...vals]) => `<tr><th scope="row">${e(title)}</th>${vals.map((v, i) => `<td ${i === 0 ? 'class="cc-our-column"' : ""}>${status(v)}</td>`).join("")}</tr>`).join("")}`).join("")}</tbody></table></div><div class="cc-legend">${c.compare.legend.map(([value, label]) => `<span>${status(value)}${value === "yes" || value === "unknown" ? ` ${e(label)}` : ""}</span>`).join("")}</div><p class="cc-fine">${e(c.compare.note)}</p><div class="cc-sources">${c.compare.sources.map(([title, url]) => `<a href="${url}"${url.startsWith("https:") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${e(title)} ${arrow}</a>`).join("")}</div></div></section>${marketLandscape()}<section class="cc-section cc-wrap" id="cloud-pricing">${heading(c.pricing)}<p class="cc-pricing-badge">${e(c.pricing.badge)}</p><div class="cc-plans">${c.pricing.plans.map((p) => `<article class="cc-plan ${p.featured ? "cc-plan-featured" : ""}"><h3>${e(p.name)}</h3><p>${e(p.audience)}</p><div class="cc-price">${e(p.price)}<small>${e(p.period)}</small></div><a class="cc-button ${p.featured ? "" : "cc-button-outline"}" href="${contact}">${e(p.cta)} ${arrow}</a><ul>${p.features.map((f) => `<li><span aria-hidden="true">✓</span>${e(f)}</li>`).join("")}</ul></article>`).join("")}</div><p class="cc-fine">${e(c.pricing.note)}</p><a class="cc-text-link" href="https://console.benchyard.com/billing">${e(c.pricing.console)} ${arrow}</a></section><section class="cc-section cc-wrap cc-faq"><h2>${e(c.faq.title)}</h2><div>${c.faq.items.map(([q, a]) => `<details><summary>${e(q)}<span aria-hidden="true">+</span></summary><p>${e(a)}</p></details>`).join("")}</div></section><section class="cc-close"><div class="cc-wrap">${heading(c.close)}<p class="cc-lead">${e(c.close.body)}</p><div class="cc-actions"><a class="cc-button" href="${contact}">${e(c.close.cta)} ${arrow}</a><a class="cc-text-link" href="https://console.benchyard.com/register">${e(c.close.secondary)} ${arrow}</a></div></div></section></div>`,
    {
      path: "/cloud-computers/",
      title: c.meta.title,
      description: c.meta.description,
      pageClass: "agent-cloud-page",
      extraScript: "cloud-computers.js",
    },
  );
}
