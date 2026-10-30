import {defineConfig, devices} from "@playwright/test";

const PORT = 5199;

/**
 * End-to-end checks of the public shop against the real Supabase project in `.env.local`. They only read the
 * catalogue and use the cart in local storage; no order, account or review is ever written.
 */
export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? "github" : "list",
    use: {
        baseURL: `http://localhost:${PORT}`,
        // The installed Chrome, so no browser download is needed; CI can switch to the bundled Chromium.
        channel: process.env.CI ? undefined : "chrome",
        trace: "retain-on-failure",
    },
    projects: [
        {name: "desktop", use: {...devices["Desktop Chrome"]}, testIgnore: /mobile.spec.ts/},
        {name: "mobile", use: {...devices["Pixel 7"]}, testMatch: /mobile\.spec\.ts/},
    ],
    webServer: {
        command: `npx vite --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
});
