const { test, expect } = require('@playwright/test');

test('AC1: user can submit a URL via a web form on the frontend', async ({ page }) => {
  await page.goto('/');

  const urlInput = page.getByLabel(/url/i);
  await expect(urlInput).toBeVisible();

  await urlInput.fill('https://example.com');

  const submitButton = page.getByRole('button', { name: /submit/i });
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  await expect(page.getByRole('heading', { name: /audit report/i })).toBeVisible({ timeout: 30000 });
});
