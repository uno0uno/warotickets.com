<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <PieLoader class="mx-auto mb-4" />
        <p class="text-secondary-500">{{ currentPhrase }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="flex items-center justify-center py-20">
      <div class="text-center">
        <p class="text-xl font-semibold text-secondary-800 mb-2">Error al cargar las facturas</p>
        <p class="text-sm text-secondary-600 mb-4">{{ fetchError }}</p>
        <button @click="refresh" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Reintentar
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col gap-4">
      <!-- Search -->
      <div class="relative flex-1 sm:max-w-xs">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por referencia, evento o monto..."
          class="w-full h-10 pl-10 pr-4 py-2 border-2 border-border bg-background rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      <!-- Responsive Data View -->
      <UiResponsiveDataView
        :columns="columns"
        :data="filteredInvoices"
        :sort-field="sortField"
        :sort-direction="sortDirection"
        item-key="payment_id"
        empty-message="No hay facturas"
        empty-sub-message="Tus facturas de compra apareceran aqui"
        variant="default"
        @sort="handleSort"
        @row-click="goToDetail($event.payment_id)"
      >
        <!-- Mobile Card -->
        <template #card="{ item }">
          <div
            class="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
            @click="goToDetail(item.payment_id)"
          >
            <div class="p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-text-primary truncate">{{ item.event_name }}</span>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2"
                  :class="statusBadgeClass(item.payment_status)"
                >
                  {{ statusLabel(item.payment_status) }}
                </span>
              </div>
              <p class="text-sm text-text-secondary mb-2">{{ formatDate(item.payment_date) }}</p>
              <div class="flex items-center justify-between text-sm">
                <span class="text-text-secondary">{{ item.ticket_count }} {{ item.ticket_count === 1 ? 'boleta' : 'boletas' }} · {{ paymentMethodLabel(item.payment_method_type) }}</span>
                <span class="font-bold text-primary">{{ formatCurrency(item.amount) }}</span>
              </div>
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-border">
                <p class="text-xs text-text-secondary font-mono">{{ item.reference }}</p>
                <ChevronRightIcon class="w-4 h-4 text-text-secondary" />
              </div>
            </div>
          </div>
        </template>

        <!-- Desktop Header -->
        <template #header>
          <h3 class="text-base sm:text-lg font-bold text-text-primary">Facturas</h3>
        </template>

        <!-- Cell: Evento -->
        <template #cell-event_name="{ value }">
          <span class="font-bold text-text-primary">{{ value }}</span>
        </template>

        <!-- Cell: Fecha -->
        <template #cell-payment_date="{ value }">
          {{ formatDate(value) }}
        </template>

        <!-- Cell: Boletas -->
        <template #cell-ticket_count="{ value }">
          {{ value }}
        </template>

        <!-- Cell: Metodo -->
        <template #cell-payment_method_type="{ value }">
          {{ paymentMethodLabel(value) }}
        </template>

        <!-- Cell: Monto -->
        <template #cell-amount="{ value }">
          <span class="font-bold text-primary">{{ formatCurrency(value) }}</span>
        </template>

        <!-- Cell: Estado -->
        <template #cell-payment_status="{ value }">
          <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="statusBadgeClass(value)"
          >
            {{ statusLabel(value) }}
          </span>
        </template>

        <!-- Cell: Referencia -->
        <template #cell-reference="{ value }">
          <span class="font-mono text-text-secondary text-xs">{{ value }}</span>
        </template>

        <!-- Cell: Detail arrow -->
        <template #cell-detail="{ row }">
          <ChevronRightIcon class="w-4 h-4 text-text-secondary" />
        </template>
      </UiResponsiveDataView>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Mis Facturas - WaRo Tickets' })

const setPageTitle = inject<(title: string) => void>('setPageTitle')
const setPageSubtitle = inject<(subtitle: string) => void>('setPageSubtitle')

interface InvoiceTicket {
  area_name: string
  unit_price: number
  base_price: number
  service_fee: number
  quantity: number
  subtotal: number
  service_total: number
  pricing_label: string
  has_discount: boolean
  discount_type: string | null
  discount_name: string | null
  discount_detail: string | null
}

interface Invoice {
  payment_id: number
  reference: string
  amount: number
  currency: string
  payment_status: string
  payment_method_type: string | null
  payment_date: string | null
  finalized_at: string | null
  event_name: string
  event_slug: string
  event_date: string | null
  reservation_id: string
  ticket_count: number
  gateway_name: string | null
  tickets: InvoiceTicket[]
}

const loading = ref(true)
const invoices = ref<Invoice[]>([])
const fetchError = ref('')
const searchQuery = ref('')
const sortField = ref('payment_date')
const sortDirection = ref<'asc' | 'desc'>('desc')

const { currentPhrase, start: startPhrases, stop: stopPhrases } = useLoadingPhrases([
  'Buscando tus facturas...',
  'Revisando transacciones...',
  'Calculando totales...',
  'Organizando por fecha...',
  'Casi listo, aguanta...'
])

const columns = [
  { key: 'event_name', title: 'Evento', sortable: true, align: 'left' as const },
  { key: 'payment_date', title: 'Fecha', sortable: true, align: 'center' as const },
  { key: 'ticket_count', title: 'Boletas', sortable: true, align: 'center' as const },
  { key: 'payment_method_type', title: 'Metodo', sortable: false, align: 'center' as const },
  { key: 'amount', title: 'Monto', sortable: true, align: 'right' as const },
  { key: 'payment_status', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'reference', title: 'Referencia', sortable: false, align: 'left' as const },
  { key: 'detail', title: '', sortable: false, align: 'center' as const }
]

function normalize(str: string) {
  return str.toLowerCase().replace(/[-_\s]/g, '')
}

const filteredInvoices = computed<Invoice[]>(() => {
  let result = invoices.value

  const q = normalize(searchQuery.value.trim())
  if (q) {
    result = result.filter(inv =>
      normalize(inv.reference).includes(q)
      || normalize(inv.event_name).includes(q)
      || normalize(String(inv.amount)).includes(q)
      || normalize(inv.payment_method_type || '').includes(q)
      || normalize(inv.reservation_id).includes(q)
    )
  }

  if (sortField.value) {
    result = [...result].sort((a: any, b: any) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
      }
      const strA = String(aVal).toLowerCase()
      const strB = String(bVal).toLowerCase()
      return sortDirection.value === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA)
    })
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

function goToDetail(paymentId: number) {
  navigateTo(`/mis-facturas/${paymentId}`)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    approved: 'Aprobado',
    pending: 'Pendiente',
    declined: 'Rechazado',
    voided: 'Anulado',
    error: 'Error',
    refunded: 'Reembolsado'
  }
  return labels[status] || status
}

