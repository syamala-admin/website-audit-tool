// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testMatch: '**/*.e2e.js',
  reporter: [['html'], ['json', { outputFile: 'playwright-report/results.json' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'on',
    video: 'on',
    trace: 'on'
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ]
});
