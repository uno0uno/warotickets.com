<template>
  <div class="min-h-screen bg-secondary-50">
    <!-- Loading State - Full page -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <PieLoader class="mx-auto mb-4" />
        <p class="text-secondary-600 font-medium">{{ currentPhrase }}</p>
      </div>
    </div>

    <!-- Page Content -->
    <div v-else class="min-h-screen flex flex-col">
    <!-- Header -->
    <div class="bg-white border-b border-secondary-100">
      <div class="container mx-auto px-4 md:px-8 py-6">
        <div class="flex items-center gap-4">
          <NuxtLink
            :to="cartStore.cart?.clusterSlug ? `/eventos/${cartStore.cart.clusterSlug}` : '/'"
            class="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center hover:bg-secondary-200 transition-colors"
          >
            <ArrowLeftIcon class="w-5 h-5 text-secondary-600" />
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-bold text-secondary-900">Tu Carrito</h1>
            <NuxtLink
              v-if="cartStore.cart"
              :to="`/eventos/${cartStore.cart.clusterSlug}`"
              class="text-sm text-primary-600 hover:text-primary-700"
            >
              {{ cartStore.cart.clusterName }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Cart -->
    <main v-if="cartStore.isEmpty" class="flex-1 container mx-auto px-4 md:px-8 py-12">
      <div class="max-w-md mx-auto text-center">
        <div class="w-24 h-24 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
          <ShoppingCartIcon class="w-12 h-12 text-secondary-400" />
        </div>
        <h2 class="text-2xl font-bold text-secondary-900 mb-2">Tu carrito esta vacio</h2>
        <p class="text-secondary-500 mb-8">Explora nuestros eventos y agrega boletas a tu carrito.</p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
        >
          <TicketIcon class="w-5 h-5" />
          Ver eventos
        </NuxtLink>
      </div>
    </main>

    <!-- Cart Content -->
    <main v-else class="flex-1 container mx-auto px-4 md:px-8 py-8 pb-24">
      <div class="flex flex-col lg:flex-row gap-6">
          <!-- Cart Items -->
          <div class="flex-1 space-y-4">
            <!-- Converted Promotions Notification -->
            <div
              v-if="cartStore.cart?.convertedPromotions?.length"
              class="bg-amber-50 border border-amber-200 rounded-2xl p-4"
            >
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ExclamationTriangleIcon class="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p class="text-amber-800 font-medium">Algunas promociones ya no estan disponibles</p>
                  <ul class="text-amber-700 text-sm mt-2 space-y-1">
                    <li v-for="cp in cartStore.cart.convertedPromotions" :key="cp.promotionName">
                      <strong>{{ cp.promotionName }}</strong>: {{ cp.reason }}
                      <span class="text-amber-600">({{ cp.itemsConverted }} items convertidos a boletas individuales)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Event Info -->
            <EventInfoCard
              :event-name="cartStore.cart?.clusterName || ''"
              :event-slug="cartStore.cart?.clusterSlug || ''"
              :event-date="eventDetails?.start_date"
            />

            <!-- Promotion Packages -->
            <template v-if="promotionPackages.length > 0">
              <!-- Section Header -->
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="font-bold text-secondary-900">Combos</h2>
                  <p class="text-xs text-secondary-500 mt-0.5">Paquetes promocionales con descuento</p>
                </div>
              </div>
            </template>

            <div
              v-for="pkg in promotionPackages"
              :key="pkg.promotionId"
              class="bg-white rounded-2xl border border-primary-200 p-5 relative overflow-hidden"
            >
              <!-- Savings Badge -->
              <SavingsRibbon
                v-if="pkg.originalTotal > pkg.subtotal"
                :amount="pkg.originalTotal - pkg.subtotal"
                variant="savings"
              />

              <div class="flex flex-col md:flex-row justify-between gap-4">
                <!-- Left: Info -->
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <GiftIcon class="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 class="font-extrabold text-lg text-secondary-900">{{ pkg.promotionName }}</h3>
                    </div>
                  </div>

                  <!-- Included Items - Badge Style (per unit combo) -->
                  <div class="space-y-2">
                    <span class="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Cada combo incluye</span>
                    <div class="flex flex-wrap gap-2">
                      <Badge
                        v-for="item in pkg.items"
                        :key="item.id"
                        variant="info"
                      >
                        <strong>{{ item.ticketsPerPackage }}x</strong> {{ item.areaName }}
                      </Badge>
                    </div>
                  </div>
                </div>

                <!-- Right: Price + Controls -->
                <div class="flex flex-col items-end justify-between md:border-l border-secondary-100 md:pl-5 min-w-[180px]">
                  <div class="text-right mb-3">
                    <p class="text-[10px] text-secondary-400 font-bold uppercase mb-1">Precio Combo</p>
                    <p class="text-2xl font-extrabold text-secondary-900">${{ formatPrice(pkg.subtotal) }}</p>
                    <p v-if="pkg.originalTotal > pkg.subtotal" class="text-xs text-secondary-400 line-through">
                      Antes ${{ formatPrice(pkg.originalTotal) }}
                    </p>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-3 mb-3">
                    <button
                      @click="decrementPromoQty(pkg.promotionId, pkg.packageCount)"
                      :disabled="cartStore.isLoading || updatingPromo === pkg.promotionId || getPendingPromoQty(pkg.promotionId, pkg.packageCount) <= 0"
                      class="w-8 h-8 rounded-lg flex items-center justify-center transition-all
                        disabled:opacity-40 disabled:cursor-not-allowed
                        bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
                    >
                      <MinusIcon class="w-4 h-4" />
                    </button>
                    <span class="w-8 text-center font-bold text-secondary-900">
                      <template v-if="updatingPromo === pkg.promotionId">
                        <svg class="animate-spin w-4 h-4 mx-auto" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </template>
                      <template v-else>{{ getPendingPromoQty(pkg.promotionId, pkg.packageCount) }}</template>
                    </span>
                    <button
                      @click="incrementPromoQty(pkg.promotionId, pkg.packageCount)"
                      :disabled="cartStore.isLoading || updatingPromo === pkg.promotionId || getPendingPromoQty(pkg.promotionId, pkg.packageCount) >= 5"
                      class="w-8 h-8 rounded-lg flex items-center justify-center transition-all
                        disabled:opacity-40 disabled:cursor-not-allowed
                        bg-primary-100 hover:bg-primary-200 text-primary-700"
                    >
                      <PlusIcon class="w-4 h-4" />
                    </button>
                  </div>

                  <!-- Update Button -->
                  <button
                    @click="applyPromoUpdate(pkg.promotionId, pkg.packageCount)"
                    :disabled="!hasPromoPendingChanges(pkg.promotionId, pkg.packageCount) || updatingPromo === pkg.promotionId"
                    class="w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all
                      disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="hasPromoPendingChanges(pkg.promotionId, pkg.packageCount)
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-secondary-100 text-secondary-400'"
                  >
                    <span v-if="updatingPromo === pkg.promotionId" class="flex items-center justify-center gap-2">
                      <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Actualizando...
                    </span>
                    <span v-else-if="getPendingPromoQty(pkg.promotionId, pkg.packageCount) === 0" class="flex items-center justify-center gap-2">
                      <TrashIcon class="w-4 h-4" />
                      Eliminar
                    </span>
                    <span v-else>Actualizar</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Regular Items (no promotion) - Card Style -->
            <template v-if="regularItems.length > 0">
              <!-- Section Header -->
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="font-bold text-secondary-900">Boletas individuales</h2>
                  <p class="text-xs text-secondary-500 mt-0.5">Compradas por separado, sin combo</p>
                </div>
              </div>

              <!-- Individual Ticket Cards - Same style as Event Page -->
              <div
                v-for="item in regularItems"
                :key="item.id"
                class="bg-white rounded-2xl border border-secondary-200 p-5 relative overflow-hidden"
              >
                <!-- Savings Ribbon - Show per-unit savings (like event page) -->
                <SavingsRibbon
                  v-if="getItemSavingsPerBundle(item) > 0"
                  :amount="getItemSavingsPerBundle(item)"
                  variant="savings"
                />

                <div class="flex flex-col md:flex-row justify-between gap-4">
                  <!-- Left: Info -->
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                        <TicketIcon class="w-5 h-5 text-secondary-600" />
                      </div>
                      <div>
                        <h3 class="font-extrabold text-lg text-secondary-900">{{ item.areaName }}</h3>
                      </div>
                    </div>

                    <!-- Info Badges - Same as Event Page -->
                    <div class="space-y-2">
                      <span class="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Detalle</span>
                      <div class="flex flex-wrap gap-2">
                        <!-- Stage Badge - from API response -->
                        <Badge v-if="item.stageStatus === 'active' && item.stageName" variant="stage">
                          Etapa: {{ item.stageName }}
                        </Badge>
                        <!-- Bundle Badge - from API response -->
                        <Badge v-if="item.bundleSize > 1" variant="bundle">
                          Promoción {{ item.bundleSize }}x1
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <!-- Right: Price + Controls -->
                  <div class="flex flex-col items-end justify-between md:border-l border-secondary-100 md:pl-5 min-w-[180px]">
                    <div class="text-right mb-3">
                      <!-- Bundle: Show package price -->
                      <template v-if="item.bundleSize > 1">
                        <p class="text-[10px] text-secondary-400 font-bold uppercase mb-1">Precio Promoción</p>
                        <p class="text-2xl font-extrabold text-secondary-900">${{ formatPrice(item.bundlePrice ?? (item.unitPrice * item.bundleSize)) }}</p>
                        <p v-if="(item.originalPrice * item.bundleSize) > (item.bundlePrice ?? (item.unitPrice * item.bundleSize))" class="text-xs text-secondary-400 line-through">
                          Antes ${{ formatPrice(item.originalPrice * item.bundleSize) }}
                        </p>
                      </template>
                      <!-- No Bundle: Show unit price -->
                      <template v-else>
                        <p class="text-[10px] text-secondary-400 font-bold uppercase mb-1">Precio Unitario</p>
                        <p class="text-2xl font-extrabold text-secondary-900">${{ formatPrice(item.unitPrice) }}</p>
                        <p v-if="item.originalPrice > item.unitPrice" class="text-xs text-secondary-400 line-through">
                          Antes ${{ formatPrice(item.originalPrice) }}
                        </p>
                      </template>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="flex items-center gap-3 mb-3">
                      <button
                        @click="decrementItemQty(item.areaId, item.quantity)"
                        :disabled="cartStore.isLoading || updatingItem === item.areaId || getPendingItemQty(item.areaId, item.quantity) <= 0"
                        class="w-8 h-8 rounded-lg flex items-center justify-center transition-all
                          disabled:opacity-40 disabled:cursor-not-allowed
                          bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
                      >
                        <MinusIcon class="w-4 h-4" />
                      </button>
                      <span class="w-8 text-center font-bold text-secondary-900">
                        <template v-if="updatingItem === item.areaId">
                          <svg class="animate-spin w-4 h-4 mx-auto" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        </template>
                        <template v-else>{{ getPendingItemQty(item.areaId, item.quantity) }}</template>
                      </span>
                      <button
                        @click="incrementItemQty(item.areaId, item.quantity)"
                        :disabled="cartStore.isLoading || updatingItem === item.areaId"
                        class="w-8 h-8 rounded-lg flex items-center justify-center transition-all
                          bg-primary-100 hover:bg-primary-200 text-primary-700"
                      >
                        <PlusIcon class="w-4 h-4" />
                      </button>
                    </div>

                    <!-- Update Button -->
                    <button
                      @click="applyItemUpdate(item.areaId, item.quantity)"
                      :disabled="!hasItemPendingChanges(item.areaId, item.quantity) || updatingItem === item.areaId"
                      class="w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all
                        disabled:opacity-40 disabled:cursor-not-allowed"
                      :class="hasItemPendingChanges(item.areaId, item.quantity)
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-secondary-100 text-secondary-400'"
                    >
                      <span v-if="updatingItem === item.areaId" class="flex items-center justify-center gap-2">
                        <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Actualizando...
                      </span>
                      <span v-else-if="getPendingItemQty(item.areaId, item.quantity) === 0" class="flex items-center justify-center gap-2">
                        <TrashIcon class="w-4 h-4" />
                        Eliminar
                      </span>
                      <span v-else>Actualizar</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>

          </div>

          <!-- Order Summary -->
          <div class="lg:w-80">
            <div class="bg-white rounded-2xl border border-secondary-100 p-6 sticky top-4">
              <h2 class="font-bold text-lg text-secondary-900 mb-4">Resumen de la compra</h2>

              <div class="space-y-3 mb-4">
                <!-- Combos Section -->
                <template v-if="promotionPackages.length > 0">
                  <p class="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Combos</p>
                  <template v-for="pkg in promotionPackages" :key="pkg.promotionId">
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <div class="flex items-center gap-1.5">
                          <GiftIcon class="w-4 h-4 text-primary-600" />
                          <span class="font-medium text-secondary-900 text-sm">{{ pkg.promotionName }}</span>
                        </div>
                        <p class="text-xs text-secondary-500 mt-0.5">{{ pkg.packageCount }} {{ pkg.packageCount === 1 ? 'combo' : 'combos' }}</p>
                      </div>
                      <div class="text-right">
                        <span class="font-medium text-secondary-900">${{ formatPrice(pkg.subtotal) }}</span>
                        <p v-if="pkg.originalTotal > pkg.subtotal" class="text-xs text-green-600">
                          -${{ formatPrice(pkg.originalTotal - pkg.subtotal) }}
                        </p>
                      </div>
                    </div>
                  </template>
                </template>

                <!-- Separator -->
                <div v-if="promotionPackages.length > 0 && regularItems.length > 0" class="border-t border-secondary-100 pt-3"></div>

                <!-- Individual Tickets Section -->
                <template v-if="regularItems.length > 0">
                  <p class="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Boletas individuales</p>
                  <template v-for="item in regularItems" :key="item.id">
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <div class="flex items-center gap-1.5">
                          <TicketIcon class="w-4 h-4 text-secondary-500" />
                          <span class="font-medium text-secondary-900 text-sm">{{ item.areaName }}</span>
                        </div>
                        <p class="text-xs text-secondary-500 mt-0.5">
                          <template v-if="item.bundleSize > 1">
                            {{ item.quantity }} {{ item.quantity === 1 ? 'promoción' : 'promociones' }} {{ item.bundleSize }}x1
                          </template>
                          <template v-else>
                            {{ item.ticketsCount }} {{ item.ticketsCount === 1 ? 'boleta' : 'boletas' }}
                          </template>
                          <span v-if="item.stageStatus === 'active' && item.stageName" class="text-green-600"> · Etapa: {{ item.stageName }}</span>
                        </p>
                      </div>
                      <div class="text-right">
                        <span class="font-medium text-secondary-900">${{ formatPrice(item.subtotal) }}</span>
                        <p v-if="(item.originalPrice * item.ticketsCount) > item.subtotal" class="text-xs text-green-600">
                          -${{ formatPrice((item.originalPrice * item.ticketsCount) - item.subtotal) }}
                        </p>
                      </div>
                    </div>
                  </template>
                </template>
              </div>

              <!-- Totals -->
              <div class="border-t border-secondary-100 pt-3 space-y-2">
                <div class="flex justify-between text-sm text-secondary-600">
                  <span>Subtotal ({{ cartStore.totalTickets }} boletas)</span>
                  <span>${{ formatPrice(totalOriginal) }}</span>
                </div>
                <div v-if="cartStore.discount > 0" class="flex justify-between text-sm text-green-600 font-medium">
                  <span>Ahorro total</span>
                  <span>-${{ formatPrice(cartStore.discount) }}</span>
                </div>
              </div>

              <div class="border-t border-secondary-100 pt-4 mt-3 mb-6">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-secondary-900">Total a pagar</span>
                  <span class="text-2xl font-black text-secondary-900">${{ formatPrice(cartStore.total) }}</span>
                </div>
              </div>

              <button
                @click="goToCheckout"
                class="w-full py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
              >
                Continuar al pago
                <ArrowLeftIcon class="w-5 h-5 rotate-180" />
              </button>

              <button
                @click="clearCart"
                class="w-full py-3 text-secondary-500 hover:text-red-500 text-sm font-medium mt-4 transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
    </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  TicketIcon,
  MinusIcon,
  PlusIcon,
  GiftIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const cartStore = useCartStore()

// Local state
const loading = ref(true)
const updatingPromo = ref<string | null>(null)
const eventDetails = ref<any>(null)

// Loading phrases
const { currentPhrase, start: startPhraseRotation, stop: stopPhraseRotation } = useLoadingPhrases([
  'Cargando tu carrito...',
  'Buscando tus boletas debajo del sofá...',
  'Verificando que no seas un bot...',
  'Haciendo cuentas con los dedos...',
  'Consultando el oráculo de precios...',
  'Negociando con el universo...',
  'Asegurando tu lugar en el concierto...',
  'Peleando con la base de datos...',
  'Prometemos no vender tus datos...',
  'Ya casi, paciencia joven padawan...'
])

onMounted(() => {
  startPhraseRotation()
})

// Pending changes (for update button pattern)
const pendingPromoQuantities = ref<Record<string, number>>({})
const pendingItemQuantities = ref<Record<number, number>>({})
const updatingItem = ref<number | null>(null)

// Load event details
async function loadEventDetails() {
  if (!cartStore.cart?.clusterSlug) return
  try {
    const data = await $fetch<any>(`/api/public/events/${cartStore.cart.clusterSlug}`)
    eventDetails.value = data
  } catch {
    eventDetails.value = null
  }
}

// Get savings per bundle for an item (calculated from API response)
function getItemSavingsPerBundle(item: any): number {
  // bundlePrice is the discounted price for the bundle
  // originalPrice * bundleSize is the original price for the bundle
  const bundleOriginal = item.originalPrice * item.bundleSize
  const bundleCurrent = item.bundlePrice ?? (item.unitPrice * item.bundleSize)
  return bundleOriginal - bundleCurrent
}

// Format date full
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

// Format time
function formatTime(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Format date short (for grid display)
function formatDateShort(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}


// Group items by promotion
const promotionPackages = computed(() => {
  if (!cartStore.cart?.items) return []

  const groups: Record<string, {
    promotionId: string
    promotionName: string
    items: typeof cartStore.cart.items
    subtotal: number
    originalTotal: number
    ticketsCount: number
    packageCount: number
  }> = {}

  for (const item of cartStore.cart.items) {
    if (item.promotionId) {
      if (!groups[item.promotionId]) {
        groups[item.promotionId] = {
          promotionId: item.promotionId,
          promotionName: item.promotionName || 'Paquete Promocional',
          items: [],
          subtotal: 0,
          originalTotal: 0,
          ticketsCount: 0,
          packageCount: item.quantity // All items in a promo have the same quantity
        }
      }
      groups[item.promotionId].items.push(item)
      groups[item.promotionId].subtotal += item.subtotal
      groups[item.promotionId].originalTotal += item.originalPrice * item.ticketsCount
      groups[item.promotionId].ticketsCount += item.ticketsCount
    }
  }

  return Object.values(groups)
})

// Regular items without promotion
const regularItems = computed(() => {
  if (!cartStore.cart?.items) return []
  return cartStore.cart.items.filter(item => !item.promotionId)
})

// Total original (before discounts)
const totalOriginal = computed(() => {
  if (!cartStore.cart?.items) return 0
  return cartStore.cart.items.reduce((sum, item) => {
    return sum + (item.originalPrice * item.ticketsCount)
  }, 0)
})

// Page meta
definePageMeta({
  layout: 'default'
})

// Load cart on mount
onMounted(async () => {
  await cartStore.fetchSummary()

  if (cartStore.summary.cartId) {
    await cartStore.fetchCart(cartStore.summary.cartId)
    // Load event details for date display
    await loadEventDetails()
  }

  stopPhraseRotation()
  loading.value = false
})

// Format price
function formatPrice(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num?.toLocaleString('es-CO') || '0'
}

// Get pending promo quantity (or current if no pending)
function getPendingPromoQty(promotionId: string, currentQty: number): number {
  return pendingPromoQuantities.value[promotionId] ?? currentQty
}

// Get pending item quantity (or current if no pending)
function getPendingItemQty(areaId: number, currentQty: number): number {
  return pendingItemQuantities.value[areaId] ?? currentQty
}

// Check if promo has pending changes
function hasPromoPendingChanges(promotionId: string, currentQty: number): boolean {
  const pending = pendingPromoQuantities.value[promotionId]
  return pending !== undefined && pending !== currentQty
}

// Check if item has pending changes
function hasItemPendingChanges(areaId: number, currentQty: number): boolean {
  const pending = pendingItemQuantities.value[areaId]
  return pending !== undefined && pending !== currentQty
}

// Increment pending promo quantity
function incrementPromoQty(promotionId: string, currentQty: number) {
  const current = getPendingPromoQty(promotionId, currentQty)
  if (current < 5) {
    pendingPromoQuantities.value[promotionId] = current + 1
  }
}

// Decrement pending promo quantity
function decrementPromoQty(promotionId: string, currentQty: number) {
  const current = getPendingPromoQty(promotionId, currentQty)
  if (current > 0) {
    pendingPromoQuantities.value[promotionId] = current - 1
  }
}

// Increment pending item quantity
function incrementItemQty(areaId: number, currentQty: number) {
  const current = getPendingItemQty(areaId, currentQty)
  pendingItemQuantities.value[areaId] = current + 1
}

// Decrement pending item quantity
function decrementItemQty(areaId: number, currentQty: number) {
  const current = getPendingItemQty(areaId, currentQty)
  if (current > 0) {
    pendingItemQuantities.value[areaId] = current - 1
  }
}

// Apply pending promo quantity change
async function applyPromoUpdate(promotionId: string, currentQty: number) {
  const newQty = getPendingPromoQty(promotionId, currentQty)
  if (newQty === currentQty) return

  if (newQty <= 0) {
    if (confirm('¿Estás seguro de quitar este paquete?')) {
      await cartStore.removePromotionPackage(promotionId)
      delete pendingPromoQuantities.value[promotionId]
    }
    return
  }

  updatingPromo.value = promotionId
  try {
    const clusterId = cartStore.cart?.clusterId
    if (clusterId) {
      await cartStore.addPromotionPackage(clusterId, promotionId, newQty)
      delete pendingPromoQuantities.value[promotionId]
    }
  } finally {
    updatingPromo.value = null
  }
}

// Apply pending item quantity change
async function applyItemUpdate(areaId: number, currentQty: number) {
  const newQty = getPendingItemQty(areaId, currentQty)
  if (newQty === currentQty) return

  updatingItem.value = areaId
  try {
    if (newQty <= 0) {
      await cartStore.removeItem(areaId)
    } else {
      await cartStore.updateQuantity(areaId, newQty)
    }
    delete pendingItemQuantities.value[areaId]
  } finally {
    updatingItem.value = null
  }
}

// Remove promotion package
async function removePromotion(promotionId: string) {
  if (confirm('¿Estás seguro de quitar este paquete?')) {
    await cartStore.removePromotionPackage(promotionId)
    delete pendingPromoQuantities.value[promotionId]
  }
}

// Clear cart
async function clearCart() {
  if (confirm('Estas seguro de vaciar el carrito?')) {
    await cartStore.clearCart()
  }
}

// Go to checkout
function goToCheckout() {
  router.push('/checkout')
}
</script>
