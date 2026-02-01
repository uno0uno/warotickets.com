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

          <!-- User Auth Section -->
          <div ref="userMenuRef" class="relative">
            <!-- No autenticado -->
            <NuxtLink
              v-if="!authStore.isAuthenticated"
              to="/auth/login"
              class="flex items-center gap-1 px-2 sm:px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              <UserIcon class="w-5 h-5" />
              <span class="hidden sm:inline">Ingresar</span>
            </NuxtLink>

            <!-- Autenticado -->
            <button
              v-else
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-secondary transition-colors"
            >
              <!-- Avatar con iniciales -->
              <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {{ authStore.initials }}
              </div>
              <span class="hidden md:inline text-sm font-medium text-text-primary max-w-[100px] truncate">
                {{ authStore.displayName }}
              </span>
              <ChevronDownIcon class="hidden sm:block w-4 h-4 text-text-secondary transition-transform" :class="{ 'rotate-180': showUserMenu }" />
            </button>

            <!-- Dropdown Menu -->
            <Transition name="fade">
              <div
                v-if="showUserMenu && authStore.isAuthenticated"
                class="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg py-2 z-50"
              >
                <div class="px-4 py-2 border-b border-border">
                  <p class="text-sm font-medium text-text-primary truncate">{{ authStore.displayName }}</p>
                  <p class="text-xs text-text-tertiary truncate">{{ authStore.user?.email }}</p>
                </div>
                <NuxtLink
                  to="/mis-boletas"
                  class="block px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary transition-colors"
                  @click="showUserMenu = false"
                >
                  Mis Boletas
                </NuxtLink>
                <NuxtLink
                  to="/mis-facturas"
                  class="block px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary transition-colors"
                  @click="showUserMenu = false"
                >
                  Mis Facturas
                </NuxtLink>
                <hr class="my-2 border-border" />
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </Transition>
          </div>

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
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { ShoppingCartIcon, UserIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()

// Get cart item count
const cartItemCount = computed(() => cartStore.summary?.itemsCount || 0)

// User menu state
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

// Fetch cart summary on mount
onMounted(() => {
  cartStore.fetchSummary()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Cerrar menú al hacer click fuera
function handleClickOutside(event: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

// Logout handler
async function handleLogout() {
  showUserMenu.value = false
  await authStore.logout()
  navigateTo('/')
}

// Ciudades disponibles
const cities = [
  { name: 'Bogotá', slug: 'bogota' },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
