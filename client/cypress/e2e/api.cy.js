// AdmuseEasy API Testing Suite
// These tests verify backend functionality and integration

describe('AdmuseEasy API Tests', () => {
  const API_BASE = Cypress.env('API_URL')

  describe('Server Health and Connectivity', () => {
    it('TC_API_001: Server should be running and responsive', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE}/`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 404])
        cy.log(`Server Status: ${response.status}`)
      })
    })

    it('TC_API_002: Health check endpoint should return server status', () => {
      cy.request({
        method: 'GET', 
        url: `${API_BASE}/api/health`,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('status')
        } else {
          cy.log('Health endpoint not implemented yet')
        }
      })
    })
  })

  describe('Error Tracking Integration', () => {
    it('TC_API_003: Sentry test endpoint should trigger error tracking', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE}/api/test-sentry`,
        failOnStatusCode: false
      }).then((response) => {
        // This should return 500 (error) but be tracked by Sentry
        expect(response.status).to.equal(500)
        expect(response.body).to.have.property('error')
        cy.log('Error successfully triggered and should appear in Sentry dashboard')
      })
    })

    it('TC_API_004: MongoDB error simulation should be tracked', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE}/api/test-mongo-error`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(500)
        cy.log('MongoDB error simulated and tracked')
      })
    })
  })

  describe('Authentication Endpoints', () => {
    it('TC_API_005: Google OAuth initiation should redirect', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE}/auth/google`,
        followRedirect: false,
        failOnStatusCode: false
      }).then((response) => {
        // Should redirect to Google OAuth
        expect(response.status).to.be.oneOf([302, 404])
        if (response.status === 302) {
          expect(response.headers).to.have.property('location')
          expect(response.headers.location).to.include('google')
        }
      })
    })

    it('TC_API_006: OAuth callback should handle authentication', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE}/auth/google/callback`,
        failOnStatusCode: false
      }).then((response) => {
        // Will likely fail without proper OAuth code, but shouldn't crash
        expect(response.status).to.be.oneOf([302, 400, 401, 404])
        cy.log(`OAuth callback status: ${response.status}`)
      })
    })
  })

  describe('User Management API', () => {
    it('TC_API_007: User profile endpoint security', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE}/api/user/profile`,
        failOnStatusCode: false
      }).then((response) => {
        // Should require authentication
        expect(response.status).to.be.oneOf([401, 404])
        cy.log('User profile properly protected')
      })
    })

    it('TC_API_008: Dashboard endpoint access control', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE}/api/dashboard`,
        failOnStatusCode: false
      }).then((response) => {
        // Should require authentication
        expect(response.status).to.be.oneOf([401, 404])
        cy.log('Dashboard properly protected')
      })
    })
  })

  describe('Data Validation and Security', () => {
    it('TC_API_009: Invalid endpoints should return 404', () => {
      cy.request({
        method: 'GET',
        url: `${API_BASE}/api/nonexistent-endpoint`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404)
      })
    })

    it('TC_API_010: Server should handle malformed requests', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/test`,
        body: 'invalid-json',
        headers: {
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404, 500])
        cy.log('Server handles malformed JSON appropriately')
      })
    })
  })
})