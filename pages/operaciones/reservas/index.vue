<template>
  <div>
    <!-- Loading Events State -->
    <UiGestionLoader v-if="isLoadingEvents" />

    <!-- Error State -->
    <div v-else-if="eventsError" class="bg-surface border border-border rounded-xl p-8 text-center">
      <ExclamationCircleIcon class="w-16 h-16 mx-auto mb-4 text-destructive" />
      <p class="text-text-primary font-bold mb-2">Error al cargar eventos</p>
      <p class="text-sm text-text-secondary mb-4">{{ eventsError.message || 'Error desconocido' }}</p>
      <button
        @click="refreshEvents"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Reintentar
      </button>
    </div>

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
        <TicketIcon class="w-16 h-16 mx-auto mb-4 text-text-tertiary" />
        <p class="text-text-primary font-bold">Selecciona un evento</p>
        <p class="text-sm text-text-secondary mt-1">Para ver las reservas, primero selecciona un evento</p>
      </div>

      <!-- Reservations Content -->
      <template v-else>
        <!-- Header Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div class="flex items-center gap-3 flex-wrap">
            <div class="relative flex-1 sm:max-w-xs">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar reservas..."
                class="w-full h-10 pl-10 pr-4 py-2 border-2 border-border bg-background rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <select
              v-model="statusFilter"
              class="h-10 px-4 py-2 border-2 border-border bg-background rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="active">Activas</option>
              <option value="confirmed">Confirmadas</option>
              <option value="cancelled">Canceladas</option>
              <option value="expired">Expiradas</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <UiGestionLoader v-if="isLoading" />

        <!-- Data View -->
        <UiResponsiveDataView
          v-else
          :columns="columns"
          :data="filteredReservations"
          :sort-field="sortField"
          :sort-direction="sortDirection"
          empty-message="No hay reservas para este evento"
          empty-sub-message="Las reservas apareceran aqui cuando se realicen"
          @sort="handleSort"
          @row-click="goToDetail"
        >
          <!-- Mobile Card -->
          <template #card="{ item }">
            <div class="bg-surface border border-border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow" @click="goToDetail(item)">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-bold text-text-primary">{{ item.name || 'Sin nombre' }}</p>
                  <p class="text-xs text-text-secondary">{{ item.email }}</p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(item.status)"
                >
                  {{ getStatusLabel(item.status) }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-text-secondary">Areas:</span>
                  <span class="ml-1 text-text-primary">{{ item.areas?.join(', ') || '-' }}</span>
                </div>
                <div>
                  <span class="text-text-secondary">Boletas:</span>
                  <span class="ml-1 text-text-primary">{{ item.total_units }}</span>
                </div>
                <div>
                  <span class="text-text-secondary">Total:</span>
                  <span class="ml-1 text-text-primary">${{ formatNumber(item.total_paid) }}</span>
                </div>
                <div>
                  <span class="text-text-secondary">Fecha:</span>
                  <span class="ml-1 text-text-primary">{{ formatDate(item.reservation_date) }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Custom cell: Name -->
          <template #cell-name="{ value }">
            <span class="font-medium">{{ value || 'Sin nombre' }}</span>
          </template>

          <!-- Custom cell: Areas -->
          <template #cell-areas="{ value }">
            <span class="text-sm">{{ value?.join(', ') || '-' }}</span>
          </template>

          <!-- Custom cell: Total -->
          <template #cell-total_paid="{ value }">
            <span class="font-medium">${{ formatNumber(value) }}</span>
          </template>

          <!-- Custom cell: Date -->
          <template #cell-reservation_date="{ value }">
            <span class="text-sm">{{ formatDate(value) }}</span>
          </template>

          <!-- Custom cell: Status badge -->
          <template #cell-status="{ value }">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(value)"
            >
              {{ getStatusLabel(value) }}
            </span>
          </template>

          <!-- Custom cell: Action icon -->
          <template #cell-action>
            <ChevronRightIcon class="w-5 h-5 text-text-tertiary" />
          </template>
        </UiResponsiveDataView>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  TicketIcon,
  ChevronRightIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

useHead({ title: 'Reservas - WaRo Tickets' })

// Tenant reactivity
const { onTenantChange, currentTenant } = useTenantReactive()

// State
const searchQuery = ref('')
const statusFilter = ref('')
const selectedEventId = ref<number | ''>('')
const isLoading = ref(false)
const reservations = ref<any[]>([])
const sortField = ref('reservation_date')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Load events for selector
const { data: eventsData, pending: isLoadingEvents, error: eventsError, refresh: refreshEvents } = useAsyncData(
  `reservas-events-${currentTenant.value?.id || 'default'}`,
  () => $fetch('/api/events', { credentials: 'include' }),
  {
    server: false,
    watch: [currentTenant],
    transform: (response: any) => response.data || response || []
  }
)

// Refresh on tenant change
onTenantChange(async () => {
  selectedEventId.value = ''
  reservations.value = []
  await refreshEvents()
  router.replace({ query: {} })
})

const events = computed(() => eventsData.value || [])

// Query param sync + shared store
const route = useRoute()
const router = useRouter()
const eventStore = useEventSelectionStore()

const initialEventId = route.query.event ? Number(route.query.event) : (eventStore.selectedEventId || '')
selectedEventId.value = initialEventId

// Load reservations after component is mounted (ensures auth middleware has completed)
onMounted(() => {
  if (initialEventId) {
    loadReservations(initialEventId as number)
  }
})

// Watch for event selection changes
watch(selectedEventId, async (newEventId, oldEventId) => {
  // Skip only if this is the very first render before user interaction
  if (oldEventId === undefined) return

  eventStore.setEvent(newEventId ? Number(newEventId) : null)

  if (newEventId) {
    await loadReservations(newEventId)
    router.replace({ query: { event: String(newEventId) } })
  } else {
    reservations.value = []
    router.replace({ query: {} })
  }
})

// Watch status filter to reload with server-side filter
watch(statusFilter, async () => {
  if (selectedEventId.value) {
    await loadReservations(selectedEventId.value)
  }
})

async function loadReservations(eventId: number) {
  isLoading.value = true
  try {
    const params: Record<string, string> = {}
    if (statusFilter.value) params.status = statusFilter.value

    const query = new URLSearchParams(params).toString()
    const url = `/api/reservations/event/${eventId}${query ? `?${query}` : ''}`

    const response = await $fetch(url, {
      credentials: 'include'
    })
    reservations.value = (response as any) || []
  } catch (err) {
    console.error('Error loading reservations:', err)
    reservations.value = []
  } finally {
    isLoading.value = false
  }
}

// Table columns
const columns = [
  { key: 'name', title: 'Nombre', sortable: true, align: 'left' as const },
  { key: 'email', title: 'Email', sortable: true, align: 'left' as const },
  { key: 'areas', title: 'Areas', sortable: false, align: 'left' as const },
  { key: 'total_units', title: 'Boletas', sortable: true, align: 'center' as const, format: 'number' as const },
  { key: 'total_paid', title: 'Total', sortable: true, align: 'right' as const },
  { key: 'reservation_date', title: 'Fecha', sortable: true, align: 'left' as const },
  { key: 'status', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'action', title: '', sortable: false, align: 'center' as const }
]

// Filtered reservations (client-side search only, status is server-side)
const filteredReservations = computed(() => {
  let result = reservations.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((r: any) =>
      (r.name || '').toLowerCase().includes(query) ||
      (r.email || '').toLowerCase().includes(query)
    )
  }

  // Sort
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

function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    confirmed: 'bg-success/10 text-success',
    active: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    cancelled: 'bg-destructive/10 text-destructive',
    expired: 'bg-surface-secondary text-text-secondary'
  }
  return classes[status] || 'bg-surface-secondary text-text-secondary'
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    confirmed: 'Confirmada',
    active: 'Activa',
    pending: 'Pendiente',
    cancelled: 'Cancelada',
    expired: 'Expirada'
  }
  return labels[status] || status
}

function goToDetail(row: any) {
  navigateTo(`/operaciones/reservas/${row.id}?event=${selectedEventId.value}`)
}

function formatNumber(value: number) {
  return (value || 0).toLocaleString('es-CO')
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>
