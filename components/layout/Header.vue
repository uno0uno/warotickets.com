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

        <!-- Desktop Navigation - Ciudades -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink
            v-for="city in cities"
            :key="city.slug"
            :to="`/eventos/${city.slug}`"
            class="text-text-secondary hover:text-primary font-medium transition-colors"
            :class="{ 'text-primary': route.path === `/eventos/${city.slug}` }"
          >
            {{ city.name }}
          </NuxtLink>
        </nav>

        <!-- CTA Buttons -->
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/organizadores"
            class="btn-primary text-sm md:text-base py-2.5 px-5"
          >
            Crear Evento
          </NuxtLink>

          <!-- Mobile Menu Button -->
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden p-2 text-text-secondary hover:text-text-primary"
            aria-label="Menu"
          >
            <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isMenuOpen" class="md:hidden py-4 border-t border-border">
          <nav class="flex flex-col gap-4">
            <NuxtLink
              v-for="city in cities"
              :key="city.slug"
              :to="`/eventos/${city.slug}`"
              @click="isMenuOpen = false"
              class="text-text-secondary hover:text-primary font-medium py-2"
              :class="{ 'text-primary': route.path === `/eventos/${city.slug}` }"
            >
              {{ city.name }}
            </NuxtLink>
            <div class="h-px bg-border my-2"></div>
            <NuxtLink
              to="/organizadores"
              @click="isMenuOpen = false"
              class="text-text-secondary hover:text-primary font-medium py-2"
            >
              Crear Evento
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
const isMenuOpen = ref(false)
const route = useRoute()

// Ciudades disponibles
const cities = [
  { name: 'Bogotá', slug: 'bogota' },
]

// Close menu on route change
watch(() => route.path, () => {
  isMenuOpen.value = false
})
</script>
