<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">

      <!-- Encabezado -->
      <div class="text-center mb-10">
        <NuxtLink to="/" class="inline-block mb-8" aria-label="Volver al inicio">
          <img src="/waro_tickets_logo.png" alt="WaRo Tickets" class="h-10 mx-auto" />
        </NuxtLink>
        <h1 class="text-3xl font-bold font-heading text-secondary-900 mb-3">
          Solicita acceso
        </h1>
        <p class="text-base text-secondary-600 leading-relaxed">
          Déjanos tu correo y teléfono. Nos ponemos en contacto contigo para activar tu cuenta de organizador.
        </p>
      </div>

      <!-- Formulario -->
      <form
        v-if="!submitted"
        class="space-y-5"
        @submit.prevent="handleSubmit"
        novalidate
      >
        <!-- Email -->
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-sm font-semibold text-secondary-700">
            Correo electrónico <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            placeholder="tu@correo.com"
            class="input-field"
            :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-400/20': errors.email }"
            required
          />
          <span v-if="errors.email" class="flex items-center gap-1.5 text-sm text-red-600" role="alert">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ errors.email }}
          </span>
        </div>

        <!-- Teléfono -->
        <div class="flex flex-col gap-1.5">
          <label for="phone" class="text-sm font-semibold text-secondary-700">
            Teléfono / WhatsApp <span class="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            placeholder="300 123 4567"
            class="input-field"
            :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-400/20': errors.phone }"
            required
          />
          <span v-if="errors.phone" class="flex items-center gap-1.5 text-sm text-red-600" role="alert">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ errors.phone }}
          </span>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn-primary w-full justify-center min-h-[48px] text-base mt-2"
          :disabled="loading"
          :class="{ 'opacity-60 cursor-not-allowed': loading }"
        >
          <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span>{{ loading ? 'Enviando…' : 'Enviar solicitud' }}</span>
        </button>
      </form>

      <!-- Estado de éxito -->
      <div
        v-else
        class="border border-secondary-100 rounded-2xl p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div class="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold font-heading text-secondary-900 mb-2">¡Solicitud enviada!</h2>
        <p class="text-base text-secondary-600 leading-relaxed mb-6">
          Recibimos tu información. Nos pondremos en contacto contigo pronto para activar tu cuenta.
        </p>
        <NuxtLink to="/organizadores" class="btn-secondary text-sm min-h-[44px]">
          Volver
        </NuxtLink>
      </div>

      <!-- Nota de privacidad -->
      <p class="text-center text-xs text-secondary-400 mt-6 leading-relaxed">
        Solo usamos tu información para contactarte. No enviamos correo no deseado.
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({ email: '', phone: '' })
const errors = reactive({ email: '', phone: '' })
const loading = ref(false)
const submitted = ref(false)

function validate(): boolean {
  errors.email = ''
  errors.phone = ''

  if (!form.email.trim()) {
    errors.email = 'El correo es obligatorio.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresa un correo válido.'
  }

  if (!form.phone.trim()) {
    errors.phone = 'El teléfono es obligatorio.'
  } else if (form.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Ingresa un número válido.'
  }

  return !errors.email && !errors.phone
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  try {
    const res = await fetch('/api/leads/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, phone: form.phone }),
    })
    if (!res.ok) throw new Error(`${res.status}`)
    submitted.value = true
  } catch {
    errors.email = 'Ocurrió un error al enviar tu solicitud. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Solicitar acceso — WaRo Tickets',
  meta: [
    { name: 'description', content: 'Solicita acceso para gestionar tus eventos con WaRo Tickets.' }
  ]
})
</script>
