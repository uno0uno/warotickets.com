<template>
  <div class="lg:hidden">
    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-secondary-900 border-t border-secondary-800 z-50 safe-area-bottom">
      <div class="flex items-center justify-around h-16 px-2">
        <!-- User Avatar -->
        <button
          @click="showUserMenu = true"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white text-sm font-medium"
        >
          {{ authStore.initials }}
        </button>

        <!-- Main Nav Items -->
        <NuxtLink
          to="/mis-eventos"
          class="flex flex-col items-center justify-center w-16 h-full"
          :class="isActive('/mis-eventos') ? 'text-primary-400' : 'text-secondary-400'"
        >
          <CalendarDaysIcon class="w-6 h-6" />
          <span class="text-xs mt-1">Eventos</span>
        </NuxtLink>

        <NuxtLink
          to="/ventas"
          class="flex flex-col items-center justify-center w-16 h-full"
          :class="isActive('/ventas') ? 'text-primary-400' : 'text-secondary-400'"
        >
          <ChartBarIcon class="w-6 h-6" />
          <span class="text-xs mt-1">Ventas</span>
        </NuxtLink>

        <!-- Menu Button -->
        <button
          @click="showMenu = true"
          class="flex flex-col items-center justify-center w-16 h-full text-secondary-400"
        >
          <Bars3Icon class="w-6 h-6" />
          <span class="text-xs mt-1">Menu</span>
        </button>
      </div>
    </nav>

    <!-- Menu Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showMenu" class="fixed inset-0 z-[100]" @click.self="showMenu = false">
          <div class="absolute inset-0 bg-black/50" @click="showMenu = false"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 safe-area-bottom">
            <div class="w-12 h-1 bg-secondary-300 rounded-full mx-auto mb-6"></div>
            <h3 class="text-lg font-bold text-secondary-900 mb-4">Menu</h3>
            <div class="grid grid-cols-4 gap-4">
              <NuxtLink
                to="/mis-eventos"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/mis-eventos') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <CalendarDaysIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Eventos</span>
              </NuxtLink>

              <NuxtLink
                to="/ventas"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/ventas') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <ChartBarIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Ventas</span>
              </NuxtLink>

              <NuxtLink
                to="/check-in"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/check-in') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <QrCodeIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Check-in</span>
              </NuxtLink>

              <NuxtLink
                to="/configuracion"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/configuracion') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <Cog6ToothIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Config</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- User Menu Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showUserMenu" class="fixed inset-0 z-[100]" @click.self="showUserMenu = false">
          <div class="absolute inset-0 bg-black/50" @click="showUserMenu = false"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 safe-area-bottom">
            <div class="w-12 h-1 bg-secondary-300 rounded-full mx-auto mb-6"></div>

            <!-- User Info -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
                {{ authStore.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-secondary-900 truncate">{{ authStore.displayName }}</p>
                <p class="text-sm text-secondary-500 truncate">{{ authStore.user?.email }}</p>
              </div>
            </div>

            <!-- Tenant Selector -->
            <div class="mb-6">
              <p class="text-sm font-medium text-secondary-700 mb-2">Tenant actual</p>
              <div class="space-y-2">
                <button
                  v-for="tenant in tenantsStore.tenants"
                  :key="tenant.id"
                  @click="selectTenant(tenant)"
                  :disabled="tenantsStore.isLoading"
                  class="w-full flex items-center gap-3 p-3 rounded-xl transition-colors disabled:opacity-50"
                  :class="tenantsStore.selectedTenant?.id === tenant.id
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                    : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100 border-2 border-transparent'"
                >
                  <div class="w-3 h-3 rounded-full" :class="tenantsStore.selectedTenant?.id === tenant.id ? 'bg-primary-500' : 'bg-secondary-400'"></div>
                  <span class="font-medium truncate">{{ tenant.name }}</span>
                  <CheckIcon v-if="tenantsStore.selectedTenant?.id === tenant.id" class="w-5 h-5 ml-auto text-primary-600" />
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="space-y-2">
              <NuxtLink
                to="/configuracion"
                @click="showUserMenu = false"
                class="flex items-center gap-3 w-full p-3 rounded-xl text-secondary-700 hover:bg-secondary-100 transition-colors"
              >
                <Cog6ToothIcon class="w-5 h-5" />
                Configuracion
              </NuxtLink>

              <button
                @click="handleLogout"
                class="flex items-center gap-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5" />
                Cerrar sesion
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckIcon,
  Cog6ToothIcon,
  QrCodeIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const authStore = useAuthStore()
const tenantsStore = useTenantsStore()

const showMenu = ref(false)
const showUserMenu = ref(false)

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

async function selectTenant(tenant: { id: string; name: string; slug: string }) {
  await tenantsStore.selectTenant(tenant)
}

async function handleLogout() {
  showUserMenu.value = false
  await authStore.logout()
  navigateTo('/auth/login')
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
