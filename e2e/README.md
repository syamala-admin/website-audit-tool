# E2E Acceptance Tests — Website Audit Tool

This suite exercises the deployed Website Audit Tool exactly as a human tester or API consumer would: submitting URLs through the real web form and calling the real HTTP endpoints.

## Run steps

```bash
npm i -D @playwright/test
npx playwright install chromium
BASE_URL=http://localhost:3000 npx playwright test
```

To run against a staging or preview deployment, just point `BASE_URL` at it:

```bash
BASE_URL=https://staging.example.com npx playwright test
```

## Notes

- Some tests submit real, stable public URLs (e.g. `https://example.com`, `https://en.wikipedia.org/wiki/Main_Page`, `https://httpbin.org/forms/post`) to the audit endpoint because the tool's core behaviour is to fetch and analyse real pages. Network flakiness on these third-party sites can occasionally affect results.
- Tests that cannot be verified from the deployed application's observable surface (e.g. presence of a README file, or unit test files in the repo) are marked `test.skip` with a reason rather than faked.
- View the HTML report after a run: `npx playwright show-report`.
