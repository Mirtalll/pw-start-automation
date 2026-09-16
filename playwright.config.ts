import { defineConfig, devices } from '@playwright/test';
import os from 'os';

export default defineConfig({
  testDir: './',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        attachments: {
          'failed-only': true,
        },
        detail: false,
        suiteTitle: true,
        environmentInfo: {
          os_platform: os.platform(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],

  use: {
    baseURL: 'https://playwright.dev',
    trace: 'off',
    actionTimeout: 30000,
    navigationTimeout: 30000,
    headless: true,
    ignoreHTTPSErrors: true,
  },
  expect: {
    timeout: 30000,
  },

  projects: [
    {
      name: 'playwright',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: 'tests/**/*.spec.ts',
    },
  ],
});
