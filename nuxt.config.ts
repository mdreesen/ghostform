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
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'GhostForm Lead Capture',
      short_name: 'GhostForm',
      description: 'Automated offline-capable lead generation and check-in portal',
      theme_color: '#09090B', // Matches your background_color layout variables
      background_color: '#09090B',
      icons: [
        {
          src: 'icons/logo-icon.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/logo-icon.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      // 📦 Cache all generated HTML, JS, CSS components, and static web routing layers
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      // Fallback strategies for custom dynamic endpoints or layouts if needed
      navigateFallback: '/'
    }
  }
})