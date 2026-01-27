/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          50: "hsl(var(--crocus-50) / <alpha-value>)",
          100: "hsl(var(--crocus-100) / <alpha-value>)",
          200: "hsl(var(--crocus-200) / <alpha-value>)",
          300: "hsl(var(--crocus-300) / <alpha-value>)",
          400: "hsl(var(--crocus-400) / <alpha-value>)",
          500: "hsl(var(--crocus-500) / <alpha-value>)",
          600: "hsl(var(--crocus-600) / <alpha-value>)",
          700: "hsl(var(--crocus-700) / <alpha-value>)",
          800: "hsl(var(--crocus-800) / <alpha-value>)",
          900: "hsl(var(--crocus-900) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          50: "hsl(var(--ebony-50) / <alpha-value>)",
          100: "hsl(var(--ebony-100) / <alpha-value>)",
          200: "hsl(var(--ebony-200) / <alpha-value>)",
          300: "hsl(var(--ebony-300) / <alpha-value>)",
          400: "hsl(var(--ebony-400) / <alpha-value>)",
          500: "hsl(var(--ebony-500) / <alpha-value>)",
          600: "hsl(var(--ebony-600) / <alpha-value>)",
          700: "hsl(var(--ebony-700) / <alpha-value>)",
          800: "hsl(var(--ebony-800) / <alpha-value>)",
          900: "hsl(var(--ebony-900) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          purple: '#7c3aed',
          pink: '#ec4899',
          orange: '#f97316'
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        // Titan White (Grises Claros)
        titan: {
          50: "hsl(var(--titan-50) / <alpha-value>)",
          100: "hsl(var(--titan-100) / <alpha-value>)",
          200: "hsl(var(--titan-200) / <alpha-value>)",
          300: "hsl(var(--titan-300) / <alpha-value>)",
          400: "hsl(var(--titan-400) / <alpha-value>)",
          500: "hsl(var(--titan-500) / <alpha-value>)",
          600: "hsl(var(--titan-600) / <alpha-value>)",
          700: "hsl(var(--titan-700) / <alpha-value>)",
          800: "hsl(var(--titan-800) / <alpha-value>)",
          900: "hsl(var(--titan-900) / <alpha-value>)",
        },
        // Crocus Purple (Púrpura)
        crocus: {
          50: "hsl(var(--crocus-50) / <alpha-value>)",
          100: "hsl(var(--crocus-100) / <alpha-value>)",
          200: "hsl(var(--crocus-200) / <alpha-value>)",
          300: "hsl(var(--crocus-300) / <alpha-value>)",
          400: "hsl(var(--crocus-400) / <alpha-value>)",
          500: "hsl(var(--crocus-500) / <alpha-value>)",
          600: "hsl(var(--crocus-600) / <alpha-value>)",
          700: "hsl(var(--crocus-700) / <alpha-value>)",
          800: "hsl(var(--crocus-800) / <alpha-value>)",
          900: "hsl(var(--crocus-900) / <alpha-value>)",
        },
        // Ebony Clay (Grises Oscuros)
        ebony: {
          50: "hsl(var(--ebony-50) / <alpha-value>)",
          100: "hsl(var(--ebony-100) / <alpha-value>)",
          200: "hsl(var(--ebony-200) / <alpha-value>)",
          300: "hsl(var(--ebony-300) / <alpha-value>)",
          400: "hsl(var(--ebony-400) / <alpha-value>)",
          500: "hsl(var(--ebony-500) / <alpha-value>)",
          600: "hsl(var(--ebony-600) / <alpha-value>)",
          700: "hsl(var(--ebony-700) / <alpha-value>)",
          800: "hsl(var(--ebony-800) / <alpha-value>)",
          900: "hsl(var(--ebony-900) / <alpha-value>)",
        },
        // Semantic Tokens
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          secondary: "hsl(var(--surface-secondary) / <alpha-value>)",
          tertiary: "hsl(var(--surface-tertiary) / <alpha-value>)",
        },
        text: {
          primary: "hsl(var(--text-primary) / <alpha-value>)",
          secondary: "hsl(var(--text-secondary) / <alpha-value>)",
          tertiary: "hsl(var(--text-tertiary) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "hsl(var(--info) / <alpha-value>)",
          foreground: "hsl(var(--info-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        principal: ['Lato'],
        sans: ['Lato', 'Inter', 'system-ui', 'sans-serif'],
        quantico: ['Quantico', 'Lato', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif']
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '6rem',
          '2xl': '8rem'
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-lg': '0 0 40px rgba(124, 58, 237, 0.4)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require("tailwindcss-animate")
  ]
}
