/**
 * Composable: Promoter Code Tracking
 *
 * Helper functions to read/write promoter codes and add to API requests
 */
export const usePromoterTracking = () => {
  /**
   * Get currently stored promoter code from cookie or localStorage
   */
  const getPromoterCode = (): string | null => {
    if (import.meta.server) return null

    // Try cookie first
    const cookie = useCookie('wt_promoter_code')
    if (cookie.value) return cookie.value as string

    // Fallback to localStorage
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem('wt_promoter_code')
        const timestamp = localStorage.getItem('wt_promoter_code_timestamp')

        if (stored && timestamp) {
          const age = Date.now() - parseInt(timestamp)
          const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days in ms

          // Check if still valid
          if (age < maxAge) {
            return stored
          } else {
            // Clear expired code
            localStorage.removeItem('wt_promoter_code')
            localStorage.removeItem('wt_promoter_code_timestamp')
          }
        }
      } catch (e) {
        console.warn('Failed to read promoter code from localStorage:', e)
      }
    }

    return null
  }

  /**
   * Get headers object with promoter code for API requests
   */
  const getPromoterHeaders = (): Record<string, string> => {
    const code = getPromoterCode()
    if (!code) return {}

    return {
      'X-Promoter-Ref': code
    }
  }

  /**
   * Clear promoter code (for testing or manual removal)
   */
  const clearPromoterCode = () => {
    // Clear cookie
    const cookie = useCookie('wt_promoter_code')
    cookie.value = null

    // Clear localStorage
    if (import.meta.client) {
      try {
        localStorage.removeItem('wt_promoter_code')
        localStorage.removeItem('wt_promoter_code_timestamp')
      } catch (e) {
        console.warn('Failed to clear promoter code from localStorage:', e)
      }
    }
  }

  return {
    getPromoterCode,
    getPromoterHeaders,
    clearPromoterCode
  }
}