function statusBadgeClass(status: string) {
  const classes: Record<string, string> = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    declined: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    voided: 'bg-surface-secondary text-text-secondary',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    refunded: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
  }
  return classes[status] || 'bg-surface-secondary text-text-secondary'
}

function paymentMethodLabel(method: string | null) {
  if (!method) return '-'
  const labels: Record<string, string> = {
    CARD: 'Tarjeta',
    CREDIT_CARD: 'Tarjeta credito',
    NEQUI: 'Nequi',
    PSE: 'PSE',
    BANCOLOMBIA_TRANSFER: 'Bancolombia',
    BOTON_BANCOLOMBIA: 'Boton Bancolombia',
    CASH: 'Efectivo'
  }
  return labels[method] || method
}

async function fetchInvoices() {
  loading.value = true
  fetchError.value = ''
  startPhrases()

  try {
    const data = await $fetch<Invoice[]>('/api/reservations/my-invoices', {
      credentials: 'include'
    })
    invoices.value = data
  } catch (e: any) {
    fetchError.value = e?.data?.detail || 'Error al cargar tus facturas'
  } finally {
    stopPhrases()
    loading.value = false
  }
}

async function refresh() {
  await fetchInvoices()
}

onMounted(() => {
  setPageTitle?.('Mis Facturas')
  setPageSubtitle?.('Facturas de eventos')
  fetchInvoices()
})
</script>
