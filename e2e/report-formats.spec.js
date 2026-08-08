const { test, expect } = require('@playwright/test');

test('AC8: system returns findings in valid JSON format', async ({ request }) => {
  const response = await request.post('/audit', {
    data: { url: 'https://example.com' },
    headers: { Accept: 'application/json' },
  });
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/json');

  const body = await response.json();
  expect(body).toBeTruthy();
  expect(typeof body).toBe('object');
});

test('AC9: system returns the audit report in clean, printable HTML format displayed on screen', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel(/url/i).fill('https://example.com');
  await page.getByRole('button', { name: /submit/i }).click();

  const reportHeading = page.getByRole('heading', { name: /audit report/i });
  await expect(reportHeading).toBeVisible({ timeout: 30000 });

  const bodyText = await page.locator('body').innerText();
  expect(bodyText.toLowerCase()).toContain('severity');
});
