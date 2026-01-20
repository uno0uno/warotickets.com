<template>
  <div>
    <!-- Filters -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative flex-1 sm:max-w-xs">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar ventas..."
            class="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="completed">Completadas</option>
          <option value="pending">Pendientes</option>
          <option value="refunded">Reembolsadas</option>
        </select>
      </div>
      <button class="btn-secondary">
        <ArrowDownTrayIcon class="w-5 h-5" />
        Exportar
      </button>
    </div>

    <!-- Responsive Data View -->
    <UiResponsiveDataView
      :columns="columns"
      :data="filteredSales"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      empty-message="No hay ventas"
      empty-sub-message="Las ventas apareceran aqui"
      @sort="handleSort"
    >
      <!-- Mobile Card -->
      <template #card="{ item }">
        <div class="bg-white border border-secondary-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <code class="text-xs text-secondary-600">#{{ item.id }}</code>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(item.status)"
            >
              {{ getStatusLabel(item.status) }}
            </span>
          </div>
          <p class="font-medium text-secondary-900">{{ item.buyerName }}</p>
          <p class="text-xs text-secondary-500 mb-2">{{ item.buyerEmail }}</p>
          <div class="flex items-center justify-between text-sm">
            <span class="text-secondary-500">{{ item.tickets }} boletas</span>
            <span class="font-medium text-secondary-900">${{ item.total.toLocaleString('es-CO') }}</span>
          </div>
        </div>
      </template>

      <!-- Custom cell: ID -->
      <template #cell-id="{ value }">
        <code class="text-xs text-secondary-600">#{{ value }}</code>
      </template>

      <!-- Custom cell: Buyer Name -->
      <template #cell-buyerName="{ value }">
        <span class="font-medium">{{ value }}</span>
      </template>

      <!-- Custom cell: Area badge -->
      <template #cell-area="{ row }">
        <span
          class="px-1.5 py-0.5 text-xs rounded"
          :style="{ backgroundColor: row.areaColor + '20', color: row.areaColor }"
        >
          {{ row.area }}
        </span>
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

      <!-- Custom cell: Actions -->
      <template #cell-actions>
        <button class="text-secondary-400 hover:text-secondary-600">
          <EyeIcon class="w-5 h-5" />
        </button>
      </template>
    </UiResponsiveDataView>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/vue/24/outline'

useHead({ title: 'Ventas - WaRo Tickets' })

const searchQuery = ref('')
const statusFilter = ref('')
const sortField = ref('date')
const sortDirection = ref<'asc' | 'desc'>('desc')

const columns = [
  { key: 'id', title: 'ID', sortable: true, align: 'left' as const },
  { key: 'buyerName', title: 'Comprador', sortable: true, align: 'left' as const },
  { key: 'buyerEmail', title: 'Email', sortable: true, align: 'left' as const },
  { key: 'event', title: 'Evento', sortable: true, align: 'left' as const },
  { key: 'tickets', title: 'Boletas', sortable: true, align: 'center' as const, format: 'number' as const },
  { key: 'area', title: 'Area', sortable: true, align: 'center' as const },
  { key: 'total', title: 'Total', sortable: true, align: 'right' as const, format: 'currency' as const },
  { key: 'status', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'date', title: 'Fecha', sortable: true, align: 'center' as const, format: 'date' as const },
  { key: 'actions', title: '', sortable: false, align: 'center' as const }
]

// Mock data
const sales = ref([
  { id: 'WT-001234', buyerName: 'Juan Perez', buyerEmail: 'juan@email.com', event: 'Concierto de Rock', tickets: 2, area: 'VIP', areaColor: '#9333EA', total: 500000, status: 'completed', date: '2025-01-18' },
  { id: 'WT-001235', buyerName: 'Maria Garcia', buyerEmail: 'maria@email.com', event: 'Concierto de Rock', tickets: 4, area: 'General', areaColor: '#22C55E', total: 320000, status: 'completed', date: '2025-01-18' },
  { id: 'WT-001236', buyerName: 'Carlos Lopez', buyerEmail: 'carlos@email.com', event: 'Festival Electronica', tickets: 1, area: 'Preferencial', areaColor: '#3B82F6', total: 150000, status: 'pending', date: '2025-01-18' },
  { id: 'WT-001237', buyerName: 'Ana Martinez', buyerEmail: 'ana@email.com', event: 'Concierto de Rock', tickets: 2, area: 'VIP', areaColor: '#9333EA', total: 500000, status: 'refunded', date: '2025-01-17' },
  { id: 'WT-001238', buyerName: 'Pedro Sanchez', buyerEmail: 'pedro@email.com', event: 'Festival Electronica', tickets: 3, area: 'General', areaColor: '#22C55E', total: 240000, status: 'completed', date: '2025-01-17' }
])

const filteredSales = computed(() => {
  let result = sales.value

  if (statusFilter.value) {
    result = result.filter(s => s.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s =>
      s.buyerName.toLowerCase().includes(query) ||
      s.buyerEmail.toLowerCase().includes(query) ||
      s.id.toLowerCase().includes(query)
    )
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
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    refunded: 'bg-red-100 text-red-700'
  }
  return classes[status] || classes.pending
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    completed: 'Completada',
    pending: 'Pendiente',
    refunded: 'Reembolsada'
  }
  return labels[status] || status
}
</script>
