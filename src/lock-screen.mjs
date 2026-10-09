import { mark } from "./brand.mjs";

// Original vector system indicators; no external icon or wallpaper assets.
export const statusIcons = `<svg viewBox="0 0 72 16" fill="currentColor" aria-hidden="true"><rect x="0" y="10" width="3" height="5" rx=".8"/><rect x="5" y="7" width="3" height="8" rx=".8"/><rect x="10" y="4" width="3" height="11" rx=".8"/><rect x="15" y="1" width="3" height="14" rx=".8"/><path d="M24 5a14 14 0 0 1 20 0l-2 2a11 11 0 0 0-16 0Zm4 4a8 8 0 0 1 12 0l-2 2a5 5 0 0 0-8 0Zm4 4a3 3 0 0 1 4 0l-2 2Z"/><rect x="49" y="2" width="20" height="12" rx="3" fill="none" stroke="currentColor" opacity=".6"/><rect x="51" y="4" width="16" height="8" rx="1.5"/><path d="M70 6h1v4h-1z"/></svg>`;
const glyph = (path) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
export const lockScreenMarkup = () =>
  `<div class="ios-lock" role="img" aria-label="Simulated iPhone lock screen. Benchyard: Approval needed, run the issue-board filter tests. Earlier notification: Task complete, the onboarding outline is ready."><div class="ios-screen" aria-hidden="true"><div class="ios-wallpaper"></div><div class="ios-island"></div><div class="ios-indicators">${statusIcons}</div><div class="ios-clock"><div class="ios-padlock">${glyph('<rect x="7" y="10" width="10" height="10" rx="2" fill="currentColor" stroke="none"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>')}</div><div class="ios-date">Friday, October 9</div><div class="ios-time">9:41</div></div><div class="ios-notifications">${[
    ["now", "Approval needed", "Run the issue-board filter tests."],
    ["8m ago", "Task complete", "The onboarding outline is ready."],
  ]
    .map(
      ([time, title, body]) =>
        `<div class="ios-notification"><div class="ios-app-icon">${mark}</div><div class="ios-notification-copy"><div class="ios-notification-heading"><b>Benchyard</b><span>${time}</span></div><strong>${title}</strong><div>${body}</div></div></div>`,
    )
    .join(
      "",
    )}</div><div class="ios-utilities"><span>${glyph('<path d="M8 3h8M8 6h8l-2 4v10h-4V10Z"/><path d="M11 12h2"/>')}</span><span>${glyph('<path d="M8 6l2-3h4l2 3h4a1 1 0 0 1 1 1v12H3V7a1 1 0 0 1 1-1Z"/><circle cx="12" cy="12" r="3.5"/>')}</span></div><div class="ios-home"></div></div></div>`;
