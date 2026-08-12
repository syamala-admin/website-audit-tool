import request from 'supertest';
import { app } from '../src/app';

describe('GET /api/audits/count', () => {
  it('returns a total audits count as { count: <number> }', async () => {
    const res = await request(app).get('/api/audits/count');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('count');
    expect(typeof res.body.count).toBe('number');
    expect(Number.isInteger(res.body.count)).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(0);
  });

  it('count matches the number of audits returned by GET /api/audits', async () => {
    const [countRes, listRes] = await Promise.all([
      request(app).get('/api/audits/count'),
      request(app).get('/api/audits'),
    ]);

    expect(countRes.status).toBe(200);
    expect(listRes.status).toBe(200);

    const audits = Array.isArray(listRes.body) ? listRes.body : listRes.body.audits;
    expect(countRes.body.count).toBe(audits.length);
  });
});
