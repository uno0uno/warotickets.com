<template>
  <div class="flex w-screen h-screen overflow-hidden">
    <div class="relative flex items-center justify-center w-full h-full px-6 sm:px-12 md:px-16 py-8 md:py-12 bg-secondary-50">
      <!-- Fondo de emojis -->
      <div ref="bgContainer" class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          v-for="(item, index) in bgItems"
          :key="index"
          class="bg-item"
          :style="item.style"
        >
          {{ item.emoji }}
        </div>
      </div>

      <div class="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <!-- Logo -->
        <div class="mb-8 md:mb-12 flex justify-center">
          <NuxtLink to="/" class="flex items-center gap-2">
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

        <!-- Contenido del login -->
        <div>
          <!-- Verificando sesion -->
          <div v-if="checkingSession" class="text-center space-y-4">
            <div class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
            <p class="text-sm text-secondary-600">Verificando sesion</p>
          </div>

          <!-- Formulario de email -->
          <div v-else-if="!emailSent" class="text-center">
            <h1 class="text-2xl md:text-3xl font-bold text-secondary-900 mb-3">Iniciar sesion</h1>
            <p class="text-secondary-600 mb-8">
              Ingresa tu email para recibir un codigo de acceso seguro.
            </p>

            <form @submit.prevent="handleSubmit">
              <div class="mb-6 text-left">
                <label for="email" class="block text-xs font-semibold text-secondary-700 mb-2">
                  Direccion de Email
                </label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  :disabled="loading"
                  class="w-full px-4 py-3 rounded-lg text-base border-2 border-secondary-200 bg-white text-secondary-900 transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="tu@correo.com"
                />
              </div>

              <button
                type="submit"
                :disabled="loading || !email"
                class="w-full px-6 py-3 rounded-lg text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary-600 text-white hover:bg-primary-700"
              >
                <span v-if="loading" class="flex items-center justify-center gap-2">
                  <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Enviando
                </span>
                <span v-else>Siguiente</span>
              </button>
            </form>
          </div>

          <!-- Codigo de Verificacion -->
          <div v-else class="text-center">
            <h1 class="text-2xl md:text-3xl font-bold text-secondary-900 mb-3">Revisa tu correo</h1>
            <p class="text-secondary-600 mb-2">
              Hemos enviado un enlace de acceso a:
            </p>
            <p class="text-base font-medium text-secondary-900 mb-6">
              {{ email }}
            </p>

            <div class="rounded-lg p-4 mb-6 bg-secondary-100 border border-secondary-200">
              <p class="text-sm text-secondary-600">
                Abre el email y haz clic en el enlace para iniciar sesion. El enlace es valido por 15 minutos.
              </p>
            </div>

            <!-- Separador -->
            <div class="relative my-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-secondary-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-secondary-500">O usa el codigo de verificacion</span>
              </div>
            </div>

            <!-- Input de codigo -->
            <div class="space-y-6">
              <input
                v-model="verificationCode"
                type="text"
                placeholder="123456"
                maxlength="6"
                :disabled="verifyingCode"
                @keyup.enter="verifyCode"
                class="w-full text-center text-2xl tracking-widest font-mono px-4 py-3.5 rounded-lg transition-all border-2 border-secondary-200 bg-white text-secondary-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none"
              />

              <button
                @click="verifyCode"
                :disabled="!verificationCode || verificationCode.length !== 6 || verifyingCode"
                class="w-full py-3 rounded-lg text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary-600 text-white hover:bg-primary-700"
              >
                <span v-if="verifyingCode" class="flex items-center justify-center gap-2">
                  <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Verificando
                </span>
                <span v-else>Verificar Codigo</span>
              </button>
            </div>

            <div class="text-center mt-8">
              <p class="text-sm text-secondary-600">
                No recibiste el email?
                <button
                  @click="emailSent = false; verificationCode = ''"
                  type="button"
                  class="font-medium ml-1 text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Reenviar
                </button>
              </p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-5 rounded-lg p-4 bg-red-50 border border-red-200">
            <div class="flex items-start gap-3">
              <svg class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-red-700">Error de autenticacion</p>
                <p class="text-sm text-red-600 mt-1">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

