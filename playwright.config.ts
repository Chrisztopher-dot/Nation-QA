import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env')
});

/**
 * QA DEBUG CONFIG
 *
 * 2026-09-21
 *
 * Firefox är tillfälligt avstängt eftersom Playwright
 * inte kan starta Firefox lokalt:
 *
 * "Could not find profile folder"
 *
 * Chromium och WebKit fungerar.
 *
 * Dessutom körs testerna sekventiellt för att undersöka
 * om flera tester som använder samma testkonto stör
 * varandras sessioner.
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: 1,

  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    // Tillfälligt avstängd
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },
  ],
});