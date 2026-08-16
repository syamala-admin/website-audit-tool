# E2E Acceptance Tests

These Playwright tests verify the observable, end-to-end behaviour of the Website Audit Tool against a running instance of the application (local, staging, or a preview URL).

## Run steps

```bash
npm i -D @playwright/test
npx playwright install chromium
BASE_URL=<url> npx playwright test
```

- `BASE_URL` defaults to `http://localhost:3000` if not set.
- Test files use the `.e2e.js` suffix and are matched via `testMatch: '**/*.e2e.js'` in `playwright.config.js`, so they never collide with the Jest unit test runner (`npm test`).
- Every test run captures a screenshot, video, and trace for review in `playwright-report/`.
