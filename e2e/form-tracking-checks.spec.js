const { test, expect } = require('@playwright/test');

test('AC5: report detects contact/lead form existence and validates action attribute and required fields', async ({ request }) => {
  const response = await request.post('/audit', { data: { url: 'https://httpbin.org/forms/post' } });
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  const text = JSON.stringify(body).toLowerCase();

  expect(text).toMatch(/form/);
  expect(text).toMatch(/action/);
  expect(text).toMatch(/required/);
});

test('AC6: report detects presence of Google Analytics, GTM, Facebook Pixel, and flags if none are found', async ({ request }) => {
  const response = await request.post('/audit', { data: { url: 'https://example.com' } });
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  const text = JSON.stringify(body).toLowerCase();

  expect(text).toMatch(/google analytics|gtm|tag manager|facebook pixel|tracking/);
  expect(text).toMatch(/none found|not detected|no tracking|missing tracking/);
});
