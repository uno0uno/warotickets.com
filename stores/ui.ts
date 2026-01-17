import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  // Global loading state
  const isLoading = ref(false)
  const loadingMessage = ref('')

  // Show loading overlay
  function showLoading(message: string = 'Cargando...') {
    loadingMessage.value = message
    isLoading.value = true
  }

  // Hide loading overlay
  function hideLoading() {
    isLoading.value = false
    loadingMessage.value = ''
  }

  // Execute async function with loading state
  async function withLoading<T>(
    fn: () => Promise<T>,
    message: string = 'Cargando...'
  ): Promise<T> {
    showLoading(message)
    try {
      return await fn()
    } finally {
      hideLoading()
    }
  }

  return {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    withLoading
  }
})
