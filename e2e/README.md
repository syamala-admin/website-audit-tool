# End-to-End Tests for Recent Audits Feature

These tests verify the complete user flow for saving and displaying recent audits.

## Setup

1. Install Playwright dependencies:
   ```bash
   npm i -D @playwright/test
   ```

2. Install the Chromium browser:
   ```bash
   npx playwright install chromium
   ```

## Running the Tests

Start the application server first:
```bash
npm start
```

Then, in another terminal, run the end-to-end tests:
```bash
BASE_URL=http://localhost:3000 npx playwright test
```

### Running against a different environment

To run tests against a staging or preview deployment, set the `BASE_URL` environment variable:
```bash
BASE_URL=https://staging.example.com npx playwright test
```

### Viewing test results

After the test run completes, view the HTML report:
```bash
npx playwright show-report
```

This will open a browser showing detailed results, screenshots, videos, and traces for each test.

## Test Structure

Each test file matches the pattern `*.e2e.js` and verifies one acceptance criterion.
- **audit.e2e.js** — Tests for the audit persistence and retrieval feature, including API responses and UI display behavior.

## Troubleshooting

- **Tests fail with "Connection refused"**: Ensure the application is running on the expected `BASE_URL` before starting tests.
- **"No audits yet" test skips**: This is expected if audits exist in the database. The test verifies the empty state behavior and skips if data is already present.
- **Timeout errors**: The application may take longer to process audits. Increase `waitForTimeout` values in the test if needed.
