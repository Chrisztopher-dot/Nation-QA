import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env')
});

/**
 * QA DEBUG CONFIG
 *
 * Firefox är tillfälligt avstängt eftersom Playwright
 * inte kan starta Firefox lokalt:
 *
 * "Could not find profile folder"
 *
 * Chromium och WebKit fungerar.
 *
 * Tester körs sekventiellt eftersom samma testkonto
 * används i flera tester.
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
    storageState: 'playwright-auth/user.json',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined,
      },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      testIgnore: /auth\/(login|logout)\.spec\.ts/,
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      testIgnore: /auth\/(login|logout)\.spec\.ts/,
      dependencies: ['setup'],
    },

    {
      name: 'auth-chromium',
      testMatch: /auth\/(login|logout)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined,
      },
    },

    {
      name: 'auth-webkit',
      testMatch: /auth\/(login|logout)\.spec\.ts/,
      use: {
        ...devices['Desktop Safari'],
        storageState: undefined,
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