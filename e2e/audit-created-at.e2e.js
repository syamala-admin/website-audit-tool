const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Recent audits list - created_at display', () => {
  test('each audit row shows its creation date/time in a human-readable format, GET /api/audits includes created_at for each audit, and the empty state ("No audits yet.") is unchanged', async ({ page, request }) => {
    // First, verify the empty state is shown when there are no audits yet.
    await page.goto(baseURL);
    await expect(page.getByText('No audits yet.')).toBeVisible();

    // Seed an audit via the API with the full required body.
    const uniqueUrl = `https://example.com/audit-${Date.now()}`;
    const createRes = await request.post(`${baseURL}/api/audits`, {
      data: { url: uniqueUrl, issueCount: 4 }
    });
    expect(createRes.ok()).toBeTruthy();
    const created = await createRes.json();
    expect(created.created_at).toBeTruthy();

    // Verify GET /api/audits includes the created_at value for each audit.
    const listRes = await request.get(`${baseURL}/api/audits`);
    expect(listRes.ok()).toBeTruthy();
    const audits = await listRes.json();
    expect(Array.isArray(audits)).toBeTruthy();
    const found = audits.find((a) => a.url === uniqueUrl);
    expect(found).toBeTruthy();
    expect(found.created_at).toBeTruthy();

    // Reload the page so the newly created audit is rendered, then verify
    // the row shows the created_at timestamp in a human-readable format
    // next to the URL and issue count.
    await page.goto(baseURL);

    const row = page.getByTestId('audit-row').filter({ hasText: uniqueUrl });
    await expect(row).toBeVisible();
    await expect(row.getByText('4')).toBeVisible();

    const createdAtLocator = row.getByTestId('audit-created-at');
    await expect(createdAtLocator).toBeVisible();
    const createdAtText = (await createdAtLocator.textContent()) || '';
    expect(createdAtText.trim().length).toBeGreaterThan(0);
    // Human-readable format should not be a raw ISO string with a 'T' and 'Z'
    expect(createdAtText.includes('T') && createdAtText.includes('Z')).toBeFalsy();
  });
});
