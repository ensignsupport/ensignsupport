import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.TEST_PORT ?? 3100);

export default defineConfig({
  testDir: "./tests",
  testIgnore: ["unit/**"], // Vitest runs these
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // The cloud test machine ships its own Chromium. Locally Playwright uses its own.
        launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
      },
    },
  ],
  // The site with a throwaway database, plus a second copy whose database is
  // unreachable (to prove a failed save is never reported as sent).
  webServer: [
    {
      command: `node scripts/test-server.mjs ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: false,
      timeout: 90_000,
    },
    {
      command: `node scripts/test-server.mjs ${PORT + 1} --broken-db`,
      url: `http://localhost:${PORT + 1}`,
      reuseExistingServer: false,
      timeout: 90_000,
    },
  ],
});
