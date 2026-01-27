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

        <!-- Buyer-only nav (no tenant) -->
        <template v-if="!tenantsStore.hasTenants">
          <NuxtLink
            to="/mis-boletas"
            class="flex flex-col items-center justify-center w-16 h-full"
            :class="isActive('/mis-boletas') ? 'text-primary-400' : 'text-secondary-400'"
          >
            <TicketIcon class="w-6 h-6" />
            <span class="text-xs mt-1">Boletas</span>
          </NuxtLink>
        </template>

        <!-- Organizer nav (has tenant) -->
        <template v-else>
          <NuxtLink
            to="/mis-boletas"
            class="flex flex-col items-center justify-center w-16 h-full"
            :class="isActive('/mis-boletas') ? 'text-primary-400' : 'text-secondary-400'"
          >
            <TicketIcon class="w-6 h-6" />
            <span class="text-xs mt-1">Boletas</span>
          </NuxtLink>

          <NuxtLink
            to="/gestion"
            class="flex flex-col items-center justify-center w-16 h-full"
            :class="isActive('/gestion') ? 'text-primary-400' : 'text-secondary-400'"
          >
            <CalendarDaysIcon class="w-6 h-6" />
            <span class="text-xs mt-1">Gestion</span>
          </NuxtLink>

          <NuxtLink
            to="/operaciones"
            class="flex flex-col items-center justify-center w-16 h-full"
            :class="isActive('/operaciones') ? 'text-primary-400' : 'text-secondary-400'"
          >
            <QrCodeIcon class="w-6 h-6" />
            <span class="text-xs mt-1">En Sitio</span>
          </NuxtLink>

          <!-- Menu Button -->
          <button
            @click="showMenu = true"
            class="flex flex-col items-center justify-center w-16 h-full text-secondary-400"
          >
            <Bars3Icon class="w-6 h-6" />
            <span class="text-xs mt-1">Menu</span>
          </button>
        </template>
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

            <!-- Administracion Section -->
            <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">Administracion</p>
            <div class="grid grid-cols-4 gap-3 mb-4">
              <NuxtLink
                to="/gestion/eventos"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/gestion/eventos') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <CalendarDaysIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Eventos</span>
              </NuxtLink>

              <NuxtLink
                to="/gestion/areas"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/gestion/areas') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <MapIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Areas</span>
              </NuxtLink>

              <NuxtLink
                to="/gestion/etapas"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/gestion/etapas') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <ListBulletIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Etapas</span>
              </NuxtLink>

              <NuxtLink
                to="/gestion/promociones"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/gestion/promociones') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <TagIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Promos</span>
              </NuxtLink>
            </div>

            <!-- En Sitio Section -->
            <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">En Sitio</p>
            <div class="grid grid-cols-4 gap-3 mb-4">
              <NuxtLink
                to="/operaciones/check-in"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/operaciones/check-in') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <QrCodeIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Check-in</span>
              </NuxtLink>

              <NuxtLink
                to="/operaciones/reservas"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/operaciones/reservas') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <ClipboardDocumentListIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Reservas</span>
              </NuxtLink>

              <NuxtLink
                to="/operaciones/transfers"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/operaciones/transfers') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <ArrowsRightLeftIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Transfers</span>
              </NuxtLink>
            </div>

            <!-- Analitica Section -->
            <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">Analitica</p>
            <div class="grid grid-cols-4 gap-3 mb-4">
              <NuxtLink
                to="/analitica/dashboard"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/analitica/dashboard') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <PresentationChartLineIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Dashboard</span>
              </NuxtLink>

              <NuxtLink
                to="/analitica/ventas"
                @click="showMenu = false"
                class="flex flex-col items-center p-3 rounded-xl transition-colors"
                :class="isActive('/analitica/ventas') ? 'bg-primary-100 text-primary-700' : 'text-secondary-600 hover:bg-secondary-100'"
              >
                <ChartBarIcon class="w-6 h-6 mb-2" />
                <span class="text-xs text-center">Ventas</span>
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
  ArrowsRightLeftIcon,
  Bars3Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  MapIcon,
  PresentationChartLineIcon,
  QrCodeIcon,
  TagIcon,
  TicketIcon
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
