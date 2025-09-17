// AdmuseEasy API Testing Suite
// Testing all backend endpoints and functionality

const request = require('supertest');
const app = require('../index'); // Assuming your main server file

describe('AdmuseEasy API Tests', () => {
  
  describe('Health Check Endpoint', () => {
    it('GET /api/health should return 200 and server status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
      expect(response.body.message).toBe('AdmuseEasy API is running!');
    });
  });

  describe('Authentication Endpoints', () => {
    it('GET /api/auth/google should redirect to Google OAuth', async () => {
      await request(app)
        .get('/api/auth/google')
        .expect(302); // Redirect to Google
    });

    it('GET /api/auth/google/callback should handle OAuth callback', async () => {
      // Note: This would need proper OAuth token for full testing
      const response = await request(app)
        .get('/api/auth/google/callback')
        .expect(302); // Redirect after callback
    });

    it('POST /api/auth/logout should clear session', async () => {
      await request(app)
        .post('/api/auth/logout')
        .expect(200);
    });
  });

  describe('Copy Generation Endpoint', () => {
    const validProductData = {
      product: {
        name: 'Test Product',
        description: 'A great test product for everyone',
        audience: 'Tech enthusiasts'
      },
      mascot: 'capybara'
    };

    it('POST /api/generate-copy should return 400 without product data', async () => {
      const response = await request(app)
        .post('/api/generate-copy')
        .send({})
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid product data');
    });

    it('POST /api/generate-copy should return 400 with invalid mascot', async () => {
      const invalidData = {
        ...validProductData,
        mascot: 'invalid-mascot'
      };

      const response = await request(app)
        .post('/api/generate-copy')
        .send(invalidData)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid mascot selection');
    });

    it('POST /api/generate-copy should generate copy with valid data', async () => {
      const response = await request(app)
        .post('/api/generate-copy')
        .send(validProductData)
        .expect(200);
      
      expect(response.body).toHaveProperty('copy');
      expect(response.body).toHaveProperty('powered_by');
      expect(response.body.copy).toHaveProperty('headline');
      expect(response.body.copy).toHaveProperty('tagline');
      expect(response.body.copy).toHaveProperty('cta');
      expect(response.body.copy).toHaveProperty('blurb');
    });

    it('POST /api/generate-copy should handle different mascots', async () => {
      const mascots = ['capybara', 'hamster', 'parrot', 'panda'];
      
      for (const mascot of mascots) {
        const testData = { ...validProductData, mascot };
        
        const response = await request(app)
          .post('/api/generate-copy')
          .send(testData)
          .expect(200);
        
        expect(response.body.copy).toHaveProperty('headline');
        expect(response.body.copy.headline).toBeTruthy();
      }
    });

    it('POST /api/generate-copy should sanitize input data', async () => {
      const maliciousData = {
        product: {
          name: '<script>alert("xss")</script>'.repeat(10), // Long malicious string
          description: 'A'.repeat(1000), // Very long description
          audience: 'Normal audience'
        },
        mascot: 'capybara'
      };

      const response = await request(app)
        .post('/api/generate-copy')
        .send(maliciousData)
        .expect(200);
      
      // Should still work but with sanitized input
      expect(response.body).toHaveProperty('copy');
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent routes with 404', async () => {
      await request(app)
        .get('/api/non-existent-route')
        .expect(404);
    });

    it('should handle invalid JSON with 400', async () => {
      await request(app)
        .post('/api/generate-copy')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });
  });

  describe('Security Tests', () => {
    it('should have security headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      // Check for security headers (added by helmet)
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });

    it('should have CORS configured properly', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000')
        .expect(204);
      
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Performance Tests', () => {
    it('should respond to health check quickly', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/health')
        .expect(200);
      
      const responseTime = Date.now() - start;
      expect(responseTime).toBeLessThan(1000); // Less than 1 second
    });

    it('should handle concurrent requests', async () => {
      const promises = Array(10).fill().map(() => 
        request(app).get('/api/health').expect(200)
      );
      
      const responses = await Promise.all(promises);
      expect(responses).toHaveLength(10);
      responses.forEach(response => {
        expect(response.body.message).toBe('AdmuseEasy API is running!');
      });
    });
  });
});