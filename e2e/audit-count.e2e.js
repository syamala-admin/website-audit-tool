const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Total audits count on the Recent audits page', () => {

  test('Recent audits page shows a total count with an accessible hook (data-testid="audit-count" or visible "Total audits: N")', async ({ page }) => {
    await page.goto(BASE_URL);

    const countTestId = page.getByTestId('audit-count');
    const visibleText = page.getByText(/Total audits:\s*\d+/i);

    const testIdVisible = await countTestId.isVisible().catch(() => false);
    const textVisible = await visibleText.isVisible().catch(() => false);

    expect(testIdVisible || textVisible).toBeTruthy();

    if (testIdVisible) {
      const text = await countTestId.innerText();
      expect(text).toMatch(/\d+/);
    } else {
      const text = await visibleText.innerText();
      expect(text).toMatch(/Total audits:\s*\d+/i);
    }
  });

  test('GET /api/audits/count returns { count: <number> }', async ({ request }) => {
    const response = await request.get(BASE_URL + '/api/audits/count');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty('count');
    expect(typeof body.count).toBe('number');
    expect(Number.isInteger(body.count)).toBeTruthy();
    expect(body.count).toBeGreaterThanOrEqual(0);
  });

});
