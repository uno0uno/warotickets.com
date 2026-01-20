<template>
  <div>
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div class="relative flex-1 sm:max-w-xs">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar areas..."
          class="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
        />
      </div>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5" />
        Crear Area
      </button>
    </div>

    <!-- Responsive Data View -->
    <UiResponsiveDataView
      :columns="columns"
      :data="filteredAreas"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      empty-message="No hay areas"
      empty-sub-message="Crea areas para organizar tu evento"
      @sort="handleSort"
    >
      <!-- Mobile Card -->
      <template #card="{ item }">
        <div class="bg-white border border-secondary-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
              <span class="font-medium text-secondary-900">{{ item.name }}</span>
            </div>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="item.active ? 'bg-green-100 text-green-700' : 'bg-secondary-100 text-secondary-600'"
            >
              {{ item.active ? 'Activa' : 'Inactiva' }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-secondary-500">Capacidad:</span>
              <span class="ml-1 text-secondary-900">{{ item.capacity }}</span>
            </div>
            <div>
              <span class="text-secondary-500">Precio:</span>
              <span class="ml-1 text-secondary-900">${{ item.basePrice.toLocaleString('es-CO') }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Custom cell: Color indicator -->
      <template #cell-name="{ row }">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: row.color }"></div>
          <span class="font-medium">{{ row.name }}</span>
        </div>
      </template>

      <!-- Custom cell: Status badge -->
      <template #cell-active="{ value }">
        <span
          class="px-2 py-1 text-xs font-medium rounded-full"
          :class="value ? 'bg-green-100 text-green-700' : 'bg-secondary-100 text-secondary-600'"
        >
          {{ value ? 'Activa' : 'Inactiva' }}
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

useHead({ title: 'Areas - WaRo Tickets' })

const searchQuery = ref('')
const sortField = ref('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

const columns = [
  { key: 'name', title: 'Nombre', sortable: true, align: 'left' as const },
  { key: 'capacity', title: 'Capacidad', sortable: true, align: 'right' as const, format: 'number' as const },
  { key: 'basePrice', title: 'Precio Base', sortable: true, align: 'right' as const, format: 'currency' as const },
  { key: 'active', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

// Mock data
const areas = ref([
  { id: '1', name: 'VIP', capacity: 100, basePrice: 250000, color: '#9333EA', active: true },
  { id: '2', name: 'Preferencial', capacity: 300, basePrice: 150000, color: '#3B82F6', active: true },
  { id: '3', name: 'General', capacity: 1000, basePrice: 80000, color: '#22C55E', active: true },
  { id: '4', name: 'Palco', capacity: 50, basePrice: 500000, color: '#F59E0B', active: false }
])

const filteredAreas = computed(() => {
  let result = areas.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(area => area.name.toLowerCase().includes(query))
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
</script>
