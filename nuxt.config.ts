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
    '@vite-pwa/nuxt'
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
      display: 'standalone', // Essential for forcing native mobile-app view wrapper
      icons: [
        {
          src: '/images/maskable-icon.png',
          sizes: '445x445',
          type: 'image/png',
          purpose: "any"
        },
        {
          src: '/images/maskable-icon.png',
          sizes: '445x445',
          type: 'image/webp',
          purpose: "png"
        },
        {
          src: '/images/maskable-icon.png',
          sizes: '445x445',
          type: 'image/png',
          purpose: "maskable"
        },
        {
          src: '/images/maskable-icon.png',
          sizes: '445x445',
          type: 'image/png',
        }
      ],
    },
    workbox: {
      // Clean up outdated caches automatically across site iterations
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}']
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})