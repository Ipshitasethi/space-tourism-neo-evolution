const request = require('supertest');
const app = require('../app');

describe('Missions API', () => {
  it('GET /api/missions should return 200 and list of missions', async () => {
    const res = await request(app).get('/api/missions');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.missions)).toBe(true);
  });

  it('GET /api/missions/active should return 200 and non-full missions', async () => {
    const res = await request(app).get('/api/missions/active');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    res.body.data.missions.forEach(m => {
      expect(m.status).not.toBe('Full');
    });
  });

  it('GET /api/missions/:id should return 404 for non-existent mission', async () => {
    const res = await request(app).get('/api/missions/MSN-999');
    expect(res.statusCode).toEqual(404);
  });
});
