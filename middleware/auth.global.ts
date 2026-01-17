export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server-side rendering
  if (import.meta.server) return

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/verify',
    '/eventos',
    '/terminos',
    '/privacidad',
    '/nosotros'
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => {
    return to.path === route || to.path.startsWith('/evento/') || to.path.startsWith('/auth/')
  })

  if (isPublicRoute) {
    return
  }

  const authStore = useAuthStore()
  const tenantsStore = useTenantsStore()

  // Check if we already have a valid session in the store
  if (authStore.user && authStore.isSessionValid) {
    // Load tenants if not loaded yet (layout will show loading state)
    if (!tenantsStore.hasTenants && !tenantsStore.isLoading) {
      await tenantsStore.fetchUserTenants()
    }
    return
  }

  try {
    // Fetch session using the store method
    const isValid = await authStore.fetchSession()

    if (isValid) {
      // Load tenants (layout will show loading state)
      await tenantsStore.fetchUserTenants()
    } else {
      // No valid session, redirect to login
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`, {
        replace: true
      })
    }
  } catch {
    authStore.clearSession()
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`, {
      replace: true
    })
  }
})
