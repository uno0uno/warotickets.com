<template>
  <div>
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div class="relative flex-1 sm:max-w-xs">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar eventos..."
          class="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
        />
      </div>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5" />
        Crear Evento
      </button>
    </div>

    <!-- Responsive Data View -->
    <UiResponsiveDataView
      :columns="columns"
      :data="filteredEvents"
      :loading="loading"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      empty-message="No hay eventos"
      empty-sub-message="Crea tu primer evento para empezar a vender boletas"
      @sort="handleSort"
    >
      <!-- Mobile Card -->
      <template #card="{ item }">
        <div class="bg-white border border-secondary-200 rounded-lg overflow-hidden">
          <div class="h-24 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <CalendarIcon class="w-10 h-10 text-white/30" />
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-secondary-900">{{ item.name }}</span>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusClass(item.status)"
              >
                {{ getStatusLabel(item.status) }}
              </span>
            </div>
            <p class="text-sm text-secondary-500 mb-2">{{ formatDate(item.date) }}</p>
            <div class="flex items-center gap-4 text-sm text-secondary-600">
              <span><strong>{{ item.sold }}</strong> vendidas</span>
              <span><strong>{{ item.checkedIn }}</strong> check-in</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Custom cell: Name -->
      <template #cell-name="{ value }">
        <span class="font-medium">{{ value }}</span>
      </template>

      <!-- Custom cell: Date -->
      <template #cell-date="{ value }">
        {{ formatDate(value) }}
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
          <EllipsisVerticalIcon class="w-5 h-5" />
        </button>
      </template>
    </UiResponsiveDataView>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon, MagnifyingGlassIcon, PlusIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

useHead({ title: 'Eventos - WaRo Tickets' })

const searchQuery = ref('')
const loading = ref(false)
const sortField = ref('date')
const sortDirection = ref<'asc' | 'desc'>('desc')

const columns = [
  { key: 'name', title: 'Nombre', sortable: true, align: 'left' as const },
  { key: 'date', title: 'Fecha', sortable: true, align: 'center' as const },
  { key: 'sold', title: 'Vendidas', sortable: true, align: 'right' as const, format: 'number' as const },
  { key: 'checkedIn', title: 'Check-in', sortable: true, align: 'right' as const, format: 'number' as const },
  { key: 'status', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

// Mock data
const events = ref([
  { id: '1', name: 'Concierto de Rock en el Parque', date: '2025-02-15T19:00:00', status: 'active', sold: 450, checkedIn: 0 },
  { id: '2', name: 'Festival de Musica Electronica', date: '2025-03-01T20:00:00', status: 'draft', sold: 0, checkedIn: 0 },
  { id: '3', name: 'Teatro: El Fantasma de la Opera', date: '2025-01-20T18:30:00', status: 'completed', sold: 320, checkedIn: 315 }
])

const filteredEvents = computed(() => {
  let result = events.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(event => event.name.toLowerCase().includes(query))
  }

  // Sort
  result = [...result].sort((a, b) => {
    const aVal = a[sortField.value as keyof typeof a]
    const bVal = b[sortField.value as keyof typeof b]

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection.value === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
    }

    return 0
  })

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

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-secondary-100 text-secondary-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return classes[status] || classes.draft
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    active: 'Activo',
    draft: 'Borrador',
    completed: 'Finalizado',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}
</script>
