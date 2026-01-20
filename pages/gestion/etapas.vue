<template>
  <div>
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div class="relative flex-1 sm:max-w-xs">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar etapas..."
          class="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
        />
      </div>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5" />
        Crear Etapa
      </button>
    </div>

    <!-- Responsive Data View -->
    <UiResponsiveDataView
      :columns="columns"
      :data="filteredStages"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      empty-message="No hay etapas"
      empty-sub-message="Crea etapas de venta para tu evento"
      @sort="handleSort"
    >
      <!-- Mobile Card -->
      <template #card="{ item }">
        <div class="bg-white border border-secondary-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="font-medium text-secondary-900">{{ item.name }}</span>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(item.status)"
            >
              {{ getStatusLabel(item.status) }}
            </span>
          </div>
          <p class="text-sm text-secondary-500 mb-2">{{ formatDateRange(item.startDate, item.endDate) }}</p>
          <div class="text-sm text-secondary-600">
            <span>{{ item.areasCount }} areas configuradas</span>
          </div>
        </div>
      </template>

      <!-- Custom cell: Name -->
      <template #cell-name="{ value }">
        <span class="font-medium">{{ value }}</span>
      </template>

      <!-- Custom cell: Date range -->
      <template #cell-startDate="{ row }">
        {{ formatDateRange(row.startDate, row.endDate) }}
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
import { MagnifyingGlassIcon, PlusIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

useHead({ title: 'Etapas - WaRo Tickets' })

const searchQuery = ref('')
const sortField = ref('startDate')
const sortDirection = ref<'asc' | 'desc'>('asc')

const columns = [
  { key: 'name', title: 'Nombre', sortable: true, align: 'left' as const },
  { key: 'startDate', title: 'Periodo', sortable: true, align: 'center' as const },
  { key: 'areasCount', title: 'Areas', sortable: true, align: 'center' as const, format: 'number' as const },
  { key: 'status', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

// Mock data
const stages = ref([
  { id: '1', name: 'Preventa', startDate: '2025-01-01', endDate: '2025-01-15', status: 'completed', areasCount: 3 },
  { id: '2', name: 'Venta Regular', startDate: '2025-01-16', endDate: '2025-02-10', status: 'active', areasCount: 3 },
  { id: '3', name: 'Ultima Hora', startDate: '2025-02-11', endDate: '2025-02-15', status: 'pending', areasCount: 3 }
])

const filteredStages = computed(() => {
  let result = stages.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(stage => stage.name.toLowerCase().includes(query))
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

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return `${startDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-secondary-100 text-secondary-600'
  }
  return classes[status] || classes.pending
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    active: 'En curso',
    pending: 'Pendiente',
    completed: 'Finalizada'
  }
  return labels[status] || status
}
</script>
