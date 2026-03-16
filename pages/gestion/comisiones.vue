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
    <div v-else class="flex flex-col gap-4">

      <!-- Metric Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <SharedMetricCard
          title="Total Comisiones"
          :value="summary?.total_amount || 0"
          format="currency"
          variant="primary"
          size="sm"
          :subtitle="`${summary?.total_commissions || 0} registros`"
        />
        <SharedMetricCard
          title="Pendiente"
          :value="summary?.pending_amount || 0"
          format="currency"
          variant="primary"
          size="sm"
          :subtitle="`${summary?.pending_count || 0} por aprobar`"
        />
        <SharedMetricCard
          title="Aprobado"
          :value="summary?.approved_amount || 0"
          format="currency"
          variant="primary"
          size="sm"
          :subtitle="`${summary?.approved_count || 0} por pagar`"
        />
        <SharedMetricCard
          title="Pagado"
          :value="summary?.paid_amount || 0"
          format="currency"
          variant="primary"
          size="sm"
          :subtitle="`${summary?.paid_count || 0} pagadas`"
        />
      </div>

      <!-- Resumen por Evento -->
      <div v-if="byCluster.length > 0" class="bg-surface border-2 border-border rounded-lg p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-semibold text-text-primary mb-4">Resumen por Evento</h3>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-3">
          <div
            v-for="cluster in byCluster"
            :key="cluster.cluster_id"
            class="bg-background border border-border rounded-xl p-4"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="font-bold text-text-primary">{{ cluster.cluster_name }}</p>
                <p class="text-xs text-text-secondary mt-0.5">
                  Tier: {{ cluster.service_fee_tier }} · {{ cluster.current_cluster_pct }}% comisión
                </p>
              </div>
              <span v-if="cluster.using_historical_pct > 0" class="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                {{ cluster.using_historical_pct }} override
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-sm pt-2 border-t border-border">
              <div>
                <p class="text-text-tertiary text-xs">Total</p>
                <p class="text-text-primary font-bold">{{ formatCurrency(cluster.total_amount) }}</p>
              </div>
              <div>
                <p class="text-text-tertiary text-xs">Pendiente</p>
                <p class="text-yellow-700 font-medium">{{ formatCurrency(cluster.pending_amount) }}</p>
              </div>
              <div>
                <p class="text-text-tertiary text-xs">Pagado</p>
                <p class="text-green-700 font-medium">{{ formatCurrency(cluster.paid_amount) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full border-2 border-border rounded-lg">
            <thead class="bg-surface-secondary">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Evento</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Tier Fee</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">% Comisión</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Total</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Pendiente</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Pagado</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Override</th>
              </tr>
            </thead>
            <tbody class="bg-surface divide-y divide-border">
              <tr v-for="cluster in byCluster" :key="cluster.cluster_id" class="hover:bg-surface-secondary/50 transition-colors">
                <td class="px-4 py-3 text-sm font-bold text-text-primary">{{ cluster.cluster_name }}</td>
                <td class="px-4 py-3 text-sm text-text-secondary text-center">{{ cluster.service_fee_tier }}</td>
                <td class="px-4 py-3 text-sm font-bold text-crocus-600 text-center">{{ cluster.current_cluster_pct }}%</td>
                <td class="px-4 py-3 text-sm font-bold text-text-primary text-right">{{ formatCurrency(cluster.total_amount) }}</td>
                <td class="px-4 py-3 text-sm text-yellow-700 font-medium text-right">{{ formatCurrency(cluster.pending_amount) }}</td>
                <td class="px-4 py-3 text-sm text-green-700 font-medium text-right">{{ formatCurrency(cluster.paid_amount) }}</td>
                <td class="px-4 py-3 text-center">
                  <span v-if="cluster.using_historical_pct > 0" class="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                    {{ cluster.using_historical_pct }}
                  </span>
                  <span v-else class="text-text-tertiary text-xs">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Historial de Comisiones -->
      <UiResponsiveDataView
        :columns="columns"
        :data="commissions"
        :sort-field="sortField"
        :sort-direction="sortDirection"
        empty-message="No hay comisiones registradas"
        empty-sub-message="Las comisiones aparecen cuando los promotores generan ventas"
        @sort="handleSort"
      >
        <!-- Desktop Header -->
        <template #header>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <h3 class="text-base sm:text-lg font-bold text-text-primary">Historial de Comisiones</h3>
            <div class="flex items-center gap-2">
              <select
                v-model="filterStatus"
                class="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="paid">Pagado</option>
              </select>
            </div>
          </div>
        </template>

        <!-- Mobile Card -->
        <template #card="{ item }">
          <div class="bg-surface border border-border rounded-xl p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0">
                <p class="font-bold text-text-primary truncate">{{ item.promoter_name || item.promoter_email || 'Sin promotor' }}</p>
                <p class="text-xs text-text-secondary mt-0.5 truncate">{{ item.cluster_name }} · {{ formatDate(item.created_at) }}</p>
              </div>
              <span :class="['px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2', getStatusColor(item.status)]">
                {{ getStatusLabel(item.status) }}
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-sm mb-3">
              <div>
                <p class="text-text-tertiary text-xs">Tier fee</p>
                <p class="text-text-primary font-medium">{{ item.service_fee_tier }}</p>
              </div>
              <div>
                <p class="text-text-tertiary text-xs">% Comisión</p>
                <div class="flex items-center gap-1">
                  <p class="text-text-primary font-medium">{{ item.commission_percentage }}%</p>
                  <span
                    v-if="isOverride(item)"
                    class="px-1 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded font-medium"
                    title="Override de promotor activo"
                  >override</span>
                </div>
              </div>
              <div>
                <p class="text-text-tertiary text-xs">Comisión</p>
                <p class="text-crocus-600 font-bold">{{ formatCurrency(item.commission_amount) }}</p>
              </div>
            </div>
            <div v-if="item.status === 'pending' || item.status === 'approved'" class="flex gap-2 pt-2 border-t border-border">
              <button
                v-if="item.status === 'pending'"
                @click="approveCommission(item.id)"
                :disabled="actionLoading === item.id"
                class="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ actionLoading === item.id ? 'Aprobando...' : 'Aprobar' }}
              </button>
              <button
                v-if="item.status === 'approved'"
                @click="markPaid(item.id)"
                :disabled="actionLoading === item.id"
                class="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ actionLoading === item.id ? 'Guardando...' : 'Marcar Pagado' }}
              </button>
            </div>
          </div>
        </template>

        <!-- Cell: Date -->
        <template #cell-created_at="{ value }">
          <span class="text-sm text-text-secondary">{{ formatDate(value) }}</span>
        </template>

        <!-- Cell: Promotor -->
        <template #cell-promoter_name="{ value, row }">
          <div>
            <p class="text-sm font-bold text-text-primary">{{ value || row?.promoter_email || 'Sin promotor' }}</p>
          </div>
        </template>

        <!-- Cell: Evento -->
        <template #cell-cluster_name="{ value }">
          <span class="text-sm font-bold text-text-primary">{{ value || '—' }}</span>
        </template>

        <!-- Cell: Tier fee -->
        <template #cell-service_fee_tier="{ value }">
          <span class="text-sm text-text-secondary">{{ value }}</span>
        </template>

        <!-- Cell: % comisión con badge override -->
        <template #cell-commission_percentage="{ value, row }">
          <div class="flex flex-col items-center gap-0.5">
            <span class="text-sm font-bold text-crocus-600">{{ value }}%</span>
            <span
              v-if="isOverride(row)"
              class="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded font-medium"
              title="Porcentaje aplicado difiere de la comisión base del evento"
            >override</span>
            <span v-else class="text-[10px] text-text-tertiary">base</span>
          </div>
        </template>

        <!-- Cell: Monto -->
        <template #cell-commission_amount="{ value }">
          <span class="text-sm font-bold text-crocus-600">{{ formatCurrency(value) }}</span>
        </template>

        <!-- Cell: Estado -->
        <template #cell-status="{ value }">
          <span :class="['px-2 py-1 rounded-full text-xs font-medium inline-block', getStatusColor(value)]">
            {{ getStatusLabel(value) }}
          </span>
        </template>

        <!-- Cell: Acciones -->
        <template #cell-actions="{ row }">
          <div class="flex items-center gap-1 justify-center">
            <button
              v-if="row?.status === 'pending'"
              @click="approveCommission(row.id)"
              :disabled="actionLoading === row.id"
              class="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ actionLoading === row.id ? '...' : 'Aprobar' }}
            </button>
            <button
              v-if="row?.status === 'approved'"
              @click="markPaid(row.id)"
              :disabled="actionLoading === row.id"
              class="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ actionLoading === row.id ? '...' : 'Pagar' }}
            </button>
          </div>
        </template>
      </UiResponsiveDataView>
    </div>
  </div>
</template>

<script setup lang="ts">
const setPageTitle = inject('setPageTitle', (_t: string) => {})
const setPageSubtitle = inject('setPageSubtitle', (_t: string) => {})

onMounted(() => {
  setPageTitle('Comisiones')
  setPageSubtitle('Gestiona y aprueba comisiones de promotores')
})

const { onTenantChange } = useTenantReactive()

const isLoading = ref(true)
const error = ref<string | null>(null)
const summary = ref<any>(null)
const byCluster = ref<any[]>([])
const commissions = ref<any[]>([])
const filterStatus = ref('')
const sortField = ref('created_at')
const sortDirection = ref<'asc' | 'desc'>('desc')
const actionLoading = ref<string | null>(null)

const columns = [
  { key: 'created_at', title: 'Fecha', sortable: true, align: 'left' as const },
  { key: 'promoter_name', title: 'Promotor', sortable: false, align: 'left' as const },
  { key: 'cluster_name', title: 'Evento', sortable: false, align: 'left' as const },
  { key: 'service_fee_tier', title: 'Tier fee', sortable: false, align: 'center' as const },
  { key: 'commission_percentage', title: '%', sortable: false, align: 'center' as const },
  { key: 'commission_amount', title: 'Comisión', sortable: true, align: 'right' as const },
  { key: 'status', title: 'Estado', sortable: false, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

function isOverride(item: any): boolean {
  if (!item) return false
  return item.commission_percentage !== item.cluster_commission_percentage
}

async function loadData() {
  isLoading.value = true
  error.value = null
  try {
    const [summaryResponse, listResponse] = await Promise.all([
      $fetch<any>('/api/admin/commissions/summary', { credentials: 'include' }),
      $fetch<any>('/api/admin/commissions/list', {
        credentials: 'include',
        query: {
          limit: 50,
          offset: 0,
          ...(filterStatus.value ? { status: filterStatus.value } : {})
        }
      })
    ])
    summary.value = summaryResponse.summary || null
    byCluster.value = summaryResponse.by_cluster || []
    commissions.value = listResponse.commissions || []
  } catch (err: any) {
    console.error('Error loading commissions:', err)
    error.value = err?.data?.detail || 'Error al cargar comisiones'
  } finally {
    isLoading.value = false
  }
}

async function approveCommission(id: string) {
  actionLoading.value = id
  try {
    await $fetch(`/api/admin/commissions/${id}/approve`, {
      method: 'PATCH',
      credentials: 'include',
      body: {}
    })
    await loadData()
  } catch (err: any) {
    alert('Error al aprobar comisión: ' + (err?.data?.detail || err.message))
  } finally {
    actionLoading.value = null
  }
}

async function markPaid(id: string) {
  const reference = window.prompt('Ingresa la referencia de pago:')
  if (!reference) return
  actionLoading.value = id
  try {
    await $fetch(`/api/admin/commissions/${id}/mark-paid`, {
      method: 'PATCH',
      credentials: 'include',
      body: { payment_reference: reference }
    })
    await loadData()
  } catch (err: any) {
    alert('Error al marcar como pagada: ' + (err?.data?.detail || err.message))
  } finally {
    actionLoading.value = null
  }
}

watch(filterStatus, () => loadData())

onMounted(() => {
  loadData()
})

onTenantChange(() => {
  loadData()
})

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
