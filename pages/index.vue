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

      <!-- Sección: Ofertas y Promociones -->
      <div v-if="eventsWithPromotions.length > 0 && !searchQuery && !selectedType" class="mb-10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <GiftIcon class="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-text-primary">Ofertas y Promociones</h2>
            <p class="text-sm text-text-secondary">Eventos con descuentos especiales</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <EventListCard
            v-for="event in eventsWithPromotions"
            :key="'promo-' + event.id"
            :event="event"
          />
        </div>
      </div>

      <!-- Future Events -->
      <div v-else-if="futureEvents.length > 0" class="space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <EventListCard
            v-for="event in futureEvents"
            :key="event.id"
            :event="event"
          />
        </div>
      </div>

      <!-- Todos los eventos (cuando hay secciones especiales) -->
      <div v-if="eventsWithPromotions.length > 0 && !searchQuery && !selectedType && futureEvents.length > 0" class="space-y-8">
        <div class="flex items-center gap-4 mb-4 mt-6">
          <h2 class="text-xl font-bold text-text-primary">Todos los eventos</h2>
          <div class="flex-1 h-px bg-border"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <EventListCard
            v-for="event in futureEvents"
            :key="'all-' + event.id"
            :event="event"
          />
        </div>
      </div>

      <!-- Past Events -->
      <div v-if="pastEvents.length > 0" class="mt-12">
        <div class="flex items-center gap-4 mb-4">
          <h2 class="text-lg font-bold text-text-tertiary">Eventos pasados</h2>
          <div class="flex-1 h-px bg-border"></div>
          <span class="text-sm text-text-tertiary font-medium">{{ pastEvents.length }} evento{{ pastEvents.length > 1 ? 's' : '' }}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
          <EventListCard
            v-for="event in pastEvents"
            :key="'past-' + event.id"
            :event="event"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  GiftIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

// SEO Configuration
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://warotickets.com'
const defaultImage = `${siteUrl}/hero_waro_tickets.png`

useHead({
  title: 'WaRo Tickets - Encuentra los mejores eventos',
  meta: [
    { name: 'description', content: 'Encuentra los mejores eventos y compra tus boletas de forma segura' },

    // Open Graph
    { property: 'og:title', content: 'WaRo Tickets - Encuentra los mejores eventos' },
    { property: 'og:description', content: 'Encuentra los mejores eventos y compra tus boletas de forma segura' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: defaultImage },

    // Twitter
    { name: 'twitter:title', content: 'WaRo Tickets' },
    { name: 'twitter:description', content: 'Encuentra los mejores eventos' },
    { name: 'twitter:image', content: defaultImage }
  ],
  link: [
    { rel: 'canonical', href: siteUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "WaRo Tickets",
        "url": siteUrl,
        "description": "Plataforma de venta de boletería y gestión de eventos",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      })
    }
  ]
})

// State
const searchQuery = ref('')
const selectedType = ref('')

// Fetch all events once - SSR (no API calls on filter changes)
const { data: events, error, refresh } = await useAsyncData(
  'public-events',
  () => $fetch('/api/public/events', {
    params: {
      limit: 50,
      city: 'Bogotá'
    }
  })
)

// Filtered events - local filtering (no API calls)
const filteredEvents = computed(() => {
  if (!events.value) return []

  let result = events.value as any[]

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(event =>
      event.cluster_name.toLowerCase().includes(query) ||
      (event.description && event.description.toLowerCase().includes(query))
    )
  }

  // Filter by event type
  if (selectedType.value) {
    result = result.filter(event => event.cluster_type === selectedType.value)
  }

  return result
})

// Eventos con promociones activas (solo futuros)
const eventsWithPromotions = computed(() => {
  if (!events.value) return []
  const now = new Date()
  return (events.value as any[]).filter(event => {
    const eventDate = new Date(event.start_date)
    return event.featured_promotion?.savings && eventDate >= now
  }).slice(0, 4)
})

// Separate future and past events
const futureEvents = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return filteredEvents.value
    .filter(event => new Date(event.start_date) >= today)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
})

const pastEvents = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return filteredEvents.value
    .filter(event => new Date(event.start_date) < today)
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
})

</script>
