// @ts-check
import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * @see https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/** @see https://playwright.dev/docs/test-configuration */
export default defineConfig({
    testDir: "./e2e",
    outputDir: "./playwright/results",
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        [process.env.CI ? "dot" : "list"],
        ["html", { open: "never", outputFolder: "playwright/report" }],
    ],
    use: {
        baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || undefined,
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
        {
            name: "Mobile Chrome",
            use: { ...devices["Pixel 5"] },
        },
        {
            name: "Mobile Safari",
            use: { ...devices["iPhone 12"] },
        },
    ],
    webServer: process.env.CI
        ? undefined
        : {
              command: "vite dev",
              port: 5175,
              reuseExistingServer: true,
          },
});
