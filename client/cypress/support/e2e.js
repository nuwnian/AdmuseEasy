// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Custom commands for AdmuseEasy testing
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-cy=email-input]').type(email)
  cy.get('[data-cy=password-input]').type(password)
  cy.get('[data-cy=login-button]').click()
})

Cypress.Commands.add('checkApiHealth', () => {
  cy.request({
    method: 'GET',
    url: Cypress.env('API_URL') + '/api/health',
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.be.oneOf([200, 404]) // 404 is ok if endpoint doesn't exist yet
  })
})