// The homepage's one script. It plays the replay (src/demo.mjs drew the
// finished session; this shows it step by step and waits for the visitor's
// approval). Without it the page shows the finished session as it is.
// What follows the scroll: an element with data-fx gets --p, from 0 as its
// top comes into view to 1 when it has come up most of the way. The page
// scrolls as the visitor scrolls it; this only reads where it is.
(() => {
  const parts = [...document.querySelectorAll("[data-fx]")];
  if (!parts.length || matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;
  let asked = false;
  const read = () => {
    asked = false;
    const h = innerHeight;
    for (const el of parts) {
      const p = (h - el.getBoundingClientRect().top) / (h * 0.6);
      el.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(3));
    }
  };
  const ask = () => asked || ((asked = true), requestAnimationFrame(read));
  addEventListener("scroll", ask, { passive: true });
  addEventListener("resize", ask);
  read();
})();
// What arrives as it is scrolled to, and the tour whose picture follows the
// step in the middle of the screen. Both only add classes; the styles that
// move things apply where the visitor has not asked for less motion.
(() => {
  // fx.js marked the page before it was drawn, unless less motion is wanted.
  document.documentElement.dataset.site = "1";
  if (!document.documentElement.classList.contains("fx")) return;
  const seen = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.classList.add("in");
          seen.unobserve(e.target);
        }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  for (const el of document.querySelectorAll("[data-in]")) seen.observe(el);
  const tour = document.querySelector(".tour");
  if (!tour) return;
  // A picture is shown once it has been fetched: until then its frame would
  // be an empty box.
  let current;
  const show = (i) => {
    current = i;
    for (const el of tour.children) {
      const on = (el.dataset.tour ?? el.dataset.shot) === i;
      const img = on && el.querySelector("img");
      if (img && !img.complete) {
        img.loading = "eager";
        img.addEventListener("load", () => show(current), { once: true });
        el.classList.remove("on");
      } else el.classList.toggle("on", on);
    }
  };
  // The picture follows the step nearest the middle of the screen. When a
  // link takes the page somewhere (the menu, "Play the demo"), the picture is
  // put away for the way there and comes back once the page has come to rest,
  // with the step it has arrived at: nothing is flipped through in passing.
  // Scrolling by hand ends that at once.
  const texts = [...tour.querySelectorAll("[data-tour]")];
  const nearest = () => {
    const mid = innerHeight / 2;
    let best = texts[0];
    let gap = Infinity;
    for (const el of texts) {
      const r = el.getBoundingClientRect();
      const d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < gap) [best, gap] = [el, d];
    }
    show(best.dataset.tour);
  };
  let rest;
  let asked = false;
  const arrive = () => {
    clearTimeout(rest);
    nearest();
    tour.classList.remove("moving");
  };
  addEventListener("click", (e) => {
    if (!e.target.closest?.('a[href*="#"]')) return;
    tour.classList.add("moving");
    clearTimeout(rest);
    rest = setTimeout(arrive, 300);
  });
  for (const input of ["wheel", "touchstart", "keydown"])
    addEventListener(
      input,
      () => tour.classList.contains("moving") && arrive(),
      { passive: true },
    );
  addEventListener(
    "scroll",
    () => {
      if (tour.classList.contains("moving")) {
        clearTimeout(rest);
        rest = setTimeout(arrive, 140);
      } else if (!asked) {
        asked = true;
        requestAnimationFrame(() => {
          asked = false;
          nearest();
        });
      }
    },
    { passive: true },
  );
  // At first the picture waits for the page to be where it will be: a reload
  // puts the page back where it was, and the picture should be that step's
  // from the start, not the first step's and then another.
  tour.classList.add("moving");
  const settled = () => (rest = setTimeout(arrive, 80));
  if (document.readyState === "complete") settled();
  else addEventListener("load", settled, { once: true });
})();
(() => {
  const root = document.querySelector("[data-replay]");
  if (!root) return;
  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const LAST = 8;
  const timed = $$("[data-at]");
  const scroller = $("[data-scroll]");
  const pill = $("[data-pill]");
  const composer = $("[data-composer]");
  const start = $("[data-start]");
  const play = $("[data-play]");
  const skip = $("[data-skip]");
  const again = $("[data-again]");
  const status = $("[data-status]");
  const card = $("[data-shell]");
  const note = $("[data-shell-note]");
  const output = $("[data-output]");
  const phone = $("[data-phone]");
  const count = $("[data-count]");
  const empty = $("[data-empty]");
  const fullOutput = output.textContent;
  const texts = new Map(
    $$("[data-stream]").map((el) => [el, el.firstElementChild.textContent]),
  );
  const prompt = $(".rp-user").textContent;

  // One run of the replay at a time: a newer run, or a skip, ends the older
  // one at its next wait.
  let run = 0;
  let paused = false;
  let state = "idle"; // idle, playing, waiting, denied, done
  let resume = [];
  const stopped = Symbol("stopped");
  const wait = (ms, mine) =>
    new Promise((ok, no) => {
      const tick = () => {
        if (mine !== run) return no(stopped);
        if (paused) return resume.push(tick);
        ok();
      };
      still.matches ? tick() : setTimeout(tick, ms);
    });

  function say(text) {
    status.textContent = text;
  }
  function pillIs(kind, text) {
    pill.dataset.kind = kind;
    pill.textContent = text;
  }
  function bottom() {
    scroller.scrollTop = scroller.scrollHeight;
  }
  /** Shows what the session holds at a step: everything up to it, nothing after. */
  function show(step) {
    for (const el of timed) el.hidden = +el.dataset.at > step;
    const changes = Math.max(0, Math.min(3, step - 2));
    count.textContent = changes ? `· ${changes}` : "";
    empty.hidden = changes > 0;
    for (const el of $$("[data-diff]"))
      el.hidden = el.hidden || el.dataset.diff !== picked;
    bottom();
  }
  let picked = "0";
  function pick(i) {
    picked = String(i);
    for (const b of $$("[data-change]"))
      b.setAttribute("aria-pressed", String(b.dataset.change === picked));
    for (const el of $$("[data-diff]"))
      el.hidden = el.dataset.diff !== picked || +el.dataset.at > shown;
  }
  let shown = LAST;
  function step(n) {
    shown = n;
    show(n);
  }
  async function stream(el, mine) {
    const p = el.firstElementChild;
    const words = texts.get(el).split(" ");
    p.textContent = "";
    for (let i = 0; i < words.length; i++) {
      p.textContent += (i ? " " : "") + words[i];
      bottom();
      if (!still.matches) await wait(38, mine);
    }
  }
  function shellIs(kind, text) {
    card.dataset.state = kind;
    note.textContent = text;
  }
  function asking(on) {
    root.classList.toggle("rp-waiting", on);
    for (const el of $$("[data-approval]")) el.hidden = !on;
    phone.hidden = !on;
  }
  function tabsOpen(on) {
    for (const t of $$('[role="tab"]'))
      if (!["chat", "changes"].includes(t.dataset.tab)) t.disabled = !on;
    if (!on) dock("changes");
  }

  function reset() {
    run++;
    paused = false;
    resume = [];
    state = "idle";
    root.classList.remove("rp-done", "rp-playing");
    asking(false);
    again.hidden = true;
    for (const [el, text] of texts) el.firstElementChild.textContent = text;
    output.textContent = "";
    shellIs("waiting", "Waiting for approval");
    pillIs("idle", "Idle");
    composer.textContent = prompt;
    composer.classList.add("rp-typed");
    start.hidden = false;
    play.disabled = false;
    skip.disabled = false;
    play.textContent = "Play";
    tabsOpen(false);
    pick(0);
    step(0);
    view("chat");
    say("A task is ready to send. Press Play.");
  }

  async function begin() {
    if (state !== "idle") reset();
    const mine = run;
    state = "playing";
    root.classList.add("rp-playing");
    start.hidden = true;
    play.textContent = "Pause";
    composer.classList.remove("rp-typed");
    composer.textContent = composer.dataset.busy;
    pillIs("running", "Running");
    say("The agent is working.");
    try {
      step(1);
      await wait(700, mine);
      step(2);
      await stream($$("[data-stream]")[0], mine);
      await wait(500, mine);
      for (const n of [3, 4, 5]) {
        step(n);
        if (n === 3) pick(0);
        await wait(750, mine);
      }
      step(6);
      await stream($$("[data-stream]")[1], mine);
      await wait(300, mine);
      ask();
    } catch (e) {
      if (e !== stopped) throw e;
    }
  }
  function ask() {
    state = "waiting";
    step(6);
    again.hidden = true;
    shellIs("waiting", "Waiting for approval");
    pillIs("approval", "Needs approval");
    asking(true);
    play.textContent = "Play";
    play.disabled = true;
    bottom();
    say(
      "Waiting for you: approve or deny npm test, here or on the phone beside it.",
    );
    // Whoever was using the replay's own controls is taken to the decision.
    if (root.contains(document.activeElement))
      $('[data-approve="desktop"]').focus({ preventScroll: true });
  }
  async function approve(where) {
    if (state !== "waiting") return;
    const mine = ++run;
    const device = where === "phone" ? "iPhone" : "MacBook";
    state = "playing";
    asking(false);
    play.disabled = false;
    play.textContent = "Pause";
    pillIs("running", "Running");
    shellIs("running", `Approved from ${device}`);
    say(`Approved from ${device}. npm test is running.`);
    try {
      const lines = fullOutput.split("\n");
      for (let i = 0; i < lines.length; i += 4) {
        output.textContent = lines.slice(0, i + 4).join("\n");
        output.scrollTop = output.scrollHeight;
        bottom();
        await wait(70, mine);
      }
      await wait(500, mine);
      finish(device);
    } catch (e) {
      if (e !== stopped) throw e;
    }
  }
  function deny(where) {
    if (state !== "waiting") return;
    const device = where === "phone" ? "iPhone" : "MacBook";
    state = "denied";
    asking(false);
    shellIs("denied", `Denied from ${device}`);
    pillIs("idle", "Idle");
    play.disabled = true;
    again.hidden = false;
    say(
      "You denied npm test, so it was not run. Nothing else happens until you decide otherwise.",
    );
    if (root.contains(document.activeElement)) again.focus();
  }
  function finish(device = "iPhone") {
    run++;
    paused = false;
    state = "done";
    root.classList.remove("rp-playing");
    root.classList.add("rp-done");
    asking(false);
    again.hidden = true;
    start.hidden = true;
    for (const [el, text] of texts) el.firstElementChild.textContent = text;
    output.textContent = fullOutput;
    shellIs("done", `Approved from ${device}`);
    pillIs("idle", "Idle");
    composer.classList.remove("rp-typed");
    composer.textContent = composer.dataset.idle;
    play.disabled = false;
    play.textContent = "Replay";
    skip.disabled = true;
    tabsOpen(true);
    step(LAST);
    output.scrollTop = output.scrollHeight;
    say(
      "The agent has finished. Look through Changes, Files, Terminal and Ports.",
    );
  }

  function dock(name) {
    root.dataset.dock = name;
    for (const t of $$('[role="tab"]'))
      t.setAttribute(
        "aria-selected",
        String(
          t.dataset.tab ===
            (root.dataset.view === "chat" && narrow() ? "chat" : name),
        ),
      );
  }
  const narrow = () => getComputedStyle($("#rp-tab-chat")).display !== "none";
  function view(name) {
    root.dataset.view = name === "chat" ? "chat" : "dock";
    dock(name === "chat" ? root.dataset.dock : name);
  }

  root.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || b.disabled) return;
    if (b.dataset.tab) view(b.dataset.tab);
    else if (b.dataset.change) pick(b.dataset.change);
    else if (b.dataset.file) {
      for (const x of $$("[data-file]"))
        x.setAttribute("aria-pressed", String(x === b));
      for (const x of $$("[data-fileview]"))
        x.hidden = x.dataset.fileview !== b.dataset.file;
    } else if (b.dataset.approve) approve(b.dataset.approve);
    else if (b.dataset.deny) deny(b.dataset.deny);
    else if (b === again) ask();
    else if (b === start) begin();
    else if (b === skip) finish();
    else if (b === play) {
      if (state === "playing") {
        paused = !paused;
        play.textContent = paused ? "Play" : "Pause";
        say(paused ? "Paused." : "The agent is working.");
        if (!paused) resume.splice(0).forEach((f) => f());
      } else begin();
    } else if ("open" in b.dataset) {
      const browser = $("[data-browser]");
      if (!$("iframe", browser)) {
        const frame = document.createElement("iframe");
        frame.title = "The issue board running on port 4173";
        frame.setAttribute("sandbox", "allow-scripts");
        frame.src = root.dataset.board;
        browser.append(frame);
      }
      browser.hidden = false;
      $("[data-close]").focus();
    } else if ("close" in b.dataset) {
      $("[data-browser]").hidden = true;
      $("[data-open]").focus();
    }
  });
  // Left and right move between the tabs, as a tab list is expected to.
  $(".rp-tabs").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = $$('[role="tab"]').filter(
      (t) => !t.disabled && t.offsetParent,
    );
    const i = tabs.indexOf(document.activeElement);
    const next =
      tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    next.focus();
    next.click();
  });

  root.classList.add("rp-on");
  reset();
})();
