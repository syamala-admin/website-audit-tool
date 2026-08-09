# End-to-End Tests

End-to-end acceptance tests for the Website Audit Tool, using Playwright.

## Setup

```bash
npm i -D @playwright/test
npx playwright install chromium
```

## Run Tests

### Against local development server (default `http://localhost:3000`):

```bash
npx playwright test
```

### Against a specific URL:

```bash
BASE_URL=http://staging.example.com npx playwright test
```

### Run a single test file:

```bash
npx playwright test e2e/health-check.e2e.js
```

### View HTML report:

```bash
npx playwright show-report
```

## Notes

- All test files use the `.e2e.js` suffix to avoid conflicts with Jest/Vitest unit tests.
- Tests read `BASE_URL` from the environment, defaulting to `http://localhost:3000`.
- Tests use Playwright's `request` fixture for API assertions and browser automation for UI tests.
