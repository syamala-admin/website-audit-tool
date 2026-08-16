# E2E Acceptance Tests

This suite verifies the "Show each audit's date and time" requirement against a real running instance of the Website Audit Tool.

## Run steps

```bash
npm i -D @playwright/test
npx playwright install chromium
BASE_URL=<your-deployed-url> npx playwright test
```

If `BASE_URL` is not set, tests default to `http://localhost:3000`.

Reports are written to `playwright-report/` (HTML report and `results.json`). Screenshots, videos, and traces are captured for every test run.
