import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

test('GET /health returns 200 with { "status": "ok" }', async ({ request }) => {
  const response = await request.get(`${baseURL}/health`);
  
  expect(response.status()).toBe(200);
  
  const body = await response.json();
  expect(body).toEqual({ status: 'ok' });
});
