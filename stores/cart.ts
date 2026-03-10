import { defineStore } from 'pinia'

interface CartItem {
  id: string
  areaId: number
  areaName: string
  quantity: number        // Bundles/combos seleccionados
  ticketsCount: number    // Total boletas (calculado en tiempo real)
  unitPrice: number       // Precio por boleta con descuento (calculado)
  bundlePrice: number | null  // Precio bundle (si aplica)
  originalPrice: number   // Precio original
  subtotal: number        // Total del item (calculado)
  bundleSize: number      // Tamano del bundle (calculado)
  serviceFeePerTicket: number  // Fee de servicio por boleta
  serviceFeeTotal: number      // Fee total del item
  stageName: string | null
  stageId: string | null
  stageStatus: 'active' | 'none'  // Estado del stage actual
  promotionId: string | null    // ID de promocion si es parte de un paquete
  promotionName: string | null  // Nombre de la promocion
  ticketsPerPackage: number | null  // Boletas de esta area por combo (solo promos)
}

interface ConvertedPromotion {
  promotionName: string
  reason: string
  itemsConverted: number
}

interface Cart {
  id: string
  clusterId: number
  clusterName: string
  clusterSlug: string
  status: string
  items: CartItem[]
  subtotal: number
  discount: number
  serviceFee: number      // Total fee de servicio Waro
  total: number
  ticketsCount: number
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  convertedPromotions: ConvertedPromotion[]  // Promociones que fueron convertidas
}

interface CartSummary {
  cartId: string | null
  itemsCount: number
  ticketsCount: number
  total: number
}

interface CheckoutData {
  customerEmail: string
  customerName?: string
  customerPhone?: string
  acceptTerms?: boolean
  returnUrl?: string
}

interface CheckoutResponse {
  reservationId: string
  paymentId: string
  checkoutUrl: string
  amount: number
  currency: string
  expiresAt: string
}

