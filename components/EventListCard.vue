<script setup lang="ts">
import { TicketIcon, SparklesIcon, GiftIcon } from '@heroicons/vue/24/outline'

interface FeaturedPromotion {
  id: string
  promotion_name: string
  total_tickets: number
  original_price?: number | null
  final_price?: number | null
  savings?: number | null
}

interface EventData {
  id: string
  slug_cluster: string
  cluster_name: string
  cover_image_url?: string | null
  start_date: string
  min_price?: number | null
  tickets_available?: number | null
  active_sale_stage?: string | null
  active_stage_bundle?: number | null  // ej: 2 para "2x1"
  has_promotions?: boolean
  featured_promotion?: FeaturedPromotion | null
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
    class="block bg-white rounded-2xl border border-secondary-200 shadow-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
  >
    <!-- Vertical Card Layout -->
    <div class="flex flex-col h-full">
      <!-- Event Image - full natural size -->
      <div class="relative bg-gradient-to-br from-primary/70 to-primary overflow-hidden">
        <img
          v-if="event.cover_image_url"
          :src="event.cover_image_url"
          :alt="event.cluster_name"
          class="w-full h-auto"
        />
        <div v-else class="aspect-video w-full flex items-center justify-center">
          <TicketIcon class="w-12 h-12 text-white/50" />
        </div>

        <!-- Status Badge -->
        <div v-if="isSoldOut" class="absolute top-3 left-3">
          <span class="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wide shadow-lg">
            Agotado
          </span>
        </div>
        <div v-else-if="isLowStock" class="absolute top-3 left-3">
          <span class="px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg uppercase tracking-wide shadow-lg">
            Últimas
          </span>
        </div>

      </div>

      <!-- Event Info -->
      <div class="p-4 flex flex-col flex-1">
        <!-- Title -->
        <h3 class="text-base sm:text-lg font-bold text-secondary-900 line-clamp-2 leading-tight mb-1">
          {{ event.cluster_name }}
        </h3>

        <!-- Date & Time -->
        <div class="flex items-center gap-2 text-sm text-secondary-500 mb-2">
          <span class="text-primary font-medium">{{ formatDateShort(event.start_date) }}</span>
          <span class="text-secondary-300">·</span>
          <span>{{ formatTime(event.start_date) }}</span>
        </div>

        <!-- Badges: Etapa y Promocion -->
        <div class="flex flex-wrap items-center gap-1.5 mb-3">
          <span v-if="event.active_sale_stage" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[10px] font-semibold">
            <SparklesIcon class="w-3 h-3" />
            {{ event.active_sale_stage }}
          </span>
          <span v-if="event.active_stage_bundle && event.active_stage_bundle > 1" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-[10px] font-bold">
            {{ event.active_stage_bundle }}x1
          </span>
          <span v-if="event.featured_promotion?.savings" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-semibold">
            <GiftIcon class="w-3 h-3" />
            Ahorra ${{ formatPrice(event.featured_promotion.savings) }}
          </span>
        </div>

        <!-- Footer: Price + CTA -->
        <div class="flex items-center justify-between pt-3 border-t border-secondary-100 mt-auto">
          <div v-if="event.min_price">
            <p class="text-[10px] text-secondary-400 uppercase font-medium">Desde</p>
            <p class="text-xl font-black text-secondary-900">
              ${{ formatPrice(event.min_price) }}
            </p>
          </div>
          <span class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg">
            Comprar
          </span>
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
