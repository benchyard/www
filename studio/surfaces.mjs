import { readFileSync } from "node:fs";
import { lockScreenMarkup } from "../src/lock-screen.mjs";
export const lockScreenCss = readFileSync(
  new URL("../src/lock-screen.css", import.meta.url),
  "utf8",
);
import content from "../content/en.mjs";
import { agentMark } from "../src/agents.mjs";
// Device-only illustrations. Application screenshots come from capture.mjs.
export const lockScreen = () =>
  `<!doctype html><html><meta charset="utf-8"><style>body{margin:0;background:transparent}${lockScreenCss}.ios-lock{height:740px;aspect-ratio:auto;box-shadow:none}</style>${lockScreenMarkup()}</html>`;
export const endCard = () =>
  `<!doctype html><html><meta charset="utf-8"><style>body{margin:0;height:900px;display:grid;place-content:center;text-align:center;background:#f2f3ef;color:#1a1e1b;font:24px system-ui}h1{font-size:76px;letter-spacing:-4px;margin:20px}p{color:#52645a}.button{display:inline-block;background:#1f6b6b;color:#fff;padding:18px 35px;border-radius:12px;margin:25px auto}small{font-size:18px}.agent-mark{width:32px;height:32px}</style><small>BENCHYARD</small><h1>Your agents.<br>Your workspace.</h1><p>${content.agents.items.map(([id, name]) => `<span style="display:inline-flex;align-items:center;gap:12px;margin:0 15px">${agentMark(id)} ${name}</span>`).join("")}</p><small>Current integrations · More agents and models planned</small><span class="button">Request access</span><small>www.benchyard.com</small></html>`;
