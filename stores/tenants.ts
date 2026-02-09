import { defineStore } from 'pinia'

export interface Tenant {
  id: string
  name: string
  slug: string
}

export const useTenantsStore = defineStore('tenants', () => {
  // State
  const tenants = ref<Tenant[]>([])
  const selectedTenant = ref<Tenant | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Global tenant change counter - increments when tenant changes
  const tenantChangeCounter = ref(0)

  // Getters
  const hasTenants = computed(() => tenants.value.length > 0)
  const selectedTenantSlug = computed(() => selectedTenant.value?.slug || null)

  // Actions
  const fetchUserTenants = async (showGlobalLoading = false) => {
    isLoading.value = true
    error.value = null

    const uiStore = useUIStore()
    if (showGlobalLoading) {
      uiStore.showLoading('Cargando tenants')
    }

    try {
      // Fetch tenants first
      const tenantsResponse = await $fetch<{ success: boolean; data: Tenant[]; message?: string }>('/api/tenants/user-tenants', {
        credentials: 'include'
      })

      if (tenantsResponse.success && tenantsResponse.data) {
        tenants.value = tenantsResponse.data

        // Try to get current tenant from session (may fail if no tenant selected yet)
        try {
          const sessionResponse = await $fetch<{ success: boolean; currentTenant?: Tenant }>('/api/auth/session', {
            credentials: 'include'
          })

          if (sessionResponse.success && sessionResponse.currentTenant) {
            const currentTenant = tenants.value.find(t => t.id === sessionResponse.currentTenant!.id)
            if (currentTenant) {
              selectedTenant.value = currentTenant
            }
          }
        } catch {
          // Use first tenant as fallback
        }

        // Fallback to first tenant if none selected
        if (!selectedTenant.value && tenants.value.length > 0) {
          selectedTenant.value = tenants.value[0]
        }
      } else {
        error.value = tenantsResponse.message || 'Error loading tenants'
      }
    } catch (err: any) {
      error.value = err?.data?.detail || err.message || 'Failed to fetch tenants'
    } finally {
      isLoading.value = false
      if (showGlobalLoading) {
        uiStore.hideLoading()
      }
    }
  }

  const selectTenant = async (tenant: Tenant) => {
    // Check if already on the selected tenant
    if (selectedTenant.value?.slug === tenant.slug) {
      return true
    }

    // Check if already loading to prevent concurrent calls
    if (isLoading.value) {
      return false
    }

    // Get UI store for global loading
    const uiStore = useUIStore()

    isLoading.value = true
    error.value = null
    uiStore.showLoading(`Cambiando a ${tenant.name}`)

    try {
      const response = await $fetch<{ success: boolean; message?: string }>('/api/auth/switch-tenant', {
        method: 'POST',
        credentials: 'include',
        body: { tenantSlug: tenant.slug }
      })

      if (response.success) {
        selectedTenant.value = tenant
        tenantChangeCounter.value++ // Increment counter to trigger reactivity globally
        // Re-fetch session to update role for the new tenant
        const authStore = useAuthStore()
        await authStore.fetchSession()
        return true
      } else {
        error.value = response.message || 'Error switching tenant'
        return false
      }
    } catch (err: any) {
      error.value = err?.data?.detail || err.message || 'Failed to switch tenant'
      return false
    } finally {
      isLoading.value = false
      uiStore.hideLoading()
    }
  }

  const selectTenantBySlug = async (slug: string) => {
    const tenant = tenants.value.find(t => t.slug === slug)
    if (tenant) {
      return await selectTenant(tenant)
    }
    return false
  }

  const clearTenants = () => {
    tenants.value = []
    selectedTenant.value = null
    error.value = null
  }

  return {
    // State
    tenants,
    selectedTenant,
    isLoading,
    error,
    tenantChangeCounter,

    // Getters
    hasTenants,
    selectedTenantSlug,

    // Actions
    fetchUserTenants,
    selectTenant,
    selectTenantBySlug,
    clearTenants
  }
})
