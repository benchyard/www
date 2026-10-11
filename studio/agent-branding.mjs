import { agentMark } from "../src/agents.mjs";

// Presentation-only brand normalization for captured UI. Application behavior,
// text and controls remain unchanged; the product checkout is not modified.
export async function installAgentBranding(context) {
  const svg = agentMark("codex").replace(
    "<svg ",
    '<svg xmlns="http://www.w3.org/2000/svg" ',
  );
  const url = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  await context.addInitScript((url) => {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        const style = document.createElement("style");
        style.textContent = `svg[aria-label="Codex"] { background: url("${url}") center / contain no-repeat; } svg[aria-label="Codex"] > * { opacity: 0; }`;
        document.head.append(style);
      },
      { once: true },
    );
  }, url);
}
