const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Recent audits page shows a total count matching GET /api/audits/count response shape', async ({ page, request }) => {
  // Seed two audits so the count is deterministic and non-zero.
  //
  // The audit-creation endpoint only requires a `url` — the server performs the audit itself
  // and derives its own issue count. Earlier this test also sent a client-supplied `issueCount`,
  // which the endpoint doesn't accept, causing the seeding POST to fail (non-2xx) in CI. That
  // was a bad assumption in the test, not an app gap, so it's been removed here.
  //
  // Each seeded URL is unique per test run (query-string suffix) so re-running against a fresh,
  // empty database never collides with a uniqueness constraint, while still using a real,
  // reliably-resolvable domain (example.com) rather than a made-up one that could fail DNS.
  const seed = Date.now();

  const audit1 = await request.post(BASE_URL + '/api/audits', {
    data: { url: `https://example.com/?seed=${seed}-1` }
  });
  expect(audit1.ok()).toBeTruthy();

  const audit2 = await request.post(BASE_URL + '/api/audits', {
    data: { url: `https://example.com/?seed=${seed}-2` }
  });
  expect(audit2.ok()).toBeTruthy();

  // Verify the API contract: GET /api/audits/count returns { count: <number> }
  const countRes = await request.get(BASE_URL + '/api/audits/count');
  expect(countRes.ok()).toBeTruthy();
  const countBody = await countRes.json();
  expect(typeof countBody.count).toBe('number');
  expect(countBody.count).toBeGreaterThanOrEqual(2);

  // Verify the UI shows the count via the stable, accessible hook the app renders on load.
  //
  // The count is fetched and rendered asynchronously *after* the initial page load, so we use
  // Playwright's auto-retrying locator/expect APIs (no one-off, non-retried `.count()` snapshot)
  // and only assert against the `data-testid="audit-count"` hook the app actually renders,
  // checking it contains the numeric total rather than guessing at exact copy/wording.
  await page.goto(BASE_URL);

  const auditCount = page.getByTestId('audit-count');
  await expect(auditCount).toBeVisible();
  await expect(auditCount).toContainText(String(countBody.count));
});
