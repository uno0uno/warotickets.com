<template>
  <div class="min-h-screen bg-secondary-50">
    <!-- Loading State - Skeleton -->
    <div v-if="pending && !data" class="animate-pulse">
      <!-- Cover Skeleton -->
      <div class="h-72 sm:h-80 lg:h-96 bg-secondary-200"></div>

      <!-- Content Skeleton -->
      <div class="container mx-auto px-4 md:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <!-- Sidebar Skeleton -->
          <div class="lg:w-[380px] flex-shrink-0">
            <div class="bg-white rounded-2xl shadow-xl border border-secondary-100 overflow-hidden">
              <div class="aspect-video bg-secondary-200"></div>
              <div class="p-6 space-y-4">
                <div class="h-6 bg-secondary-200 rounded-full w-24"></div>
                <div class="h-8 bg-secondary-200 rounded w-full"></div>
                <div class="h-6 bg-secondary-200 rounded w-3/4"></div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-secondary-200 rounded-xl"></div>
                  <div class="space-y-2 flex-1">
                    <div class="h-4 bg-secondary-200 rounded w-full"></div>
                    <div class="h-3 bg-secondary-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-secondary-200 rounded-xl"></div>
                  <div class="space-y-2 flex-1">
                    <div class="h-4 bg-secondary-200 rounded w-3/4"></div>
                    <div class="h-3 bg-secondary-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div class="border-t border-secondary-100 my-6"></div>
                <div class="h-14 bg-secondary-200 rounded-xl"></div>
              </div>
            </div>
          </div>

          <!-- Main Content Skeleton -->
          <div class="flex-1 space-y-6">
            <div class="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 lg:p-8">
              <div class="h-6 bg-secondary-200 rounded w-48 mb-4"></div>
              <div class="space-y-3">
                <div class="h-4 bg-secondary-200 rounded w-full"></div>
                <div class="h-4 bg-secondary-200 rounded w-full"></div>
                <div class="h-4 bg-secondary-200 rounded w-3/4"></div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 lg:p-8">
              <div class="h-6 bg-secondary-200 rounded w-32 mb-6"></div>
              <div class="space-y-3">
                <div class="h-20 bg-secondary-100 rounded-xl"></div>
                <div class="h-20 bg-secondary-100 rounded-xl"></div>
                <div class="h-20 bg-secondary-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !data" class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-2xl font-bold text-secondary-900 mb-2">Evento no encontrado</h2>
        <p class="text-secondary-500 mb-6">El evento que buscas no existe o ya no esta disponible.</p>
        <NuxtLink
          to="/eventos"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
        >
          <ArrowLeftIcon class="w-5 h-5" />
          Ver todos los eventos
        </NuxtLink>
      </div>
    </div>

    <!-- Event Content -->
    <template v-else-if="event">
      <!-- Cover Image -->
      <div class="relative h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-primary-800 via-primary-900 to-secondary-900 overflow-hidden">
        <img
          v-if="event.banner_image_url || event.cover_image_url"
          :src="event.banner_image_url || event.cover_image_url"
          :alt="event.cluster_name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <!-- Back Button -->
        <NuxtLink
          to="/eventos"
          class="absolute top-4 left-4 sm:left-6 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-secondary-700 rounded-xl hover:bg-white transition-all shadow-sm z-10"
        >
          <ArrowLeftIcon class="w-4 h-4" />
          <span class="text-sm font-medium">Eventos</span>
        </NuxtLink>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto px-4 md:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <!-- Sidebar - Event Info Card -->
          <div class="lg:w-[380px] flex-shrink-0 order-1 lg:order-none">
            <div class="bg-white rounded-2xl shadow-xl border border-secondary-100 overflow-hidden sticky top-4">
              <!-- Cover thumbnail -->
              <div v-if="event.cover_image_url" class="aspect-video bg-secondary-100">
                <img :src="event.cover_image_url" :alt="event.cluster_name" class="w-full h-full object-cover" />
              </div>

              <div class="p-6">
                <!-- Event Type Badge -->
                <div v-if="event.cluster_type" class="mb-4">
                  <span class="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                    {{ getEventTypeLabel(event.cluster_type) }}
                  </span>
                </div>

                <!-- Title -->
                <h1 class="text-2xl font-bold text-secondary-900 mb-4 leading-tight">
                  {{ event.cluster_name }}
                </h1>

                <!-- Date & Time -->
                <div class="flex items-start gap-3 mb-4">
                  <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CalendarIcon class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary-900">{{ formatDateFull(event.start_date) }}</p>
                    <p class="text-sm text-secondary-500">{{ formatTime(event.start_date) }}</p>
                  </div>
                </div>

                <!-- Price Range -->
                <div v-if="summary?.min_price" class="flex items-start gap-3 mb-4">
                  <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TicketIcon class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary-900">
                      <template v-if="summary.min_price === summary.max_price">
                        ${{ formatPrice(summary.min_price) }}
                      </template>
                      <template v-else>
                        ${{ formatPrice(summary.min_price) }} - ${{ formatPrice(summary.max_price) }}
                      </template>
                    </p>
                    <p class="text-sm text-secondary-500">{{ summary.areas_count }} localidades</p>
                  </div>
                </div>

                <!-- Availability -->
                <div v-if="summary" class="flex items-start gap-3 mb-6">
                  <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UserGroupIcon class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary-900">{{ summary.tickets_available }} disponibles</p>
                    <p class="text-sm text-secondary-500">de {{ summary.total_capacity }} total</p>
                  </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-secondary-100 my-6"></div>

                <!-- CTA Button -->
                <button
                  :disabled="summary?.is_sold_out"
                  class="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="summary?.is_sold_out
                    ? 'bg-secondary-400'
                    : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98]'"
                >
                  <template v-if="summary?.is_sold_out">
                    <span class="flex items-center justify-center gap-2">
                      <XCircleIcon class="w-5 h-5" />
                      Agotado
                    </span>
                  </template>
                  <template v-else>
                    <span class="flex items-center justify-center gap-2">
                      <TicketIcon class="w-5 h-5" />
                      Comprar boletas
                    </span>
                  </template>
                </button>

                <!-- Sold Progress -->
                <div v-if="summary && !summary.is_sold_out" class="mt-4">
                  <div class="flex justify-between text-xs text-secondary-500 mb-1.5">
                    <span>{{ summary.tickets_sold }} vendidas</span>
                    <span>{{ Math.round((summary.tickets_sold / summary.total_capacity) * 100) }}%</span>
                  </div>
                  <div class="h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary-500 rounded-full transition-all duration-500"
                      :style="{ width: `${(summary.tickets_sold / summary.total_capacity) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 min-w-0 space-y-6 order-2">
            <!-- Description Card -->
            <div v-if="event.description" class="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 lg:p-8">
              <h2 class="text-xl font-bold text-secondary-900 mb-4">Acerca del evento</h2>
              <div class="prose prose-secondary max-w-none">
                <p class="text-secondary-600 whitespace-pre-line leading-relaxed">{{ event.description }}</p>
              </div>
            </div>

            <!-- Boletas Section - Estilo Etapas -->
            <div class="space-y-6">
              <!-- Section Header -->
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-extrabold text-secondary-900 tracking-tight">Areas y Localidades</h2>
                <p class="text-sm text-secondary-500 font-medium hidden sm:block">
                  Cada area tiene sus propias etapas de venta
                </p>
              </div>

              <!-- Ticket Cards -->
              <div v-if="areas && areas.length > 0" class="space-y-4">
                <!-- Area Card -->
                <div
                  v-for="area in areas"
                  :key="area.id"
                  class="bg-white rounded-3xl p-6 border border-secondary-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                  :class="{
                    'opacity-60 grayscale': area.units_available === 0
                  }"
                >
                  <!-- Sold Out Overlay -->
                  <div
                    v-if="area.units_available === 0"
                    class="absolute inset-0 bg-secondary-100/10 backdrop-blur-[1px] flex items-center justify-center z-10"
                  >
                    <span class="bg-white/90 border border-secondary-300 px-6 py-2 rounded-full font-bold text-secondary-500 text-xs uppercase tracking-widest shadow-sm">
                      Localidad Agotada
                    </span>
                  </div>

                  <!-- Low Stock Ribbon -->
                  <div
                    v-if="area.units_available > 0 && area.units_available < 20"
                    class="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider"
                  >
                    Ultimos {{ area.units_available }} lugares
                  </div>

                  <!-- Header: Area Name + Active Stage Badge -->
                  <div class="flex items-start justify-between gap-4 mb-4">
                    <div class="flex-1">
                      <h3 class="font-extrabold text-xl text-secondary-900 tracking-tight">{{ area.area_name }}</h3>
                      <p v-if="area.description" class="text-sm text-secondary-500 mt-1">{{ area.description }}</p>
                    </div>
                    <span
                      v-if="area.active_sale_stage"
                      class="flex-shrink-0 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-green-200 whitespace-nowrap"
                    >
                      {{ area.active_sale_stage }}: Activa
                    </span>
                  </div>

                  <!-- Content: Stage Info + Pricing -->
                  <!-- With Stage: Two columns -->
                  <div v-if="area.active_sale_stage && getStageInfo(area.active_sale_stage)" class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <!-- Left: Stage Info Box -->
                    <div class="flex-1">
                      <div class="bg-secondary-50 border border-secondary-100 rounded-2xl p-4 h-full">
                        <div class="flex items-center gap-2 mb-2">
                          <ClockIcon class="w-4 h-4 text-secondary-400" />
                          <span class="text-xs font-semibold text-secondary-500 uppercase tracking-wide">Etapa Actual</span>
                        </div>
                        <p class="font-bold text-secondary-800 mb-1">{{ area.active_sale_stage }}</p>
                        <p
                          v-if="getStageInfo(area.active_sale_stage)?.end_time"
                          class="text-sm text-secondary-500"
                        >
                          Hasta {{ formatDateShort(getStageInfo(area.active_sale_stage).end_time) }}
                        </p>
                        <div
                          v-if="area.current_price && Number(area.current_price) < Number(area.price)"
                          class="mt-3 inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-2.5 py-1 rounded-lg text-xs font-bold"
                        >
                          <SparklesIcon class="w-3.5 h-3.5" />
                          {{ Math.round((1 - Number(area.current_price) / Number(area.price)) * 100) }}% descuento
                        </div>
                      </div>
                    </div>

                    <!-- Right: Pricing Box -->
                    <div class="sm:w-48 flex-shrink-0">
                      <div class="bg-primary-50 border border-primary-100 rounded-2xl p-4 text-center h-full flex flex-col justify-center">
                        <p class="text-[10px] text-primary-600 font-bold uppercase tracking-wide mb-1">Precio Unitario</p>
                        <p class="text-3xl font-black text-primary-700">
                          ${{ formatPrice(area.current_price || area.price) }}
                        </p>
                        <p
                          v-if="area.current_price && Number(area.current_price) < Number(area.price)"
                          class="text-sm text-secondary-400 line-through mt-1"
                        >
                          Antes ${{ formatPrice(area.price) }}
                        </p>
                        <p v-if="area.units_available > 0" class="text-xs text-primary-600/70 mt-2 font-medium">
                          {{ area.units_available }} disponibles
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Without Stage: Single row pricing -->
                  <div v-else class="flex items-center justify-between gap-4 bg-secondary-50 border border-secondary-100 rounded-2xl p-4">
                    <div class="flex items-center gap-3">
                      <TicketIcon class="w-5 h-5 text-secondary-400" />
                      <div>
                        <p class="text-xs text-secondary-500 font-medium">Precio unitario</p>
                        <p v-if="area.units_available > 0" class="text-xs text-secondary-400">{{ area.units_available }} disponibles</p>
                      </div>
                    </div>
                    <p class="text-2xl font-black text-secondary-900">
                      ${{ formatPrice(area.current_price || area.price) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- No Areas -->
              <div v-else class="bg-white rounded-3xl border border-secondary-200 p-12 text-center">
                <TicketIcon class="w-12 h-12 mx-auto mb-3 text-secondary-300" />
                <p class="text-secondary-500 font-medium">No hay boletas disponibles</p>
              </div>
            </div>

            <!-- Combos Section - Solo con parametro ?promo=1 -->
            <div v-if="promotions.length > 0 && showPromos" class="space-y-6">
              <!-- Section Header -->
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-extrabold text-secondary-900 tracking-tight">Combos y Paquetes</h2>
                <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  Ahorra mas
                </span>
              </div>

              <!-- Combo Cards -->
              <div class="space-y-4">
                <div
                  v-for="promo in promotions"
                  :key="promo.id"
                  class="bg-white rounded-3xl p-6 border border-primary-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  <!-- Savings Ribbon -->
                  <div
                    v-if="promo.savings > 0"
                    class="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider"
                  >
                    Ahorras ${{ formatPrice(promo.savings) }}
                  </div>

                  <div class="flex flex-col md:flex-row justify-between gap-6">
                    <!-- Left: Info -->
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="font-extrabold text-xl text-secondary-900 tracking-tight">{{ promo.promotion_name }}</h3>
                        <span class="bg-primary-100 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-primary-200">
                          {{ promo.promotion_code }}
                        </span>
                      </div>
                      <p v-if="promo.description" class="text-sm text-secondary-500 mb-4">{{ promo.description }}</p>

                      <!-- Included Items -->
                      <div class="space-y-2">
                        <span class="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Incluye</span>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="item in promo.items"
                            :key="item.area_id"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary-100 rounded-lg text-sm text-secondary-700"
                          >
                            <CheckIcon class="w-4 h-4 text-green-500" />
                            <strong>{{ item.quantity }}x</strong> {{ item.area_name }}
                          </span>
                        </div>
                        <p class="text-xs text-secondary-500 mt-2">
                          Total: {{ promo.total_tickets }} boletas
                        </p>
                      </div>
                    </div>

                    <!-- Right: Price -->
                    <div class="flex flex-col items-end justify-between md:border-l border-secondary-100 md:pl-6 min-w-[160px]">
                      <div class="text-right">
                        <p class="text-[10px] text-secondary-400 font-bold uppercase mb-1">Precio Combo</p>
                        <p class="text-3xl font-extrabold text-secondary-900">
                          ${{ formatPrice(promo.final_price) }}
                        </p>
                        <p
                          v-if="promo.savings > 0"
                          class="text-xs text-secondary-400 line-through"
                        >
                          Antes ${{ formatPrice(promo.original_price) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Extra Attributes -->
            <div
              v-if="event.extra_attributes && Object.keys(event.extra_attributes).length > 0"
              class="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 lg:p-8"
            >
              <h2 class="text-xl font-bold text-secondary-900 mb-6">Informacion adicional</h2>
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="(value, key) in event.extra_attributes"
                  :key="key"
                  class="bg-secondary-50 rounded-xl p-4"
                >
                  <dt class="text-sm text-secondary-500 capitalize mb-1">{{ formatAttributeKey(key) }}</dt>
                  <dd class="text-secondary-900 font-medium">{{ value }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  CalendarIcon,
  TicketIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  UserGroupIcon,
  SparklesIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const slug = route.params.slug as string

// Solo mostrar promociones si viene el parametro ?promo=1 o ?promo=true
const showPromos = computed(() => {
  const promoParam = route.query.promo
  return promoParam === '1' || promoParam === 'true'
})

// Page Meta
definePageMeta({
  layout: 'default'
})

// Fetch all data in parallel from server
const { data, pending, error } = await useAsyncData(
  `event-full-${slug}`,
  async () => {
    const [event, areas, summary, promotions, saleStages] = await Promise.all([
      $fetch(`/api/public/events/${slug}`),
      $fetch(`/api/public/events/${slug}/areas`),
      $fetch(`/api/public/events/${slug}/summary`),
      $fetch(`/api/public/events/${slug}/promotions`),
      $fetch(`/api/public/events/${slug}/sale-stages`)
    ])
    return { event, areas, summary, promotions, saleStages }
  }
)

// Destructure for easier access
const event = computed(() => data.value?.event)
const areas = computed(() => data.value?.areas as any[] || [])
const summary = computed(() => data.value?.summary)
const promotions = computed(() => data.value?.promotions as any[] || [])
const saleStages = computed(() => data.value?.saleStages as any[] || [])

// Dynamic SEO
useHead(() => ({
  title: event.value ? `${event.value.cluster_name} - WaRo Tickets` : 'Evento - WaRo Tickets',
  meta: [
    {
      name: 'description',
      content: event.value?.description || 'Compra tus boletas de forma segura'
    }
  ]
}))

// Helpers
function formatDateFull(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function formatPrice(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num?.toLocaleString('es-CO') || '0'
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

function formatAttributeKey(key: string) {
  return key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function formatDateShort(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Obtener info de una etapa por nombre
function getStageInfo(stageName: string) {
  if (!saleStages.value || !stageName) return null
  return saleStages.value.find((s: any) => s.stage_name === stageName)
}
</script>
