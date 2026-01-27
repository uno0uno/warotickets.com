<template>
  <div>
    <!-- Loading Events State -->
    <UiGestionLoader v-if="isLoadingEvents" />

    <template v-else>
      <!-- Event Selector -->
      <div class="bg-surface border border-border rounded-xl p-4 mb-6">
        <label class="block text-sm font-bold text-text-primary mb-2">
          Seleccionar Evento
        </label>
        <select
          v-model="selectedEventId"
          class="w-full sm:max-w-md h-10 px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-primary bg-background"
        >
          <option value="">Seleccionar evento</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.cluster_name }}
          </option>
        </select>
      </div>

      <!-- No Event Selected -->
      <div v-if="!selectedEventId" class="bg-surface border border-border rounded-xl p-8 text-center">
        <TicketIcon class="w-16 h-16 mx-auto mb-4 text-text-tertiary" />
        <p class="text-text-primary font-bold">Selecciona un evento</p>
        <p class="text-sm text-text-secondary mt-1">Para ver y gestionar las promociones, primero selecciona un evento</p>
      </div>

      <!-- Promociones Content -->
      <template v-else>
        <!-- Loading State -->
        <UiGestionLoader v-if="isLoading" />

        <!-- Error State -->
        <div v-else-if="fetchError" class="flex items-center justify-center min-h-[400px]">
          <div class="text-center">
            <p class="text-xl font-bold text-text-primary mb-2">Error al cargar las promociones</p>
            <p class="text-sm text-text-secondary mb-4">{{ fetchError }}</p>
            <button @click="loadPromotions" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Reintentar
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div v-else class="flex flex-col gap-4">
          <!-- Header Actions -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="relative flex-1 sm:max-w-xs">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar promociones..."
                class="w-full h-10 pl-10 pr-4 py-2 border-2 border-border bg-background rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <NuxtLink :to="`/gestion/promocion/crear?event=${selectedEventId}`" class="btn-primary">
              <PlusIcon class="w-5 h-5" />
              <span class="hidden sm:inline">Crear Promocion</span>
              <span class="sm:hidden">Nueva</span>
            </NuxtLink>
          </div>

          <!-- Responsive Data View -->
          <UiResponsiveDataView
            :columns="columns"
            :data="filteredPromotions"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            empty-message="No hay promociones"
            empty-sub-message="Crea combos/paquetes promocionales para este evento"
            @sort="handleSort"
          >
            <!-- Mobile Card -->
            <template #card="{ item }">
              <NuxtLink :to="`/gestion/promocion/${item.id}?event=${selectedEventId}`" class="block">
                <div class="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
                  <div class="h-16 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center relative">
                    <TicketIcon class="w-8 h-8 text-white/30" />
                    <div class="absolute top-2 right-2">
                      <span
                        class="px-2 py-0.5 text-xs font-medium rounded-full"
                        :class="getStatusClass(item.is_currently_valid)"
                      >
                        {{ getStatusLabel(item.is_currently_valid, item.is_active) }}
                      </span>
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="flex items-center justify-between mb-2">
                      <p class="text-sm font-medium text-secondary-900">{{ item.promotion_name }}</p>
                      <span class="text-xs text-secondary-500">
                        {{ item.total_tickets }} boletas
                      </span>
                    </div>

                    <!-- Combo Items Preview -->
                    <div v-if="item.items && item.items.length" class="mb-3 flex flex-wrap gap-1">
                      <span
                        v-for="(comboItem, idx) in item.items.slice(0, 3)"
                        :key="idx"
                        class="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded"
                      >
                        {{ comboItem.quantity }}x {{ comboItem.area_name }}
                      </span>
                      <span v-if="item.items.length > 3" class="px-1.5 py-0.5 text-text-tertiary text-xs">
                        +{{ item.items.length - 3 }} más
                      </span>
                    </div>

                    <div class="flex items-center justify-between text-sm">
                      <div class="flex items-center gap-2">
                        <span
                          class="px-1.5 py-0.5 text-xs font-medium rounded"
                          :class="getPricingTypeClass(item.pricing_type)"
                        >
                          {{ getPricingTypeLabel(item.pricing_type) }}
                        </span>
                        <span class="font-bold" :class="item.pricing_type === 'fixed_price' ? 'text-primary' : 'text-success'">
                          {{ formatPricing(item) }}
                        </span>
                      </div>
                      <span class="text-text-secondary">{{ formatUses(item) }}</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </template>

            <!-- Desktop Header -->
            <template #header>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h3 class="text-base sm:text-lg font-bold text-text-primary">
                  Promociones (Combos)
                </h3>
              </div>
            </template>

            <!-- Custom cell: Name -->
            <template #cell-promotion_name="{ value, row }">
              <NuxtLink :to="`/gestion/promocion/${row.id}?event=${selectedEventId}`" class="font-bold text-text-primary hover:text-primary">
                {{ value }}
              </NuxtLink>
            </template>

            <!-- Custom cell: Combo (items) -->
            <template #cell-combo="{ row }">
              <div class="flex flex-wrap gap-1 max-w-xs">
                <span
                  v-for="(item, idx) in (row.items || []).slice(0, 2)"
                  :key="idx"
                  class="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded whitespace-nowrap"
                >
                  {{ item.quantity }}x {{ item.area_name }}
                </span>
                <span v-if="(row.items || []).length > 2" class="px-1.5 py-0.5 text-text-tertiary text-xs">
                  +{{ row.items.length - 2 }}
                </span>
              </div>
            </template>

            <!-- Custom cell: Total Tickets -->
            <template #cell-total_tickets="{ value }">
              <span class="font-bold text-text-primary">{{ value || 0 }}</span>
            </template>

            <!-- Custom cell: Pricing Type -->
            <template #cell-pricing_type="{ value }">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getPricingTypeClass(value)"
              >
                {{ getPricingTypeLabel(value) }}
              </span>
            </template>

            <!-- Custom cell: Pricing Value -->
            <template #cell-pricing_value="{ row }">
              <span class="font-bold" :class="row.pricing_type === 'fixed_price' ? 'text-primary' : 'text-success'">
                {{ formatPricing(row) }}
              </span>
            </template>

            <!-- Custom cell: Uses -->
            <template #cell-uses_count="{ row }">
              {{ formatUses(row) }}
            </template>

            <!-- Custom cell: Date range -->
            <template #cell-start_time="{ row }">
              {{ formatDateRange(row.start_time, row.end_time) }}
            </template>

            <!-- Custom cell: Status badge -->
            <template #cell-is_currently_valid="{ value, row }">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusClass(value)"
              >
                {{ getStatusLabel(value, row.is_active) }}
              </span>
            </template>

            <!-- Custom cell: Actions -->
            <template #cell-actions="{ row }">
              <div class="flex items-center gap-2 justify-center">
                <button
                  @click.prevent="copyPromoLink(row)"
                  class="p-1.5 rounded-lg transition-colors"
                  :class="copiedPromoId === row.id ? 'text-success bg-success/10' : 'text-text-secondary hover:bg-surface-secondary'"
                  :title="copiedPromoId === row.id ? 'Copiado!' : 'Copiar enlace con promo'"
                >
                  <CheckIcon v-if="copiedPromoId === row.id" class="w-4 h-4" />
                  <LinkIcon v-else class="w-4 h-4" />
                </button>
                <NuxtLink
                  :to="`/gestion/promocion/${row.id}?event=${selectedEventId}`"
                  class="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                  title="Editar"
                >
                  <PencilIcon class="w-4 h-4" />
                </NuxtLink>
              </div>
            </template>
          </UiResponsiveDataView>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  TicketIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  LinkIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

