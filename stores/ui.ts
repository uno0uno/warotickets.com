import { defineStore } from 'pinia'

// Frases de carga contextuales
const loadingPhrases = {
  default: [
    'Cargando',
    'Un momento',
    'Preparando todo',
    'Casi listo'
  ],
  session: [
    'Verificando sesion',
    'Preparando tu espacio',
    'Cargando tu perfil'
  ],
  events: [
    'Cargando eventos',
    'Obteniendo tus eventos',
    'Preparando el calendario'
  ],
  saving: [
    'Guardando cambios',
    'Procesando',
    'Actualizando datos'
  ]
}

export type LoadingContext = keyof typeof loadingPhrases

export const useUIStore = defineStore('ui', () => {
  // Global loading state
  const isLoading = ref(false)
  const loadingMessage = ref('')
  const loadingContext = ref<LoadingContext>('default')

  let phraseInterval: ReturnType<typeof setInterval> | null = null
  let phraseIndex = 0

  // Get random phrase from context
  function getPhrase(context: LoadingContext): string {
    const phrases = loadingPhrases[context] || loadingPhrases.default
    return phrases[Math.floor(Math.random() * phrases.length)]
  }

  // Start rotating phrases
  function startPhraseRotation(context: LoadingContext) {
    const phrases = loadingPhrases[context] || loadingPhrases.default
    phraseIndex = 0
    loadingMessage.value = phrases[0]

    // Rotate every 2 seconds if loading takes long
    phraseInterval = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length
      loadingMessage.value = phrases[phraseIndex]
    }, 2500)
  }

  // Stop rotating phrases
  function stopPhraseRotation() {
    if (phraseInterval) {
      clearInterval(phraseInterval)
      phraseInterval = null
    }
  }

  // Show loading overlay with optional context for rotating phrases
  function showLoading(message?: string, context: LoadingContext = 'default') {
    loadingContext.value = context

    if (message) {
      // Use specific message without rotation
      loadingMessage.value = message
    } else {
      // Use context phrases with rotation
      startPhraseRotation(context)
    }

    isLoading.value = true
  }

  // Hide loading overlay
  function hideLoading() {
    stopPhraseRotation()
    isLoading.value = false
    loadingMessage.value = ''
  }

  // Execute async function with loading state
  async function withLoading<T>(
    fn: () => Promise<T>,
    message?: string,
    context: LoadingContext = 'default'
  ): Promise<T> {
    showLoading(message, context)
    try {
      return await fn()
    } finally {
      hideLoading()
    }
  }

  return {
    isLoading,
    loadingMessage,
    loadingContext,
    showLoading,
    hideLoading,
    withLoading,
    getPhrase
  }
})
