<script setup lang="ts">
import { TicketIcon } from '@heroicons/vue/24/outline'

interface EventData {
  id: string
  slug_cluster: string
  cluster_name: string
  cover_image_url?: string | null
  start_date: string
  min_price?: number | null
  tickets_available?: number | null
}

interface Props {
  event: EventData
  lowStockThreshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  lowStockThreshold: 50
})

// Helpers
function formatDateShort(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Hoy'
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Mañana'
  }

  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function formatPrice(price: number) {
  return price?.toLocaleString('es-CO') || '0'
}

// Computed states
const isSoldOut = computed(() => props.event.tickets_available === 0)
const isLowStock = computed(() =>
  props.event.tickets_available &&
  props.event.tickets_available > 0 &&
  props.event.tickets_available < props.lowStockThreshold
)
</script>

<template>
  <NuxtLink
    :to="`/eventos/${event.slug_cluster}`"
    class="group block bg-white rounded-2xl border border-secondary-200 shadow-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
  >
    <div class="flex">
      <!-- Event Image -->
      <div class="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-gradient-to-br from-primary/70 to-primary">
        <img
          v-if="event.cover_image_url"
          :src="event.cover_image_url"
          :alt="event.cluster_name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <TicketIcon class="w-10 h-10 text-white/50" />
        </div>

        <!-- Status Badge -->
        <div v-if="isSoldOut" class="absolute top-2 left-2">
          <span class="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wide">
            Agotado
          </span>
        </div>
        <div v-else-if="isLowStock" class="absolute top-2 left-2">
          <span class="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wide">
            Últimas
          </span>
        </div>
      </div>

      <!-- Event Info -->
      <div class="flex-1 min-w-0 p-4 flex flex-col justify-between">
        <div>
          <!-- Title -->
          <h3 class="text-base sm:text-lg font-bold text-secondary-900 group-hover:text-primary transition-colors mb-1 line-clamp-2">
            {{ event.cluster_name }}
          </h3>

          <!-- Date & Time -->
          <div class="flex items-center gap-2 text-xs sm:text-sm text-secondary-500 mb-2">
            <span class="text-primary font-medium">{{ formatDateShort(event.start_date) }}</span>
            <span class="text-secondary-300">·</span>
            <span>{{ formatTime(event.start_date) }}</span>
          </div>
        </div>

        <!-- Footer: Price prominent -->
        <div class="flex items-end justify-between gap-2">
          <div v-if="event.min_price">
            <p class="text-[10px] text-secondary-400 uppercase font-medium">Desde</p>
            <p class="text-lg sm:text-xl font-black text-secondary-900">
              ${{ formatPrice(event.min_price) }}
            </p>
          </div>
          <div v-if="event.tickets_available && event.tickets_available > 0" class="text-right">
            <span class="text-xs text-secondary-400">{{ event.tickets_available }} disponibles</span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
