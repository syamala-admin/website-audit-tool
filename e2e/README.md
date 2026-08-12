# E2E Acceptance Tests

Playwright end-to-end acceptance tests for the "Total audits count on the Recent audits page" feature.

## Run steps

```bash
npm i -D @playwright/test
npx playwright install chromium
BASE_URL=<url> npx playwright test
```

Defaults to `http://localhost:3000` if `BASE_URL` is not set.

Reports are generated as HTML (`playwright-report/`) and JSON (`playwright-report/results.json`), with screenshots, video and trace captured for every browser test run.
