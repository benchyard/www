const MARK =
  '<svg viewBox="0 0 44 44" fill="currentColor" aria-hidden="true"><path d="M39 19.8612H41V31.4523L39 33.501V19.8612Z"/><path d="M30.0665 8.92773H28V24.1771H30.0665V8.92773Z"/><path d="M19.1054 8.92773H30.046L13.9405 20.5189H3L19.1054 8.92773Z"/><path d="M30.0595 19.8612H41L26.5387 31.4523H15.5982L30.0595 19.8612Z"/></svg>';

function fill(sel, id) {
  const tpl = document.getElementById(id);
  if (!tpl) return;
  document.querySelectorAll(sel).forEach((el) => {
    el.append(tpl.content.cloneNode(true));
  });
}

function fillTemplates() {
  fill("[data-ui=todos]", "tpl-todos");
  fill("[data-ui=docs]", "tpl-docs");
  fill("[data-ui=phone]", "tpl-phone");
  document.querySelectorAll("[data-mark]").forEach((el) => {
    el.innerHTML = MARK;
  });
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
bootCopy();
