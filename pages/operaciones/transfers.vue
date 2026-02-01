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
        <ArrowsRightLeftIcon class="w-16 h-16 mx-auto mb-4 text-text-tertiary" />
        <p class="text-text-primary font-bold">Selecciona un evento</p>
        <p class="text-sm text-text-secondary mt-1">Para ver los transfers, primero selecciona un evento</p>
      </div>

      <!-- Transfers Content -->
      <template v-else>
        <!-- Header Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div class="flex items-center gap-3 flex-wrap">
            <div class="relative flex-1 sm:max-w-xs">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar transfers..."
                class="w-full h-10 pl-10 pr-4 py-2 border-2 border-border bg-background rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <select
              v-model="statusFilter"
              class="h-10 px-4 py-2 border-2 border-border bg-background rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="accepted">Aceptados</option>
              <option value="cancelled">Cancelados</option>
              <option value="expired">Expirados</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <UiGestionLoader v-if="isLoading" />

        <!-- Data View -->
        <UiResponsiveDataView
          v-else
          :columns="columns"
          :data="filteredTransfers"
          :sort-field="sortField"
          :sort-direction="sortDirection"
          empty-message="No hay transfers para este evento"
          empty-sub-message="Las transferencias de boletas apareceran aqui"
          @sort="handleSort"
        >
          <!-- Mobile Card -->
          <template #card="{ item }">
            <div class="bg-surface border border-border rounded-xl p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-text-primary">{{ item.from_name || 'Sin nombre' }}</span>
                  <ArrowRightIcon class="w-4 h-4 text-text-tertiary" />
                  <span class="text-sm font-bold text-primary">{{ item.to_name || item.to_email || 'Pendiente' }}</span>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(item.status)"
                >
                  {{ getStatusLabel(item.status) }}
                </span>
              </div>
              <div class="text-sm text-text-secondary space-y-1">
                <p>{{ item.area_name }} - {{ item.unit_display_name }}</p>
                <p class="text-xs text-text-tertiary">{{ formatDate(item.transfer_date) }}</p>
              </div>
            </div>
          </template>

          <!-- Custom cell: From -->
          <template #cell-from_name="{ value }">
            <span class="font-medium">{{ value || 'Sin nombre' }}</span>
          </template>

          <!-- Custom cell: To -->
          <template #cell-to_name="{ row }">
            <span class="font-medium">{{ row.to_name || row.to_email || 'Pendiente' }}</span>
          </template>

          <!-- Custom cell: Date -->
          <template #cell-transfer_date="{ value }">
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
        </UiResponsiveDataView>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon
} from '@heroicons/vue/24/outline'

useHead({ title: 'Transfers - WaRo Tickets' })

// State
const searchQuery = ref('')
const statusFilter = ref('')
const selectedEventId = ref<number | ''>('')
const isLoading = ref(false)
const transfers = ref<any[]>([])
const sortField = ref('transfer_date')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Load events for selector
const { data: eventsData, pending: isLoadingEvents } = useAsyncData('transfers-events-list', () =>
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

// Query param sync + shared store
const route = useRoute()
const router = useRouter()
const eventStore = useEventSelectionStore()

const initialEventId = route.query.event ? Number(route.query.event) : (eventStore.selectedEventId || '')
selectedEventId.value = initialEventId

// Load transfers after component is mounted (ensures auth middleware has completed)
onMounted(() => {
  if (initialEventId) {
    loadTransfers(initialEventId as number)
  }
})

// Watch for event selection changes
watch(selectedEventId, async (newEventId, oldEventId) => {
  // Skip if this is the initial mount (oldEventId will be '' or undefined)
  if (oldEventId === undefined || oldEventId === '') return

  eventStore.setEvent(newEventId ? Number(newEventId) : null)

  if (newEventId) {
    await loadTransfers(newEventId)
    router.replace({ query: { event: String(newEventId) } })
  } else {
    transfers.value = []
    router.replace({ query: {} })
  }
})

async function loadTransfers(eventId: number) {
  isLoading.value = true
  try {
    const response = await $fetch(`/api/transfers/event/${eventId}`, {
      credentials: 'include'
    })
    transfers.value = (response as any) || []
  } catch (err) {
    console.error('Error loading transfers:', err)
    transfers.value = []
  } finally {
    isLoading.value = false
  }
}

// Table columns
const columns = [
  { key: 'from_name', title: 'Origen', sortable: true, align: 'left' as const },
  { key: 'to_name', title: 'Destino', sortable: true, align: 'left' as const },
  { key: 'area_name', title: 'Area', sortable: true, align: 'left' as const },
  { key: 'unit_display_name', title: 'Boleta', sortable: true, align: 'left' as const },
  { key: 'transfer_date', title: 'Fecha', sortable: true, align: 'left' as const },
  { key: 'status', title: 'Estado', sortable: true, align: 'center' as const }
]

// Filtered transfers (client-side search + status filter)
const filteredTransfers = computed(() => {
  let result = transfers.value

  if (statusFilter.value) {
    result = result.filter((t: any) => t.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((t: any) =>
      (t.from_name || '').toLowerCase().includes(query) ||
      (t.from_email || '').toLowerCase().includes(query) ||
      (t.to_name || '').toLowerCase().includes(query) ||
      (t.to_email || '').toLowerCase().includes(query)
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
    accepted: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    cancelled: 'bg-destructive/10 text-destructive',
    expired: 'bg-surface-secondary text-text-secondary'
  }
  return classes[status] || 'bg-surface-secondary text-text-secondary'
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    accepted: 'Aceptado',
    pending: 'Pendiente',
    cancelled: 'Cancelado',
    expired: 'Expirado'
  }
  return labels[status] || status
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
