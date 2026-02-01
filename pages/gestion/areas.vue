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
        <p class="text-sm text-text-secondary mt-1">Para ver y gestionar las áreas, primero selecciona un evento</p>
      </div>

      <!-- Areas Content -->
      <template v-else>
        <!-- Header Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div class="relative flex-1 sm:max-w-xs">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar áreas..."
              class="w-full h-10 pl-10 pr-4 py-2 border-2 border-border bg-background rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <NuxtLink
            :to="`/gestion/area/crear?event=${selectedEventId}`"
            class="btn-primary inline-flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            Crear Area
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <UiGestionLoader v-if="isLoading" />

        <!-- Data View -->
        <UiResponsiveDataView
          v-else
          :columns="columns"
          :data="filteredAreas"
          :sort-field="sortField"
          :sort-direction="sortDirection"
          empty-message="No hay areas para este evento"
          empty-sub-message="Crea areas para empezar a vender boletas"
          @sort="handleSort"
        >
          <!-- Mobile Card -->
          <template #card="{ item }">
            <NuxtLink :to="`/gestion/area/${item.id}?event=${selectedEventId}`" class="block">
              <div class="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
                <div class="p-4">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <span v-if="item.nomenclature_letter" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                        {{ item.nomenclature_letter }}
                      </span>
                      <span class="font-bold text-text-primary">{{ item.area_name }}</span>
                    </div>
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getStatusClass(item.status)"
                    >
                      {{ getStatusLabel(item.status) }}
                    </span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span class="text-text-secondary">Capacidad:</span>
                      <span class="ml-1 text-text-primary font-bold">{{ item.capacity }}</span>
                    </div>
                    <div>
                      <span class="text-text-secondary">Disponibles:</span>
                      <span class="ml-1 text-text-primary font-bold">{{ item.units_available ?? '-' }}</span>
                    </div>
                    <div class="col-span-2">
                      <span class="text-text-secondary">Precio:</span>
                      <span class="ml-1 text-primary font-bold">${{ Number(item.price).toLocaleString('es-CO') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </template>

          <!-- Desktop Header -->
          <template #header>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <h3 class="text-base sm:text-lg font-bold text-text-primary">
                Áreas
              </h3>
            </div>
          </template>

          <!-- Custom cell: Name -->
          <template #cell-area_name="{ value, row }">
            <NuxtLink :to="`/gestion/area/${row.id}?event=${selectedEventId}`" class="font-bold text-text-primary hover:text-primary">
              {{ value }}
            </NuxtLink>
          </template>

          <!-- Custom cell: Code -->
          <template #cell-nomenclature_letter="{ value }">
            <span v-if="value" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface-secondary text-text-primary font-bold text-sm">
              {{ value }}
            </span>
            <span v-else class="text-text-tertiary">-</span>
          </template>

          <!-- Custom cell: Price -->
          <template #cell-price="{ value }">
            <span class="font-bold text-primary">${{ Number(value).toLocaleString('es-CO') }}</span>
          </template>

          <!-- Custom cell: Status badge -->
          <template #cell-status="{ value }">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(value)"
            >
              {{ getStatusLabel(value) }}
            </span>
          </template>

          <!-- Custom cell: Actions -->
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-2 justify-center">
              <NuxtLink
                :to="`/gestion/area/${row.id}?event=${selectedEventId}`"
                class="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                title="Editar"
              >
                <PencilIcon class="w-4 h-4" />
              </NuxtLink>
              <button
                @click.stop="confirmDelete(row)"
                class="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                title="Eliminar"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </template>
        </UiResponsiveDataView>
      </template>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-surface rounded-xl max-w-md w-full p-6 border border-border shadow-2xl">
          <h3 class="text-lg font-bold text-text-primary mb-2">Eliminar Área</h3>
          <p class="text-text-secondary mb-6">
            ¿Estás seguro de eliminar el área <strong>{{ areaToDelete?.area_name }}</strong>? Esta acción no se puede deshacer.
          </p>
          <div class="flex gap-3 justify-end">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border-2 border-border rounded-lg text-text-secondary hover:bg-surface-secondary font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="deleteArea"
              :disabled="isDeleting"
              class="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 font-bold disabled:opacity-50 transition-colors"
            >
              {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TicketIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

useHead({ title: 'Areas - WaRo Tickets' })

// State
const searchQuery = ref('')
const selectedEventId = ref<number | ''>('')
const isLoading = ref(false)
const areas = ref<any[]>([])
const sortField = ref('area_name')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Delete modal
const showDeleteModal = ref(false)
const areaToDelete = ref<any>(null)
const isDeleting = ref(false)

// Load events for selector
const { data: eventsData, pending: isLoadingEvents } = useAsyncData('areas-events-list', () =>
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

// Check for event query param + shared store
const route = useRoute()
const router = useRouter()
const eventStore = useEventSelectionStore()

// Initialize from query param, fallback to store
const initialEventId = route.query.event ? Number(route.query.event) : (eventStore.selectedEventId || '')
selectedEventId.value = initialEventId

// Load areas after component is mounted (ensures auth middleware has completed)
onMounted(() => {
  if (initialEventId) {
    loadAreas(initialEventId as number)
  }
})

// Watch for event selection changes (user interaction only)
watch(selectedEventId, async (newEventId, oldEventId) => {
  // Skip if this is the initial load (oldEventId is undefined or empty string)
  if (oldEventId === undefined || oldEventId === '') return

  eventStore.setEvent(newEventId ? Number(newEventId) : null)

  if (newEventId) {
    await loadAreas(newEventId)
    // Update URL without triggering navigation
    router.replace({ query: { event: String(newEventId) } })
  } else {
    areas.value = []
    router.replace({ query: {} })
  }
})

// Load areas for selected event
async function loadAreas(eventId: number) {
  isLoading.value = true
  try {
    const response = await $fetch(`/api/areas/event/${eventId}`, {
      credentials: 'include'
    })
    areas.value = (response as any) || []
  } catch (err) {
    console.error('Error loading areas:', err)
    areas.value = []
  } finally {
    isLoading.value = false
  }
}

// Table columns
const columns = [
  { key: 'area_name', title: 'Nombre', sortable: true, align: 'left' as const },
  { key: 'nomenclature_letter', title: 'Codigo', sortable: true, align: 'center' as const },
  { key: 'capacity', title: 'Capacidad', sortable: true, align: 'right' as const, format: 'number' as const },
  { key: 'units_available', title: 'Disponibles', sortable: true, align: 'right' as const, format: 'number' as const },
  { key: 'price', title: 'Precio', sortable: true, align: 'right' as const },
  { key: 'status', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

// Filtered and sorted areas
const filteredAreas = computed(() => {
  let result = areas.value

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(area =>
      area.area_name.toLowerCase().includes(query) ||
      (area.nomenclature_letter && area.nomenclature_letter.toLowerCase().includes(query))
    )
  }

  // Sort
  if (sortField.value) {
    result = [...result].sort((a: any, b: any) => {
      const aValue = a[sortField.value]
      const bValue = b[sortField.value]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
      }

      const strA = String(aValue).toLowerCase()
      const strB = String(bValue).toLowerCase()
      return sortDirection.value === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA)
    })
  }

  return result
})

// Sort handler
function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Status helpers
function getStatusClass(status: string) {
  switch (status) {
    case 'available':
      return 'bg-success/10 text-success'
    case 'sold_out':
      return 'bg-destructive/10 text-destructive'
    case 'disabled':
      return 'bg-surface-secondary text-text-secondary'
    default:
      return 'bg-surface-secondary text-text-secondary'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'available':
      return 'Disponible'
    case 'sold_out':
      return 'Agotada'
    case 'disabled':
      return 'Deshabilitada'
    default:
      return status
  }
}

// Delete functionality
function confirmDelete(area: any) {
  areaToDelete.value = area
  showDeleteModal.value = true
}

async function deleteArea() {
  if (!areaToDelete.value || !selectedEventId.value) return

  isDeleting.value = true
  try {
    await $fetch(`/api/areas/event/${selectedEventId.value}/${areaToDelete.value.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    // Remove from list
    areas.value = areas.value.filter(a => a.id !== areaToDelete.value.id)
    showDeleteModal.value = false
    areaToDelete.value = null
  } catch (err: any) {
    console.error('Error deleting area:', err)
    alert(err?.data?.detail || 'Error al eliminar el area')
  } finally {
    isDeleting.value = false
  }
}
</script>
