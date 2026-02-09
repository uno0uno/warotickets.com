/**
 * Global Middleware: Promoter Code Tracking
 *
 * Captures WRPROM query parameter and stores in cookie + localStorage
 * Uses last-click attribution model (30 days)
 */
export default defineNuxtRouteMiddleware((to) => {
  // Only run on client side
  if (import.meta.server) return

  const promoterCode = to.query.WRPROM as string | undefined

  // Check if valid promoter code format
  if (promoterCode && promoterCode.startsWith('WRPROM-')) {
    // Store in cookie (30 days)
    const cookie = useCookie('wt_promoter_code', {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    cookie.value = promoterCode

    // Backup in localStorage (survives cookie deletion)
    if (import.meta.client) {
      try {
        localStorage.setItem('wt_promoter_code', promoterCode)
        localStorage.setItem('wt_promoter_code_timestamp', Date.now().toString())
      } catch (e) {
        // Silent fail if localStorage is not available
        console.warn('Failed to store promoter code in localStorage:', e)
      }
    }

    console.log('🎯 Promoter code tracked:', promoterCode)
  }
})
