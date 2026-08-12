import request from 'supertest';
import { createApp } from '../src/app';

describe('Total audits count on the Recent audits page', () => {
  const app = createApp();

  it('GET /api/audits/count returns a JSON object with a numeric count property', async () => {
    const response = await request(app).get('/api/audits/count');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('count');
    expect(typeof response.body.count).toBe('number');
    expect(Number.isInteger(response.body.count)).toBe(true);
    expect(response.body.count).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/audits/count count matches the number of audits returned by GET /api/audits', async () => {
    const listResponse = await request(app).get('/api/audits');
    const countResponse = await request(app).get('/api/audits/count');

    expect(listResponse.status).toBe(200);
    expect(countResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(countResponse.body.count).toBe(listResponse.body.length);
  });
});
