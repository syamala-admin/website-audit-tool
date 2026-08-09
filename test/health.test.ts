import request from 'supertest';
import { createApp } from '../src/app';

/**
 * Unit/integration coverage plus an acceptance-level check of the
 * GET /health endpoint contract, using the authorized Jest + Supertest
 * stack (no separate e2e framework is introduced).
 */
describe('GET /health', () => {
  const app = createApp();

  it('returns 200 with { status: "ok" }', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('acceptance: satisfies the GET /health 200 + { status: "ok" } contract end-to-end via HTTP', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
