<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-secondary-500">Cargando eventos...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <p class="text-xl font-semibold text-secondary-800 mb-2">Error al cargar los eventos</p>
        <p class="text-sm text-secondary-600 mb-4">{{ fetchError.message || 'Error desconocido' }}</p>
        <button @click="refresh" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Reintentar
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col gap-4">
      <!-- Header Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="relative flex-1 sm:max-w-xs">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar eventos..."
            class="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
            @input="handleSearch"
          />
        </div>
        <NuxtLink to="/gestion/evento/crear" class="btn-primary">
          <PlusIcon class="w-5 h-5" />
          <span class="hidden sm:inline">Crear Evento</span>
          <span class="sm:hidden">Nuevo</span>
        </NuxtLink>
      </div>

      <!-- Responsive Data View -->
      <UiResponsiveDataView
        :columns="columns"
        :data="events"
        :sort-field="sortField"
        :sort-direction="sortDirection"
        empty-message="No hay eventos"
        empty-sub-message="Crea tu primer evento para empezar a vender boletas"
        @sort="handleSort"
      >
        <!-- Mobile Card -->
        <template #card="{ item }">
          <NuxtLink :to="`/gestion/evento/${item.id}`" class="block">
            <div class="bg-white border border-secondary-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors">
              <div class="h-24 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <CalendarIcon class="w-10 h-10 text-white/30" />
              </div>
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-secondary-900">{{ item.cluster_name }}</span>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(item.is_active)"
                  >
                    {{ getStatusLabel(item.is_active) }}
                  </span>
                </div>
                <p class="text-sm text-secondary-500 mb-2">{{ formatDate(item.start_date) }}</p>
                <div class="flex items-center gap-4 text-sm text-secondary-600">
                  <span><strong>{{ item.total_sold || 0 }}</strong> vendidas</span>
                  <span><strong>{{ item.total_checked_in || 0 }}</strong> check-in</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </template>

        <!-- Desktop Header -->
        <template #header>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <h3 class="text-base sm:text-lg font-bold text-secondary-900">
              Eventos
            </h3>
          </div>
        </template>

        <!-- Custom cell: Name -->
        <template #cell-cluster_name="{ value, row }">
          <NuxtLink :to="`/gestion/evento/${row.id}`" class="font-medium text-secondary-900 hover:text-primary-600">
            {{ value }}
          </NuxtLink>
        </template>

        <!-- Custom cell: Date -->
        <template #cell-start_date="{ value }">
          {{ formatDate(value) }}
        </template>

        <!-- Custom cell: Status badge -->
        <template #cell-is_active="{ value }">
          <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="getStatusClass(value)"
          >
            {{ getStatusLabel(value) }}
          </span>
        </template>

        <!-- Custom cell: Actions -->
        <template #cell-actions="{ row }">
          <div class="flex items-center gap-2 justify-center">
            <NuxtLink
              :to="`/gestion/evento/${row.id}`"
              class="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg"
              title="Editar"
            >
              <PencilIcon class="w-4 h-4" />
            </NuxtLink>
          </div>
        </template>
      </UiResponsiveDataView>

      <!-- Pagination -->
      <div v-if="totalEvents > itemsPerPage" class="bg-white px-4 py-3 flex items-center justify-between border border-secondary-200 rounded-lg">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-secondary-300 text-sm font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-secondary-300 text-sm font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-secondary-700">
              Mostrando <span class="font-medium">{{ startIndex }}</span> a <span class="font-medium">{{ endIndex }}</span>
              de <span class="font-medium">{{ totalEvents }}</span> resultados
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50"
              >
                <ChevronLeftIcon class="h-5 w-5" />
              </button>
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-secondary-300 text-sm font-medium',
                  currentPage === page
                    ? 'bg-primary-50 border-primary-500 text-primary-600'
                    : 'bg-white text-secondary-700 hover:bg-secondary-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50"
              >
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

useHead({ title: 'Eventos - WaRo Tickets' })

// Tenant reactivity
const { onTenantChange, currentTenant } = useTenantReactive()

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(20)

// Search and sort state
const searchQuery = ref('')
const apiSearchQuery = ref('')
const sortField = ref('start_date')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout>
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    apiSearchQuery.value = searchQuery.value
    currentPage.value = 1
    refresh()
  }, 300)
}

// Fetch events from API
const { data: eventsData, pending: isLoading, error: fetchError, refresh } = useAsyncData(
  `events-${currentTenant.value?.id || 'default'}`,
  () => {
    const params: Record<string, any> = {
      page: currentPage.value,
      limit: itemsPerPage.value
    }

    if (apiSearchQuery.value) {
      params.search = apiSearchQuery.value
    }

    return $fetch('/api/events', {
      query: params,
      credentials: 'include'
    })
  },
  {
    server: false,
    watch: [currentTenant, currentPage],
    default: () => ({ data: [], total: 0 }),
    transform: (response: any) => ({
      data: response.data || response || [],
      total: response.total || (response.data ? response.data.length : response.length) || 0
    })
  }
)

// Refresh on tenant change
onTenantChange(async () => {
  await refresh()
})

// Computed properties
const events = computed(() => {
  let result = eventsData.value?.data || []

  // Client-side sorting
  if (sortField.value) {
    result = [...result].sort((a: any, b: any) => {
      const aValue = a[sortField.value]
      const bValue = b[sortField.value]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
      }

      const strA = String(aValue).toLowerCase()
      const strB = String(bValue).toLowerCase()
      return sortDirection.value === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA)
    })
  }

  return result
})

const totalEvents = computed(() => eventsData.value?.total || 0)
const totalPages = computed(() => Math.ceil(totalEvents.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalEvents.value))

const displayedPages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Table columns
const columns = [
  { key: 'cluster_name', title: 'Nombre', sortable: true, align: 'left' as const },
  { key: 'start_date', title: 'Fecha', sortable: true, align: 'center' as const },
  { key: 'total_sold', title: 'Vendidas', sortable: true, align: 'right' as const, format: 'number' as const },
  { key: 'total_checked_in', title: 'Check-in', sortable: true, align: 'right' as const, format: 'number' as const },
  { key: 'is_active', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

// Methods
function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function formatDate(dateString: string) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusClass(isActive: boolean) {
  return isActive
    ? 'bg-green-100 text-green-700'
    : 'bg-secondary-100 text-secondary-600'
}

function getStatusLabel(isActive: boolean) {
  return isActive ? 'Activo' : 'Inactivo'
}
</script>
