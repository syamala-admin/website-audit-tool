# End-to-End Tests for Audit Deletion

This directory contains Playwright end-to-end tests for the "Delete audit from Recent audits list" feature.

## Setup

1. Install Playwright and dependencies:
   ```bash
   npm install -D @playwright/test
   ```

2. Install the Chromium browser:
   ```bash
   npx playwright install chromium
   ```

## Running the Tests

Run all tests:
```bash
BASE_URL=http://localhost:3000 npx playwright test
```

Run tests in headed mode (with visible browser):
```bash
BASE_URL=http://localhost:3000 npx playwright test --headed
```

Run a specific test file:
```bash
BASE_URL=http://localhost:3000 npx playwright test audit-delete.e2e.js
```

Run tests against staging:
```bash
BASE_URL=https://staging.example.com npx playwright test
```

## Viewing Test Results

After tests complete, view the HTML report:
```bash
npx playwright show-report
```

Test artifacts (screenshots, videos, traces) are saved to `playwright-report/`.

## Test Coverage

The test suite covers the following acceptance criteria:
1. Each audit item displays a Delete button with proper labeling
2. DELETE /api/audits/:id returns 204 or 200 with {deleted:true}
3. DELETE /api/audits/:id with non-existent id returns 404
4. Clicking Delete removes audit without page reload
5. Deleted audit does not reappear after page reload
6. GET /api/audits excludes deleted audit
7. Deleting last audit shows "No audits yet." empty state
