<template>
  <div class="min-h-screen bg-secondary-50">
    <!-- Header -->
    <div class="bg-white border-b border-secondary-100">
      <div class="container mx-auto px-4 md:px-8 py-6">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/carrito"
            class="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center hover:bg-secondary-200 transition-colors"
          >
            <ArrowLeftIcon class="w-5 h-5 text-secondary-600" />
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-bold text-secondary-900">Checkout</h1>
            <p class="text-sm text-secondary-500">Completa tu compra</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="container mx-auto px-4 md:px-8 py-12">
      <div class="max-w-4xl mx-auto">
        <div class="animate-pulse space-y-4">
          <div class="h-64 bg-white rounded-2xl"></div>
          <div class="h-48 bg-white rounded-2xl"></div>
        </div>
      </div>
    </div>

    <!-- No Cart -->
    <div v-else-if="cartStore.isEmpty" class="container mx-auto px-4 md:px-8 py-12">
      <div class="max-w-md mx-auto text-center">
        <div class="w-24 h-24 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
          <ShoppingCartIcon class="w-12 h-12 text-secondary-400" />
        </div>
        <h2 class="text-2xl font-bold text-secondary-900 mb-2">No hay nada en tu carrito</h2>
        <p class="text-secondary-500 mb-8">Agrega boletas antes de continuar al checkout.</p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
        >
          Ver eventos
        </NuxtLink>
      </div>
    </div>

    <!-- Checkout Content -->
    <div v-else class="container mx-auto px-4 md:px-8 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Form -->
          <div class="flex-1">
            <form @submit.prevent="handleCheckout" class="space-y-6">
              <!-- Contact Info -->
              <div class="bg-white rounded-2xl border border-secondary-100 p-6">
                <h2 class="font-bold text-lg text-secondary-900 mb-6">Informacion de contacto</h2>
                <p class="text-sm text-secondary-500 mb-6">
                  Estos datos se usaran para enviarte tus boletas y confirmacion de compra.
                </p>

                <div class="space-y-4">
                  <!-- Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-secondary-700 mb-1.5">
                      Nombre completo *
                    </label>
                    <input
                      id="name"
                      v-model="form.customerName"
                      type="text"
                      required
                      placeholder="Tu nombre"
                      class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      :class="{ 'border-red-300': errors.customerName }"
                    />
                    <p v-if="errors.customerName" class="text-sm text-red-500 mt-1">{{ errors.customerName }}</p>
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-secondary-700 mb-1.5">
                      Correo electronico *
                    </label>
                    <input
                      id="email"
                      v-model="form.customerEmail"
                      type="email"
                      required
                      placeholder="tu@email.com"
                      class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      :class="{ 'border-red-300': errors.customerEmail }"
                    />
                    <p v-if="errors.customerEmail" class="text-sm text-red-500 mt-1">{{ errors.customerEmail }}</p>
                    <p class="text-xs text-secondary-400 mt-1">Aqui recibirás tus boletas</p>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-secondary-700 mb-1.5">
                      Telefono *
                    </label>
                    <input
                      id="phone"
                      v-model="form.customerPhone"
                      type="tel"
                      required
                      placeholder="300 123 4567"
                      class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      :class="{ 'border-red-300': errors.customerPhone }"
                    />
                    <p v-if="errors.customerPhone" class="text-sm text-red-500 mt-1">{{ errors.customerPhone }}</p>
                  </div>
                </div>
              </div>

              <!-- Terms -->
              <div class="bg-white rounded-2xl border border-secondary-100 p-6">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    v-model="form.acceptTerms"
                    type="checkbox"
                    required
                    class="mt-1 w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <span class="text-sm text-secondary-600">
                    Acepto los
                    <a href="/terminos" target="_blank" class="text-primary-600 hover:underline">terminos y condiciones</a>
                    y la
                    <a href="/privacidad" target="_blank" class="text-primary-600 hover:underline">politica de privacidad</a>.
                    Entiendo que las boletas no son reembolsables una vez completada la compra.
                  </span>
                </label>
                <p v-if="errors.acceptTerms" class="text-sm text-red-500 mt-2">{{ errors.acceptTerms }}</p>
              </div>

              <!-- Error Message -->
              <div v-if="checkoutError" class="bg-red-50 border border-red-200 rounded-xl p-4">
                <div class="flex items-center gap-2">
                  <ExclamationTriangleIcon class="w-5 h-5 text-red-500" />
                  <p class="text-red-700">{{ checkoutError }}</p>
                </div>
              </div>

              <!-- Submit Button (mobile) -->
              <button
                type="submit"
                :disabled="processing"
                class="lg:hidden w-full py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="processing" class="flex items-center gap-2">
                  <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </span>
                <span v-else class="flex items-center gap-2">
                  <CreditCardIcon class="w-5 h-5" />
                  Pagar ${{ formatPrice(cartStore.total) }}
                </span>
              </button>
            </form>
          </div>

          <!-- Order Summary -->
          <div class="lg:w-96">
            <div class="bg-white rounded-2xl border border-secondary-100 p-6 sticky top-4">
              <h2 class="font-bold text-lg text-secondary-900 mb-4">Tu pedido</h2>

              <!-- Event -->
              <div class="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl mb-4">
                <CalendarIcon class="w-5 h-5 text-secondary-400" />
                <span class="font-medium text-secondary-700">{{ cartStore.cart?.clusterName }}</span>
              </div>

              <!-- Items -->
              <div class="space-y-3 mb-4">
                <div
                  v-for="item in cartStore.cart?.items"
                  :key="item.id"
                  class="flex justify-between text-sm"
                >
                  <div>
                    <span class="text-secondary-700">{{ item.areaName }}</span>
                    <span class="text-secondary-400"> x{{ item.ticketsCount }}</span>
                  </div>
                  <span class="font-medium text-secondary-900">${{ formatPrice(item.subtotal) }}</span>
                </div>
              </div>

              <!-- Totals -->
              <div class="border-t border-secondary-100 pt-4 space-y-2">
                <div class="flex justify-between text-secondary-600">
                  <span>Subtotal</span>
                  <span>${{ formatPrice(cartStore.subtotal) }}</span>
                </div>
                <div v-if="cartStore.discount > 0" class="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-${{ formatPrice(cartStore.discount) }}</span>
                </div>
                <div v-if="cartStore.cart?.promotionDiscount && cartStore.cart.promotionDiscount > 0" class="flex justify-between text-green-600">
                  <span>Promocion</span>
                  <span>-${{ formatPrice(cartStore.cart.promotionDiscount) }}</span>
                </div>
              </div>

              <div class="border-t border-secondary-100 pt-4 mt-4">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-secondary-900">Total a pagar</span>
                  <span class="text-2xl font-black text-secondary-900">${{ formatPrice(cartStore.total) }}</span>
                </div>
                <p class="text-xs text-secondary-400 mt-1">{{ cartStore.totalTickets }} boletas</p>
              </div>

              <!-- Submit Button (desktop) -->
              <button
                @click="handleCheckout"
                :disabled="processing"
                class="hidden lg:flex w-full mt-6 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2"
              >
                <span v-if="processing" class="flex items-center gap-2">
                  <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </span>
                <span v-else class="flex items-center gap-2">
                  <CreditCardIcon class="w-5 h-5" />
                  Pagar ${{ formatPrice(cartStore.total) }}
                </span>
              </button>

              <!-- Security Note -->
              <div class="flex items-center gap-2 mt-4 text-xs text-secondary-400">
                <LockClosedIcon class="w-4 h-4" />
                <span>Pago seguro con Wompi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  CalendarIcon,
  CreditCardIcon,
  LockClosedIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const config = useRuntimeConfig()
