import { agentMark } from "../src/agents.mjs";

// Presentation-only brand normalization for recordings of the SVG-based UI.
// Application behavior, text and controls remain unchanged.
export async function installAgentBranding(context) {
  const css = [
    ["claude", "Claude Code"],
    ["codex", "Codex"],
    ["cursor", "Cursor"],
    ["gemini", "Gemini"],
  ]
    .map(([id, label]) => {
      const svg = agentMark(id).replace(
        "<svg ",
        '<svg xmlns="http://www.w3.org/2000/svg" ',
      );
      const url = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      return `svg[aria-label="${label}"] { background: url("${url}") center / contain no-repeat; } svg[aria-label="${label}"] > * { opacity: 0; }`;
    })
    .join("\n");
  await context.addInitScript((css) => {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.append(style);
      },
      { once: true },
    );
  }, css);
}
