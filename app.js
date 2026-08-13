const BELL =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2m6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1z"/></svg>';

const STEPS = [
  { label: "Running", cls: "badge badge-warn", bell: false },
  { label: "Gating", cls: "badge badge-warn", bell: false },
  { label: "Pushing", cls: "badge badge-warn", bell: false },
  { label: "Retesting", cls: "badge badge-info", bell: false },
  { label: "Verify", cls: "badge badge-info", bell: true },
];

function apply(index) {
  const step = STEPS[index];
  const pill = document.getElementById("status-pill");
  if (!pill) return;
  pill.className = step.cls;
  pill.innerHTML = (step.bell ? `${BELL} ` : "") + step.label;
}

function bootDemo() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0;
  apply(i);
  if (reduce) return;
  window.setInterval(() => {
    i = (i + 1) % STEPS.length;
    apply(i);
  }, 2400);
}

function bootCopy() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-copy");
      const el = sel ? document.querySelector(sel) : null;
      const text = el ? el.textContent.trim() : "";
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
        window.setTimeout(() => {
          btn.textContent = "Copy";
        }, 1400);
      } catch {
        btn.textContent = "Copy failed";
      }
    });
  });
}

bootDemo();
bootCopy();
