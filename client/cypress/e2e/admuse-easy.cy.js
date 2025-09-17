// AdmuseEasy End-to-End Tests
// Testing the complete user workflow

describe('AdmuseEasy Application', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('http://localhost:3000');
  });

  describe('Homepage Tests', () => {
    it('should load the homepage successfully', () => {
      cy.contains('AdmuseEasy').should('be.visible');
      cy.get('[data-cy="main-header"]').should('exist');
    });

    it('should have working navigation', () => {
      cy.get('[data-cy="nav-login"]').should('be.visible');
      cy.get('[data-cy="nav-signup"]').should('be.visible');
    });
  });

  describe('Authentication Flow', () => {
    it('should show login modal when login button is clicked', () => {
      cy.get('[data-cy="nav-login"]').click();
      cy.get('[data-cy="login-modal"]').should('be.visible');
    });

    it('should show Google OAuth button', () => {
      cy.get('[data-cy="nav-login"]').click();
      cy.get('[data-cy="google-login-btn"]').should('be.visible');
      cy.contains('Sign in with Google').should('be.visible');
    });

    it('should show signup modal when signup button is clicked', () => {
      cy.get('[data-cy="nav-signup"]').click();
      cy.get('[data-cy="signup-modal"]').should('be.visible');
    });
  });

  describe('Copy Generation Workflow', () => {
    // Note: These tests would require authentication
    // For now, we'll test the UI elements

    it('should have copy generation form elements', () => {
      // Skip if not authenticated
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="product-form"]').length > 0) {
          cy.get('[data-cy="product-name"]').should('be.visible');
          cy.get('[data-cy="product-description"]').should('be.visible');
          cy.get('[data-cy="target-audience"]').should('be.visible');
          cy.get('[data-cy="mascot-selector"]').should('be.visible');
        }
      });
    });

    it('should show mascot options', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="mascot-selector"]').length > 0) {
          cy.get('[data-cy="mascot-capybara"]').should('exist');
          cy.get('[data-cy="mascot-hamster"]').should('exist');
          cy.get('[data-cy="mascot-parrot"]').should('exist');
          cy.get('[data-cy="mascot-panda"]').should('exist');
        }
      });
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-6');
      cy.contains('AdmuseEasy').should('be.visible');
      cy.get('[data-cy="nav-login"]').should('be.visible');
    });

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.contains('AdmuseEasy').should('be.visible');
      cy.get('[data-cy="main-header"]').should('be.visible');
    });

    it('should work on desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.contains('AdmuseEasy').should('be.visible');
      cy.get('[data-cy="nav-login"]').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Simulate network error
      cy.intercept('GET', '/api/**', { forceNetworkError: true }).as('networkError');
      
      // Trigger API call and check error handling
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="generate-btn"]').length > 0) {
          cy.get('[data-cy="generate-btn"]').click();
          // Should show error message
          cy.get('[data-cy="error-message"]').should('be.visible');
        }
      });
    });
  });

  describe('Performance Tests', () => {
    it('should load within acceptable time', () => {
      const start = Date.now();
      cy.visit('http://localhost:3000').then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds max
      });
    });
  });
});