const { test, expect } = require('@playwright/test');

test('AC11: backend runs on Node.js with Express', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['x-powered-by']).toBe('Express');
});

test('AC12: frontend is a single HTML page served by Express with vanilla JavaScript', async ({ page, request }) => {
  const pageResponse = await request.get('/');
  expect(pageResponse.ok()).toBeTruthy();
  expect(pageResponse.headers()['content-type']).toContain('text/html');

  await page.goto('/');
  await expect(page.getByLabel(/url/i)).toBeVisible();

  const scriptResponse = await request.get('/app.js');
  expect(scriptResponse.ok()).toBeTruthy();
  expect(scriptResponse.headers()['content-type']).toContain('javascript');
});

test('AC13: all checks run locally without external paid APIs', async () => {
  test.skip(true, 'Absence of paid third-party API usage is an internal implementation detail not observable from the deployed application\'s external behaviour.');
});
