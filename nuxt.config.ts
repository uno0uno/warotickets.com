// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },

  devServer: {
    port: 8888
  },

  ssr: true,

  nitro: {
    preset: 'node-server',
    routeRules: {
      '/api/auth/**': {
        proxy: {
          to: process.env.NODE_ENV === 'development'
            ? `${process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}/auth/**`
            : 'https://api.warotickets.com/auth/**',
          changeOrigin: true,
          followRedirects: true,
          ...(process.env.NODE_ENV === 'development' && {
            headers: {
              'X-Forwarded-Host': 'localhost:8888'
            }
          })
        },
        cors: true,
        headers: {
          'Access-Control-Allow-Credentials': 'true'
        }
      },
      '/api/**': {
        proxy: {
          to: process.env.NODE_ENV === 'development'
            ? `${process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}/**`
            : 'https://api.warotickets.com/**',
          changeOrigin: true,
          followRedirects: true,
          headers: process.env.NODE_ENV === 'development'
            ? {
                'X-Forwarded-Host': 'localhost:8888',
                'Origin': 'http://localhost:8888',
                'Referer': 'http://localhost:8888/'
              }
            : {
                'Origin': 'https://warotickets.com',
                'Referer': 'https://warotickets.com/'
              }
        },
        cors: true,
        headers: {
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    }
  },

  app: {
    head: {
      title: 'WaRo Tickets - Sistema de Boletería para Eventos',
      htmlAttrs: {
        lang: 'es'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Plataforma de venta de boletería y gestión de eventos. Vende entradas, controla accesos con QR y gestiona tu evento de forma simple.' },
        { name: 'theme-color', content: '#7C3AED' },
        // Open Graph
        { property: 'og:title', content: 'WaRo Tickets - Sistema de Boletería' },
        { property: 'og:description', content: 'Plataforma de venta de boletería y gestión de eventos' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'es_CO' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'WaRo Tickets' },
        { name: 'twitter:description', content: 'Sistema de boletería para eventos' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt'
  ],

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700, 800],
      Poppins: [400, 500, 600, 700, 800]
    },
    display: 'swap'
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js'
  },

  css: [
    '~/assets/css/main.css'
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
      siteName: 'WaRo Tickets',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://warotickets.com',
      defaultRedirectUrl: '/gestion/eventos'
    }
  }
})
