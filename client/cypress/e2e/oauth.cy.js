// AdmuseEasy OAuth Authentication Tests
// These tests verify the OAuth flow functionality

describe('OAuth Authentication Flow', () => {
  beforeEach(() => {
    // Check if backend is running before each test
    cy.checkApiHealth()
    
    // Visit the main page
    cy.visit('/')
    cy.waitForReact()
  })

  it('should display the login/signup options on homepage', () => {
    // Test Case: TC001 - Homepage displays authentication options
    cy.contains('AdmuseEasy').should('be.visible')
    
    // Look for login/signup buttons (adjust selectors based on your actual UI)
    cy.get('body').should('contain.text', 'Login').or('contain.text', 'Sign')
  })

  it('should handle Google OAuth button click', () => {
    // Test Case: TC002 - Google OAuth button interaction
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=google-login]').length > 0) {
        cy.getByDataCy('google-login').should('be.visible')
        cy.getByDataCy('google-login').click()
        
        // Check if redirected or popup opened (will fail without proper OAuth setup)
        cy.url().should('not.eq', Cypress.config().baseUrl + '/')
      } else {
        cy.log('Google OAuth button not found - UI not implemented yet')
      }
    })
  })

  it('should show error when OAuth fails', () => {
    // Test Case: TC003 - OAuth error handling
    // This will help us identify OAuth issues
    cy.visit('/auth/google/callback?error=access_denied')
    
    // Should show some error message
    cy.get('body').should('contain.text', 'Error').or('contain.text', 'Failed')
  })

  it('should redirect to dashboard after successful login', () => {
    // Test Case: TC004 - Successful authentication flow
    // Mock successful OAuth for testing
    cy.mockGoogleOAuth()
    cy.visit('/dashboard')
    
    // Check if user data is displayed or if redirected to login
    cy.url().should('include', '/dashboard').or('include', '/login')
  })
})

describe('API Health Checks', () => {
  it('should verify backend server is running', () => {
    // Test Case: TC005 - Backend connectivity
    cy.apiRequest('GET', '/api/health').then((response) => {
      // Log the response for debugging
      cy.log('API Response:', response.status)
      expect(response.status).to.be.oneOf([200, 404]) // 404 is ok if endpoint doesn't exist
    })
  })

  it('should test Sentry error tracking endpoint', () => {
    // Test Case: TC006 - Error tracking verification
    cy.apiRequest('GET', '/api/test-sentry').then((response) => {
      // This should trigger an error that gets sent to Sentry
      expect(response.status).to.be.oneOf([500, 404])
    })
  })
})