<template>
  <div class="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
      <!-- Logo -->
      <div class="mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 12V6H4v6h16zm0 2H4v4h16v-4zM3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm3 4h2v2H6V8zm0 6h2v2H6v-2z"/>
            </svg>
          </div>
          <span class="text-xl font-bold font-heading text-secondary-900">
            WaRo<span class="text-primary-600">Tickets</span>
          </span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        <p class="text-secondary-600">Aceptando transferencia...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="space-y-4">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-secondary-900">Boleta aceptada</h2>
        <p class="text-secondary-600">Redirigiendo a tus boletas</p>
      </div>

      <!-- Error State -->
      <div v-else class="space-y-4">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-secondary-900">Error</h2>
        <p class="text-secondary-600">{{ error }}</p>
        <NuxtLink to="/" class="btn-primary inline-flex mt-4">
          Ir al inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

useHead({ title: 'Aceptar transferencia - WaRo Tickets' })

const route = useRoute()

const loading = ref(true)
const success = ref(false)
const error = ref('')

onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    error.value = 'Token no proporcionado'
    loading.value = false
    return
  }

  try {
    // Accept the transfer (public endpoint, no auth needed)
    const result = await $fetch<{ success: boolean; message: string; access_token?: string }>('/api/transfers/accept-public', {
      method: 'POST',
      body: { transfer_token: token },
      credentials: 'include'
    })

    if (result.success && result.access_token) {
      // Auto-login using the access token
      await $fetch('/api/auth/verify', {
        method: 'POST',
        body: { token: result.access_token },
        credentials: 'include'
      })

      success.value = true
      setTimeout(() => {
        navigateTo('/mis-boletas')
      }, 2000)
    } else {
      error.value = result.message || 'Error al aceptar la transferencia'
    }
  } catch (e: any) {
    error.value = e?.data?.detail || 'Token invalido o transferencia expirada'
  } finally {
    loading.value = false
  }
})
</script>
