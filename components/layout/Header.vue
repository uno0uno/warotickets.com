<template>
  <header
    class="w-full border-b border-border bg-surface"
  >
    <div class="container mx-auto px-4 md:px-8">
      <div class="flex h-16 md:h-20 items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center">
          <img
            src="/waro_tickets_logo.png"
            alt="WaRo Tickets"
            class="h-10 md:h-12 w-auto"
          />
        </NuxtLink>

        <!-- Navigation - Ciudades -->
        <nav class="flex items-center gap-3 md:gap-6">
          <NuxtLink
            v-for="city in cities"
            :key="city.slug"
            :to="`/eventos/${city.slug}`"
            class="text-sm md:text-base text-text-secondary hover:text-primary font-medium transition-colors"
            :class="{ 'text-primary': route.path === `/eventos/${city.slug}` }"
          >
            {{ city.name }}
          </NuxtLink>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 md:gap-3">
          <!-- Cart Icon -->
          <NuxtLink
            to="/carrito"
            class="relative p-2 text-text-secondary hover:text-primary transition-colors"
            aria-label="Carrito"
          >
            <ShoppingCartIcon class="w-6 h-6" />
            <span
              v-if="cartItemCount > 0"
              class="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
            >
              {{ cartItemCount > 99 ? '99+' : cartItemCount }}
            </span>
          </NuxtLink>

          <!-- Crear Evento - visible on all sizes -->
          <NuxtLink
            to="/organizadores"
            class="btn-primary text-xs sm:text-sm md:text-base py-2 px-3 sm:py-2.5 sm:px-5"
          >
            <span class="hidden sm:inline">Crear Evento</span>
            <span class="sm:hidden">Crear</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const cartStore = useCartStore()

// Get cart item count
const cartItemCount = computed(() => cartStore.summary?.itemsCount || 0)

// Fetch cart summary on mount
onMounted(() => {
  cartStore.fetchSummary()
})

// Ciudades disponibles
const cities = [
  { name: 'Bogotá', slug: 'bogota' },
]
</script>
