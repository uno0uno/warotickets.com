<template>
  <!-- Initial Loading State -->
  <div v-if="initialLoading" class="h-screen w-screen flex items-center justify-center bg-secondary-50">
    <div class="flex flex-col items-center gap-4">
      <span class="loader"></span>
      <p class="text-secondary-600 font-medium transition-opacity duration-300">{{ currentPhrase }}</p>
    </div>
  </div>

  <!-- Dashboard Content -->
  <div v-else class="h-screen flex flex-col lg:flex-row overflow-hidden bg-secondary-50">
    <!-- Sidebar (Desktop) -->
    <DashboardSidebar />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white border-b border-secondary-200 px-4 lg:px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-secondary-900">{{ pageTitle }}</h1>
            <p v-if="pageSubtitle" class="text-sm text-secondary-500 mt-1">{{ pageSubtitle }}</p>
          </div>
          <div v-if="$slots.headerAction" class="hidden lg:block">
            <slot name="headerAction" />
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
        <slot />
      </div>
    </main>

    <!-- Bottom Nav (Mobile) -->
    <DashboardBottomNav />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const tenantsStore = useTenantsStore()

const pageTitle = ref('Dashboard')
const pageSubtitle = ref('')

// Loading phrases for initial load
const sessionPhrases = [
  'Verificando sesion',
  'Preparando tu espacio',
  'Cargando tu perfil',
  'Obteniendo tus datos'
]

const currentPhrase = ref(sessionPhrases[0])
let phraseInterval: ReturnType<typeof setInterval> | null = null
let phraseIndex = 0

// Initial loading state - show loader until we have user and tenants data
const initialLoading = computed(() => {
  return !authStore.user || !tenantsStore.hasTenants
})

// Start phrase rotation (only on client)
function startPhraseRotation() {
  if (import.meta.server) return

  phraseIndex = 0
  currentPhrase.value = sessionPhrases[0]
  phraseInterval = setInterval(() => {
    phraseIndex = (phraseIndex + 1) % sessionPhrases.length
    currentPhrase.value = sessionPhrases[phraseIndex]
  }, 2000)
}

// Stop phrase rotation
function stopPhraseRotation() {
  if (phraseInterval) {
    clearInterval(phraseInterval)
    phraseInterval = null
  }
}

// Start/stop phrase rotation based on loading state (only on client)
onMounted(() => {
  if (initialLoading.value) {
    startPhraseRotation()
  }

  watch(initialLoading, (loading) => {
    if (loading) {
      startPhraseRotation()
    } else {
      stopPhraseRotation()
    }
  })
})

onUnmounted(() => {
  stopPhraseRotation()
})

// Provide functions to child components
provide('setPageTitle', (title: string) => {
  pageTitle.value = title
})

provide('setPageSubtitle', (subtitle: string) => {
  pageSubtitle.value = subtitle
})
</script>

<style scoped>
.loader {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
  position: relative;
  color: #6366f1;
  left: -100px;
  box-sizing: border-box;
  animation: shadowRolling 2s linear infinite;
}

@keyframes shadowRolling {
  0% {
    box-shadow: 0px 0 rgba(99, 102, 241, 0), 0px 0 rgba(99, 102, 241, 0), 0px 0 rgba(99, 102, 241, 0), 0px 0 rgba(99, 102, 241, 0);
  }
  12% {
    box-shadow: 100px 0 #6366f1, 0px 0 rgba(99, 102, 241, 0), 0px 0 rgba(99, 102, 241, 0), 0px 0 rgba(99, 102, 241, 0);
  }
  25% {
    box-shadow: 110px 0 #6366f1, 100px 0 #6366f1, 0px 0 rgba(99, 102, 241, 0), 0px 0 rgba(99, 102, 241, 0);
  }
  36% {
    box-shadow: 120px 0 #6366f1, 110px 0 #6366f1, 100px 0 #6366f1, 0px 0 rgba(99, 102, 241, 0);
  }
  50% {
    box-shadow: 130px 0 #6366f1, 120px 0 #6366f1, 110px 0 #6366f1, 100px 0 #6366f1;
  }
  62% {
    box-shadow: 200px 0 rgba(99, 102, 241, 0), 130px 0 #6366f1, 120px 0 #6366f1, 110px 0 #6366f1;
  }
  75% {
    box-shadow: 200px 0 rgba(99, 102, 241, 0), 200px 0 rgba(99, 102, 241, 0), 130px 0 #6366f1, 120px 0 #6366f1;
  }
  87% {
    box-shadow: 200px 0 rgba(99, 102, 241, 0), 200px 0 rgba(99, 102, 241, 0), 200px 0 rgba(99, 102, 241, 0), 130px 0 #6366f1;
  }
  100% {
    box-shadow: 200px 0 rgba(99, 102, 241, 0), 200px 0 rgba(99, 102, 241, 0), 200px 0 rgba(99, 102, 241, 0), 200px 0 rgba(99, 102, 241, 0);
  }
}
</style>
