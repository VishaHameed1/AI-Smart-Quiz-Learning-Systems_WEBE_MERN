process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');

// Mock AI generation test
describe('AI Question Generation', () => {
  test('Should generate questions from topic', async () => {
    const response = await request(app)
      .post('/api/ai/generate-questions')
      .send({
        topic: 'JavaScript Basics',
        numberOfQuestions: 3,
        difficulty: 'medium'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
  
  test('Should handle invalid topic', async () => {
    const response = await request(app)
      .post('/api/ai/generate-questions')
      .send({
        topic: '',
        numberOfQuestions: 0
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});