<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UiGestionLoader />
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="bg-surface border border-border rounded-xl p-8 text-center">
      <p class="text-lg font-bold text-text-primary mb-2">Error al cargar la reserva</p>
      <p class="text-sm text-text-secondary mb-4">{{ fetchError }}</p>
      <NuxtLink
        :to="backUrl"
        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-bold"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        Volver a reservas
      </NuxtLink>
    </div>

    <!-- Reservation Detail -->
    <div v-else-if="detail" class="space-y-6">
      <!-- Back button -->
      <NuxtLink
        :to="backUrl"
        class="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        Volver a reservas
      </NuxtLink>

      <!-- Header Card -->
      <div class="bg-surface border border-border rounded-xl p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <h1 class="text-xl sm:text-2xl font-bold text-text-primary truncate">{{ detail.customer_name || 'Sin nombre' }}</h1>
              <span
                class="px-2.5 py-1 text-xs font-semibold rounded-full flex-shrink-0"
                :class="reservationStatusClass(detail.status)"
              >
                {{ reservationStatusLabel(detail.status) }}
              </span>
            </div>
            <p class="text-sm text-text-secondary">{{ detail.customer_email }}</p>
            <p v-if="detail.customer_phone" class="text-sm text-text-tertiary">{{ detail.customer_phone }}</p>
          </div>
          <div v-if="detail.payment" class="text-left sm:text-right flex-shrink-0">
            <p class="text-2xl sm:text-3xl font-bold text-text-primary">{{ formatCurrency(detail.payment.amount) }}</p>
            <p class="text-sm text-text-secondary">{{ detail.payment.currency }}</p>
          </div>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Evento -->
        <div class="bg-surface border border-border rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <CalendarDaysIcon class="w-4 h-4 text-text-tertiary" />
            <p class="text-xs text-text-tertiary uppercase tracking-wider font-medium">Evento</p>
          </div>
          <p class="text-sm font-bold text-text-primary">{{ detail.event_name }}</p>
          <p class="text-xs text-text-secondary mt-0.5">{{ formatDateLong(detail.event_date) }}</p>
        </div>

        <!-- Fecha de Reserva -->
        <div class="bg-surface border border-border rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <ClockIcon class="w-4 h-4 text-text-tertiary" />
            <p class="text-xs text-text-tertiary uppercase tracking-wider font-medium">Fecha reserva</p>
          </div>
          <p class="text-sm font-bold text-text-primary">{{ formatDateLong(detail.reservation_date) }}</p>
        </div>

        <!-- Metodo de Pago -->
        <div class="bg-surface border border-border rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <CreditCardIcon class="w-4 h-4 text-text-tertiary" />
            <p class="text-xs text-text-tertiary uppercase tracking-wider font-medium">Metodo de pago</p>
          </div>
          <template v-if="detail.payment">
            <p class="text-sm font-bold text-text-primary">{{ paymentMethodLabel(detail.payment.payment_method_type) }}</p>
            <p v-if="detail.payment.card_brand && detail.payment.card_last_four" class="text-xs text-text-secondary mt-0.5">
              {{ detail.payment.card_brand }} **** {{ detail.payment.card_last_four }}
            </p>
          </template>
          <p v-else class="text-sm text-text-secondary">Sin pago registrado</p>
        </div>

        <!-- Estado Pago -->
        <div class="bg-surface border border-border rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <BanknotesIcon class="w-4 h-4 text-text-tertiary" />
            <p class="text-xs text-text-tertiary uppercase tracking-wider font-medium">Estado pago</p>
          </div>
          <template v-if="detail.payment">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="paymentStatusClass(detail.payment.payment_status)"
            >
              {{ paymentStatusLabel(detail.payment.payment_status) }}
            </span>
            <p v-if="detail.payment.reference" class="text-xs text-text-tertiary font-mono mt-1">{{ detail.payment.reference }}</p>
          </template>
          <p v-else class="text-sm text-text-secondary">-</p>
        </div>
      </div>

      <!-- Desglose por Area -->
      <div class="bg-surface border border-border rounded-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-border">
          <h2 class="text-base font-bold text-text-primary">Desglose por area</h2>
          <p class="text-xs text-text-secondary mt-0.5">{{ detail.ticket_count }} {{ detail.ticket_count === 1 ? 'boleta' : 'boletas' }} en total</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-surface-secondary text-text-secondary">
                <th class="text-left px-5 py-3 font-medium">Area</th>
                <th class="text-center px-5 py-3 font-medium">Cant.</th>
                <th class="text-right px-5 py-3 font-medium">Precio base</th>
                <th class="text-right px-5 py-3 font-medium">Pagado</th>
                <th class="text-right px-5 py-3 font-medium">Subtotal</th>
                <th class="text-right px-5 py-3 font-medium">Servicio</th>
                <th class="text-right px-5 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(t, i) in detail.tickets" :key="i" class="border-t border-border">
                <td class="px-5 py-3">
                  <span class="font-medium text-text-primary">{{ t.pricing_label || t.area_name }}</span>
                  <span
                    v-if="t.has_discount && t.discount_name"
                    class="ml-2 inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary"
                  >
                    {{ t.discount_name }}
                  </span>
                </td>
                <td class="px-5 py-3 text-center text-text-secondary">{{ t.quantity }}</td>
                <td class="px-5 py-3 text-right text-text-secondary">
                  <span :class="{ 'line-through text-text-tertiary': t.has_discount }">{{ formatCurrency(t.base_price) }}</span>
                </td>
                <td class="px-5 py-3 text-right text-text-primary font-medium">{{ formatCurrency(t.unit_price) }}</td>
                <td class="px-5 py-3 text-right text-text-secondary">{{ formatCurrency(t.subtotal) }}</td>
                <td class="px-5 py-3 text-right text-text-secondary">{{ formatCurrency(t.service_total) }}</td>
                <td class="px-5 py-3 text-right font-bold text-text-primary">{{ formatCurrency(t.subtotal + t.service_total) }}</td>
              </tr>
            </tbody>
            <tfoot v-if="detail.payment">
              <tr class="border-t-2 border-border bg-surface-secondary">
                <td colspan="6" class="px-5 py-3 text-right font-bold text-text-secondary">TOTAL PAGADO</td>
                <td class="px-5 py-3 text-right font-bold text-lg text-text-primary">{{ formatCurrency(detail.payment.amount) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Boletas Individuales -->
      <div class="bg-surface border border-border rounded-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-border">
          <h2 class="text-base font-bold text-text-primary">Boletas</h2>
          <p class="text-xs text-text-secondary mt-0.5">Detalle individual de cada boleta</p>
        </div>
        <div class="divide-y divide-border">
          <div
            v-for="unit in detail.units"
            :key="unit.reservation_unit_id"
            class="flex items-center gap-4 px-5 py-3"
          >
            <div class="w-8 h-8 bg-surface-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <TicketIcon class="w-4 h-4 text-text-secondary" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary">{{ unit.area_name }}</p>
              <p class="text-xs text-text-secondary font-mono">{{ unit.display_name }}</p>
            </div>
            <div class="text-right flex-shrink-0 mr-3">
              <p class="text-sm font-bold text-text-primary">{{ formatCurrency(unit.unit_price) }}</p>
              <p v-if="unit.has_discount" class="text-xs text-text-tertiary line-through">{{ formatCurrency(unit.base_price) }}</p>
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
      <div class="bg-surface border border-border rounded-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-border">
          <h2 class="text-base font-bold text-text-primary">Informacion adicional</h2>
        </div>
        <div class="px-5 py-4">
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt class="text-text-tertiary text-xs uppercase tracking-wider font-medium">ID Reserva</dt>
              <dd class="text-text-primary font-mono mt-0.5 text-xs break-all">{{ detail.id }}</dd>
            </div>
            <div v-if="detail.payment?.reference">
              <dt class="text-text-tertiary text-xs uppercase tracking-wider font-medium">Referencia pago</dt>
              <dd class="text-text-primary font-mono mt-0.5">{{ detail.payment.reference }}</dd>
            </div>
            <div v-if="detail.payment?.transaction_id">
              <dt class="text-text-tertiary text-xs uppercase tracking-wider font-medium">ID Transaccion</dt>
              <dd class="text-text-primary font-mono mt-0.5 text-xs break-all">{{ detail.payment.transaction_id }}</dd>
            </div>
            <div v-if="detail.payment?.gateway_name">
              <dt class="text-text-tertiary text-xs uppercase tracking-wider font-medium">Procesador</dt>
              <dd class="text-text-primary mt-0.5 capitalize">{{ detail.payment.gateway_name }}</dd>
            </div>
            <div v-if="detail.payment?.finalized_at">
              <dt class="text-text-tertiary text-xs uppercase tracking-wider font-medium">Pago finalizado</dt>
              <dd class="text-text-primary mt-0.5">{{ formatDateTime(detail.payment.finalized_at) }}</dd>
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
  BanknotesIcon,
  TicketIcon
} from '@heroicons/vue/24/outline'

useHead({ title: 'Detalle Reserva - WaRo Tickets' })

const route = useRoute()
const reservationId = computed(() => route.params.id as string)
const eventId = computed(() => route.query.event as string)

const backUrl = computed(() =>
  eventId.value ? `/operaciones/reservas?event=${eventId.value}` : '/operaciones/reservas'
)

const loading = ref(true)
const detail = ref<any>(null)
const fetchError = ref('')

async function fetchDetail() {
  if (!eventId.value) {
    fetchError.value = 'No se especifico el evento'
    loading.value = false
    return
  }

  loading.value = true
  fetchError.value = ''

  try {
    const data = await $fetch(`/api/reservations/event/${eventId.value}/${reservationId.value}`, {
      credentials: 'include'
    })
    detail.value = data
    useHead({ title: `${(data as any).customer_name || 'Reserva'} - Detalle - WaRo Tickets` })
  } catch (e: any) {
    fetchError.value = e?.data?.detail || 'Error al cargar la reserva'
  } finally {
    loading.value = false
  }
}

onMounted(fetchDetail)

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0)
}

