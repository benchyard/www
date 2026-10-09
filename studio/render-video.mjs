import { chromium } from "@playwright/test";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import { lockScreenMarkup, statusIcons } from "../src/lock-screen.mjs";
import { endCard, lockScreenCss } from "./surfaces.mjs";
import { transcript } from "../content/guides.mjs";
import { agentMark } from "../src/agents.mjs";
import content from "../content/en.mjs";
const root = new URL("../", import.meta.url).pathname;
const out = root + "studio/output";
await mkdir(root + "media", { recursive: true });
const scenes = JSON.parse(await readFile(out + "/scenes.json"));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
// Refresh the outro from the same integration registry used on the website.
await page.setViewportSize({ width: 1440, height: 900 });
await page.setContent(endCard());
await page.screenshot({ path: out + "/frames/08-end/0000.png" });
for (let n = 1; n < 50; n++)
  await copyFile(
    out + "/frames/08-end/0000.png",
    out + "/frames/08-end/" + String(n).padStart(4, "0") + ".png",
  );
// A cold open on the finished workspace, followed by the recorded task flow.
for (let n = 0; n < 50; n++)
  await copyFile(
    root + "src-img/session-approval-light.png",
    out + "/frames/01-start/" + String(n).padStart(4, "0") + ".png",
  );
