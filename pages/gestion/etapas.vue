<template>
  <div>
    <!-- Loading Events State -->
    <div v-if="isLoadingEvents" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-secondary-500">Cargando eventos...</p>
      </div>
    </div>

    <template v-else>
      <!-- Event Selector -->
      <div class="bg-white border border-secondary-200 rounded-lg p-4 mb-6">
        <label class="block text-sm font-medium text-secondary-900 mb-2">
          Seleccionar Evento
        </label>
        <select
          v-model="selectedEventId"
          class="w-full sm:max-w-md px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 bg-white"
        >
          <option value="">Seleccionar evento</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.cluster_name }}
          </option>
        </select>
      </div>

      <!-- No Event Selected -->
      <div v-if="!selectedEventId" class="bg-white border border-secondary-200 rounded-lg p-8 text-center">
        <ClockIcon class="w-16 h-16 mx-auto mb-4 text-secondary-300" />
        <p class="text-secondary-600 font-medium">Selecciona un evento</p>
        <p class="text-sm text-secondary-500 mt-1">Para ver y gestionar las etapas de venta, primero selecciona un evento</p>
      </div>

      <!-- Etapas Content -->
      <template v-else>
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
          <div class="text-center">
            <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-secondary-500">Cargando etapas...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="fetchError" class="flex items-center justify-center min-h-[400px]">
          <div class="text-center">
            <p class="text-xl font-semibold text-secondary-800 mb-2">Error al cargar las etapas</p>
            <p class="text-sm text-secondary-600 mb-4">{{ fetchError }}</p>
            <button @click="loadStages" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
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
                placeholder="Buscar etapas..."
                class="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
              />
            </div>
            <NuxtLink :to="`/gestion/etapa/crear?event=${selectedEventId}`" class="btn-primary">
              <PlusIcon class="w-5 h-5" />
              <span class="hidden sm:inline">Crear Etapa</span>
              <span class="sm:hidden">Nueva</span>
            </NuxtLink>
          </div>

          <!-- Responsive Data View -->
          <UiResponsiveDataView
            :columns="columns"
            :data="filteredStages"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            empty-message="No hay etapas de venta"
            empty-sub-message="Crea etapas como Early Bird, Preventa, etc."
            @sort="handleSort"
          >
            <!-- Mobile Card -->
            <template #card="{ item }">
              <NuxtLink :to="`/gestion/etapa/${item.id}?event=${selectedEventId}`" class="block">
                <div class="bg-white border border-secondary-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors">
                  <div class="h-16 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <ClockIcon class="w-8 h-8 text-white/30" />
                  </div>
                  <div class="p-4">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium text-secondary-900">{{ item.stage_name }}</span>
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="getStatusClass(item.is_active)"
                      >
                        {{ getStatusLabel(item.is_active) }}
                      </span>
                    </div>
                    <p class="text-sm text-secondary-500 mb-2">{{ formatDateRange(item.start_time, item.end_time) }}</p>
                    <div class="flex items-center gap-4 text-sm text-secondary-600">
                      <span><strong>{{ formatDiscount(item) }}</strong></span>
                      <span>{{ item.quantity_available - item.quantity_sold }} disponibles</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </template>

            <!-- Desktop Header -->
            <template #header>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h3 class="text-base sm:text-lg font-bold text-secondary-900">
                  Etapas de Venta
                </h3>
              </div>
            </template>

            <!-- Custom cell: Name -->
            <template #cell-stage_name="{ value, row }">
              <NuxtLink :to="`/gestion/etapa/${row.id}?event=${selectedEventId}`" class="font-medium text-secondary-900 hover:text-primary-600">
                {{ value }}
              </NuxtLink>
            </template>

            <!-- Custom cell: Discount -->
            <template #cell-discount="{ row }">
              <span :class="row.price_adjustment_value < 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatDiscount(row) }}
              </span>
            </template>

            <!-- Custom cell: Date range -->
            <template #cell-start_time="{ row }">
              {{ formatDateRange(row.start_time, row.end_time) }}
            </template>

            <!-- Custom cell: Availability -->
            <template #cell-quantity_available="{ row }">
              {{ row.quantity_available - row.quantity_sold }} / {{ row.quantity_available }}
            </template>

            <!-- Custom cell: Areas count -->
            <template #cell-areas_count="{ row }">
              {{ row.area_ids?.length || 0 }} areas
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
                  :to="`/gestion/etapa/${row.id}?event=${selectedEventId}`"
                  class="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg"
                  title="Editar"
                >
                  <PencilIcon class="w-4 h-4" />
                </NuxtLink>
              </div>
            </template>
          </UiResponsiveDataView>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ClockIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

