import request from 'supertest';
import app from '../src/server';

describe('Backend smoke tests', () => {
  it('GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('GET /api/routes returns seeded routes', async () => {
    const res = await request(app).get('/api/routes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(5);
  });

  it('GET /api/routes/comparison returns baseline', async () => {
    const res = await request(app).get('/api/routes/comparison');
    expect(res.status).toBe(200);
    expect(res.body.baseline).toBeDefined();
    expect(Array.isArray(res.body.comparisons)).toBe(true);
  });
});
