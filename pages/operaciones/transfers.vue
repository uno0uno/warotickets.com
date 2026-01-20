<template>
  <div>
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="relative flex-1 sm:w-64">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar transfers..."
            class="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
        </select>
      </div>
    </div>

    <!-- Responsive Data View -->
    <UiResponsiveDataView
      :columns="columns"
      :data="filteredTransfers"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      empty-message="No hay transfers"
      empty-sub-message="Las solicitudes de transferencia apareceran aqui"
      @sort="handleSort"
    >
      <!-- Mobile Card -->
      <template #card="{ item }">
        <div class="bg-white border border-secondary-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-secondary-900">{{ item.fromName }}</span>
              <ArrowRightIcon class="w-4 h-4 text-secondary-400" />
              <span class="text-sm font-medium text-primary-600">{{ item.toName }}</span>
            </div>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(item.status)"
            >
              {{ getStatusLabel(item.status) }}
            </span>
          </div>
          <div class="text-sm text-secondary-600 mb-2">
            <p>{{ item.event }}</p>
            <div class="flex items-center gap-2 mt-1">
              <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.areaColor }"></div>
              <span>{{ item.area }} - {{ item.quantity }} boleta(s)</span>
            </div>
          </div>
          <p class="text-xs text-secondary-400">{{ item.requestedAt }}</p>
        </div>
      </template>

      <!-- Custom cell: From Name -->
      <template #cell-fromName="{ value }">
        <span class="font-medium">{{ value }}</span>
      </template>

      <!-- Custom cell: To Name -->
      <template #cell-toName="{ value }">
        <span class="font-medium">{{ value }}</span>
      </template>

      <!-- Custom cell: Area with color -->
      <template #cell-area="{ row }">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: row.areaColor }"></div>
          <span>{{ row.area }}</span>
        </div>
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
      <template #cell-actions="{ row }">
        <div v-if="row.status === 'pending'" class="flex items-center gap-1 justify-center">
          <button
            class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
            title="Aprobar"
          >
            <CheckIcon class="w-4 h-4" />
          </button>
          <button
            class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
            title="Rechazar"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
        <span v-else class="text-secondary-400">-</span>
      </template>
    </UiResponsiveDataView>
  </div>
</template>

<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

useHead({ title: 'Transfers - WaRo Tickets' })

const searchQuery = ref('')
const statusFilter = ref('')
const sortField = ref('requestedAt')
const sortDirection = ref<'asc' | 'desc'>('desc')

const columns = [
  { key: 'fromName', title: 'Origen', sortable: true, align: 'left' as const },
  { key: 'toName', title: 'Destino', sortable: true, align: 'left' as const },
  { key: 'event', title: 'Evento', sortable: true, align: 'left' as const },
  { key: 'area', title: 'Area', sortable: true, align: 'left' as const },
  { key: 'quantity', title: 'Cantidad', sortable: true, align: 'center' as const, format: 'number' as const },
  { key: 'status', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

// Mock data - flattened structure (one column = one data)
const transfers = ref([
  {
    id: '1',
    fromName: 'Juan Perez',
    toName: 'Maria Garcia',
    event: 'Concierto de Rock en el Parque',
    area: 'VIP',
    areaColor: '#9333EA',
    quantity: 2,
    status: 'pending',
    requestedAt: 'hace 2 horas'
  },
  {
    id: '2',
    fromName: 'Carlos Lopez',
    toName: 'Ana Torres',
    event: 'Festival de Musica Electronica',
    area: 'General',
    areaColor: '#22C55E',
    quantity: 1,
    status: 'approved',
    requestedAt: 'hace 1 dia'
  },
  {
    id: '3',
    fromName: 'Laura Diaz',
    toName: 'Pedro Sanchez',
    event: 'Concierto de Rock en el Parque',
    area: 'Preferencial',
    areaColor: '#3B82F6',
    quantity: 3,
    status: 'rejected',
    requestedAt: 'hace 3 dias'
  }
])

const filteredTransfers = computed(() => {
  let result = transfers.value

  if (statusFilter.value) {
    result = result.filter(t => t.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.fromName.toLowerCase().includes(query) ||
      t.toName.toLowerCase().includes(query) ||
      t.event.toLowerCase().includes(query)
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
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700'
  }
  return classes[status] || classes.pending
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    approved: 'Aprobado',
    pending: 'Pendiente',
    rejected: 'Rechazado'
  }
  return labels[status] || status
}
</script>
