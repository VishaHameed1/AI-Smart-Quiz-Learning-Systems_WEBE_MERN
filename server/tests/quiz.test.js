const request = require('supertest');
const app = require('../app');

describe('Quiz API Tests', () => {
  test('GET /api/health should return success', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