await page.setViewportSize({ width: 1920, height: 1080 });
const font = await readFile(
  root + "src/fonts/bricolage-grotesque-latin-wght-normal.woff2",
);
const sans = await readFile(
  root + "src/fonts/ibm-plex-sans-latin-400-normal.woff2",
);
function frame(i, phone = false, dark = false) {
  const fg = dark ? "#e6eae5" : "#1a1e1b",
    bg = dark ? "#111513" : "#f2f3ef";
  return `<html><style>@font-face{font-family:b;src:url(data:font/woff2;base64,${font.toString("base64")})}@font-face{font-family:p;src:url(data:font/woff2;base64,${sans.toString("base64")})}*{box-sizing:border-box}body{margin:0;width:1920px;height:1080px;background:${bg};color:${fg};font:24px p}header{position:absolute;left:80px;right:80px;top:24px;display:flex;justify-content:space-between}strong{font-family:b;font-size:28px}footer{position:absolute;bottom:20px;left:80px;font-size:17px;color:${dark ? "#aab6ae" : "#5e655f"}}.label{font-size:18px;letter-spacing:2px;color:${dark ? "#79ccc5" : "#1f6b6b"}}h1{font:600 70px/1.1 b;letter-spacing:-2px;max-width:750px}.phone{position:absolute;left:1201px;top:84px;width:396px;height:860px;border:3px solid #a0a69f;border-radius:60px;background:${dark ? "#1c221e" : "#ffffff"};box-shadow:0 24px 65px #0003}.phone:after{content:'';position:absolute;bottom:15px;left:125px;width:140px;height:6px;background:${fg};border-radius:5px}.island{position:absolute;top:16px;left:50%;transform:translateX(-50%);width:130px;height:32px;border-radius:25px;background:#111}.status{position:absolute;left:29px;right:29px;top:28px;display:flex;justify-content:space-between;font-size:16px;font-weight:bold}.side{position:absolute;left:-8px;top:140px;height:60px;width:4px;background:#737b74}.copy{position:absolute;left:180px;top:260px}p{max-width:700px;color:${dark ? "#aab6ae" : "#5e655f"};font-size:28px}.agent-mark{width:45px;height:45px;margin:16px}${lockScreenCss}.video-lock{position:absolute;left:1190px;top:84px;width:418px}.status svg{width:65px;height:16px}</style><body><header><strong>Benchyard</strong><span>${String(i + 1).padStart(2, "0")} / 08 &nbsp; ${["Start a task", "Your agent at work", "Review the changes", "A decision needs you", "Approve from your phone", "Check the result", "Try the running app", "Keep work moving"][i]}</span></header>${phone ? `<div class="copy"><span class="label">THE SAME WORKSPACE. ANOTHER DEVICE.</span><h1>${i === 3 ? "A decision needs you." : "Review it.<br>Then approve."}</h1><p>${i === 3 ? "A notification takes you back to the session." : "Read the request and approve the command from your phone."}</p><p style="font-size:20px">${i === 3 ? "Simulated lock-screen notification" : "Recorded in the Benchyard mobile interface"}</p></div>${i === 3 ? `<div class="video-lock">${lockScreenMarkup()}</div>` : `<div class="phone"><div class="status"><span>9:41</span><span>${statusIcons}</span></div><div class="island"></div></div>`}` : ""}<footer>Recorded in Benchyard with demo data. Agent responses are scripted; timing is edited.</footer></body></html>`;
}
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i],
    phone = s.width === 390;
  await page.setContent(frame(i, phone));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}/frame-${i}.png` });
  const pos = phone ? "1204:150" : "240:80";
  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-loop",
      "1",
      "-i",
      `${out}/frame-${i}.png`,
      "-framerate",
      "10",
      "-i",
      `${out}/frames/${s.name}/%04d.png`,
      "-filter_complex",
      i === 3
        ? "[0:v]format=yuv420p[v]"
        : `[1:v]fps=30,tpad=stop_mode=clone:stop_duration=0.3[screen];[0:v][screen]overlay=${pos}:shortest=1,format=yuv420p[v]`,
      "-map",
      "[v]",
      "-t",
      String(s.seconds),
      "-r",
      "30",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "19",
      `${out}/part-${i}.mp4`,
    ],
    { stdio: "inherit" },
  );
  console.log("Encoded", s.name);
}
await writeFile(
  `${out}/concat.txt`,
  scenes.map((_, i) => `file 'part-${i}.mp4'`).join("\n"),
);
execFileSync("ffmpeg", [
  "-hide_banner",
  "-loglevel",
  "error",
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  `${out}/concat.txt`,
  "-c",
  "copy",
  "-movflags",
  "+faststart",
  `${out}/benchyard-demo-1080p.mp4`,
]);
execFileSync("ffmpeg", [
  "-hide_banner",
  "-loglevel",
  "error",
  "-y",
  "-i",
  `${out}/benchyard-demo-1080p.mp4`,
  "-vf",
  "scale=1280:720",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "21",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  `${root}/media/benchyard-demo-720p.mp4`,
]);
const timing = [
  "00:00:00.000",
  "00:00:05.000",
  "00:00:13.000",
  "00:00:21.000",
  "00:00:28.000",
  "00:00:38.000",
  "00:00:47.000",
  "00:00:55.000",
  "00:01:00.000",
];
await writeFile(
  root + "media/benchyard-demo.en.vtt",
  "WEBVTT\n\n" +
    transcript
      .map((x, i) => `${i + 1}\n${timing[i]} --> ${timing[i + 1]}\n${x[1]}\n`)
      .join("\n"),
);
for (const theme of ["light", "dark"]) {
  await sharp(root + `src-img/session-approval-${theme}.png`)
    .extract({ left: 880, top: 0, width: 560, height: 400 })
    .toFile(root + `src-img/hero-detail-${theme}.png`);
  const data = (
    await readFile(root + `src-img/session-approval-${theme}.png`)
  ).toString("base64");
  await page.setContent(
    frame(0, false, theme === "dark").replace(
      "</body>",
      `<div style="position:absolute;left:80px;top:200px;width:600px"><span class="label">THE 60-SECOND TOUR</span><h1>From task<br>to preview.</h1><p>Wherever you are.</p><div>${content.agents.items.map(([id]) => agentMark(id)).join("")}</div></div><img src="data:image/png;base64,${data}" style="position:absolute;width:1070px;left:770px;top:180px;border:1px solid #8885;border-radius:16px;box-shadow:0 25px 75px #0003"><div style="position:absolute;left:1230px;top:470px;width:130px;height:130px;background:#1f6b6b;border:3px solid #fff;border-radius:50%;display:grid;place-content:center;color:white;font-size:55px;padding-left:10px">▶</div></body>`,
    ),
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: root + `src-img/demo-poster-${theme}.png` });
}
await browser.close();
console.log("Video master, web video, captions and posters are ready.");