const cartStore = useCartStore()

// State
const loading = ref(true)
const processing = ref(false)
const checkoutError = ref('')

const form = reactive({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  acceptTerms: false
})

const errors = reactive({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  acceptTerms: ''
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
  }

  loading.value = false
})

// Format price
function formatPrice(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num?.toLocaleString('es-CO') || '0'
}

// Validate form
function validateForm(): boolean {
  let valid = true

  // Reset errors
  errors.customerName = ''
  errors.customerEmail = ''
  errors.customerPhone = ''
  errors.acceptTerms = ''

  // Name
  if (!form.customerName || form.customerName.length < 2) {
    errors.customerName = 'Ingresa tu nombre completo'
    valid = false
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.customerEmail || !emailRegex.test(form.customerEmail)) {
    errors.customerEmail = 'Ingresa un correo electronico valido'
    valid = false
  }

  // Phone
  if (!form.customerPhone || form.customerPhone.length < 7) {
    errors.customerPhone = 'Ingresa un numero de telefono valido'
    valid = false
  }

  // Terms
  if (!form.acceptTerms) {
    errors.acceptTerms = 'Debes aceptar los terminos y condiciones'
    valid = false
  }

  return valid
}

// Handle checkout
async function handleCheckout() {
  if (!validateForm()) return

  processing.value = true
  checkoutError.value = ''

  try {
    const returnUrl = `${window.location.origin}/checkout/resultado`

    const result = await cartStore.checkout({
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      acceptTerms: form.acceptTerms,
      returnUrl
    })

    if (result?.checkoutUrl) {
      // Redirect to payment gateway
      window.location.href = result.checkoutUrl
    } else {
      checkoutError.value = cartStore.error || 'Error al procesar el pago. Intenta de nuevo.'
    }
  } catch (e: any) {
    checkoutError.value = e?.message || 'Error inesperado. Intenta de nuevo.'
  } finally {
    processing.value = false
  }
}
</script>
