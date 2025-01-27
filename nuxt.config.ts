// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css', // Путь к вашему Tailwind CSS файлу
    configPath: 'tailwind.config',       // Путь к конфигурации Tailwind
  },

  postcss: {
    plugins: {

    }
  },
  nitro: {
    preset: 'node-server'
  },
  compatibilityDate: '2025-01-25'
});
