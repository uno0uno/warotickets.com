<template>
  <footer class="bg-secondary-900 text-white">
    <div class="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <div class="flex flex-col items-center text-center">
        <!-- Brand -->
        <NuxtLink to="/" class="flex items-center gap-2 mb-4">
          <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 12V6H4v6h16zm0 2H4v4h16v-4zM3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm3 4h2v2H6V8zm0 6h2v2H6v-2z"/>
            </svg>
          </div>
          <span class="text-xl font-bold font-heading">
            WaRo<span class="text-primary-400">Tickets</span>
          </span>
        </NuxtLink>
        <p class="text-secondary-400 text-sm leading-relaxed mb-4 max-w-md">
          Plataforma de venta de boleteria y gestion de eventos. Simplifica la venta de entradas y el control de accesos.
        </p>
        <!-- Social Links -->
        <div class="flex gap-4">
          <a
            href="https://www.tiktok.com/@warocolombia"
            target="_blank"
            rel="noopener"
            class="text-secondary-400 hover:text-primary-400 transition-colors"
            aria-label="TikTok"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
          <a
            href="https://github.com/uno0uno/warotickets.com"
            target="_blank"
            rel="noopener"
            class="text-secondary-400 hover:text-primary-400 transition-colors"
            aria-label="GitHub"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-secondary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-secondary-500 text-sm">
          &copy; {{ currentYear }} <a href="https://warolabs.com" target="_blank" rel="noopener" class="hover:text-primary-400 transition-colors">Waro Labs</a>. Todos los derechos reservados.
        </p>
        <p class="text-secondary-500 text-sm">
          Hecho con <span class="text-red-500">&hearts;</span> en Colombia
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
