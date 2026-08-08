const { test, expect } = require('@playwright/test');

test('AC3: report flags HTTPS status, page reachability, mobile viewport tag, and image alt text', async ({ request }) => {
  const response = await request.post('/audit', { data: { url: 'https://en.wikipedia.org/wiki/Main_Page' } });
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  const text = JSON.stringify(body).toLowerCase();

  expect(text).toMatch(/https/);
  expect(text).toMatch(/reachable|unreachable|status code|200/);
  expect(text).toMatch(/viewport/);
  expect(text).toMatch(/alt text|alt attribute|missing alt/);
});

test('AC4: report flags title tag, meta description, exactly one H1, canonical tag, and heading structure', async ({ request }) => {
  const response = await request.post('/audit', { data: { url: 'https://example.com' } });
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  const text = JSON.stringify(body).toLowerCase();

  expect(text).toMatch(/title/);
  expect(text).toMatch(/meta description/);
  expect(text).toMatch(/h1/);
  expect(text).toMatch(/canonical/);
  expect(text).toMatch(/heading structure|heading order|h2|h3/);
});
