import { existsSync } from 'fs';
import { defineConfig, devices } from '@playwright/test';

// Cloud dev containers ship a pre-installed Chromium and block browser downloads;
// CI installs Playwright's own browser instead.
const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium';
const executablePath = process.env.PW_CHROMIUM_PATH ?? (existsSync(LOCAL_CHROMIUM) && !process.env.CI ? LOCAL_CHROMIUM : undefined);

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: executablePath ? { executablePath } : {} } },
    { name: 'mobile', use: { ...devices['Pixel 5'], launchOptions: executablePath ? { executablePath } : {} } },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