useHead({ title: 'Iniciar Sesion - WaRo Tickets' })

const authStore = useAuthStore()
const route = useRoute()

const email = ref('')
const loading = ref(false)
const error = ref('')
const checkingSession = ref(true)
const emailSent = ref(false)
const verificationCode = ref('')
const verifyingCode = ref(false)

// Emojis de eventos/tickets
const eventEmojis = [
  '🎫', '🎟️', '🎪', '🎭', '🎬', '🎤', '🎧', '🎵', '🎶', '🎸',
  '🥁', '🎹', '🎺', '🎻', '🪗', '🎯', '🎰', '🎲', '🎳', '🎮',
  '🏟️', '🎡', '🎢', '🎠', '🎪', '🍿', '🥤', '🎉', '🎊', '✨',
  '🌟', '⭐', '💫', '🔥', '💥', '🎆', '🎇', '🪩', '🕺', '💃'
]

const bgContainer = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)

const bgItems = computed(() => {
  if (containerWidth.value === 0 || containerHeight.value === 0) return []

  const size = 100
  const cols = Math.ceil(containerWidth.value / size)
  const rows = Math.ceil(containerHeight.value / size)
  const totalItems = cols * rows

  const items = []
  for (let i = 0; i < totalItems; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols

    const emoji = eventEmojis[Math.floor(Math.random() * eventEmojis.length)]
    const randomOffsetX = (Math.random() - 0.5) * size * 0.6
    const randomOffsetY = (Math.random() - 0.5) * size * 0.6

    const left = (col * size) + (size / 2) + randomOffsetX
    const top = (row * size) + (size / 2) + randomOffsetY

    items.push({
      emoji,
      style: {
        left: `${left}px`,
        top: `${top}px`
      }
    })
  }

  return items
})

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  // Setup emoji background
  if (bgContainer.value) {
    const rect = bgContainer.value.getBoundingClientRect()
    containerWidth.value = rect.width
    containerHeight.value = rect.height

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width
        containerHeight.value = entry.contentRect.height
      }
    })

    resizeObserver.observe(bgContainer.value)
  }

  // Check existing session
  try {
    const hasSession = await authStore.fetchSession()
    if (hasSession) {
      const redirectUrl = route.query.redirect as string
      if (redirectUrl) {
        await navigateTo(redirectUrl)
      } else {
        // Smart redirect: check if user has tenants
        const tenantsStore = useTenantsStore()
        await tenantsStore.fetchUserTenants()
        if (tenantsStore.hasTenants) {
          await navigateTo('/gestion/eventos')
        } else {
          await navigateTo('/mis-boletas')
        }
      }
      return
    }
  } catch {
    // No valid session
  } finally {
    checkingSession.value = false
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

async function handleSubmit() {
  if (!email.value) return

  loading.value = true
  error.value = ''

  const redirectPath = route.query.redirect as string
  const result = await authStore.sendMagicLink(email.value, redirectPath)

  if (result.success) {
    emailSent.value = true
  } else {
    error.value = result.error || 'Error al enviar el codigo. Verifica que tu email este registrado.'
  }

  loading.value = false
}

async function verifyCode() {
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    error.value = 'Ingresa un codigo de 6 digitos'
    return
  }

  verifyingCode.value = true
  error.value = ''

  const result = await authStore.verifyCode(email.value, verificationCode.value)

  if (result.success) {
    const redirectUrl = route.query.redirect as string
    if (redirectUrl) {
      await navigateTo(redirectUrl)
    } else {
      // Smart redirect: check if user has tenants
      const tenantsStore = useTenantsStore()
      await tenantsStore.fetchUserTenants()
      if (tenantsStore.hasTenants) {
        await navigateTo('/gestion/eventos')
      } else {
        await navigateTo('/mis-boletas')
      }
    }
  } else {
    error.value = result.error || 'Codigo invalido o expirado'
    verifyingCode.value = false
  }
}

watch([email, verificationCode], () => {
  if (error.value) {
    error.value = ''
  }
})
</script>

<style scoped>
.bg-item {
  position: absolute;
  font-size: 50px;
  opacity: 0.06;
  filter: grayscale(100%) brightness(0.6);
  transform: translate(-50%, -50%);
}
</style>
