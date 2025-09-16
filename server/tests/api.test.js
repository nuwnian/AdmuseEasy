const request = require('supertest');
const app = require('../index');

describe('API Health Check', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('AdmuseEasy API is running!');
  });
});

describe('Ad Generation API', () => {
  test('POST /api/generate-copy should work with valid data', async () => {
    const testProduct = {
      name: 'Test Product',
      description: 'A test product for testing',
      audience: 'Test users'
    };
    
    const response = await request(app)
      .post('/api/generate-copy')
      .send({
        product: testProduct,
        mascot: 'capybara'
      })
      .expect(200);
    
    expect(response.body).toHaveProperty('copy');
    expect(response.body.copy).toHaveProperty('headline');
    expect(response.body.copy).toHaveProperty('tagline');
    expect(response.body.copy).toHaveProperty('cta');
    expect(response.body.copy).toHaveProperty('blurb');
  });

  test('POST /api/generate-copy should reject invalid mascot', async () => {
    const response = await request(app)
      .post('/api/generate-copy')
      .send({
        product: { name: 'Test', description: 'Test', audience: 'Test' },
        mascot: 'invalid_mascot'
      })
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Invalid mascot selection');
  });
});