export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ],
  plugins: [
    '~/plugins/pinia-persistedstate.client.ts'
  ],
  css: ['~/assets/css/main.css'],
  // Auto-imports configuration
  imports: {
    // Auto-import composables
    dirs: [
      'composables/**',
      'lib/**',
      'types/**'
    ]
  },
  runtimeConfig: {
    public: {
      rawgApiKey: process.env.RAWG_API_KEY || '',
      rawUrl: process.env.RAW_URL || 'https://api/rawg.io/api'
    }
  },
})