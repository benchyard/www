// Interactive local desktop illustration. No commands reach a server or operating system.
const computer = document.querySelector(".cc-computer");
const toggle = computer?.querySelector("[data-computer-toggle]");
const desktop = computer?.querySelector(".gd-desktop");
const copy = JSON.parse(computer?.dataset.desktopCopy || "{}");
const windows = [...document.querySelectorAll("[data-app-window]")];
let topLayer = 20;
let demoTimer;
let demoRunning = false;
const demoButton = computer?.querySelector("[data-agent-demo]");
const demoProgress = computer?.querySelector("[data-agent-progress]");
function stopDemo() {
  clearTimeout(demoTimer);
  if (!demoRunning) return;
  demoRunning = false;
  demoButton.textContent = copy.replayDemo;
  demoButton.setAttribute("aria-pressed", "false");
  demoProgress.textContent = copy.demoStopped;
}
desktop?.addEventListener("pointerdown", stopDemo, true);
desktop?.addEventListener("keydown", stopDemo, true);
function bringForward(win) {
  for (const item of windows)
    item.classList.toggle("gd-window-front", item === win);
  win.style.zIndex = String(++topLayer);
}
function openApp(name, focus = true) {
  if (computer.classList.contains("cc-is-sleeping")) return;
  const win = windows.find((item) => item.dataset.appWindow === name);
  if (!win) return;
  win.hidden = false;
  bringForward(win);
  if (name === "terminal" && focus)
    win.querySelector("input").focus({ preventScroll: true });
}
for (const button of document.querySelectorAll("[data-open-app]"))
  button.addEventListener("click", () => openApp(button.dataset.openApp));
for (const win of windows) {
  win.addEventListener("pointerdown", () => bringForward(win));
  win.addEventListener("focusin", () => bringForward(win));
  win.querySelector("[data-close-app]").addEventListener("click", () => {
    win.hidden = true;
    const next = windows
      .filter((item) => !item.hidden)
      .sort(
        (a, b) => (Number(b.style.zIndex) || 0) - (Number(a.style.zIndex) || 0),
      )[0];
    if (next) bringForward(next);
    document
      .querySelector(`.gd-dock [data-open-app="${win.dataset.appWindow}"]`)
      .focus({ preventScroll: true });
  });
  const handle = win.querySelector("[data-drag-window]");
  let drag;
  function move(left, top) {
    const maxLeft = Math.max(0, desktop.clientWidth - win.offsetWidth);
    const maxTop = Math.max(32, desktop.clientHeight - win.offsetHeight - 65);
    win.style.left = `${Math.max(0, Math.min(left, maxLeft))}px`;
    win.style.top = `${Math.max(32, Math.min(top, maxTop))}px`;
    win.style.right = "auto";
    win.style.bottom = "auto";
  }
  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || matchMedia("(max-width:700px)").matches) return;
    event.preventDefault();
    bringForward(win);
    drag = {
      x: event.clientX,
      y: event.clientY,
      left: win.offsetLeft,
      top: win.offsetTop,
    };
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener("pointermove", (event) => {
    if (drag)
      move(
        drag.left + event.clientX - drag.x,
        drag.top + event.clientY - drag.y,
      );
  });
  for (const name of ["pointerup", "pointercancel", "lostpointercapture"])
    handle.addEventListener(name, () => {
      drag = null;
    });
  handle.addEventListener("keydown", (event) => {
    if (!event.altKey || matchMedia("(max-width:700px)").matches) return;
    const direction = {
      ArrowLeft: [-16, 0],
      ArrowRight: [16, 0],
      ArrowUp: [0, -16],
      ArrowDown: [0, 16],
    }[event.key];
    if (!direction) return;
    event.preventDefault();
    bringForward(win);
    move(win.offsetLeft + direction[0], win.offsetTop + direction[1]);
  });
}
toggle?.addEventListener("click", () => {
  stopDemo();
  const sleeping = toggle.getAttribute("aria-pressed") !== "true";
  toggle.setAttribute("aria-pressed", String(sleeping));
  toggle.textContent = sleeping
    ? toggle.dataset.sleepLabel
    : toggle.dataset.activeLabel;
  computer.classList.toggle("cc-is-sleeping", sleeping);
  demoButton.disabled = sleeping;
  computer.querySelector("[data-computer-state]").textContent = sleeping
    ? toggle.dataset.sleepState
    : toggle.dataset.activeState;
  computer.querySelector("[data-computer-task]").textContent = sleeping
    ? toggle.dataset.sleepTask
    : toggle.dataset.activeTask;
  computer.querySelector(".gd-sleep-overlay").hidden = !sleeping;
  for (const el of desktop.querySelectorAll("button,input,[tabindex]")) {
    if ("disabled" in el) el.disabled = sleeping;
    else el.tabIndex = sleeping ? -1 : 0;
  }
});
for (const button of document.querySelectorAll("[data-preview-file]"))
  button.addEventListener("click", () => {
    const name = button.dataset.previewFile;
    computer.querySelector("[data-file-preview]").textContent =
      name === "progress.md"
        ? copy.filePreview
        : name === "release-notes.md"
          ? copy.releasePreview
          : copy.folderPreview;
    for (const item of document.querySelectorAll("[data-preview-file]"))
      item.classList.toggle("gd-file-selected", item === button);
  });
computer
  ?.querySelector("[data-preview-explore]")
  .addEventListener("click", () => openApp("files"));
const form = computer?.querySelector(".gd-terminal-form");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  const command = input.value.trim();
  input.value = "";
  if (!command) return;
  const output = computer.querySelector("[data-terminal-output]");
  if (command === "clear") output.textContent = "";
  else {
    const result =
      command === "help"
        ? copy.help
        : command === "pwd"
          ? copy.path
          : command === "ls"
            ? copy.listing
            : command === "cat progress.md"
              ? copy.filePreview
              : copy.unknown;
    output.textContent = (
      output.textContent +
      "\n\n" +
      copy.prompt +
      " " +
      command +
      "\n" +
      result
    ).slice(-10000);
    output.scrollTop = output.scrollHeight;
  }
});

demoButton?.addEventListener("click", () => {
  if (demoRunning) return stopDemo();
  demoRunning = true;
  demoButton.textContent = copy.stopDemo;
  demoButton.setAttribute("aria-pressed", "true");
  const command = (value) => {
    form.querySelector("input").value = value;
    form.requestSubmit();
  };
  const steps = [
    () => openApp("terminal", false),
    () => command("ls"),
    () => command("cat progress.md"),
    () => {
      openApp("files", false);
      computer.querySelector('[data-preview-file="progress.md"]').click();
    },
    () => openApp("browser", false),
  ];
  let index = 0;
  function advance() {
    if (!demoRunning) return;
    if (index === steps.length) {
      demoRunning = false;
      demoButton.textContent = copy.replayDemo;
      demoButton.setAttribute("aria-pressed", "false");
      demoProgress.textContent = copy.demoComplete;
      return;
    }
    demoProgress.textContent = copy.demoSteps[index];
    steps[index++]();
    demoTimer = setTimeout(advance, 1100);
  }
  advance();
});
