<template>
  <div class="flex w-screen h-screen overflow-hidden">
    <div class="relative flex items-center justify-center w-full h-full px-6 sm:px-12 md:px-16 py-8 md:py-12 bg-[hsl(220,14%,97%)]">
      <!-- Background pattern -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
        <div class="mb-8 md:mb-16 flex justify-center">
          <span class="text-2xl font-bold text-primary-600">WaRo Tickets</span>
        </div>

        <!-- Verificando invitación -->
        <div v-if="verifying" class="text-center">
          <div class="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center bg-primary-600/10">
            <div class="w-8 h-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
          </div>
          <h1 class="text-2xl font-bold mb-2 text-gray-900">Aceptando invitación</h1>
          <p class="text-base text-gray-600">Por favor espera mientras validamos tu invitación...</p>
        </div>

        <!-- Invitación aceptada exitosamente -->
        <div v-else-if="success" class="text-center">
          <div class="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold mb-2 text-gray-900">¡Bienvenido al equipo!</h1>
          <p class="text-base mb-2 text-gray-600">
            Hola <strong>{{ userName }}</strong>, tu invitación ha sido aceptada correctamente.
          </p>
          <p class="text-sm mb-6 text-gray-500">
            Serás redirigido al dashboard en unos segundos...
          </p>
          <div class="w-full rounded-full h-2 bg-gray-200">
            <div class="h-2 rounded-full transition-all duration-300 bg-primary-600"
              :style="{ width: `${redirectProgress}%` }"></div>
          </div>
        </div>

        <!-- Error en la invitación -->
        <div v-else-if="error" class="text-center">
          <div class="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center bg-red-100">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold mb-2 text-gray-900">Error de invitación</h1>
          <p class="text-base mb-6 text-gray-600">{{ errorMessage }}</p>

          <div class="space-y-3">
            <NuxtLink
              to="/auth/login"
              class="w-full py-3 px-6 rounded-lg text-base font-medium transition-all inline-block text-center bg-primary-600 text-white hover:bg-primary-700"
            >
              Ir al inicio de sesión
            </NuxtLink>

            <p class="text-xs text-gray-500">
              Si el problema persiste, contacta al administrador que te envió la invitación
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

useHead({ title: 'Aceptar Invitación - WaRo Tickets' })

const route = useRoute()

// Reactive states
const verifying = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const redirectProgress = ref(0)
const userName = ref('')

// Get token from URL
const token = route.query.token

// Ticket emojis for background
const ticketEmojis = [
  '🎫', '🎤', '🎵', '🎶', '🎸', '🥁', '🎹', '🎺', '🎷', '🎻',
  '🎪', '🎭', '🎬', '🎟️', '🎊', '🎉', '🎈', '🎆', '🎇', '⭐',
  '🌟', '✨', '🔥', '💫', '🎯', '🎲', '🎰', '🎳', '🏟️', '🎠'
]

const bgItems = computed(() => {
  const items = []
  const cols = 12
  const rows = 8
  const size = 100

  for (let i = 0; i < cols * rows; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const emoji = ticketEmojis[i % ticketEmojis.length]

    const offsetX = ((i * 7) % 30) - 15
    const offsetY = ((i * 13) % 30) - 15

    items.push({
      emoji,
      style: {
        left: `${(col * size) + (size / 2) + offsetX}px`,
        top: `${(row * size) + (size / 2) + offsetY}px`
      }
    })
  }
  return items
})

// Accept invitation
const acceptInvitation = async () => {
  try {
    if (!token) {
      throw new Error('Token de invitación faltante en la URL')
    }

    const response = await $fetch('/api/invitations/accept', {
      method: 'POST',
      body: { token },
      credentials: 'include'
    })

    if (!response.success) {
      throw new Error(response.message || 'Error al aceptar la invitación')
    }

    // Save user name for welcome message
    userName.value = response.user?.name || 'Usuario'

    // Mark as success
    verifying.value = false
    success.value = true

    // Animate progress bar and redirect
    const progressInterval = setInterval(() => {
      redirectProgress.value += 10
      if (redirectProgress.value >= 100) {
        clearInterval(progressInterval)
        setTimeout(() => {
          navigateTo('/gestion/')
        }, 500)
      }
    }, 200)

  } catch (err) {
    console.error('Error accepting invitation:', err)

    verifying.value = false
    error.value = true

    if (err.message?.includes('expirada') || err.message?.includes('expired')) {
      errorMessage.value = 'La invitación ha expirado. Solicita una nueva invitación al administrador.'
    } else if (err.message?.includes('inválida') || err.message?.includes('invalid') || err.message?.includes('no encontrada')) {
      errorMessage.value = 'La invitación es inválida o ya fue utilizada.'
    } else if (err.message?.includes('faltante')) {
      errorMessage.value = 'El enlace de invitación está incompleto.'
    } else {
      errorMessage.value = err.data?.detail || err.data?.message || err.message || 'Error al aceptar la invitación. Inténtalo nuevamente.'
    }
  }
}

// Accept on mount with small delay for UX
onMounted(() => {
  setTimeout(() => {
    acceptInvitation()
  }, 1000)
})
</script>

<style scoped>
.bg-item {
  position: absolute;
  font-size: 50px;
  opacity: 0.08;
  filter: grayscale(100%) brightness(0.7);
  transform: translate(-50%, -50%);
}
</style>
