import { deviceSetup } from "../content/device-setup.mjs";
import { mark } from "./brand.mjs";
const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
function scene(device, step) {
  const app = `<span class="setup-app-icon">${mark}</span><span>Benchyard</span>`;
  const views = [
    `<div class="setup-browser"><span class="setup-address">console.benchyard.com</span><div class="setup-project"><span class="setup-brand">${mark} Benchyard</span><strong>issue-board</strong><span>Agent session · Needs approval</span></div></div>`,
    `<div class="setup-menu"><span>${device.id === "mac" ? "Safari · File" : "Safari · Share"}</span><strong>${device.action} <span>＋</span></strong><span class="setup-confirm">Add</span></div>`,
    `<div class="setup-launch ${device.id === "mac" ? "setup-dock" : "setup-home"}"><span class="setup-placeholder"></span><span class="setup-app">${app}</span><span class="setup-placeholder"></span></div>`,
    `<div class="setup-permission"><span class="setup-app-icon">${mark}</span><strong>Notifications for Benchyard</strong><span>Enable in Benchyard, then allow on this device.</span><span class="setup-confirm">Allow notifications</span></div>`,
    `<div class="setup-alert"><span class="setup-brand">${mark} Benchyard</span><strong>Approval needed</strong><span>Add a status filter</span><span class="setup-confirm">Open session → Review request</span></div>`,
  ];
  return `<div class="setup-illustration">${views[step]}</div>`;
}
export function walkthrough({ expanded = false } = {}) {
  return `<details class="device-setup" id="device-setup" ${expanded ? "open" : ""}>
    <summary><strong>On your Dock. On your Home Screen.</strong><span>No separate app download.</span><span class="text-link">View setup steps <span aria-hidden="true">↓</span></span></summary>
    <div class="setup-body" data-walkthrough><p class="caption">Illustrative walkthroughs, not native OS screenshots or a recording of notification delivery.</p>
    <div class="setup-select" role="group" aria-label="Choose your device" hidden>${deviceSetup.map((d, i) => `<button type="button" data-device="${d.id}" aria-pressed="${i === 0}">${d.name}</button>`).join("")}</div>
    ${deviceSetup.map((d) => `<article class="setup-device" data-device-panel="${d.id}"><h3>${d.name}: ${d.action}</h3><p class="note">${esc(d.requirement)}</p><ol class="setup-steps">${d.steps.map(([title, body, visual], i) => `<li data-setup-step><div class="setup-scene" aria-hidden="true">${scene(d, i)}<span class="setup-path">${esc(visual)}</span><span class="setup-counter">${d.name} · ${i + 1} / ${d.steps.length}</span></div><h4>${esc(title)}</h4><p>${esc(body)}</p></li>`).join("")}</ol><div class="setup-controls" hidden><button type="button" data-previous>Previous</button><span data-step-status aria-live="polite"></span><button type="button" data-next>Next</button></div></article>`).join("")}
    <p class="note">Notifications depend on device permission and your settings. Completion and failure alerts are supported too; delivery is not guaranteed. This website does not request notification permission.</p><p><a href="https://console.benchyard.com">Open the Benchyard console →</a></p></div></details>`;
}
