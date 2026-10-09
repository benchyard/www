import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 90000,
  expect: { timeout: 10000 },
  workers: 3,
  reporter: "list",
  use: {
    baseURL: process.env.WWW_TEST_URL || "http://localhost:4322",
    headless: true,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    {
      name: "firefox",
      use: {
        browserName: "firefox",
        launchOptions: { firefoxUserPrefs: { "network.proxy.type": 0 } },
      },
    },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
