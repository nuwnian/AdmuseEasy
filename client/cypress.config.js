const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    env: {
      API_URL: "http://localhost:5000"
    }
  },
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack"
    },
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}"
  }
});