function formatDateLong(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function reservationStatusLabel(status: string) {
  const labels: Record<string, string> = {
    confirmed: 'Confirmada',
    active: 'Activa',
    pending: 'Pendiente',
    cancelled: 'Cancelada',
    expired: 'Expirada'
  }
  return labels[status] || status
}

function reservationStatusClass(status: string) {
  const classes: Record<string, string> = {
    confirmed: 'bg-success/10 text-success',
    active: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    cancelled: 'bg-destructive/10 text-destructive',
    expired: 'bg-surface-secondary text-text-secondary'
  }
  return classes[status] || 'bg-surface-secondary text-text-secondary'
}

function paymentStatusLabel(status: string) {
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

function paymentStatusClass(status: string) {
  const classes: Record<string, string> = {
    approved: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    declined: 'bg-destructive/10 text-destructive',
    voided: 'bg-surface-secondary text-text-secondary',
    error: 'bg-destructive/10 text-destructive',
    refunded: 'bg-primary/10 text-primary'
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

function unitStatusLabel(status: string) {
  const labels: Record<string, string> = {
    confirmed: 'Confirmada',
    used: 'Ingresado',
    checked_in: 'Ingresado',
    cancelled: 'Cancelada',
    transferred: 'Transferida',
    reserved: 'Reservada'
  }
  return labels[status] || status
}

function unitStatusClass(status: string) {
  const classes: Record<string, string> = {
    confirmed: 'bg-success/10 text-success',
    used: 'bg-primary/10 text-primary',
    checked_in: 'bg-primary/10 text-primary',
    cancelled: 'bg-destructive/10 text-destructive',
    transferred: 'bg-warning/10 text-warning',
    reserved: 'bg-surface-secondary text-text-secondary'
  }
  return classes[status] || 'bg-surface-secondary text-text-secondary'
}
</script>
