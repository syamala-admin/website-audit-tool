const { test, expect } = require('@playwright/test');

test('AC2: system fetches the submitted URL and handles timeouts/errors gracefully', async ({ page }) => {
  await page.goto('/');

  const badUrl = 'https://this-domain-does-not-exist-abcdef123456.invalid';
  await page.getByLabel(/url/i).fill(badUrl);
  await page.getByRole('button', { name: /submit/i }).click();

  await expect(page.getByText(/unable to reach url/i)).toBeVisible({ timeout: 30000 });
  await expect(page.getByText(badUrl)).toBeVisible();
});
