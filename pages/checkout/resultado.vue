<template>
  <div class="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <div class="w-16 h-16 mx-auto mb-4">
        <svg class="animate-spin w-full h-full text-primary-600" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <p class="text-secondary-600 font-medium">Verificando tu pago...</p>
    </div>

    <!-- Success State -->
    <div v-else-if="paymentStatus === 'APPROVED'" class="max-w-lg w-full">
      <div class="bg-white rounded-2xl border border-secondary-100 p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircleIcon class="w-10 h-10 text-green-500" />
        </div>

        <h1 class="text-2xl font-bold text-secondary-900 mb-2">Pago exitoso</h1>
        <p class="text-secondary-500 mb-6">Tu compra ha sido procesada correctamente.</p>

        <!-- Payment Details -->
        <div v-if="payment" class="bg-secondary-50 rounded-xl p-4 mb-6 text-left">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-secondary-500">Referencia</span>
              <span class="font-medium text-secondary-900">{{ payment.reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-secondary-500">Monto</span>
              <span class="font-medium text-secondary-900">${{ formatPrice(payment.amount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-secondary-500">Estado</span>
              <span class="font-medium text-green-600">Aprobado</span>
            </div>
          </div>
        </div>

        <p class="text-sm text-secondary-500 mb-6">
          Hemos enviado tus boletas al correo electronico que proporcionaste.
          Tambien puedes verlas en la seccion "Mis Eventos".
        </p>

        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink
            to="/mis-eventos"
            class="flex-1 py-3 px-6 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors text-center"
          >
            Ver mis boletas
          </NuxtLink>
          <NuxtLink
            to="/"
            class="flex-1 py-3 px-6 bg-secondary-100 text-secondary-700 rounded-xl font-semibold hover:bg-secondary-200 transition-colors text-center"
          >
            Volver al inicio
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Pending State -->
    <div v-else-if="paymentStatus === 'PENDING'" class="max-w-lg w-full">
      <div class="bg-white rounded-2xl border border-secondary-100 p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
          <ClockIcon class="w-10 h-10 text-yellow-500" />
        </div>

        <h1 class="text-2xl font-bold text-secondary-900 mb-2">Pago pendiente</h1>
        <p class="text-secondary-500 mb-6">
          Tu pago esta siendo procesado. Te notificaremos cuando se confirme.
        </p>

        <div v-if="payment" class="bg-secondary-50 rounded-xl p-4 mb-6 text-left">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-secondary-500">Referencia</span>
              <span class="font-medium text-secondary-900">{{ payment.reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-secondary-500">Monto</span>
              <span class="font-medium text-secondary-900">${{ formatPrice(payment.amount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-secondary-500">Estado</span>
              <span class="font-medium text-yellow-600">Pendiente</span>
            </div>
          </div>
        </div>

        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 py-3 px-6 bg-secondary-100 text-secondary-700 rounded-xl font-semibold hover:bg-secondary-200 transition-colors"
        >
          Volver al inicio
        </NuxtLink>
      </div>
    </div>

    <!-- Declined/Error State -->
    <div v-else class="max-w-lg w-full">
      <div class="bg-white rounded-2xl border border-secondary-100 p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <XCircleIcon class="w-10 h-10 text-red-500" />
        </div>

        <h1 class="text-2xl font-bold text-secondary-900 mb-2">
          {{ paymentStatus === 'DECLINED' ? 'Pago rechazado' : 'Error en el pago' }}
        </h1>
        <p class="text-secondary-500 mb-6">
          {{ errorMessage || 'No pudimos procesar tu pago. Por favor intenta de nuevo.' }}
        </p>

        <div v-if="payment" class="bg-secondary-50 rounded-xl p-4 mb-6 text-left">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-secondary-500">Referencia</span>
              <span class="font-medium text-secondary-900">{{ payment.reference }}</span>
            </div>
            <div v-if="payment.gateway_status_message" class="flex justify-between">
              <span class="text-secondary-500">Motivo</span>
              <span class="font-medium text-red-600">{{ payment.gateway_status_message }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink
            to="/carrito"
            class="flex-1 py-3 px-6 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors text-center"
          >
            Intentar de nuevo
          </NuxtLink>
          <NuxtLink
            to="/"
            class="flex-1 py-3 px-6 bg-secondary-100 text-secondary-700 rounded-xl font-semibold hover:bg-secondary-200 transition-colors text-center"
          >
            Volver al inicio
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

// State
const loading = ref(true)
const paymentStatus = ref<string | null>(null)
const payment = ref<any>(null)
const errorMessage = ref('')

// Page meta
definePageMeta({
  layout: 'default'
})

// Get transaction ID from query
const transactionId = computed(() => route.query.id as string)

// Format price
function formatPrice(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num?.toLocaleString('es-CO') || '0'
}

// Verify payment on mount
onMounted(async () => {
  if (!transactionId.value) {
    paymentStatus.value = 'ERROR'
    errorMessage.value = 'No se encontro la transaccion'
    loading.value = false
    return
  }

  try {
    // Call API to verify transaction
    const response = await $fetch<any>(`/api/payments/verify/${transactionId.value}`, {
      credentials: 'include'
    })

    payment.value = response
    paymentStatus.value = response.gateway_status || response.status

    // Map status if needed
    if (paymentStatus.value === 'confirmed' || paymentStatus.value === 'APPROVED') {
      paymentStatus.value = 'APPROVED'
    } else if (paymentStatus.value === 'pending' || paymentStatus.value === 'PENDING') {
      paymentStatus.value = 'PENDING'
    } else if (paymentStatus.value === 'declined' || paymentStatus.value === 'DECLINED' || paymentStatus.value === 'failed') {
      paymentStatus.value = 'DECLINED'
    }
  } catch (e: any) {
    console.error('Error verifying payment:', e)
    paymentStatus.value = 'ERROR'
    errorMessage.value = e?.data?.detail || 'Error al verificar el pago'
  } finally {
    loading.value = false
  }
})
</script>
