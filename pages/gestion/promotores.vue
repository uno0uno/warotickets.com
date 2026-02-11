<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
      <UiGestionLoader />
    </div>

    <!-- Content -->
    <div v-else>
      <UiResponsiveDataView
        :columns="columns"
        :data="promoters"
        :sort-field="sortField"
        :sort-direction="sortDirection"
        empty-message="No hay promotores asignados"
        empty-sub-message="Asigna el rol de promotor a un miembro del equipo desde Miembros"
        @sort="handleSort"
        @row-click="openPromoter"
      >
        <!-- Desktop Header -->
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base sm:text-lg font-bold text-text-primary">Promotores</h3>
          </div>
        </template>

        <!-- Mobile Card -->
        <template #card="{ item }">
          <div
            @click="openPromoter(item)"
            class="bg-surface border border-border rounded-xl p-4 cursor-pointer hover:border-primary transition-colors"
          >
            <div class="flex items-start gap-3 mb-3">
              <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                {{ getInitials(item.name) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-text-primary truncate">{{ item.name || 'Sin nombre' }}</p>
                <p class="text-xs text-text-secondary truncate">{{ item.email }}</p>
              </div>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium flex-shrink-0',
                  item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ item.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p class="text-text-tertiary text-xs">Codigo</p>
                <p class="text-text-primary font-medium text-xs">{{ item.promoter_code || 'Sin codigo' }}</p>
              </div>
              <div>
                <p class="text-text-tertiary text-xs">Ventas</p>
                <p class="text-text-primary font-bold">{{ formatCurrency(item.total_sales) }}</p>
              </div>
            </div>

            <div class="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span class="text-xs text-text-tertiary">{{ item.events_count }} eventos asignados</span>
              <svg class="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </template>

        <!-- Cell: Nombre -->
        <template #cell-name="{ value }">
          <span class="text-sm font-bold text-text-primary">{{ value || 'Sin nombre' }}</span>
        </template>

        <!-- Cell: Email -->
        <template #cell-email="{ value }">
          <span class="text-sm text-text-secondary">{{ value }}</span>
        </template>

        <!-- Cell: Codigo -->
        <template #cell-promoter_code="{ value }">
          <code class="text-xs bg-background px-2 py-1 rounded border border-border">
            {{ value || 'Sin codigo' }}
          </code>
        </template>

        <!-- Cell: Ventas -->
        <template #cell-total_sales="{ value }">
          <span class="text-sm font-bold text-text-primary">{{ formatCurrency(value) }}</span>
        </template>

        <!-- Cell: Eventos -->
        <template #cell-events_count="{ value }">
          <span class="text-sm text-text-primary">{{ value }}</span>
        </template>

        <!-- Cell: Estado -->
        <template #cell-is_active="{ value }">
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium inline-block',
              value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ value ? 'Activo' : 'Inactivo' }}
          </span>
        </template>

        <!-- Cell: Acciones -->
        <template #cell-actions="{ row }">
          <button
            @click.stop="openPromoter(row)"
            class="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
            title="Ver promotor"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </template>
      </UiResponsiveDataView>
    </div>
  </div>
</template>

<script setup lang="ts">
const setPageTitle = inject('setPageTitle', (_t: string) => {})
const setPageSubtitle = inject('setPageSubtitle', (_t: string) => {})

onMounted(() => {
  setPageTitle('Promotores')
  setPageSubtitle('Gestiona promotores, eventos y comisiones')
})

const { onTenantChange } = useTenantReactive()

const isLoading = ref(false)
const error = ref<string | null>(null)
const sortField = ref('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

const columns = [
  { key: 'name', title: 'Nombre', sortable: true, align: 'left' as const },
  { key: 'email', title: 'Email', sortable: true, align: 'left' as const },
  { key: 'promoter_code', title: 'Codigo', sortable: false, align: 'left' as const },
  { key: 'total_sales', title: 'Ventas Totales', sortable: true, align: 'right' as const },
  { key: 'events_count', title: 'Eventos', sortable: true, align: 'center' as const },
  { key: 'is_active', title: 'Estado', sortable: false, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

const promoters = ref<any[]>([])

async function loadPromoters() {
  isLoading.value = true
  error.value = null
  try {
    const response = await $fetch<any>('/api/admin/promoters/list', {
      credentials: 'include'
    })
    promoters.value = response.promoters || []
  } catch (err: any) {
    console.error('Error loading promoters:', err)
    error.value = err?.data?.detail || 'Error al cargar promotores'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadPromoters()
})

// Reload when tenant changes
onTenantChange(() => {
  loadPromoters()
})

function openPromoter(promoter: any) {
  navigateTo(`/gestion/promotor/${promoter.id}`)
}

function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

function formatCurrency(amount: number): string {
  if (!amount) return '$0'
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount.toLocaleString()}`
}
</script>
