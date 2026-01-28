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
            href="https://instagram.com/warotickets"
            target="_blank"
            rel="noopener"
            class="text-secondary-400 hover:text-primary-400 transition-colors"
            aria-label="Instagram"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a
            href="https://twitter.com/warotickets"
            target="_blank"
            rel="noopener"
            class="text-secondary-400 hover:text-primary-400 transition-colors"
            aria-label="Twitter"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-secondary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-secondary-500 text-sm">
          &copy; {{ currentYear }} WaRo Tickets. Todos los derechos reservados.
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
