const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('POST /api/audits with an invalid url returns 400 and creates nothing, while a valid url still succeeds and appears in Recent audits', async ({ request }) => {
  // --- Invalid URL case ---
  const invalidUrl = 'not-a-url';

  const invalidResponse = await request.post(`${BASE_URL}/api/audits`, {
    data: { url: invalidUrl, issueCount: 0 }
  });

  expect(invalidResponse.status()).toBe(400);

  const invalidBody = await invalidResponse.json();
  expect(invalidBody).toHaveProperty('error');
  expect(typeof invalidBody.error).toBe('string');
  expect(invalidBody.error.length).toBeGreaterThan(0);

  // Confirm nothing was created for the invalid url
  const listAfterInvalid = await request.get(`${BASE_URL}/api/audits`);
  expect(listAfterInvalid.ok()).toBeTruthy();
  const auditsAfterInvalid = await listAfterInvalid.json();
  const invalidMatch = auditsAfterInvalid.find((a) => a.url === invalidUrl);
  expect(invalidMatch).toBeUndefined();

  // --- Valid URL case ---
  const validUrl = `https://example.com/valid-audit-${Date.now()}`;

  const validResponse = await request.post(`${BASE_URL}/api/audits`, {
    data: { url: validUrl, issueCount: 0 }
  });

  expect(validResponse.ok()).toBeTruthy();
  const validBody = await validResponse.json();
  expect(validBody).toHaveProperty('url', validUrl);

  // Confirm the valid audit now shows up in the Recent audits list
  const listAfterValid = await request.get(`${BASE_URL}/api/audits`);
  expect(listAfterValid.ok()).toBeTruthy();
  const auditsAfterValid = await listAfterValid.json();
  const validMatch = auditsAfterValid.find((a) => a.url === validUrl);
  expect(validMatch).toBeDefined();
});
