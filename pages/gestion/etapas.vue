<template>
  <div>
    <!-- Loading Events State -->
    <UiGestionLoader v-if="isLoadingEvents" />

    <template v-else>
      <!-- Event Selector -->
      <div class="bg-surface border border-border rounded-xl p-4 mb-6">
        <label class="block text-sm font-bold text-text-primary mb-2">
          Seleccionar Evento
        </label>
        <select
          v-model="selectedEventId"
          class="w-full sm:max-w-md h-10 px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-primary bg-background"
        >
          <option value="">Seleccionar evento</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.cluster_name }}
          </option>
        </select>
      </div>

      <!-- No Event Selected -->
      <div v-if="!selectedEventId" class="bg-surface border border-border rounded-xl p-8 text-center">
        <ClockIcon class="w-16 h-16 mx-auto mb-4 text-text-tertiary" />
        <p class="text-text-primary font-bold">Selecciona un evento</p>
        <p class="text-sm text-text-secondary mt-1">Para ver y gestionar las etapas de venta, primero selecciona un evento</p>
      </div>

      <!-- Etapas Content -->
      <template v-else>
        <!-- Loading State -->
        <UiGestionLoader v-if="isLoading" />

        <!-- Error State -->
        <div v-else-if="fetchError" class="flex items-center justify-center min-h-[400px]">
          <div class="text-center">
            <p class="text-xl font-bold text-text-primary mb-2">Error al cargar las etapas</p>
            <p class="text-sm text-text-secondary mb-4">{{ fetchError }}</p>
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
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar etapas..."
                class="w-full h-10 pl-10 pr-4 py-2 border-2 border-border bg-background rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none"
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
                <div class="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
                  <div class="h-16 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center relative">
                    <ClockIcon class="w-8 h-8 text-white/30" />
                    <div class="absolute top-2 right-2">
                      <span
                        class="px-2 py-0.5 text-xs font-medium rounded-full"
                        :class="getStatusClass(item.is_active)"
                      >
                        {{ getStatusLabel(item.is_active) }}
                      </span>
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium text-secondary-900">{{ item.stage_name }}</span>
                      <span class="text-xs text-secondary-500">
                        {{ item.total_tickets || item.areas?.reduce((s: number, a: any) => s + (a.quantity || 1), 0) || 0 }} boletas
                      </span>
                    </div>

                    <!-- Areas Preview -->
                    <div v-if="item.areas && item.areas.length" class="mb-3 flex flex-wrap gap-1">
                      <span
                        v-for="(area, idx) in item.areas.slice(0, 3)"
                        :key="idx"
                        class="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded"
                      >
                        {{ area.quantity || 1 }}x {{ area.area_name }}
                      </span>
                      <span v-if="item.areas.length > 3" class="px-1.5 py-0.5 text-text-tertiary text-xs">
                        +{{ item.areas.length - 3 }} más
                      </span>
                    </div>

                    <p class="text-sm text-text-secondary mb-2">{{ formatDateRange(item.start_time, item.end_time) }}</p>
                    <div class="flex items-center justify-between text-sm">
                      <div class="flex items-center gap-2">
                        <span
                          class="px-1.5 py-0.5 text-xs font-medium rounded"
                          :class="getPricingTypeClass(item.price_adjustment_type)"
                        >
                          {{ getPricingTypeLabel(item.price_adjustment_type) }}
                        </span>
                        <span class="font-bold" :class="item.price_adjustment_type === 'fixed_price' ? 'text-primary' : 'text-success'">
                          {{ formatDiscount(item) }}
                        </span>
                      </div>
                      <span class="text-text-secondary">{{ item.quantity_available - item.quantity_sold }} disp.</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </template>

            <!-- Desktop Header -->
            <template #header>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h3 class="text-base sm:text-lg font-bold text-text-primary">
                  Etapas de Venta
                </h3>
              </div>
            </template>

            <!-- Custom cell: Name -->
            <template #cell-stage_name="{ value, row }">
              <NuxtLink :to="`/gestion/etapa/${row.id}?event=${selectedEventId}`" class="font-bold text-text-primary hover:text-primary">
                {{ value }}
              </NuxtLink>
            </template>

            <!-- Custom cell: Areas (Paquete) -->
            <template #cell-areas="{ row }">
              <div class="flex flex-wrap gap-1 max-w-xs">
                <span
                  v-for="(area, idx) in (row.areas || []).slice(0, 2)"
                  :key="idx"
                  class="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded whitespace-nowrap"
                >
                  {{ area.quantity || 1 }}x {{ area.area_name }}
                </span>
                <span v-if="(row.areas || []).length > 2" class="px-1.5 py-0.5 text-text-tertiary text-xs">
                  +{{ row.areas.length - 2 }}
                </span>
              </div>
            </template>

            <!-- Custom cell: Total Tickets -->
            <template #cell-total_tickets="{ row }">
              <span class="font-bold text-text-primary">{{ row.total_tickets || row.areas?.reduce((s: number, a: any) => s + (a.quantity || 1), 0) || 0 }}</span>
            </template>

            <!-- Custom cell: Pricing Type -->
            <template #cell-pricing_type="{ row }">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getPricingTypeClass(row.price_adjustment_type)"
              >
                {{ getPricingTypeLabel(row.price_adjustment_type) }}
              </span>
            </template>

            <!-- Custom cell: Discount -->
            <template #cell-discount="{ row }">
              <span class="font-bold" :class="row.price_adjustment_type === 'fixed_price' ? 'text-primary' : 'text-success'">
                {{ formatDiscount(row) }}
              </span>
            </template>

            <!-- Custom cell: Availability -->
            <template #cell-quantity_available="{ row }">
              {{ row.quantity_available - row.quantity_sold }} / {{ row.quantity_available }}
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
                  class="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
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
  PencilIcon,
  TicketIcon
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
  { key: 'areas', title: 'Paquete', sortable: false, align: 'left' as const },
  { key: 'total_tickets', title: 'Boletas', sortable: false, align: 'center' as const },
  { key: 'pricing_type', title: 'Tipo', sortable: false, align: 'center' as const },
  { key: 'discount', title: 'Precio/Descuento', sortable: false, align: 'center' as const },
  { key: 'quantity_available', title: 'Disponibilidad', sortable: true, align: 'center' as const },
  { key: 'is_active', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: '', sortable: false, align: 'center' as const }
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

  if (type === 'fixed_price') {
    return `$${Math.abs(value).toLocaleString('es-CO')}`
  } else if (type === 'percentage') {
    return `${value > 0 ? '+' : ''}${value}%`
  } else {
    const absValue = Math.abs(value)
    const formatted = absValue.toLocaleString('es-CO')
    return value < 0 ? `-$${formatted}` : `+$${formatted}`
  }
}

function getPricingTypeClass(type: string) {
  switch (type) {
    case 'fixed_price':
      return 'bg-primary/10 text-primary'
    case 'percentage':
      return 'bg-success/10 text-success'
    case 'fixed':
      return 'bg-info/10 text-info'
    default:
      return 'bg-surface-secondary text-text-tertiary'
  }
}

function getPricingTypeLabel(type: string) {
  switch (type) {
    case 'fixed_price':
      return 'Precio Fijo'
    case 'percentage':
      return 'Porcentaje'
    case 'fixed':
      return 'Descuento'
    default:
      return type
  }
}

function getStatusClass(isActive: boolean) {
  return isActive
    ? 'bg-success/10 text-success'
    : 'bg-surface-secondary text-text-secondary'
}

function getStatusLabel(isActive: boolean) {
  return isActive ? 'Activa' : 'Inactiva'
}
</script>
