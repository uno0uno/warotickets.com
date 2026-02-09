<template>
  <aside
    class="hidden lg:flex flex-col h-screen bg-secondary-900 text-white transition-all duration-300"
    :class="isExpanded ? 'w-56' : 'w-16'"
    @mouseenter="isExpanded = true"
    @mouseleave="handleMouseLeave"
  >
    <!-- Logo -->
    <div class="flex items-center h-16 px-4 border-b border-secondary-800">
      <NuxtLink to="/" class="flex items-center gap-2 overflow-hidden">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <TicketIcon class="w-5 h-5 text-white" />
        </div>
        <Transition name="fade">
          <span v-if="isExpanded" class="text-lg font-bold font-heading whitespace-nowrap">
            WaRo<span class="text-primary-400">Tickets</span>
          </span>
        </Transition>
      </NuxtLink>
    </div>

    <!-- Buyer-only navigation (no tenant) -->
    <template v-if="!tenantsStore.hasTenants">
      <nav class="flex-1 py-4 overflow-y-auto px-2">
        <div class="space-y-1">
          <span v-if="isExpanded" class="px-3 text-[10px] text-titan-500/70 uppercase tracking-widest font-medium">Mis Compras</span>

          <NuxtLink
            to="/mis-boletas"
            :class="[
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group',
              isExpanded ? '' : 'justify-center',
              isActive('/mis-boletas')
                ? 'bg-primary-600/20 text-primary-400 font-medium'
                : 'text-titan-300 hover:bg-secondary-800 hover:text-white'
            ]"
            :title="!isExpanded ? 'Mis Boletas' : ''"
          >
            <TicketIcon :class="['w-5 h-5 flex-shrink-0', isActive('/mis-boletas') ? 'text-primary-500' : 'text-titan-500 group-hover:text-titan-300']" />
            <span v-if="isExpanded" class="whitespace-nowrap">Mis Boletas</span>
          </NuxtLink>

          <NuxtLink
            to="/mis-facturas"
            :class="[
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group',
              isExpanded ? '' : 'justify-center',
              isActive('/mis-facturas')
                ? 'bg-primary-600/20 text-primary-400 font-medium'
                : 'text-titan-300 hover:bg-secondary-800 hover:text-white'
            ]"
            :title="!isExpanded ? 'Mis Facturas' : ''"
          >
            <DocumentTextIcon :class="['w-5 h-5 flex-shrink-0', isActive('/mis-facturas') ? 'text-primary-500' : 'text-titan-500 group-hover:text-titan-300']" />
            <span v-if="isExpanded" class="whitespace-nowrap">Mis Facturas</span>
          </NuxtLink>
        </div>
      </nav>
    </template>

    <!-- Full organizer navigation (has tenant) -->
    <template v-else>
      <!-- Tenant Selector -->
      <div v-if="isExpanded" class="px-3 pt-4">
        <div class="tenant-selector-container">
          <button
            @click="showTenantDropdown = !showTenantDropdown"
            :disabled="tenantsStore.isLoading"
            class="w-full flex items-center justify-between px-3 py-2 border border-secondary-700 rounded-lg text-sm text-white bg-secondary-800 hover:bg-secondary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span v-if="tenantsStore.isLoading" class="text-titan-400">Cargando</span>
              <span v-else class="font-medium truncate">{{ tenantsStore.selectedTenant?.name || 'Seleccionar' }}</span>
            </div>
            <ChevronDownIcon :class="['w-4 h-4 text-titan-400 transition-transform flex-shrink-0', showTenantDropdown ? 'rotate-180' : '']" />
          </button>

          <!-- Expandable List -->
          <Transition name="tenant-expand">
            <div
              v-show="showTenantDropdown"
              class="mt-2 bg-secondary-800 border border-secondary-700 rounded-lg overflow-hidden"
            >
              <div class="py-1">
                <div v-if="tenantsStore.isLoading" class="px-3 py-2 text-sm text-titan-400">
                  Cargando tenants
                </div>
                <div v-else-if="tenantsStore.tenants.length === 0" class="px-3 py-2 text-sm text-titan-400">
                  Sin tenants disponibles
                </div>
                <button
                  v-else
                  v-for="tenant in tenantsStore.tenants"
                  :key="tenant.id"
                  @click="selectTenant(tenant)"
                  :disabled="tenantsStore.isLoading"
                  class="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-secondary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                  :class="tenantsStore.selectedTenant?.id === tenant.id ? 'bg-primary-600/20 text-primary-400 font-medium' : ''"
                >
                  <div class="w-2 h-2 rounded-full" :class="tenantsStore.selectedTenant?.id === tenant.id ? 'bg-primary-500' : 'bg-secondary-500'"></div>
                  <span class="truncate">{{ tenant.name }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 overflow-y-auto px-2">
        <!-- Mis Compras -->
        <div class="space-y-1">
          <span v-if="isExpanded" class="px-3 text-[10px] text-titan-500/70 uppercase tracking-widest font-medium">Mis Compras</span>

          <NuxtLink
            to="/mis-boletas"
            :class="[
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group',
              isExpanded ? '' : 'justify-center',
              isActive('/mis-boletas')
                ? 'bg-primary-600/20 text-primary-400 font-medium'
                : 'text-titan-300 hover:bg-secondary-800 hover:text-white'
            ]"
            :title="!isExpanded ? 'Mis Boletas' : ''"
          >
            <TicketIcon :class="['w-5 h-5 flex-shrink-0', isActive('/mis-boletas') ? 'text-primary-500' : 'text-titan-500 group-hover:text-titan-300']" />
            <span v-if="isExpanded" class="whitespace-nowrap">Mis Boletas</span>
          </NuxtLink>

          <NuxtLink
            to="/mis-facturas"
            :class="[
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group',
              isExpanded ? '' : 'justify-center',
              isActive('/mis-facturas')
                ? 'bg-primary-600/20 text-primary-400 font-medium'
                : 'text-titan-300 hover:bg-secondary-800 hover:text-white'
            ]"
            :title="!isExpanded ? 'Mis Facturas' : ''"
          >
            <DocumentTextIcon :class="['w-5 h-5 flex-shrink-0', isActive('/mis-facturas') ? 'text-primary-500' : 'text-titan-500 group-hover:text-titan-300']" />
            <span v-if="isExpanded" class="whitespace-nowrap">Mis Facturas</span>
          </NuxtLink>
        </div>

        <!-- Promotor (visible for promotor/admin/superuser) -->
        <div v-if="authStore.canAccessPromoterPages" class="pt-4 space-y-1">
          <span v-if="isExpanded" class="px-3 text-[10px] text-titan-500/70 uppercase tracking-widest font-medium">Promotor</span>

          <NuxtLink
            to="/promotores/mis-ventas"
            :class="[
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group',
              isExpanded ? '' : 'justify-center',
              isActive('/promotores')
                ? 'bg-primary-600/20 text-primary-400 font-medium'
                : 'text-titan-300 hover:bg-secondary-800 hover:text-white'
            ]"
            :title="!isExpanded ? 'Promotor' : ''"
          >
            <ChartBarIcon :class="['w-5 h-5 flex-shrink-0', isActive('/promotores') ? 'text-primary-500' : 'text-titan-500 group-hover:text-titan-300']" />
            <span v-if="isExpanded" class="whitespace-nowrap">Promotor</span>
          </NuxtLink>
        </div>

        <!-- Administracion (collapsible, only for admin/superuser) -->
        <div v-if="authStore.isAdmin" class="pt-4">
          <button
            v-if="isExpanded"
            @click="sections.administracion = !sections.administracion"
            class="w-full flex items-center justify-between px-3 py-1 group"
          >
            <span class="text-[10px] text-titan-500/70 uppercase tracking-widest font-medium group-hover:text-titan-400 transition-colors">Administracion</span>
            <ChevronDownIcon :class="['w-3 h-3 text-titan-500/70 transition-transform duration-200', sections.administracion ? '' : '-rotate-90']" />
          </button>
          <div :class="['overflow-hidden transition-all duration-200 space-y-1', isExpanded && !sections.administracion ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100']">
            <NuxtLink
              to="/gestion"
              :class="[
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group',
                isExpanded ? '' : 'justify-center',
                isActive('/gestion')
                  ? 'bg-primary-600/20 text-primary-400 font-medium'
                  : 'text-titan-300 hover:bg-secondary-800 hover:text-white'
              ]"
              :title="!isExpanded ? 'Gestion de Eventos' : ''"
            >
              <CalendarDaysIcon :class="['w-5 h-5 flex-shrink-0', isActive('/gestion') ? 'text-primary-500' : 'text-titan-500 group-hover:text-titan-300']" />
              <span v-if="isExpanded" class="whitespace-nowrap">Gestion de Eventos</span>
            </NuxtLink>

            <NuxtLink
              to="/operaciones"
              :class="[
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group',
                isExpanded ? '' : 'justify-center',
                isActive('/operaciones')
                  ? 'bg-primary-600/20 text-primary-400 font-medium'
                  : 'text-titan-300 hover:bg-secondary-800 hover:text-white'
              ]"
              :title="!isExpanded ? 'Operaciones' : ''"
            >
              <QrCodeIcon :class="['w-5 h-5 flex-shrink-0', isActive('/operaciones') ? 'text-primary-500' : 'text-titan-500 group-hover:text-titan-300']" />
              <span v-if="isExpanded" class="whitespace-nowrap">Operaciones</span>
            </NuxtLink>

            <NuxtLink
              to="/equipo/miembros"
              :class="[
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group',
                isExpanded ? '' : 'justify-center',
                isActive('/equipo')
                  ? 'bg-primary-600/20 text-primary-400 font-medium'
                  : 'text-titan-300 hover:bg-secondary-800 hover:text-white'
              ]"
              :title="!isExpanded ? 'Miembros' : ''"
            >
              <UsersIcon :class="['w-5 h-5 flex-shrink-0', isActive('/equipo') ? 'text-primary-500' : 'text-titan-500 group-hover:text-titan-300']" />
              <span v-if="isExpanded" class="whitespace-nowrap">Miembros</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Aplicaciones (collapsible, closed by default) -->
        <div class="pt-4">
          <button
            v-if="isExpanded"
            @click="sections.aplicaciones = !sections.aplicaciones"
            class="w-full flex items-center justify-between px-3 py-1 group"
          >
            <span class="text-[10px] text-titan-500/70 uppercase tracking-widest font-medium group-hover:text-titan-400 transition-colors">Aplicaciones</span>
            <ChevronDownIcon :class="['w-3 h-3 text-titan-500/70 transition-transform duration-200', sections.aplicaciones ? '' : '-rotate-90']" />
          </button>
          <div :class="['overflow-hidden transition-all duration-200 space-y-1', isExpanded && !sections.aplicaciones ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100']">
            <a
              href="https://warocol.com/menu/productos"
              :class="[
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group',
                isExpanded ? '' : 'justify-center',
                'text-titan-300 hover:bg-secondary-800 hover:text-white'
              ]"
              :title="!isExpanded ? 'Restaurantes' : ''"
            >
              <Squares2X2Icon class="w-5 h-5 flex-shrink-0 text-titan-500 group-hover:text-titan-300" />
              <span v-if="isExpanded" class="whitespace-nowrap">Restaurantes</span>
            </a>
          </div>
        </div>
      </nav>
    </template>

    <!-- User Profile & Logout -->
    <div class="border-t border-secondary-800 p-3">
      <!-- User Info -->
      <div class="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-secondary-800/50">
        <div class="relative flex-shrink-0">
          <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
            {{ authStore.initials }}
          </div>
          <span class="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-secondary-900 rounded-full"></span>
        </div>
        <div v-if="isExpanded" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ authStore.displayName }}</p>
          <p class="text-xs text-titan-400 truncate">{{ authStore.user?.email }}</p>
        </div>
      </div>

      <!-- Logout Button -->
      <button
        @click="handleLogout"
        :class="[
          'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-titan-400 hover:bg-red-900/20 hover:text-red-400 transition-colors text-sm group',
          isExpanded ? '' : 'justify-center'
        ]"
        :title="!isExpanded ? 'Cerrar sesion' : ''"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5 flex-shrink-0 text-titan-500 group-hover:text-red-400" />
        <Transition name="fade">
          <span v-if="isExpanded" class="whitespace-nowrap">Cerrar sesion</span>
        </Transition>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  QrCodeIcon,
  Squares2X2Icon,
  TicketIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const authStore = useAuthStore()
const tenantsStore = useTenantsStore()

const isExpanded = ref(false)
const showTenantDropdown = ref(false)

// Collapsible sections state
const sections = reactive({
  administracion: true,
  aplicaciones: false
})

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

function handleMouseLeave() {
  isExpanded.value = false
  showTenantDropdown.value = false
}

async function selectTenant(tenant: { id: string; name: string; slug: string }) {
  showTenantDropdown.value = false
  await tenantsStore.selectTenant(tenant)
}

async function handleLogout() {
  await authStore.logout()
  navigateTo('/auth/login')
}

// Close tenant dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    const tenantSelector = document.querySelector('.tenant-selector-container')
    if (tenantSelector && !tenantSelector.contains(target)) {
      showTenantDropdown.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tenant dropdown expand/collapse transition */
.tenant-expand-enter-active,
.tenant-expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  opacity: 1;
}

.tenant-expand-enter-from,
.tenant-expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
