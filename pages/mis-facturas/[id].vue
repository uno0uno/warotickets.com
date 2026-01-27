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
        <p class="text-xl font-semibold text-secondary-800 mb-2">Error al cargar la factura</p>
        <p class="text-sm text-secondary-600 mb-4">{{ fetchError }}</p>
        <NuxtLink
          to="/mis-facturas"
          class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <ArrowLeftIcon class="w-4 h-4" />
          Volver a facturas
        </NuxtLink>
      </div>
    </div>

    <!-- Invoice Detail -->
    <div v-else-if="invoice" class="space-y-6">
      <!-- Back button -->
      <NuxtLink
        to="/mis-facturas"
        class="inline-flex items-center gap-2 text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        Volver a facturas
      </NuxtLink>

      <!-- Header Card -->
      <div class="bg-white border border-secondary-200 rounded-xl overflow-hidden">
        <div class="p-5 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="min-w-0">
              <div class="flex items-center gap-3 mb-1">
                <h1 class="text-xl sm:text-2xl font-bold text-secondary-900 truncate">{{ invoice.event_name }}</h1>
                <span
                  class="px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0"
                  :class="statusBadgeClass(invoice.payment_status)"
                >
                  {{ statusLabel(invoice.payment_status) }}
                </span>
              </div>
              <p class="text-sm text-secondary-500 font-mono">{{ invoice.reference }}</p>
            </div>
            <div class="text-left sm:text-right flex-shrink-0">
              <p class="text-2xl sm:text-3xl font-bold text-secondary-900">{{ formatCurrency(invoice.amount) }}</p>
              <p class="text-sm text-secondary-500">{{ invoice.currency }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Evento -->
        <div class="bg-white border border-secondary-200 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <CalendarDaysIcon class="w-4 h-4 text-secondary-400" />
            <p class="text-xs text-secondary-400 uppercase tracking-wider font-medium">Evento</p>
          </div>
          <p class="text-sm font-semibold text-secondary-900">{{ invoice.event_name }}</p>
          <p class="text-xs text-secondary-500 mt-0.5">{{ formatDateLong(invoice.event_date) }}</p>
        </div>

        <!-- Metodo de Pago -->
        <div class="bg-white border border-secondary-200 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <CreditCardIcon class="w-4 h-4 text-secondary-400" />
            <p class="text-xs text-secondary-400 uppercase tracking-wider font-medium">Metodo de pago</p>
          </div>
          <p class="text-sm font-semibold text-secondary-900">{{ paymentMethodLabel(invoice.payment_method_type) }}</p>
          <p v-if="invoice.card_brand && invoice.card_last_four" class="text-xs text-secondary-500 mt-0.5">
            {{ invoice.card_brand }} **** {{ invoice.card_last_four }}
          </p>
          <p v-if="invoice.installments && invoice.installments > 1" class="text-xs text-secondary-500 mt-0.5">
            {{ invoice.installments }} cuotas
          </p>
        </div>

        <!-- Fecha de Pago -->
        <div class="bg-white border border-secondary-200 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <ClockIcon class="w-4 h-4 text-secondary-400" />
            <p class="text-xs text-secondary-400 uppercase tracking-wider font-medium">Fecha de pago</p>
          </div>
          <p class="text-sm font-semibold text-secondary-900">{{ formatDateLong(invoice.payment_date) }}</p>
          <p v-if="invoice.finalized_at" class="text-xs text-secondary-500 mt-0.5">
            Finalizado: {{ formatDateTime(invoice.finalized_at) }}
          </p>
        </div>

        <!-- Gateway -->
        <div class="bg-white border border-secondary-200 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <ServerIcon class="w-4 h-4 text-secondary-400" />
            <p class="text-xs text-secondary-400 uppercase tracking-wider font-medium">Procesador</p>
          </div>
          <p class="text-sm font-semibold text-secondary-900 capitalize">{{ invoice.gateway_name || '-' }}</p>
          <p v-if="invoice.transaction_id" class="text-xs text-secondary-500 mt-0.5 font-mono truncate">
            TX: {{ invoice.transaction_id }}
          </p>
        </div>
      </div>

      <!-- Detalle por Area -->
      <div class="bg-white border border-secondary-200 rounded-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-secondary-100">
          <h2 class="text-base font-bold text-secondary-900">Desglose por area</h2>
          <p class="text-xs text-secondary-500 mt-0.5">{{ invoice.ticket_count }} {{ invoice.ticket_count === 1 ? 'boleta' : 'boletas' }} en total</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-secondary-50 text-secondary-500">
                <th class="text-left px-5 py-3 font-medium">Area / Etapa</th>
                <th class="text-center px-5 py-3 font-medium">Cant.</th>
                <th class="text-right px-5 py-3 font-medium">Precio base</th>
                <th class="text-right px-5 py-3 font-medium">Pagado</th>
                <th class="text-right px-5 py-3 font-medium">Subtotal</th>
                <th class="text-right px-5 py-3 font-medium">Servicio</th>
                <th class="text-right px-5 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(t, i) in invoice.tickets" :key="i" class="border-t border-secondary-100">
                <td class="px-5 py-3">
                  <span class="font-medium text-secondary-900">{{ t.pricing_label || t.area_name }}</span>
                  <span
                    v-if="t.discount_detail"
                    class="ml-2 inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded"
                    :class="t.discount_type === 'promotion' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                  >
                    {{ t.discount_detail }}
                  </span>
                </td>
                <td class="px-5 py-3 text-center text-secondary-600">{{ t.quantity }}</td>
                <td class="px-5 py-3 text-right text-secondary-600">
                  <span :class="{ 'line-through text-secondary-400': t.has_discount }">{{ formatCurrency(t.base_price) }}</span>
                </td>
                <td class="px-5 py-3 text-right text-secondary-600 font-medium">{{ formatCurrency(t.unit_price) }}</td>
                <td class="px-5 py-3 text-right text-secondary-600">{{ formatCurrency(t.subtotal) }}</td>
                <td class="px-5 py-3 text-right text-secondary-600">{{ formatCurrency(t.service_total) }}</td>
                <td class="px-5 py-3 text-right font-semibold text-secondary-900">{{ formatCurrency(t.subtotal + t.service_total) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-secondary-200 bg-secondary-50">
                <td colspan="6" class="px-5 py-3 text-right font-bold text-secondary-700">TOTAL PAGADO</td>
                <td class="px-5 py-3 text-right font-bold text-lg text-secondary-900">{{ formatCurrency(invoice.amount) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Boletas Individuales -->
      <div class="bg-white border border-secondary-200 rounded-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-secondary-100">
          <h2 class="text-base font-bold text-secondary-900">Boletas</h2>
          <p class="text-xs text-secondary-500 mt-0.5">Detalle individual de cada boleta comprada</p>
        </div>
        <div class="divide-y divide-secondary-100">
          <div
            v-for="unit in invoice.units"
            :key="unit.reservation_unit_id"
            class="flex items-center gap-4 px-5 py-3"
          >
            <div class="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TicketIcon class="w-4 h-4 text-secondary-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-secondary-900">{{ unit.pricing_label || unit.area_name }}</p>
              <p class="text-xs text-secondary-500 font-mono">{{ unit.display_name }}</p>
            </div>
            <div class="text-right flex-shrink-0 mr-3">
              <p class="text-sm font-semibold text-secondary-900">{{ formatCurrency(unit.unit_price) }}</p>
              <p v-if="unit.has_discount" class="text-xs text-secondary-400 line-through">{{ formatCurrency(unit.base_price) }}</p>
            </div>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0"
              :class="unitStatusClass(unit.status)"
            >
              {{ unitStatusLabel(unit.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Info Adicional -->
      <div class="bg-white border border-secondary-200 rounded-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-secondary-100">
          <h2 class="text-base font-bold text-secondary-900">Informacion adicional</h2>
        </div>
        <div class="px-5 py-4">
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt class="text-secondary-400 text-xs uppercase tracking-wider font-medium">Referencia</dt>
              <dd class="text-secondary-900 font-mono mt-0.5">{{ invoice.reference }}</dd>
            </div>
            <div>
              <dt class="text-secondary-400 text-xs uppercase tracking-wider font-medium">ID Reserva</dt>
              <dd class="text-secondary-900 font-mono mt-0.5">{{ invoice.reservation_id }}</dd>
            </div>
            <div>
              <dt class="text-secondary-400 text-xs uppercase tracking-wider font-medium">Email</dt>
              <dd class="text-secondary-900 mt-0.5">{{ invoice.customer_email || '-' }}</dd>
            </div>
            <div>
              <dt class="text-secondary-400 text-xs uppercase tracking-wider font-medium">Fecha reserva</dt>
              <dd class="text-secondary-900 mt-0.5">{{ formatDateTime(invoice.reservation_date) }}</dd>
            </div>
            <div v-if="invoice.status_message">
              <dt class="text-secondary-400 text-xs uppercase tracking-wider font-medium">Mensaje</dt>
              <dd class="text-secondary-900 mt-0.5">{{ invoice.status_message }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  ClockIcon,
  ServerIcon,
  TicketIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Detalle Factura - WaRo Tickets' })

const route = useRoute()
const paymentId = computed(() => route.params.id as string)

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

interface InvoiceUnit {
  reservation_unit_id: number
  area_name: string
  display_name: string
  status: string
  qr_code: string | null
  unit_price: number
  base_price: number
  service_fee: number
  pricing_label: string
  has_discount: boolean
  discount_type: string | null
  discount_name: string | null
}

interface InvoiceDetail {
  payment_id: number
  reference: string
  amount: number
  currency: string
  payment_status: string
  payment_method_type: string | null
  payment_date: string | null
  finalized_at: string | null
  gateway_name: string | null
  customer_email: string | null
  status_message: string | null
  transaction_id: string | null
  card_brand: string | null
  card_last_four: string | null
  card_name: string | null
  installments: number | null
  event_name: string
  event_slug: string
  event_date: string | null
  reservation_id: string
  reservation_date: string | null
  ticket_count: number
  tickets: InvoiceTicket[]
  units: InvoiceUnit[]
}

const loading = ref(true)
const invoice = ref<InvoiceDetail | null>(null)
const fetchError = ref('')

const { currentPhrase, start: startPhrases, stop: stopPhrases } = useLoadingPhrases([
  'Cargando factura...',
  'Obteniendo detalles...',
  'Preparando desglose...',
  'Casi listo...'
])

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

function formatDateLong(dateStr: string | null) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function formatDateTime(dateStr: string | null) {
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
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    declined: 'bg-red-100 text-red-700',
    voided: 'bg-secondary-100 text-secondary-600',
    error: 'bg-red-100 text-red-700',
    refunded: 'bg-blue-100 text-blue-700'
  }
  return classes[status] || 'bg-secondary-100 text-secondary-600'
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

function unitStatusLabel(status: string) {
  const labels: Record<string, string> = {
    confirmed: 'Confirmada',
    checked_in: 'Ingresado',
    cancelled: 'Cancelada',
    transferred: 'Transferida',
    reserved: 'Reservada'
  }
  return labels[status] || status
}

function unitStatusClass(status: string) {
  const classes: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    checked_in: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    transferred: 'bg-amber-100 text-amber-700',
    reserved: 'bg-secondary-100 text-secondary-600'
  }
  return classes[status] || 'bg-secondary-100 text-secondary-600'
}

async function fetchInvoice() {
  loading.value = true
  fetchError.value = ''
  startPhrases()

  try {
    const data = await $fetch<InvoiceDetail>(`/api/reservations/my-invoices/${paymentId.value}`, {
      credentials: 'include'
    })
    invoice.value = data
    useHead({ title: `${data.event_name} - Factura - WaRo Tickets` })
  } catch (e: any) {
    fetchError.value = e?.data?.detail || 'Error al cargar la factura'
  } finally {
    stopPhrases()
    loading.value = false
  }
}

onMounted(() => {
  setPageTitle?.('Detalle Factura')
  setPageSubtitle?.('Informacion completa del pago')
  fetchInvoice()
})
</script>