useHead({ title: 'Etapas de Venta - WaRo Tickets' })

// State
const selectedEventId = ref<number | ''>('')
const isLoading = ref(false)
const fetchError = ref<string | null>(null)
const stages = ref<any[]>([])
const searchQuery = ref('')
const sortField = ref('priority_order')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Load events for selector
const { data: eventsData, pending: isLoadingEvents } = useAsyncData('etapas-events-list', () =>
  $fetch('/api/events', {
    credentials: 'include'
  }),
  {
    server: false,
    lazy: true,
    transform: (response: any) => response.data || response || []
  }
)

const events = computed(() => eventsData.value || [])

// Check for event query param
const route = useRoute()
const router = useRouter()

// Initialize from query param
const initialEventId = route.query.event ? Number(route.query.event) : ''
if (initialEventId) {
  selectedEventId.value = initialEventId
  loadStages()
}

// Watch for event selection changes
watch(selectedEventId, async (newEventId, oldEventId) => {
  if (oldEventId === undefined) return

  if (newEventId) {
    await loadStages()
    router.replace({ query: { event: String(newEventId) } })
  } else {
    stages.value = []
    router.replace({ query: {} })
  }
})

// Load stages for selected event
async function loadStages() {
  if (!selectedEventId.value) return

  isLoading.value = true
  fetchError.value = null

  try {
    const response = await $fetch(`/api/sale-stages/event/${selectedEventId.value}`, {
      credentials: 'include'
    })
    stages.value = (response as any) || []
  } catch (err: any) {
    console.error('Error loading stages:', err)
    fetchError.value = err?.data?.detail || 'Error al cargar las etapas'
    stages.value = []
  } finally {
    isLoading.value = false
  }
}

// Table columns
const columns = [
  { key: 'stage_name', title: 'Nombre', sortable: true, align: 'left' as const },
  { key: 'discount', title: 'Descuento', sortable: false, align: 'center' as const },
  { key: 'start_time', title: 'Periodo', sortable: true, align: 'center' as const },
  { key: 'quantity_available', title: 'Disponibilidad', sortable: true, align: 'center' as const },
  { key: 'areas_count', title: 'Areas', sortable: false, align: 'center' as const },
  { key: 'is_active', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

// Filtered and sorted stages
const filteredStages = computed(() => {
  let result = stages.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(stage =>
      stage.stage_name.toLowerCase().includes(query)
    )
  }

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

// Methods
function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function formatDateRange(start: string, end: string | null) {
  if (!start) return '-'
  const startDate = new Date(start)
  const startStr = startDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })

  if (!end) return `Desde ${startStr}`

  const endDate = new Date(end)
  const endStr = endDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

  return `${startStr} - ${endStr}`
}

function formatDiscount(stage: any) {
  const value = stage.price_adjustment_value
  const type = stage.price_adjustment_type

  if (type === 'percentage') {
    return `${value > 0 ? '+' : ''}${value}%`
  } else {
    const absValue = Math.abs(value)
    const formatted = absValue.toLocaleString('es-CO')
    return value < 0 ? `-$${formatted}` : `+$${formatted}`
  }
}

function getStatusClass(isActive: boolean) {
  return isActive
    ? 'bg-green-100 text-green-700'
    : 'bg-secondary-100 text-secondary-600'
}

function getStatusLabel(isActive: boolean) {
  return isActive ? 'Activa' : 'Inactiva'
}
</script>
