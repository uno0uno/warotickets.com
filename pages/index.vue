<template>
  <div class="min-h-screen bg-secondary-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden h-[280px] sm:h-[350px] lg:h-[420px]">
      <img
        src="/hero_waro_tickets.png"
        alt="WaRo Tickets - Eventos en tu ciudad"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative h-full container mx-auto px-4 md:px-8 flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            Eventos en tu ciudad
          </h1>
          <p class="text-base sm:text-lg text-white/90 max-w-xl mx-auto drop-shadow">
            Descubre los mejores eventos y vive experiencias inolvidables
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 md:px-8 py-8">
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-8">
        <!-- Search -->
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar eventos..."
            class="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        <!-- Type Filter -->
        <select
          v-model="selectedType"
          class="px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all cursor-pointer min-w-[160px] text-text-primary"
        >
          <option value="">Todos los tipos</option>
          <option value="concert">Conciertos</option>
          <option value="festival">Festivales</option>
          <option value="theater">Teatro</option>
          <option value="sports">Deportes</option>
          <option value="conference">Conferencias</option>
          <option value="party">Fiestas</option>
          <option value="other">Otros</option>
        </select>
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center py-16">
        <div class="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon class="w-8 h-8 text-destructive" />
        </div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">Error al cargar eventos</h3>
        <p class="text-text-secondary mb-4">No pudimos cargar los eventos. Intenta de nuevo.</p>
        <button
          @click="refresh"
          class="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
        >
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEvents.length === 0" class="text-center py-16">
        <div class="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <CalendarDaysIcon class="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">No hay eventos disponibles</h3>
        <p class="text-text-secondary">Vuelve pronto para descubrir nuevos eventos</p>
      </div>

      <!-- Events Grouped by Date -->
      <div v-else class="space-y-8">
        <template v-for="(group, groupKey) in groupedEvents" :key="groupKey">
          <div v-if="group.events.length > 0">
            <!-- Date Group Header -->
            <div class="flex items-center gap-4 mb-4">
              <h2 class="text-lg font-bold text-text-primary">{{ group.label }}</h2>
              <div class="flex-1 h-px bg-border"></div>
              <span class="text-sm text-text-tertiary font-medium">{{ group.events.length }} evento{{ group.events.length > 1 ? 's' : '' }}</span>
            </div>

            <!-- Events Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <NuxtLink
                v-for="event in group.events"
                :key="event.id"
                :to="`/eventos/${event.slug_cluster}`"
                class="group block bg-surface rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div class="p-4 sm:p-5">
                  <div class="flex gap-4 sm:gap-5">
                    <!-- Event Image -->
                    <div class="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary/70 to-primary">
                      <img
                        v-if="event.cover_image_url"
                        :src="event.cover_image_url"
                        :alt="event.cluster_name"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <TicketIcon class="w-10 h-10 text-primary-foreground/50" />
                      </div>

                      <!-- Status Badge -->
                      <div v-if="event.tickets_available === 0" class="absolute top-2 left-2">
                        <span class="px-2 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-md uppercase tracking-wide">
                          Agotado
                        </span>
                      </div>
                      <div v-else-if="event.tickets_available && event.tickets_available < 50" class="absolute top-2 left-2">
                        <span class="px-2 py-1 bg-warning text-warning-foreground text-[10px] font-bold rounded-md uppercase tracking-wide">
                          Ultimas
                        </span>
                      </div>
                    </div>

                    <!-- Event Info -->
                    <div class="flex-1 min-w-0">
                      <!-- Date & Type -->
                      <div class="flex items-center gap-2 text-primary text-sm font-medium mb-1.5">
                        <span>{{ formatTime(event.start_date) }}</span>
                        <span v-if="event.cluster_type" class="text-border">·</span>
                        <span v-if="event.cluster_type" class="text-text-secondary font-normal">
                          {{ getEventTypeLabel(event.cluster_type) }}
                        </span>
                      </div>

                      <!-- Title -->
                      <h3 class="text-base sm:text-lg font-semibold text-text-primary group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {{ event.cluster_name }}
                      </h3>

                      <!-- Footer Info -->
                      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                        <!-- Price -->
                        <div v-if="event.min_price" class="flex items-center gap-1.5">
                          <span class="font-semibold text-text-primary">
                            ${{ formatPrice(event.min_price) }}
                          </span>
                          <span v-if="event.min_price !== event.max_price" class="text-text-tertiary">
                            - ${{ formatPrice(event.max_price) }}
                          </span>
                        </div>

                        <!-- Availability -->
                        <div v-if="event.tickets_available && event.tickets_available > 0" class="flex items-center gap-1.5">
                          <TicketIcon class="w-4 h-4 text-text-tertiary" />
                          <span>{{ event.tickets_available }} disponibles</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  TicketIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'WaRo Tickets - Encuentra los mejores eventos',
  meta: [
    { name: 'description', content: 'Encuentra los mejores eventos y compra tus boletas de forma segura' }
  ]
})

// State
const searchQuery = ref('')
const selectedType = ref('')

// Fetch events - SSR siempre (filtrado por Bogotá)
const { data: events, error, refresh } = await useAsyncData(
  'public-events',
  () => $fetch('/api/public/events', {
    params: {
      limit: 50,
      event_type: selectedType.value || undefined,
      city: 'Bogotá'
    }
  }),
  {
    watch: [selectedType]
  }
)

// Filtered events
const filteredEvents = computed(() => {
  if (!events.value) return []

  let result = events.value as any[]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(event =>
      event.cluster_name.toLowerCase().includes(query) ||
      (event.description && event.description.toLowerCase().includes(query))
    )
  }

  return result
})

// Group events by date
const groupedEvents = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const endOfWeek = new Date(today)
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()))
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const groups: Record<string, { label: string; events: any[] }> = {
    today: { label: 'Hoy', events: [] },
    tomorrow: { label: 'Mañana', events: [] },
    thisWeek: { label: 'Esta semana', events: [] },
    thisMonth: { label: 'Este mes', events: [] },
    upcoming: { label: 'Próximamente', events: [] },
    past: { label: 'Eventos pasados', events: [] }
  }

  for (const event of filteredEvents.value) {
    const eventDate = new Date(event.start_date)
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())

    if (eventDay < today) {
      groups.past.events.push(event)
    } else if (eventDay.getTime() === today.getTime()) {
      groups.today.events.push(event)
    } else if (eventDay.getTime() === tomorrow.getTime()) {
      groups.tomorrow.events.push(event)
    } else if (eventDay > tomorrow && eventDay <= endOfWeek) {
      groups.thisWeek.events.push(event)
    } else if (eventDay > endOfWeek && eventDay <= endOfMonth) {
      groups.thisMonth.events.push(event)
    } else if (eventDay > endOfMonth) {
      groups.upcoming.events.push(event)
    }
  }

  return groups
})

// Helpers
function formatTime(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function formatPrice(price: number) {
  return price?.toLocaleString('es-CO') || '0'
}

function getEventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    concert: 'Concierto',
    festival: 'Festival',
    theater: 'Teatro',
    sports: 'Deportes',
    conference: 'Conferencia',
    party: 'Fiesta',
    other: 'Otro'
  }
  return labels[type] || type
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
