const request = require('supertest');
const app = require('../app');

describe('Bookings API', () => {
  it('POST /api/bookings without token should return 401', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ missionId: 'MSN-001', destination: 'Mars' });
    expect(res.statusCode).toEqual(401);
  });

  it('GET /api/bookings/my without token should return 401', async () => {
    const res = await request(app).get('/api/bookings/my');
    expect(res.statusCode).toEqual(401);
  });
});