export const useCartStore = defineStore('cart', () => {
  const { getPromoterHeaders } = usePromoterTracking()

  // State
  const cart = ref<Cart | null>(null)
  const summary = ref<CartSummary>({
    cartId: null,
    itemsCount: 0,
    ticketsCount: 0,
    total: 0
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const sessionId = ref<string | null>(null)

  // Getters
  const isEmpty = computed(() => !cart.value || cart.value.items.length === 0)
  const totalItems = computed(() => cart.value?.items.length ?? 0)
  const totalTickets = computed(() => cart.value?.ticketsCount ?? 0)
  const subtotal = computed(() => cart.value?.subtotal ?? 0)
  const discount = computed(() => cart.value?.discount ?? 0)
  const serviceFee = computed(() => cart.value?.serviceFee ?? 0)
  const total = computed(() => cart.value?.total ?? 0)

  // Generate or get session ID
  function getSessionId(): string {
    if (sessionId.value) return sessionId.value

    // Check localStorage
    if (import.meta.client) {
      const stored = localStorage.getItem('cart_session_id')
      if (stored) {
        sessionId.value = stored
        return stored
      }

      // Generate new
      const newId = crypto.randomUUID()
      localStorage.setItem('cart_session_id', newId)
      sessionId.value = newId
      return newId
    }

    return ''
  }

  // Transform API response to cart
  function transformCart(data: any): Cart {
    return {
      id: data.id,
      clusterId: data.cluster_id,
      clusterName: data.cluster_name,
      clusterSlug: data.cluster_slug,
      status: data.status,
      items: data.items.map((item: any) => ({
        id: item.id,
        areaId: item.area_id,
        areaName: item.area_name,
        quantity: item.quantity,
        ticketsCount: item.tickets_count,
        unitPrice: parseFloat(item.unit_price),
        bundlePrice: item.bundle_price ? parseFloat(item.bundle_price) : null,
        originalPrice: parseFloat(item.original_price),
        subtotal: parseFloat(item.subtotal),
        bundleSize: item.bundle_size,
        serviceFeePerTicket: parseFloat(item.service_fee_per_ticket || 0),
        serviceFeeTotal: parseFloat(item.service_fee_total || 0),
        stageName: item.stage_name,
        stageId: item.stage_id,
        stageStatus: item.stage_status || 'none',
        promotionId: item.promotion_id || null,
        promotionName: item.promotion_name || null,
        ticketsPerPackage: item.tickets_per_package || null
      })),
      subtotal: parseFloat(data.subtotal),
      discount: parseFloat(data.discount),
      serviceFee: parseFloat(data.service_fee || 0),
      total: parseFloat(data.total),
      ticketsCount: data.tickets_count,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      convertedPromotions: (data.converted_promotions || []).map((cp: any) => ({
        promotionName: cp.promotion_name,
        reason: cp.reason,
        itemsConverted: cp.items_converted
      }))
    }
  }

  // Fetch cart summary (for header icon)
  async function fetchSummary() {
    try {
      const response = await $fetch<any>('/api/cart/summary', {
        headers: {
          'X-Session-Id': getSessionId()
        },
        credentials: 'include'
      })

      summary.value = {
        cartId: response.cart_id,
        itemsCount: response.items_count,
        ticketsCount: response.tickets_count,
        total: parseFloat(response.total)
      }
    } catch {
      // No cart exists, that's fine
      summary.value = {
        cartId: null,
        itemsCount: 0,
        ticketsCount: 0,
        total: 0
      }
    }
  }

  // Fetch full cart by ID
  async function fetchCart(cartId: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<any>(`/api/cart/${cartId}`, {
        credentials: 'include'
      })

      cart.value = transformCart(response)
      return cart.value
    } catch (e: any) {
      error.value = e?.data?.detail || 'Error al cargar el carrito'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Create or get cart and add initial items
  async function createCart(clusterId: number, items?: { areaId: number; quantity: number }[]) {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<any>('/api/cart', {
        method: 'POST',
        headers: {
          'X-Session-Id': getSessionId(),
          ...getPromoterHeaders()
        },
        body: {
          cluster_id: clusterId,
          items: items?.map(i => ({
            area_id: i.areaId,
            quantity: i.quantity
          }))
        },
        credentials: 'include'
      })

      cart.value = transformCart(response)
      await fetchSummary()
      return cart.value
    } catch (e: any) {
      error.value = e?.data?.detail || 'Error al crear el carrito'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Add item to cart
  async function addItem(clusterId: number, areaId: number, quantity: number = 1) {
    isLoading.value = true
    error.value = null

    try {
      // If no cart exists, create one
      if (!cart.value) {
        return await createCart(clusterId, [{ areaId, quantity }])
      }

      // If cart exists but for different event, clear and create new
      if (cart.value.clusterId !== clusterId) {
        await clearCart()
        return await createCart(clusterId, [{ areaId, quantity }])
      }

      // Add to existing cart
      const response = await $fetch<any>(`/api/cart/${cart.value.id}/items`, {
        method: 'POST',
        body: {
          area_id: areaId,
          quantity
        },
        credentials: 'include'
      })

      cart.value = transformCart(response)
      await fetchSummary()
      return cart.value
    } catch (e: any) {
      error.value = e?.data?.detail || 'Error al agregar al carrito'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Update item quantity
  async function updateQuantity(areaId: number, quantity: number) {
    if (!cart.value) return null

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<any>(`/api/cart/${cart.value.id}/items/${areaId}`, {
        method: 'PATCH',
        body: { quantity },
        credentials: 'include'
      })

      cart.value = transformCart(response)
      await fetchSummary()
      return cart.value
    } catch (e: any) {
      error.value = e?.data?.detail || 'Error al actualizar cantidad'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Remove item from cart
  async function removeItem(areaId: number) {
    if (!cart.value) return null

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<any>(`/api/cart/${cart.value.id}/items/${areaId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      cart.value = transformCart(response)
      await fetchSummary()
      return cart.value
    } catch (e: any) {
      error.value = e?.data?.detail || 'Error al eliminar item'
      return null
    } finally {
      isLoading.value = false
    }
  }


  // Add promotion package (replaces cart with promo items)
  async function addPromotionPackage(clusterId: number, promotionId: string, quantity: number = 1) {
    isLoading.value = true
    error.value = null

    try {
      // If no cart exists, create one first
      if (!cart.value || cart.value.clusterId !== clusterId) {
        const createResponse = await $fetch<any>('/api/cart', {
          method: 'POST',
          headers: {
            'X-Session-Id': getSessionId(),
            ...getPromoterHeaders()
          },
          body: { cluster_id: clusterId },
          credentials: 'include'
        })
        cart.value = transformCart(createResponse)
      }

      // Add promotion package with quantity
      const response = await $fetch<any>(`/api/cart/${cart.value!.id}/promotion-package/${promotionId}`, {
        method: 'POST',
        body: { quantity },
        credentials: 'include'
      })

      cart.value = transformCart(response)
      await fetchSummary()
      return { success: true }
    } catch (e: any) {
      const message = e?.data?.detail || 'Error al agregar el paquete promocional'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }


  // Remove promotion package from cart
  async function removePromotionPackage(promotionId: string) {
    if (!cart.value) return null

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<any>(`/api/cart/${cart.value.id}/promotion-package/${promotionId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      cart.value = transformCart(response)
      await fetchSummary()
      return cart.value
    } catch (e: any) {
      error.value = e?.data?.detail || 'Error al quitar el paquete'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Checkout - convert cart to reservation and get payment URL
  async function checkout(data: CheckoutData): Promise<CheckoutResponse | null> {
    if (!cart.value) return null

    isLoading.value = true
    error.value = null

    try {
      const body: Record<string, any> = {
        customer_email: data.customerEmail,
        accept_terms: data.acceptTerms ?? true
      }

      // Only include optional fields if provided
      if (data.customerName) body.customer_name = data.customerName
      if (data.customerPhone) body.customer_phone = data.customerPhone
      if (data.returnUrl) body.return_url = data.returnUrl

      const response = await $fetch<any>(`/api/cart/${cart.value.id}/checkout`, {
        method: 'POST',
        body,
        credentials: 'include'
      })

      // Clear cart after successful checkout
      cart.value = null
      summary.value = {
        cartId: null,
        itemsCount: 0,
        ticketsCount: 0,
        total: 0
      }

      return {
        reservationId: response.reservation_id,
        paymentId: response.payment_id,
        checkoutUrl: response.checkout_url,
        amount: parseFloat(response.amount),
        currency: response.currency,
        expiresAt: response.expires_at
      }
    } catch (e: any) {
      error.value = e?.data?.detail || 'Error al procesar el pago'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Clear cart
  async function clearCart() {
    if (!cart.value) return

    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/cart/${cart.value.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      cart.value = null
      summary.value = {
        cartId: null,
        itemsCount: 0,
        ticketsCount: 0,
        total: 0
      }
    } catch (e: any) {
      error.value = e?.data?.detail || 'Error al vaciar carrito'
    } finally {
      isLoading.value = false
    }
  }

  // Get item quantity in cart for a specific area
  function getItemQuantity(areaId: number): number {
    if (!cart.value) return 0
    const item = cart.value.items.find(i => i.areaId === areaId)
    return item?.quantity ?? 0
  }

  // Check if cart has items for a specific cluster
  function hasItemsForCluster(clusterId: number): boolean {
    return cart.value?.clusterId === clusterId && cart.value.items.length > 0
  }

  return {
    // State
    cart,
    summary,
    isLoading,
    error,

    // Getters
    isEmpty,
    totalItems,
    totalTickets,
    subtotal,
    discount,
    serviceFee,
    total,

    // Actions
    fetchSummary,
    fetchCart,
    createCart,
    addItem,
    updateQuantity,
    removeItem,
    addPromotionPackage,
    removePromotionPackage,
    checkout,
    clearCart,
    getItemQuantity,
    hasItemsForCluster
  }
})
