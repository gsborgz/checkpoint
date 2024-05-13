import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: false,
    baseUrl: 'http://localhost:3000',
    viewportHeight: 720,
    viewportWidth: 1336,
    setupNodeEvents(on, config) { },
  },
})
