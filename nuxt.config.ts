// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    '@vueuse/motion/nuxt',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
  ],
  app: {
    head: {
      title: 'GhostForm', // default fallback title
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      script: [
        { src: '/_vercel/insights/script.js', defer: true, async: true }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss()
    ],
  },
  typescript: {
    strict: false
  },
  colorMode: {
    dataValue: 'theme',
    classSuffix: '', // Important for Tailwind CSS integration
  }
})