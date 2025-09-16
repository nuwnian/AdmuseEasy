// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for AdmuseEasy
Cypress.Commands.add('waitForReact', () => {
  cy.window().its('React', { timeout: 10000 }).should('exist')
})

Cypress.Commands.add('getByDataCy', (selector) => {
  return cy.get(`[data-cy=${selector}]`)
})

// OAuth testing commands
Cypress.Commands.add('mockGoogleOAuth', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('mockUser', JSON.stringify({
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User'
    }))
  })
})

// API testing commands
Cypress.Commands.add('apiRequest', (method, endpoint, body = null) => {
  return cy.request({
    method: method,
    url: Cypress.env('API_URL') + endpoint,
    body: body,
    failOnStatusCode: false
  })
})