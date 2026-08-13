const MARK =
  '<svg viewBox="0 0 44 44" fill="currentColor" aria-hidden="true"><path d="M39 19.8612H41V31.4523L39 33.501V19.8612Z"/><path d="M30.0665 8.92773H28V24.1771H30.0665V8.92773Z"/><path d="M19.1054 8.92773H30.046L13.9405 20.5189H3L19.1054 8.92773Z"/><path d="M30.0595 19.8612H41L26.5387 31.4523H15.5982L30.0595 19.8612Z"/></svg>';

const BELL =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2m6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1z"/></svg>';

const STEPS = [
  { label: "Running", cls: "badge badge-warn status-pill", bell: false },
  { label: "Gating", cls: "badge badge-warn status-pill", bell: false },
  { label: "Pushing", cls: "badge badge-warn status-pill", bell: false },
  { label: "Retesting", cls: "badge badge-info status-pill", bell: false },
  { label: "Verify", cls: "badge badge-info status-pill", bell: true },
];

function fillTemplates() {
  const desk = document.getElementById("tpl-desktop");
  const phone = document.getElementById("tpl-phone");
  document.querySelectorAll("[data-ui=desktop]").forEach((el) => {
    el.append(desk.content.cloneNode(true));
  });
  document.querySelectorAll("[data-ui=phone]").forEach((el) => {
    el.append(phone.content.cloneNode(true));
  });
  document.querySelectorAll("[data-mark]").forEach((el) => {
    el.innerHTML = MARK;
  });
}

function apply(index) {
  const step = STEPS[index];
  document.querySelectorAll(".status-pill").forEach((pill) => {
    pill.className = step.cls;
    pill.innerHTML = (step.bell ? `${BELL} ` : "") + step.label;
  });
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

fillTemplates();
bootDemo();
bootCopy();
