<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
      <UiGestionLoader />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <p class="text-xl font-semibold text-text-primary mb-2">Error al cargar datos</p>
        <p class="text-sm text-text-secondary">{{ error }}</p>
        <button @click="loadData" class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          Reintentar
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col gap-3 md:gap-4">
      <!-- Metrics Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <SharedMetricCard
          title="Ventas Referidas"
          :value="stats?.total_sales || 0"
          format="number"
          variant="primary"
          size="sm"
          :subtitle="`${stats?.total_tickets || 0} boletas vendidas`"
        />
        <SharedMetricCard
          title="Total Comisiones"
          :value="stats?.total_commissions || 0"
          format="currency"
          variant="primary"
          size="sm"
          subtitle="Comisiones generadas"
        />
        <SharedMetricCard
          title="Por Pagar"
          :value="stats?.approved || 0"
          format="currency"
          variant="primary"
          size="sm"
          subtitle="Comisiones aprobadas"
        />
        <SharedMetricCard
          title="Pagado"
          :value="stats?.paid || 0"
          format="currency"
          variant="primary"
          size="sm"
          subtitle="Comisiones recibidas"
        />
      </div>

      <!-- Sales Table -->
      <UiResponsiveDataView
        :columns="columns"
        :data="sales"
        :sort-field="sortField"
        :sort-direction="sortDirection"
        empty-message="No hay ventas registradas"
        empty-sub-message="Comparte tus enlaces para empezar a generar comisiones"
        @sort="handleSort"
      >
        <!-- Desktop Header -->
        <template #header>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h3 class="text-base sm:text-lg font-bold text-text-primary">Historial de Ventas</h3>
            </div>
          </div>
        </template>

        <!-- Mobile Card -->
        <template #card="{ item }">
          <div class="bg-surface border border-border rounded-xl p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <p class="font-bold text-text-primary">{{ item.cluster_name || 'Sin nombre' }}</p>
                <p class="text-xs text-text-secondary mt-1">{{ formatDate(item.created_at) }} · <span class="font-mono">{{ item.reservation_id?.slice(0, 8) }}</span></p>
              </div>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(item.status)
                ]"
              >
                {{ getStatusLabel(item.status) }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p class="text-text-tertiary text-xs">Boletas</p>
                <p class="text-text-primary font-medium">{{ item.tickets_count }}</p>
              </div>
              <div>
                <p class="text-text-tertiary text-xs">Ingresos</p>
                <p class="text-text-primary font-medium">{{ formatCurrency(item.total_base_price) }}</p>
              </div>
              <div class="col-span-2 pt-2 border-t border-border">
                <p class="text-text-tertiary text-xs">Comision ({{ item.commission_percentage }}%)</p>
                <p class="text-crocus-600 font-bold text-lg">{{ formatCurrency(item.commission_amount) }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Custom cell: Date -->
        <template #cell-created_at="{ value }">
          <span class="text-sm text-text-secondary">{{ formatDate(value) }}</span>
        </template>

        <!-- Custom cell: Event name -->
        <template #cell-cluster_name="{ value }">
          <span class="text-sm font-bold text-text-primary">{{ value || 'Sin nombre' }}</span>
        </template>

        <!-- Custom cell: Reference -->
        <template #cell-reservation_id="{ value }">
          <span class="text-xs text-text-secondary font-mono">{{ value ? value.slice(0, 8) : 'N/A' }}</span>
        </template>

        <!-- Custom cell: Tickets -->
        <template #cell-tickets_count="{ value }">
          <span class="text-sm text-text-primary">{{ value }}</span>
        </template>

        <!-- Custom cell: Revenue -->
        <template #cell-total_base_price="{ value }">
          <span class="text-sm font-bold text-text-primary">{{ formatCurrency(value) }}</span>
        </template>

        <!-- Custom cell: Commission % -->
        <template #cell-commission_percentage="{ value }">
          <span class="text-sm text-text-primary font-medium">{{ value }}%</span>
        </template>

        <!-- Custom cell: Commission amount -->
        <template #cell-commission_amount="{ value }">
          <span class="text-sm font-bold text-crocus-600">{{ formatCurrency(value) }}</span>
        </template>

        <!-- Custom cell: Status -->
        <template #cell-status="{ value }">
          <span :class="['px-2 py-1 rounded-full text-xs font-medium inline-block', getStatusColor(value)]">
            {{ getStatusLabel(value) }}
          </span>
        </template>
      </UiResponsiveDataView>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Mis Ventas - Promotor - WaRo Tickets' })

const authStore = useAuthStore()

const sales = ref<any[]>([])
const stats = ref<any>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const sortField = ref('created_at')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Table columns
const columns = [
  { key: 'created_at', title: 'Fecha', sortable: true, align: 'left' as const },
  { key: 'cluster_name', title: 'Evento', sortable: true, align: 'left' as const },
  { key: 'reservation_id', title: 'Referencia', sortable: false, align: 'left' as const },
  { key: 'tickets_count', title: 'Boletas', sortable: true, align: 'center' as const },
  { key: 'total_base_price', title: 'Ingresos', sortable: true, align: 'right' as const },
  { key: 'commission_percentage', title: '%', sortable: false, align: 'center' as const },
  { key: 'commission_amount', title: 'Comision', sortable: true, align: 'right' as const },
  { key: 'status', title: 'Estado', sortable: false, align: 'center' as const }
]

async function loadData() {
  isLoading.value = true
  error.value = null

  try {
    const [salesResponse, statsResponse] = await Promise.all([
      $fetch('/api/promoters/me/sales', {
        credentials: 'include',
        query: { limit: 50, offset: 0 }
      }),
      $fetch('/api/promoters/me/stats', {
        credentials: 'include'
      })
    ])
    sales.value = (salesResponse as any).sales || []
    stats.value = (statsResponse as any).stats || null
  } catch (err: any) {
    console.error('Error loading promoter data:', err)
    error.value = err?.data?.detail || 'Error al cargar datos del promotor'
    sales.value = []
    stats.value = null
  } finally {
    isLoading.value = false
  }
}

watch(() => authStore.user, (user) => {
  if (user) loadData()
}, { immediate: true })

function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    paid: 'Pagado'
  }
  return labels[status] || status
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>
