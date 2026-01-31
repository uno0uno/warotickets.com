<template>
  <!-- Bottom Navigation - Mobile & Tablet -->
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 shadow-lg z-50 safe-area-bottom">
    <div class="flex items-center justify-between px-4 py-2">

      <!-- User Profile -->
      <div class="flex items-center gap-3">
        <div class="relative flex-shrink-0">
          <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center font-semibold text-white text-sm">
            {{ authStore.initials }}
          </div>
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-secondary-900 leading-tight">{{ authStore.displayName }}</span>
          <span class="text-xs text-secondary-500 leading-tight">{{ tenantsStore.selectedTenant?.name || 'Sin tenant' }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- Refresh Button -->
        <button
          v-if="onRefresh"
          @click="onRefresh"
          class="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-secondary-100"
        >
          <ArrowPathIcon class="w-5 h-5 text-secondary-500" />
        </button>

        <!-- Menú (all navigation) -->
        <button
          @click="showMenuModal = true"
          class="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-secondary-100"
        >
          <Bars3Icon class="w-5 h-5 text-secondary-500" />
        </button>

        <!-- Configuración/Tenant -->
        <button
          @click="showTenantModal = true"
          class="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-secondary-100"
        >
          <Cog6ToothIcon class="w-5 h-5 text-secondary-500" />
        </button>
      </div>

    </div>

    <!-- Menu Modal (grid of icons) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showMenuModal" class="fixed inset-0 z-[100]" @click.self="showMenuModal = false">
          <div class="absolute inset-0 bg-black/50" @click="showMenuModal = false"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl safe-area-bottom">
            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-4 border-b border-secondary-200">
              <h3 class="text-lg font-semibold text-secondary-900">Navegación</h3>
              <button
                @click="showMenuModal = false"
                class="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <XMarkIcon class="w-5 h-5 text-secondary-500" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-4">
              <!-- Buyer Links (no tenant) -->
              <template v-if="!tenantsStore.hasTenants">
                <div class="grid grid-cols-4 gap-4">
                  <NuxtLink
                    to="/mis-boletas"
                    @click="showMenuModal = false"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      :class="isActive('/mis-boletas') ? 'bg-primary-100' : 'bg-secondary-100 hover:bg-secondary-200'"
                    >
                      <TicketIcon
                        class="w-6 h-6"
                        :class="isActive('/mis-boletas') ? 'text-primary-600' : 'text-secondary-600'"
                      />
                    </div>
                    <span class="text-[10px] text-secondary-600">Boletas</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/mis-facturas"
                    @click="showMenuModal = false"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      :class="isActive('/mis-facturas') ? 'bg-primary-100' : 'bg-secondary-100 hover:bg-secondary-200'"
                    >
                      <DocumentTextIcon
                        class="w-6 h-6"
                        :class="isActive('/mis-facturas') ? 'text-primary-600' : 'text-secondary-600'"
                      />
                    </div>
                    <span class="text-[10px] text-secondary-600">Facturas</span>
                  </NuxtLink>
                </div>
              </template>

              <!-- Organizer Links (has tenant) -->
              <template v-else>
                <!-- Administracion Section -->
                <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-3">Administración</p>
                <div class="grid grid-cols-4 gap-4 mb-6">
                  <NuxtLink
                    to="/gestion/eventos"
                    @click="showMenuModal = false"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      :class="isActive('/gestion/eventos') ? 'bg-primary-100' : 'bg-secondary-100 hover:bg-secondary-200'"
                    >
                      <CalendarDaysIcon
                        class="w-6 h-6"
                        :class="isActive('/gestion/eventos') ? 'text-primary-600' : 'text-secondary-600'"
                      />
                    </div>
                    <span class="text-[10px] text-secondary-600">Eventos</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/gestion/areas"
                    @click="showMenuModal = false"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      :class="isActive('/gestion/areas') ? 'bg-primary-100' : 'bg-secondary-100 hover:bg-secondary-200'"
                    >
                      <MapIcon
                        class="w-6 h-6"
                        :class="isActive('/gestion/areas') ? 'text-primary-600' : 'text-secondary-600'"
                      />
                    </div>
                    <span class="text-[10px] text-secondary-600">Areas</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/gestion/etapas"
                    @click="showMenuModal = false"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      :class="isActive('/gestion/etapas') ? 'bg-primary-100' : 'bg-secondary-100 hover:bg-secondary-200'"
                    >
                      <ListBulletIcon
                        class="w-6 h-6"
                        :class="isActive('/gestion/etapas') ? 'text-primary-600' : 'text-secondary-600'"
                      />
                    </div>
                    <span class="text-[10px] text-secondary-600">Etapas</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/gestion/promociones"
                    @click="showMenuModal = false"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      :class="isActive('/gestion/promociones') ? 'bg-primary-100' : 'bg-secondary-100 hover:bg-secondary-200'"
                    >
                      <TagIcon
                        class="w-6 h-6"
                        :class="isActive('/gestion/promociones') ? 'text-primary-600' : 'text-secondary-600'"
                      />
                    </div>
                    <span class="text-[10px] text-secondary-600">Promos</span>
                  </NuxtLink>
                </div>

                <!-- Operaciones Section -->
                <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-3">Operaciones</p>
                <div class="grid grid-cols-4 gap-4 mb-6">
                  <NuxtLink
                    to="/operaciones/check-in"
                    @click="showMenuModal = false"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      :class="isActive('/operaciones/check-in') ? 'bg-primary-100' : 'bg-secondary-100 hover:bg-secondary-200'"
                    >
                      <QrCodeIcon
                        class="w-6 h-6"
                        :class="isActive('/operaciones/check-in') ? 'text-primary-600' : 'text-secondary-600'"
                      />
                    </div>
                    <span class="text-[10px] text-secondary-600">Check-in</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/operaciones/reservas"
                    @click="showMenuModal = false"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      :class="isActive('/operaciones/reservas') ? 'bg-primary-100' : 'bg-secondary-100 hover:bg-secondary-200'"
                    >
                      <ClipboardDocumentListIcon
                        class="w-6 h-6"
                        :class="isActive('/operaciones/reservas') ? 'text-primary-600' : 'text-secondary-600'"
                      />
                    </div>
                    <span class="text-[10px] text-secondary-600">Reservas</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/operaciones/transfers"
                    @click="showMenuModal = false"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      :class="isActive('/operaciones/transfers') ? 'bg-primary-100' : 'bg-secondary-100 hover:bg-secondary-200'"
                    >
                      <ArrowsRightLeftIcon
                        class="w-6 h-6"
                        :class="isActive('/operaciones/transfers') ? 'text-primary-600' : 'text-secondary-600'"
                      />
                    </div>
                    <span class="text-[10px] text-secondary-600">Transfers</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/mis-boletas"
                    @click="showMenuModal = false"
                    class="flex flex-col items-center gap-1"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      :class="isActive('/mis-boletas') ? 'bg-primary-100' : 'bg-secondary-100 hover:bg-secondary-200'"
                    >
                      <TicketIcon
                        class="w-6 h-6"
                        :class="isActive('/mis-boletas') ? 'text-primary-600' : 'text-secondary-600'"
                      />
                    </div>
                    <span class="text-[10px] text-secondary-600">Boletas</span>
                  </NuxtLink>
                </div>

                <!-- External Links -->
                <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-3">Otros</p>
                <div class="grid grid-cols-4 gap-4">
                  <a
                    href="https://warocol.com/menu/productos"
                    target="_blank"
                    class="flex flex-col items-center gap-1"
                  >
                    <div class="w-12 h-12 rounded-full flex items-center justify-center bg-secondary-100 hover:bg-secondary-200 transition-colors">
                      <Squares2X2Icon class="w-6 h-6 text-secondary-600" />
                    </div>
                    <span class="text-[10px] text-secondary-600">Restaurantes</span>
                  </a>
                </div>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Tenant Selector Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showTenantModal" class="fixed inset-0 z-[100]" @click.self="showTenantModal = false">
          <div class="absolute inset-0 bg-black/50" @click="showTenantModal = false"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl safe-area-bottom">
            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-4 border-b border-secondary-200">
              <h3 class="text-lg font-semibold text-secondary-900">Configuración</h3>
              <button
                @click="showTenantModal = false"
                class="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <XMarkIcon class="w-5 h-5 text-secondary-500" />
              </button>
            </div>

            <div class="p-4 space-y-6">
              <!-- Tenant Selector -->
              <div v-if="tenantsStore.tenants.length > 0">
                <label class="text-sm text-secondary-600 font-medium mb-2 block">Seleccionar Tenant</label>
                <div class="space-y-2">
                  <button
                    v-for="tenant in tenantsStore.tenants"
                    :key="tenant.id"
                    @click="selectTenant(tenant)"
                    :disabled="tenantsStore.isLoading"
                    class="w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="tenantsStore.selectedTenant?.id === tenant.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-secondary-200 hover:border-primary-300 hover:bg-secondary-50'"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="w-3 h-3 rounded-full"
                        :class="tenantsStore.selectedTenant?.id === tenant.id ? 'bg-primary-600' : 'bg-secondary-400'"
                      ></div>
                      <span class="font-medium text-secondary-900">{{ tenant.name }}</span>
                    </div>
                    <CheckCircleIcon
                      v-if="tenantsStore.selectedTenant?.id === tenant.id"
                      class="w-5 h-5 text-primary-600"
                    />
                  </button>
                </div>
              </div>

              <!-- User Info -->
              <div class="pt-4 border-t border-secondary-200">
                <div class="flex items-center gap-3 px-4 py-3 bg-secondary-50 rounded-lg">
                  <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                    {{ authStore.initials }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-sm text-secondary-900">{{ authStore.displayName }}</div>
                    <div class="text-xs text-secondary-600 truncate">{{ authStore.user?.email }}</div>
                  </div>
                </div>
              </div>

              <!-- Logout Button -->
              <button
                @click="handleLogout"
                class="flex items-center gap-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  ArrowsRightLeftIcon,
  Bars3Icon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ListBulletIcon,
  MapIcon,
  QrCodeIcon,
  Squares2X2Icon,
  TagIcon,
  TicketIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Props {
  onRefresh?: () => void | Promise<void>
}

const props = defineProps<Props>()

const route = useRoute()
const authStore = useAuthStore()
const tenantsStore = useTenantsStore()

// Modal state
const showMenuModal = ref(false)
const showTenantModal = ref(false)

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

async function selectTenant(tenant: { id: string; name: string; slug: string }) {
  const success = await tenantsStore.selectTenant(tenant)
  if (success) {
    showTenantModal.value = false
  }
}

async function handleLogout() {
  showTenantModal.value = false
  await authStore.logout()
  navigateTo('/auth/login')
}
</script>

<style scoped>
/* Safe area para dispositivos con notch */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
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
