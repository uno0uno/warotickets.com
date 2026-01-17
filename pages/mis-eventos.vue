<template>
  <div>
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="relative flex-1 sm:w-64">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar eventos..."
            class="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
          />
        </div>
      </div>
      <button class="btn-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Crear Evento
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl border border-secondary-200 overflow-hidden animate-pulse">
        <div class="h-40 bg-secondary-200"></div>
        <div class="p-4 space-y-3">
          <div class="h-5 bg-secondary-200 rounded w-3/4"></div>
          <div class="h-4 bg-secondary-200 rounded w-1/2"></div>
          <div class="h-4 bg-secondary-200 rounded w-full"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredEvents.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-secondary-900 mb-2">
        {{ searchQuery ? 'No se encontraron eventos' : 'No tienes eventos' }}
      </h3>
      <p class="text-secondary-500 mb-6">
        {{ searchQuery ? 'Intenta con otros terminos de busqueda' : 'Crea tu primer evento y empieza a vender boletas' }}
      </p>
      <button v-if="!searchQuery" class="btn-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Crear mi primer evento
      </button>
    </div>

    <!-- Events Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="bg-white rounded-xl border border-secondary-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      >
        <!-- Event Image -->
        <div class="relative h-40 bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
          <img
            v-if="event.image"
            :src="event.image"
            :alt="event.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="absolute inset-0 flex items-center justify-center">
            <svg class="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(event.status)"
            >
              {{ getStatusLabel(event.status) }}
            </span>
          </div>
        </div>

        <!-- Event Info -->
        <div class="p-4">
          <h3 class="font-semibold text-secondary-900 mb-1 truncate group-hover:text-primary-600 transition-colors">
            {{ event.name }}
          </h3>
          <p class="text-sm text-secondary-500 mb-3 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ formatDate(event.date) }}
          </p>

          <!-- Stats -->
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-4">
              <span class="text-secondary-600">
                <span class="font-medium text-secondary-900">{{ event.sold }}</span> vendidas
              </span>
              <span class="text-secondary-600">
                <span class="font-medium text-secondary-900">{{ event.checkedIn }}</span> check-in
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useHead({ title: 'Mis Eventos - WaRo Tickets' })

// Set page title
const setPageTitle = inject<(title: string) => void>('setPageTitle')
const setPageSubtitle = inject<(subtitle: string) => void>('setPageSubtitle')

onMounted(() => {
  setPageTitle?.('Mis Eventos')
  setPageSubtitle?.('Gestiona todos tus eventos')
})

const searchQuery = ref('')
const loading = ref(false)

// Mock data - replace with API call
const events = ref([
  {
    id: '1',
    name: 'Concierto de Rock en el Parque',
    date: '2025-02-15T19:00:00',
    image: null,
    status: 'active',
    sold: 450,
    checkedIn: 0
  },
  {
    id: '2',
    name: 'Festival de Musica Electronica',
    date: '2025-03-01T20:00:00',
    image: null,
    status: 'draft',
    sold: 0,
    checkedIn: 0
  },
  {
    id: '3',
    name: 'Teatro: El Fantasma de la Opera',
    date: '2025-01-20T18:30:00',
    image: null,
    status: 'completed',
    sold: 320,
    checkedIn: 315
  }
])

const filteredEvents = computed(() => {
  if (!searchQuery.value) return events.value
  const query = searchQuery.value.toLowerCase()
  return events.value.filter(event =>
    event.name.toLowerCase().includes(query)
  )
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-secondary-100 text-secondary-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return classes[status] || classes.draft
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    active: 'Activo',
    draft: 'Borrador',
    completed: 'Finalizado',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}
</script>