useHead({ title: 'Promociones - WaRo Tickets' })

// State
const selectedEventId = ref<number | ''>('')
const isLoading = ref(false)
const fetchError = ref<string | null>(null)
const promotions = ref<any[]>([])
const searchQuery = ref('')
const sortField = ref('promotion_name')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Load events for selector
const { data: eventsData, pending: isLoadingEvents } = useAsyncData('promotions-events-list', () =>
  $fetch('/api/events', {
    credentials: 'include'
  }),
  {
    server: false,
    lazy: true,
    transform: (response: any) => response.data || response || []
  }
)

const events = computed(() => eventsData.value || [])

// Check for event query param
const route = useRoute()
const router = useRouter()

// Initialize from query param
const initialEventId = route.query.event ? Number(route.query.event) : ''
if (initialEventId) {
  selectedEventId.value = initialEventId
  loadPromotions()
}

// Watch for event selection changes
watch(selectedEventId, async (newEventId, oldEventId) => {
  if (oldEventId === undefined) return

  if (newEventId) {
    await loadPromotions()
    router.replace({ query: { event: String(newEventId) } })
  } else {
    promotions.value = []
    router.replace({ query: {} })
  }
})

// Load promotions for selected event
async function loadPromotions() {
  if (!selectedEventId.value) return

  isLoading.value = true
  fetchError.value = null

  try {
    const response = await $fetch(`/api/promotions/event/${selectedEventId.value}`, {
      credentials: 'include'
    })
    promotions.value = (response as any) || []
  } catch (err: any) {
    console.error('Error loading promotions:', err)
    fetchError.value = err?.data?.detail || 'Error al cargar las promociones'
    promotions.value = []
  } finally {
    isLoading.value = false
  }
}

