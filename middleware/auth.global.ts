export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server-side rendering
  if (import.meta.server) return

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/verify',
    '/eventos',
    '/organizadores',
    '/terminos',
    '/privacidad',
    '/nosotros',
    '/carrito',
    '/checkout'
  ]

  // Define public prefixes
  const publicPrefixes = [
    '/eventos/',
    '/auth/',
    '/pago/'
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => to.path === route) ||
    publicPrefixes.some(prefix => to.path.startsWith(prefix))

  if (isPublicRoute) {
    return
  }

  const authStore = useAuthStore()
  const tenantsStore = useTenantsStore()
  const uiStore = useUIStore()

  // Routes that require auth but NOT tenant (buyer routes)
  const buyerRoutes = ['/mis-boletas']
  const isBuyerRoute = buyerRoutes.some(route => to.path.startsWith(route))

  if (isBuyerRoute) {
    // Verify authentication, do NOT require tenants but load them for sidebar
    if (authStore.user && authStore.isSessionValid) {
      if (!tenantsStore.hasTenants && !tenantsStore.isLoading) {
        tenantsStore.fetchUserTenants()
      }
      return
    }

    uiStore.showLoading(undefined, 'session')
    try {
      const isValid = await authStore.fetchSession()
      if (isValid) {
        tenantsStore.fetchUserTenants()
        uiStore.hideLoading()
        return
      }
    } catch {
      // fall through to redirect
    }
    uiStore.hideLoading()
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`, {
      replace: true
    })
  }

  // Management routes - require auth + tenant
  // Check if we already have a valid session in the store
  if (authStore.user && authStore.isSessionValid) {
    // Load tenants if not loaded yet
    if (!tenantsStore.hasTenants && !tenantsStore.isLoading) {
      uiStore.showLoading(undefined, 'session')
      try {
        await tenantsStore.fetchUserTenants()
      } finally {
        uiStore.hideLoading()
      }
    }
    return
  }

  // Show loading overlay during session verification
  uiStore.showLoading(undefined, 'session')

  try {
    // Fetch session using the store method
    const isValid = await authStore.fetchSession()

    if (isValid) {
      // Load tenants
      await tenantsStore.fetchUserTenants()
      uiStore.hideLoading()
    } else {
      // No valid session, redirect to login
      uiStore.hideLoading()
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`, {
        replace: true
      })
    }
  } catch {
    uiStore.hideLoading()
    authStore.clearSession()
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`, {
      replace: true
    })
  }
})
