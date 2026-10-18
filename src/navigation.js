// Shared progressive enhancement. Links and setup instructions work without it.
(() => {
  const items = [...document.querySelectorAll("[data-nav-item]")];
  const close = (except) => {
    for (const item of items) {
      if (item === except) continue;
      clearTimeout(item.openTimer);
      clearTimeout(item.closeTimer);
      item.querySelector(".nav-toggle").setAttribute("aria-expanded", "false");
      item.querySelector(".nav-panel").hidden = true;
    }
  };
  for (const item of items) {
    const toggle = item.querySelector(".nav-toggle");
    const panel = item.querySelector(".nav-panel");
    toggle.hidden = false;
    const open = () => {
      close(item);
      clearTimeout(item.closeTimer);
      toggle.setAttribute("aria-expanded", "true");
      panel.hidden = false;
    };
    toggle.addEventListener("click", () => (panel.hidden ? open() : close()));
    item.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      clearTimeout(item.closeTimer);
      item.openTimer = setTimeout(open, 150);
    });
    item.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      clearTimeout(item.openTimer);
      item.closeTimer = setTimeout(() => {
        if (!item.contains(document.activeElement)) close();
      }, 200);
    });
    // Focus on the section link opens its disclosure. The separate button
    // keeps normal Enter/Space toggle semantics (including after Escape).
    item.querySelector(".nav-label > a").addEventListener("focus", open);
    item.addEventListener("focusout", (e) => {
      if (e.relatedTarget && !item.contains(e.relatedTarget)) {
        clearTimeout(item.openTimer);
        close();
      }
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
        toggle.focus();
      }
    });
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-nav-item]") || e.target.closest("a")) close();
    if (!e.target.closest(".mobile-nav") || e.target.closest(".mobile-nav a")) {
      document.querySelector(".mobile-nav").open = false;
    }
  });
  const mobile = document.querySelector(".mobile-nav");
  mobile?.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      mobile.open = false;
      mobile.querySelector("summary").focus();
    }
  });
  mobile?.addEventListener("focusout", (e) => {
    if (e.relatedTarget && !mobile.contains(e.relatedTarget)) {
      mobile.open = false;
      close();
    }
  });

  for (const root of document.querySelectorAll("[data-walkthrough]")) {
    const buttons = [...root.querySelectorAll("[data-device]")];
    const panels = [...root.querySelectorAll("[data-device-panel]")];
    const steps = new Map(panels.map((p) => [p, 0]));
    root.querySelector(".setup-select").hidden = false;
    const showStep = (panel, index) => {
      const entries = [...panel.querySelectorAll("[data-setup-step]")];
      index = Math.max(0, Math.min(entries.length - 1, index));
      steps.set(panel, index);
      entries.forEach((el, i) => {
        el.hidden = i !== index;
      });
      panel.querySelector("[data-step-status]").textContent =
        `Step ${index + 1} of ${entries.length}`;
      // Keep controls focusable while at either end so focus never disappears.
      panel
        .querySelector("[data-previous]")
        .setAttribute("aria-disabled", String(index === 0));
      panel
        .querySelector("[data-next]")
        .setAttribute("aria-disabled", String(index === entries.length - 1));
    };
    const select = (id) => {
      buttons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.device === id)),
      );
      panels.forEach((p) => {
        p.hidden = p.dataset.devicePanel !== id;
      });
    };
    buttons.forEach((b) =>
      b.addEventListener("click", () => select(b.dataset.device)),
    );
    panels.forEach((p) => {
      p.querySelector(".setup-controls").hidden = false;
      p.querySelector("[data-previous]").addEventListener("click", () =>
        showStep(p, steps.get(p) - 1),
      );
      p.querySelector("[data-next]").addEventListener("click", () =>
        showStep(p, steps.get(p) + 1),
      );
      showStep(p, 0);
    });
    select("mac");
  }
  const reveal = () => {
    if (location.hash !== "#device-setup") return;
    const setup = document.getElementById("device-setup");
    if (setup) {
      setup.open = true;
      requestAnimationFrame(() =>
        setup.scrollIntoView({ behavior: "instant", block: "start" }),
      );
    }
  };
  addEventListener("hashchange", reveal);
  document.addEventListener("click", (e) => {
    if (e.target.closest('a[href$="#device-setup"]')) setTimeout(reveal, 0);
  });
  reveal();
})();
