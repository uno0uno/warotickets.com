<template>
  <header
    class="w-full border-b border-secondary-200/80 bg-white"
  >
    <div class="container mx-auto px-4 md:px-8">
      <div class="flex h-16 md:h-20 items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 12V6H4v6h16zm0 2H4v4h16v-4zM3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm3 4h2v2H6V8zm0 6h2v2H6v-2z"/>
              </svg>
            </div>
            <span class="text-xl font-bold font-heading text-secondary-900">
              WaRo<span class="text-primary-700">Tickets</span>
            </span>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink
            to="/"
            class="text-secondary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Eventos
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
            class="md:hidden p-2 text-secondary-600 hover:text-secondary-900"
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
        <div v-if="isMenuOpen" class="md:hidden py-4 border-t border-secondary-200">
          <nav class="flex flex-col gap-4">
            <NuxtLink
              to="/"
              @click="isMenuOpen = false"
              class="text-secondary-600 hover:text-primary-700 font-medium py-2"
            >
              Eventos
            </NuxtLink>
            <NuxtLink
              to="/organizadores"
              @click="isMenuOpen = false"
              class="text-secondary-600 hover:text-primary-700 font-medium py-2"
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

// Close menu on route change
const route = useRoute()
watch(() => route.path, () => {
  isMenuOpen.value = false
})
</script>
