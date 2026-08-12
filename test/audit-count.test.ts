import request from 'supertest';
import app from '../src/app';

describe('GET /api/audits/count', () => {
  it('returns the total number of audits as { count: <number> }', async () => {
    const response = await request(app).get('/api/audits/count');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('count');
    expect(typeof response.body.count).toBe('number');
    expect(response.body.count).toBeGreaterThanOrEqual(0);
  });

  it('reflects newly created audits in the count', async () => {
    const before = await request(app).get('/api/audits/count');
    const beforeCount = before.body.count;

    await request(app)
      .post('/api/audits')
      .send({ url: 'https://example.com', issueCount: 2 });

    const after = await request(app).get('/api/audits/count');

    expect(after.status).toBe(200);
    expect(after.body.count).toBe(beforeCount + 1);
  });
});
