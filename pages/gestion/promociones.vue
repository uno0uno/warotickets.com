<template>
  <div>
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div class="relative flex-1 sm:max-w-xs">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar promociones..."
          class="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
        />
      </div>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5" />
        Crear Promocion
      </button>
    </div>

    <!-- Responsive Data View -->
    <UiResponsiveDataView
      :columns="columns"
      :data="filteredPromotions"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      empty-message="No hay promociones"
      empty-sub-message="Crea codigos promocionales para tus eventos"
      @sort="handleSort"
    >
      <!-- Mobile Card -->
      <template #card="{ item }">
        <div class="bg-white border border-secondary-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <code class="px-2 py-1 bg-secondary-100 rounded text-sm font-mono text-secondary-900">{{ item.code }}</code>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(item.status)"
            >
              {{ getStatusLabel(item.status) }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-secondary-500">Descuento:</span>
              <span class="ml-1 font-medium text-secondary-900">
                {{ item.type === 'percentage' ? `${item.value}%` : `$${item.value.toLocaleString('es-CO')}` }}
              </span>
            </div>
            <div>
              <span class="text-secondary-500">Usos:</span>
              <span class="ml-1 text-secondary-900">{{ item.used }} / {{ item.maxUses || 'Sin limite' }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Custom cell: Code -->
      <template #cell-code="{ value }">
        <code class="px-2 py-1 bg-secondary-100 rounded text-sm font-mono">{{ value }}</code>
      </template>

      <!-- Custom cell: Discount -->
      <template #cell-discount="{ row }">
        {{ row.type === 'percentage' ? `${row.value}%` : `$${row.value.toLocaleString('es-CO')}` }}
      </template>

      <!-- Custom cell: Uses -->
      <template #cell-used="{ row }">
        {{ row.used }} / {{ row.maxUses || 'Sin limite' }}
      </template>

      <!-- Custom cell: Validity -->
      <template #cell-validity="{ row }">
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

useHead({ title: 'Promociones - WaRo Tickets' })

const searchQuery = ref('')
const sortField = ref('code')
const sortDirection = ref<'asc' | 'desc'>('asc')

const columns = [
  { key: 'code', title: 'Codigo', sortable: true, align: 'left' as const },
  { key: 'discount', title: 'Descuento', sortable: true, align: 'right' as const },
  { key: 'used', title: 'Usos', sortable: true, align: 'center' as const },
  { key: 'validity', title: 'Validez', sortable: false, align: 'center' as const },
  { key: 'status', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

// Mock data
const promotions = ref([
  { id: '1', code: 'PREVENTA20', type: 'percentage', value: 20, used: 45, maxUses: 100, startDate: '2025-01-01', endDate: '2025-01-15', status: 'active' },
  { id: '2', code: 'AMIGOS10K', type: 'fixed', value: 10000, used: 12, maxUses: null, startDate: '2025-01-01', endDate: '2025-02-15', status: 'active' },
  { id: '3', code: 'VIP50', type: 'percentage', value: 50, used: 5, maxUses: 5, startDate: '2025-01-01', endDate: '2025-01-10', status: 'exhausted' },
  { id: '4', code: 'FLASH30', type: 'percentage', value: 30, used: 0, maxUses: 50, startDate: '2025-02-01', endDate: '2025-02-03', status: 'scheduled' }
])

const filteredPromotions = computed(() => {
  let result = promotions.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(promo => promo.code.toLowerCase().includes(query))
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
  return `${startDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}`
}

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    scheduled: 'bg-blue-100 text-blue-700',
    exhausted: 'bg-orange-100 text-orange-700',
    expired: 'bg-secondary-100 text-secondary-600'
  }
  return classes[status] || classes.expired
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    active: 'Activa',
    scheduled: 'Programada',
    exhausted: 'Agotada',
    expired: 'Expirada'
  }
  return labels[status] || status
}
</script>
