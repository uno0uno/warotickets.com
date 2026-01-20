<template>
  <div>
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative flex-1 sm:max-w-xs">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar reservas..."
            class="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5" />
        Nueva Reserva
      </button>
    </div>

    <!-- Responsive Data View -->
    <UiResponsiveDataView
      :columns="columns"
      :data="filteredReservations"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      empty-message="No hay reservas"
      empty-sub-message="Las reservas de cortesia apareceran aqui"
      @sort="handleSort"
    >
      <!-- Mobile Card -->
      <template #card="{ item }">
        <div class="bg-white border border-secondary-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="font-medium text-secondary-900">{{ item.name }}</p>
              <p class="text-xs text-secondary-500">{{ item.email }}</p>
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
              <span class="text-secondary-500">Evento:</span>
              <span class="ml-1 text-secondary-900">{{ item.event }}</span>
            </div>
            <div>
              <span class="text-secondary-500">Cantidad:</span>
              <span class="ml-1 text-secondary-900">{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Custom cell: Name -->
      <template #cell-name="{ row }">
        <span class="font-medium">{{ row.name }}</span>
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
        <div class="flex items-center justify-center gap-2">
          <button
            v-if="row.status === 'pending'"
            class="text-green-600 hover:text-green-700"
            title="Confirmar"
          >
            <CheckIcon class="w-5 h-5" />
          </button>
          <button class="text-secondary-400 hover:text-secondary-600">
            <EllipsisVerticalIcon class="w-5 h-5" />
          </button>
        </div>
      </template>
    </UiResponsiveDataView>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, PlusIcon, EllipsisVerticalIcon, CheckIcon } from '@heroicons/vue/24/outline'

useHead({ title: 'Reservas - WaRo Tickets' })

const searchQuery = ref('')
const statusFilter = ref('')
const sortField = ref('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

const columns = [
  { key: 'name', title: 'Nombre', sortable: true, align: 'left' as const },
  { key: 'email', title: 'Email', sortable: true, align: 'left' as const },
  { key: 'event', title: 'Evento', sortable: true, align: 'left' as const },
  { key: 'area', title: 'Area', sortable: true, align: 'left' as const },
  { key: 'quantity', title: 'Cantidad', sortable: true, align: 'center' as const, format: 'number' as const },
  { key: 'status', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

// Mock data
const reservations = ref([
  { id: '1', name: 'Maria Gonzalez', email: 'maria@empresa.com', event: 'Concierto de Rock', area: 'VIP', areaColor: '#9333EA', quantity: 4, status: 'confirmed' },
  { id: '2', name: 'Pedro Sanchez', email: 'pedro@prensa.com', event: 'Concierto de Rock', area: 'Prensa', areaColor: '#3B82F6', quantity: 2, status: 'pending' },
  { id: '3', name: 'Laura Torres', email: 'laura@sponsor.com', event: 'Festival Electronica', area: 'VIP', areaColor: '#9333EA', quantity: 6, status: 'confirmed' },
  { id: '4', name: 'Roberto Diaz', email: 'roberto@artista.com', event: 'Concierto de Rock', area: 'Backstage', areaColor: '#F59E0B', quantity: 3, status: 'cancelled' }
])

const filteredReservations = computed(() => {
  let result = reservations.value

  if (statusFilter.value) {
    result = result.filter(r => r.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.email.toLowerCase().includes(query) ||
      r.event.toLowerCase().includes(query)
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
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return classes[status] || classes.pending
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    confirmed: 'Confirmada',
    pending: 'Pendiente',
    cancelled: 'Cancelada'
  }
  return labels[status] || status
}
</script>