// Table columns - updated for combo system
const columns = [
  { key: 'promotion_name', title: 'Nombre', sortable: true, align: 'left' as const },
  { key: 'combo', title: 'Combo', sortable: false, align: 'left' as const },
  { key: 'total_tickets', title: 'Boletas', sortable: true, align: 'center' as const },
  { key: 'pricing_type', title: 'Tipo', sortable: true, align: 'center' as const },
  { key: 'pricing_value', title: 'Valor', sortable: true, align: 'center' as const },
  { key: 'uses_count', title: 'Usos', sortable: true, align: 'center' as const },
  { key: 'start_time', title: 'Vigencia', sortable: true, align: 'center' as const },
  { key: 'is_currently_valid', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

// Filtered and sorted promotions
const filteredPromotions = computed(() => {
  let result = promotions.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(promo =>
      promo.promotion_name.toLowerCase().includes(query)
    )
  }

  if (sortField.value) {
    result = [...result].sort((a: any, b: any) => {
      const aValue = a[sortField.value]
      const bValue = b[sortField.value]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection.value === 'asc'
          ? (aValue === bValue ? 0 : aValue ? -1 : 1)
          : (aValue === bValue ? 0 : aValue ? 1 : -1)
      }

      const strA = String(aValue).toLowerCase()
      const strB = String(bValue).toLowerCase()
      return sortDirection.value === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA)
    })
  }

  return result
})

// Methods
function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function formatDateRange(start: string, end: string | null) {
  if (!start) return '-'
  const startDate = new Date(start)
  const startStr = startDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })

  if (!end) return `Desde ${startStr}`

  const endDate = new Date(end)
  const endStr = endDate.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

  return `${startStr} - ${endStr}`
}

function formatPricing(promo: any) {
  const value = Number(promo.pricing_value)
  const type = promo.pricing_type

  if (type === 'percentage') {
    return `-${value}%`
  } else if (type === 'fixed_discount') {
    const formatted = value.toLocaleString('es-CO')
    return `-$${formatted}`
  } else if (type === 'fixed_price') {
    const formatted = value.toLocaleString('es-CO')
    return `$${formatted}`
  }
  return '-'
}

function getPricingTypeLabel(type: string) {
  switch (type) {
    case 'percentage': return 'Porcentaje'
    case 'fixed_discount': return 'Descuento fijo'
    case 'fixed_price': return 'Precio fijo'
    default: return type
  }
}

function getPricingTypeClass(type: string) {
  switch (type) {
    case 'percentage': return 'bg-success/10 text-success'
    case 'fixed_discount': return 'bg-info/10 text-info'
    case 'fixed_price': return 'bg-primary/10 text-primary'
    default: return 'bg-surface-secondary text-text-tertiary'
  }
}

function formatUses(promo: any) {
  const used = promo.uses_count || 0
  const available = promo.quantity_available
  if (available === null || available === undefined) {
    return `${used} usos`
  }
  return `${used} / ${available}`
}

function getStatusClass(isValid: boolean) {
  return isValid
    ? 'bg-success/10 text-success'
    : 'bg-surface-secondary text-text-secondary'
}

function getStatusLabel(isValid: boolean, isActive: boolean) {
  if (!isActive) return 'Inactiva'
  return isValid ? 'Valida' : 'No valida'
}

// Copy link functionality
const copiedPromoId = ref<string | null>(null)

async function copyPromoLink(promo: any) {
  // Get the selected event to get its slug
  const selectedEvent = events.value.find((e: any) => e.id === selectedEventId.value)
  const slug = selectedEvent?.slug_cluster || selectedEvent?.slug || selectedEventId.value
  // Include the promotion ID in the URL
  const url = `${window.location.origin}/eventos/${slug}?promo=${promo.id}`

  try {
    await navigator.clipboard.writeText(url)
    copiedPromoId.value = promo.id
    setTimeout(() => {
      copiedPromoId.value = null
    }, 2000)
  } catch (err) {
    console.error('Error copying link:', err)
  }
}
</script>
