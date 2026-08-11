const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Recent audits page - total audits count', () => {
  test('shows a total count with an accessible hook and GET /api/audits/count returns { count: <number> }', async ({ page, request }) => {
    // Seed an audit so we know at least one record exists in the (possibly empty) database.
    const createResponse = await request.post(`${BASE_URL}/api/audits`, {
      data: {
        url: 'https://example.com',
        issueCount: 5
      }
    });
    expect(createResponse.ok()).toBeTruthy();

    // Verify the API contract directly.
    const countResponse = await request.get(`${BASE_URL}/api/audits/count`);
    expect(countResponse.ok()).toBeTruthy();
    const countBody = await countResponse.json();
    expect(countBody).toHaveProperty('count');
    expect(typeof countBody.count).toBe('number');
    expect(countBody.count).toBeGreaterThanOrEqual(1);

    // Verify the UI surfaces the same count via a stable, accessible hook.
    // Navigate AFTER seeding (and after the API call above resolves) so the
    // page's render pass has a real record to reflect. We wait for the
    // network to settle rather than relying on a single synchronous check,
    // since the count is populated via a client-side fetch after load.
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const countTestId = page.getByTestId('audit-count');
    const countText = page.getByText(/Total audits:\s*\d+/i);

    await Promise.race([
      countTestId.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
      countText.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    ]);

    const testIdVisible = await countTestId.isVisible().catch(() => false);
    const textVisible = await countText.isVisible().catch(() => false);

    expect(testIdVisible || textVisible).toBeTruthy();

    // Not just visible - the number shown must match what the API reports.
    if (testIdVisible) {
      await expect(countTestId).toContainText(String(countBody.count));
    } else {
      await expect(countText).toContainText(String(countBody.count));
    }
  });
});
