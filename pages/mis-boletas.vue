<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <PieLoader class="mx-auto mb-4" />
        <p class="text-secondary-500">{{ currentPhrase }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!tickets || tickets.length === 0" class="flex flex-col items-center justify-center py-20">
      <div class="relative mb-6">
        <div class="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl flex items-center justify-center rotate-6">
          <TicketIcon class="w-12 h-12 text-primary-400 -rotate-6" />
        </div>
      </div>
      <h3 class="text-xl font-bold text-secondary-900 mb-2">Aun no tienes boletas</h3>
      <p class="text-secondary-500 mb-8 text-center max-w-sm">Explora los eventos disponibles y compra tus boletas. Apareceran aqui con su codigo QR.</p>
      <NuxtLink to="/eventos" class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 text-sm font-semibold">
        <CalendarDaysIcon class="w-5 h-5" />
        Explorar eventos
      </NuxtLink>
    </div>

    <!-- Search Bar -->
    <div v-else-if="tickets && tickets.length > 0" class="space-y-6">
      <div class="relative">
        <MagnifyingGlassIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por evento, referencia o ubicacion (ej: VIP-18, 1a2a59f6)"
          class="w-full pl-11 pr-10 py-3 bg-white border border-secondary-200 rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- No results -->
      <div v-if="filteredGroupedTickets.length === 0" class="text-center py-12">
        <MagnifyingGlassIcon class="w-10 h-10 text-secondary-300 mx-auto mb-3" />
        <p class="text-secondary-500 text-sm">No se encontraron boletas para <span class="font-semibold">"{{ searchQuery }}"</span></p>
      </div>

      <!-- Tickets grouped by event -->
      <div v-else class="space-y-10">
      <div v-for="event in filteredGroupedTickets" :key="event.slug">
        <!-- Event Header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-secondary-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <CalendarDaysIcon class="w-5 h-5 text-white" />
          </div>
          <div class="min-w-0">
            <h2 class="text-lg font-bold text-secondary-900 truncate">{{ event.name }}</h2>
            <p class="text-sm text-secondary-500">{{ formatDate(event.date) }}</p>
          </div>
          <span class="ml-auto text-xs font-medium text-secondary-400 bg-secondary-100 px-2.5 py-1 rounded-full flex-shrink-0">
            {{ event.tickets.length }} {{ event.tickets.length === 1 ? 'boleta' : 'boletas' }}
          </span>
        </div>

        <!-- Ticket Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="ticket in event.tickets"
            :key="ticket.reservation_unit_id"
            class="group relative bg-white rounded-2xl border border-secondary-200 overflow-hidden hover:shadow-lg hover:shadow-secondary-200/50 transition-all duration-300"
          >
            <div class="p-5">
              <div class="flex gap-4">
                <!-- Ticket Info -->
                <div class="flex-1 min-w-0">
                  <!-- Area & Unit -->
                  <div class="mb-3">
                    <p class="text-base font-bold text-secondary-900">{{ ticket.area_name }}</p>
                    <p class="text-sm text-secondary-500 font-mono">{{ ticket.unit_display_name }}</p>
                  </div>

                  <!-- Status Badge -->
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      :class="ticket.status === 'confirmed'
                        ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                        : ticket.status === 'checked_in'
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                          : ticket.status === 'transferred'
                            ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                            : 'bg-secondary-50 text-secondary-600 ring-1 ring-secondary-200'"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        :class="ticket.status === 'confirmed'
                          ? 'bg-green-500'
                          : ticket.status === 'checked_in'
                            ? 'bg-blue-500'
                            : ticket.status === 'transferred'
                              ? 'bg-amber-500'
                              : 'bg-secondary-400'"
                      ></span>
                      {{ statusLabel(ticket.status) }}
                    </span>
                  </div>
                </div>

                <!-- QR Code -->
                <div v-if="ticket.qr_data" class="flex-shrink-0">
                  <div class="relative bg-white rounded-xl border-2 border-secondary-100 p-2 group-hover:border-primary-200 transition-colors">
                    <img
                      :src="getQrUrl(ticket.qr_data.code)"
                      :alt="`QR ${ticket.unit_display_name}`"
                      class="w-24 h-24 sm:w-28 sm:h-28"
                      loading="lazy"
                    />
                  </div>
                  <p class="text-[9px] text-secondary-300 mt-1.5 font-mono text-center tracking-wider">{{ ticket.qr_data.code?.slice(0, 8) }}...</p>
                </div>
              </div>
            </div>

            <!-- Perforated divider effect -->
            <div class="relative">
              <div class="border-t-2 border-dashed border-secondary-100 mx-4"></div>
              <div class="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-secondary-50 rounded-full"></div>
              <div class="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-secondary-50 rounded-full"></div>
            </div>

            <!-- Footer -->
            <div class="px-5 py-3 flex items-center justify-between">
              <p class="text-[11px] text-secondary-400 font-medium uppercase tracking-wider">
                Ref: {{ ticket.reservation_id.slice(0, 8) }}
              </p>
              <div v-if="ticket.can_transfer" class="flex items-center gap-1 text-xs text-primary-500 font-medium cursor-pointer hover:text-primary-600 transition-colors">
                <ArrowsRightLeftIcon class="w-3.5 h-3.5" />
                Transferir
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA for organizers -->
      <div v-if="!tenantsStore.hasTenants" class="relative overflow-hidden bg-gradient-to-br from-secondary-900 to-secondary-800 rounded-2xl p-8 text-center">
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
        </div>
        <div class="relative">
          <div class="w-14 h-14 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SparklesIcon class="w-7 h-7 text-primary-400" />
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Organizas eventos?</h3>
          <p class="text-secondary-400 text-sm mb-6 max-w-md mx-auto">Crea tu organizacion y empieza a vender boletas con WaRo Tickets. Configura eventos, areas y precios en minutos.</p>
          <NuxtLink to="/organizadores" class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-all text-sm font-semibold shadow-lg shadow-primary-600/30">
            Crear organizacion
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </div>
    </div>

    <!-- Error State -->
    <div v-if="fetchError" class="mt-6 bg-red-50 border border-red-200 rounded-xl p-5 text-center">
      <p class="text-sm text-red-700 mb-2">{{ fetchError }}</p>
      <button @click="refresh" class="text-sm font-semibold text-red-600 hover:text-red-700 underline underline-offset-2">Reintentar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TicketIcon,
  CalendarDaysIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Mis Boletas - WaRo Tickets' })

const setPageTitle = inject<(title: string) => void>('setPageTitle')
const setPageSubtitle = inject<(subtitle: string) => void>('setPageSubtitle')

const tenantsStore = useTenantsStore()

interface Ticket {
  reservation_unit_id: number
  reservation_id: string
  unit_id: number
  unit_display_name: string
  area_name: string
  event_name: string
  event_slug: string
  event_date: string
  status: string
  qr_code: string | null
  qr_data: { code: string; [key: string]: any } | null
  qr_code_url: string | null
  can_transfer: boolean
}

interface GroupedEvent {
  name: string
  slug: string
  date: string
  tickets: Ticket[]
}

const loading = ref(true)
const tickets = ref<Ticket[]>([])
const fetchError = ref('')
const searchQuery = ref('')

const { currentPhrase, start: startPhrases, stop: stopPhrases } = useLoadingPhrases([
  'Buscando tus boletas...',
  'Revisando confirmaciones...',
  'Preparando codigos QR...',
  'Organizando por evento...',
  'Casi listo, aguanta...'
])

const groupedTickets = computed<GroupedEvent[]>(() => {
  if (!tickets.value?.length) return []

  const groups: Record<string, GroupedEvent> = {}
  for (const ticket of tickets.value) {
    if (!groups[ticket.event_slug]) {
      groups[ticket.event_slug] = {
        name: ticket.event_name,
        slug: ticket.event_slug,
        date: ticket.event_date,
        tickets: []
      }
    }
    groups[ticket.event_slug].tickets.push(ticket)
  }

  return Object.values(groups).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

function normalize(str: string) {
  return str.toLowerCase().replace(/[-_\s]/g, '')
}

const filteredGroupedTickets = computed<GroupedEvent[]>(() => {
  const q = normalize(searchQuery.value.trim())
  if (!q) return groupedTickets.value

  return groupedTickets.value
    .map(event => {
      if (normalize(event.name).includes(q)) return event

      const filtered = event.tickets.filter(t =>
        normalize(t.unit_display_name).includes(q)
        || normalize(t.area_name).includes(q)
        || normalize(t.reservation_id).includes(q)
        || (t.qr_data?.code && normalize(t.qr_data.code).includes(q))
      )
      if (filtered.length === 0) return null
      return { ...event, tickets: filtered }
    })
    .filter(Boolean) as GroupedEvent[]
})

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    confirmed: 'Confirmada',
    checked_in: 'Ingresado',
    cancelled: 'Cancelada',
    transferred: 'Transferida'
  }
  return labels[status] || status
}

function getQrUrl(code: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(code)}`
}

async function fetchTickets() {
  loading.value = true
  fetchError.value = ''
  startPhrases()

  try {
    const data = await $fetch<Ticket[]>('/api/reservations/my-tickets', {
      credentials: 'include'
    })
    tickets.value = data
  } catch (e: any) {
    fetchError.value = e?.data?.detail || 'Error al cargar tus boletas'
  } finally {
    stopPhrases()
    loading.value = false
  }
}

async function refresh() {
  await fetchTickets()
}

onMounted(() => {
  setPageTitle?.('Mis Boletas')
  setPageSubtitle?.('Tus boletas compradas y codigos QR')
  fetchTickets()
})
</script>
