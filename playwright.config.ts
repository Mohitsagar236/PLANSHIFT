import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 120000,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:4317",
    navigationTimeout: 60000,
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm.cmd run dev -- -p 4317",
    url: "http://127.0.0.1:4317",
    reuseExistingServer: true,
    timeout: 120000
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
