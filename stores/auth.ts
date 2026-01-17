import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  phone?: string
}

interface Session {
  access_token?: string
  expires_at?: string
}

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value && isSessionValid.value)

  const isSessionValid = computed(() => {
    if (!session.value?.expires_at) return !!user.value
    return new Date(session.value.expires_at) > new Date()
  })

  const displayName = computed(() => {
    if (!user.value) return ''
    return user.value.name || user.value.email.split('@')[0]
  })

  const initials = computed(() => {
    if (!user.value) return ''
    const name = user.value.name || user.value.email
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  })

  async function sendMagicLink(email: string, redirect?: string) {
    isLoading.value = true
    try {
      await $fetch('/api/auth/sign-in-magic-link', {
        method: 'POST',
        body: { email, redirect },
        credentials: 'include'
      })
      return { success: true }
    } catch (error: any) {
      const message = error?.data?.detail || error?.message || 'Error al enviar el codigo'
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  async function verifyCode(email: string, code: string) {
    isLoading.value = true
    try {
      const response = await $fetch<{
        success: boolean
        user_id?: string
        email?: string
        name?: string
      }>('/api/auth/verify-code', {
        method: 'POST',
        body: { email, code },
        credentials: 'include'
      })

      if (response.success && response.user_id) {
        user.value = {
          id: response.user_id,
          email: response.email || email,
          name: response.name || ''
        }
      }

      return { success: true }
    } catch (error: any) {
      const message = error?.data?.detail || error?.message || 'Codigo invalido o expirado'
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSession() {
    try {
      const response = await $fetch<{
        success: boolean
        user?: {
          id: string
          email: string
          name?: string
          createdAt?: string
        }
        session?: {
          expiresAt?: string
          createdAt?: string
          tenantId?: string
        }
        currentTenant?: {
          id: string
          name: string
          slug: string
        }
      }>('/api/auth/session', {
        credentials: 'include'
      })

      if (response.success && response.user) {
        user.value = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || ''
        }
        if (response.session) {
          session.value = {
            expires_at: response.session.expiresAt
          }
        }
        return true
      }
      return false
    } catch {
      user.value = null
      session.value = null
      return false
    }
  }

  async function logout() {
    const uiStore = useUIStore()
    uiStore.showLoading('Cerrando sesion')

    try {
      await $fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include'
      })
    } catch {
      // Ignore errors on logout
    } finally {
      user.value = null
      session.value = null
      uiStore.hideLoading()
    }
  }

  function clearSession() {
    user.value = null
    session.value = null
  }

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    isSessionValid,
    displayName,
    initials,
    sendMagicLink,
    verifyCode,
    fetchSession,
    logout,
    clearSession
  }
})
