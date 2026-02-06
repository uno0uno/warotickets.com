// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },

  devServer: {
    port: parseInt(process.env.PORT || '3003')
  },

  ssr: true,

  nitro: {
    preset: 'node-server',
    routeRules: {
      '/api/auth/**': {
        proxy: {
          to: `${process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}/auth/**`,
          changeOrigin: true,
          followRedirects: true,
          ...(process.env.NODE_ENV === 'development' && {
            headers: {
              'X-Forwarded-Host': `localhost:${process.env.PORT || '3003'}`
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
          to: `${process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}/**`,
          changeOrigin: true,
          followRedirects: true,
          headers: process.env.NODE_ENV === 'development'
            ? {
              'X-Forwarded-Host': `localhost:${process.env.PORT || '3003'}`,
              'Origin': `http://localhost:${process.env.PORT || '3003'}`,
              'Referer': `http://localhost:${process.env.PORT || '3003'}/`
            }
            : {
              'Origin': process.env.NUXT_PUBLIC_SITE_URL || 'https://warotickets.com',
              'Referer': `${process.env.NUXT_PUBLIC_SITE_URL || 'https://warotickets.com'}/`
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
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: process.env.NUXT_PUBLIC_SEO_TITLE || 'WaRo Tickets - Sistema de Boletería para Eventos',
      htmlAttrs: {
        lang: process.env.NUXT_PUBLIC_SITE_LANG || 'es'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: process.env.NUXT_PUBLIC_SEO_DESCRIPTION || 'Plataforma de venta de boletería y gestión de eventos. Vende entradas, controla accesos con QR y gestiona tu evento de forma simple.' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: 'hsl(var(--crocus-600))' },
        // Open Graph
        { property: 'og:title', content: process.env.NUXT_PUBLIC_OG_TITLE || 'WaRo Tickets - Sistema de Boletería' },
        { property: 'og:description', content: process.env.NUXT_PUBLIC_OG_DESCRIPTION || 'Plataforma de venta de boletería y gestión de eventos' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: process.env.NUXT_PUBLIC_SITE_LOCALE || 'es_CO' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: process.env.NUXT_PUBLIC_TWITTER_TITLE || 'WaRo Tickets' },
        { name: 'twitter:description', content: process.env.NUXT_PUBLIC_TWITTER_DESCRIPTION || 'Sistema de boletería para eventos' }
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
      Lato: [400, 700, 900],
      Quantico: [400, 700],
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
    '~/assets/css/design-tokens.css',
    '~/assets/css/design-system.css',
    '~/assets/css/main.css'
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'WaRo Tickets',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://warotickets.com',
      defaultRedirectUrl: process.env.NUXT_PUBLIC_DEFAULT_REDIRECT_URL || '/gestion/eventos',
      gtmContainerId: process.env.NUXT_PUBLIC_GTM_CONTAINER_ID || ''
    }
  }
})
