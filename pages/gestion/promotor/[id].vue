<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Back button -->
    <button
      @click="navigateTo('/gestion/promotores')"
      class="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Volver a Promotores
    </button>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
      <UiGestionLoader />
    </div>

    <div v-else-if="promoter" class="space-y-4 sm:space-y-6">

      <!-- Header Info Cards -->
      <div class="bg-surface border-2 border-border rounded-lg">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-6">

            <!-- Promoter Code + Name -->
            <div class="flex items-start space-x-3">
              <div class="bg-background p-3 rounded-lg border border-border flex-shrink-0">
                <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-text-secondary uppercase tracking-wide">{{ promoter.email }}</p>
                <div class="flex items-center gap-2">
                  <p class="text-lg font-semibold text-text-primary">{{ promoter.name }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <code class="text-xs bg-background px-2 py-1 rounded border border-border">{{ promoter.promoter_code }}</code>
                  <button
                    @click="copyCode(promoter.promoter_code)"
                    class="w-8 h-8 flex items-center justify-center bg-surface-secondary rounded-md text-primary transition-colors"
                    title="Copiar codigo"
                  >
                    <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Ventas -->
            <div class="flex items-start space-x-3">
              <div class="bg-background p-3 rounded-lg border border-border flex-shrink-0">
                <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-text-secondary uppercase tracking-wide">Ventas</p>
                <p class="text-lg font-semibold text-text-primary">{{ formatCurrencyFull(promoter.total_sales) }}</p>
                <p class="text-xs text-text-secondary">{{ promoter.total_orders }} ordenes | {{ assignedEvents.length }} eventos</p>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-start space-x-3">
              <div class="bg-background p-3 rounded-lg border border-border flex-shrink-0">
                <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-text-secondary uppercase tracking-wide">Estado Actual</p>
                <span
                  :class="[
                    'inline-flex items-center font-semibold px-2.5 py-0.5 text-xs rounded-full border-0',
                    promoter.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ promoter.is_active ? 'Activo' : 'Inactivo' }}
                </span>
                <p class="text-xs text-text-secondary">Comisiones: {{ formatCurrencyFull(promoter.total_commissions) }}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Eventos Asignados Section (Items pattern) -->
      <div class="bg-surface border-2 border-border rounded-lg p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h3 class="text-base sm:text-lg font-semibold text-text-primary flex items-center space-x-2">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Eventos ({{ assignedEvents.length }})</span>
          </h3>

          <!-- Edit Toggle -->
          <button
            v-if="!isEditMode"
            @click="enterEditMode"
            class="px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors flex items-center space-x-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar</span>
          </button>

          <div v-else class="flex items-center gap-2">
            <button
              @click="cancelEdit"
              class="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded-lg hover:bg-background transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="saveChanges"
              :disabled="isSaving"
              class="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ isSaving ? 'Guardando...' : 'Guardar' }}</span>
            </button>
          </div>
        </div>

        <!-- VIEW MODE -->
        <div v-if="!isEditMode">
          <!-- Empty -->
          <div v-if="assignedEvents.length === 0" class="text-center py-8">
            <p class="text-sm text-text-secondary">No hay eventos asignados</p>
            <p class="text-xs text-text-tertiary mt-1">Haz click en Editar para asignar eventos</p>
          </div>

          <!-- Mobile Cards -->
          <div v-else class="md:hidden space-y-3">
            <div
              v-for="event in assignedEvents"
              :key="event.cluster_id"
              class="bg-surface rounded-xl border border-border"
            >
              <div class="p-4">
                <div class="border-2 border-dashed border-border rounded-lg p-3 mb-3">
                  <div class="mb-3">
                    <h4 class="text-sm font-bold text-text-primary">{{ event.cluster_name }}</h4>
                    <p class="text-xs text-text-secondary mt-1">{{ formatDate(event.start_date) }}</p>
                  </div>
                  <div class="flex items-end justify-between pt-2 border-t border-border">
                    <div>
                      <p class="text-xs text-text-tertiary mb-0.5">Comision</p>
                      <p class="text-base font-semibold text-crocus-600">{{ event.commission_percentage }}%</p>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-text-tertiary mb-0.5">Comision Generada</p>
                      <p class="text-lg font-bold text-text-primary">{{ formatCurrencyFull(event.commission_earned) }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3 text-xs">
                  <span class="text-text-primary font-semibold">{{ event.sales_count }} ventas</span>
                  <span class="text-text-tertiary">|</span>
                  <span class="text-text-secondary">{{ formatCurrencyFull(event.revenue) }} ingresos</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full border-2 border-border rounded-lg">
              <thead class="bg-surface-secondary">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Evento</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Fecha</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Comision</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Ventas</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Ingresos</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Comision Generada</th>
                </tr>
              </thead>
              <tbody class="bg-surface divide-y divide-border">
                <tr v-for="event in assignedEvents" :key="event.cluster_id" class="hover:bg-surface-secondary/50 transition-colors">
                  <td class="px-4 py-3 text-sm font-bold text-text-primary">{{ event.cluster_name }}</td>
                  <td class="px-4 py-3 text-sm text-text-secondary">{{ formatDate(event.start_date) }}</td>
                  <td class="px-4 py-3 text-sm font-bold text-crocus-600 text-center">{{ event.commission_percentage }}%</td>
                  <td class="px-4 py-3 text-sm text-text-primary text-right">{{ event.sales_count }}</td>
                  <td class="px-4 py-3 text-sm text-text-primary text-right">{{ formatCurrencyFull(event.revenue) }}</td>
                  <td class="px-4 py-3 text-sm font-bold text-text-primary text-right">{{ formatCurrencyFull(event.commission_earned) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- EDIT MODE -->
        <div v-else class="space-y-4">
          <!-- Editable Event Cards -->
          <div
            v-for="(event, index) in editEvents"
            :key="event.cluster_id"
            class="p-4 border-2 border-border rounded-lg bg-background"
          >
            <div class="flex justify-between items-start mb-4">
              <h4 class="text-sm font-medium text-text-primary">{{ event.cluster_name }}</h4>
              <button
                type="button"
                @click="removeEvent(index)"
                class="text-red-600 hover:text-red-700 p-1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-medium text-text-secondary mb-1">Fecha</label>
                <div class="px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-secondary">
                  {{ formatDate(event.start_date) }}
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-text-secondary mb-1">Comision %</label>
                <input
                  v-model.number="event.commission_percentage"
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-text-secondary mb-1">Ventas</label>
                <div class="px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-secondary">
                  {{ event.sales_count }}
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-text-secondary mb-1">Comision Generada</label>
                <div class="px-3 py-2 text-sm bg-primary/10 text-primary font-bold border border-border rounded-lg">
                  {{ formatCurrencyFull(event.commission_earned) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Add Event (Inline) -->
          <div class="border-2 border-dashed border-border rounded-lg overflow-hidden">
            <!-- Collapsed -->
            <button
              v-if="!showAddEventForm"
              type="button"
              @click="showAddEventForm = true"
              class="w-full px-4 py-3 text-text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar Evento</span>
            </button>

            <!-- Expanded -->
            <div v-else class="p-4 bg-background">
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-sm font-semibold text-text-primary">Nuevo Evento</h4>
                <button
                  @click="showAddEventForm = false; resetNewEvent()"
                  class="text-text-secondary hover:text-text-primary p-1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Event Select -->
              <div class="mb-4">
                <label class="block text-xs font-medium text-text-secondary mb-1">Evento *</label>
                <select
                  v-model="newEventForm.event_id"
                  class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Seleccionar evento...</option>
                  <option v-for="event in availableEvents" :key="event.id" :value="event.id">
                    {{ event.name }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-xs font-medium text-text-secondary mb-1">Comision % *</label>
                  <input
                    v-model.number="newEventForm.commission_percentage"
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-text-secondary mb-1">Preview</label>
                  <div class="px-3 py-2 text-sm bg-primary/10 text-primary font-bold border border-border rounded-lg">
                    {{ newEventForm.commission_percentage || promoter.commission_percentage }}%
                  </div>
                </div>
              </div>

              <button
                type="button"
                @click="addEvent"
                :disabled="!newEventForm.event_id"
                class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Agregar a la Lista</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Total Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div class="md:col-span-2"></div>
          <div class="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <p class="text-xs text-primary mb-1">Comision Total Generada</p>
            <p class="text-2xl font-bold text-primary">{{ formatCurrencyFull(totalCommission) }}</p>
          </div>
        </div>
      </div>

      <!-- Ventas Recientes Section -->
      <div class="bg-surface border-2 border-border rounded-lg p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-semibold text-text-primary flex items-center space-x-2 mb-4 sm:mb-6">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span>Ventas Recientes</span>
        </h3>

        <div v-if="recentSales.length === 0" class="text-center py-8">
          <p class="text-sm text-text-secondary">No hay ventas registradas</p>
        </div>

        <!-- Mobile Cards -->
        <div v-else class="md:hidden space-y-3">
          <div v-for="sale in recentSales" :key="sale.id" class="bg-surface rounded-xl border border-border p-4">
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="font-bold text-text-primary text-sm">{{ sale.event_name }}</p>
                <p class="text-xs text-text-secondary">{{ formatDate(sale.created_at) }}</p>
              </div>
              <span :class="['px-2 py-1 rounded-full text-xs font-medium border-0', getStatusColor(sale.status)]">
                {{ getStatusLabel(sale.status) }}
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-sm pt-2 border-t border-border">
              <div>
                <p class="text-text-tertiary text-xs">Boletas</p>
                <p class="text-text-primary font-medium">{{ sale.tickets_count }}</p>
              </div>
              <div>
                <p class="text-text-tertiary text-xs">Ingresos</p>
                <p class="text-text-primary font-medium">{{ formatCurrencyFull(sale.revenue) }}</p>
              </div>
              <div>
                <p class="text-text-tertiary text-xs">Comision</p>
                <p class="text-crocus-600 font-bold">{{ formatCurrencyFull(sale.commission_amount) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full border-2 border-border rounded-lg">
            <thead class="bg-surface-secondary">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Fecha</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Evento</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Boletas</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Ingresos</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Comision</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider border-b-2 border-border">Estado</th>
              </tr>
            </thead>
            <tbody class="bg-surface divide-y divide-border">
              <tr v-for="sale in recentSales" :key="sale.id" class="hover:bg-surface-secondary/50 transition-colors">
                <td class="px-4 py-3 text-sm text-text-secondary">{{ formatDate(sale.created_at) }}</td>
                <td class="px-4 py-3 text-sm font-bold text-text-primary">{{ sale.event_name }}</td>
                <td class="px-4 py-3 text-sm text-text-primary text-right">{{ sale.tickets_count }}</td>
                <td class="px-4 py-3 text-sm font-bold text-text-primary text-right">{{ formatCurrencyFull(sale.revenue) }}</td>
                <td class="px-4 py-3 text-sm font-bold text-crocus-600 text-right">{{ formatCurrencyFull(sale.commission_amount) }}</td>
                <td class="px-4 py-3 text-center">
                  <span :class="['px-2.5 py-0.5 rounded-full text-xs font-medium border-0', getStatusColor(sale.status)]">
                    {{ getStatusLabel(sale.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const promoterId = route.params.id as string

const setPageTitle = inject('setPageTitle', (_t: string) => {})
const setPageSubtitle = inject('setPageSubtitle', (_t: string) => {})

const isLoading = ref(true)
const isSaving = ref(false)
const isEditMode = ref(false)
const showAddEventForm = ref(false)

// Data from API
const promoter = ref<any>(null)
const assignedEvents = ref<any[]>([])
const recentSales = ref<any[]>([])
const availableEvents = ref<any[]>([])

// Edit state
const editEvents = ref<any[]>([])
const newEventForm = reactive({
  event_id: '',
  commission_percentage: null as number | null
})

async function loadData() {
  isLoading.value = true
  try {
    const response = await $fetch<any>(`/api/admin/promoters/detail/${promoterId}`, {
      credentials: 'include'
    })
    promoter.value = response.promoter
    assignedEvents.value = response.events || []
    recentSales.value = response.sales || []
    availableEvents.value = response.available_events || []

    setPageTitle(promoter.value.name || 'Promotor')
    setPageSubtitle('Detalle del promotor')
  } catch (err: any) {
    console.error('Error loading promoter detail:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const totalCommission = computed(() => {
  return assignedEvents.value.reduce((sum: number, e: any) => sum + (e.commission_earned || 0), 0)
})

// Edit mode
function enterEditMode() {
  editEvents.value = assignedEvents.value.map((e: any) => ({ ...e }))
  isEditMode.value = true
}

function cancelEdit() {
  isEditMode.value = false
  editEvents.value = []
  showAddEventForm.value = false
}

async function saveChanges() {
  isSaving.value = true
  try {
    const payload = {
      events: editEvents.value.map((e: any) => ({
        cluster_id: e.cluster_id,
        commission_percentage: e.commission_percentage
      }))
    }

    await $fetch(`/api/admin/promoters/detail/${promoterId}/events`, {
      method: 'PUT',
      body: payload,
      credentials: 'include'
    })

    isEditMode.value = false
    showAddEventForm.value = false
    await loadData()
  } catch (err: any) {
    console.error('Error saving event configs:', err)
    alert('Error al guardar configuraciones: ' + (err?.data?.detail || err.message))
  } finally {
    isSaving.value = false
  }
}

function removeEvent(index: number) {
  const removed = editEvents.value[index]
  editEvents.value.splice(index, 1)
  availableEvents.value.push({ id: removed.cluster_id, name: removed.cluster_name })
}

function addEvent() {
  if (!newEventForm.event_id) return

  const selected = availableEvents.value.find((e: any) => String(e.id) === String(newEventForm.event_id))
  if (!selected) return

  editEvents.value.push({
    cluster_id: selected.id,
    cluster_name: selected.name,
    start_date: selected.start_date,
    commission_percentage: newEventForm.commission_percentage || promoter.value?.commission_percentage || 10,
    sales_count: 0,
    revenue: 0,
    commission_earned: 0
  })

  availableEvents.value = availableEvents.value.filter((e: any) => String(e.id) !== String(newEventForm.event_id))
  resetNewEvent()
  showAddEventForm.value = false
}

function resetNewEvent() {
  newEventForm.event_id = ''
  newEventForm.commission_percentage = null
}

function copyCode(code: string) {
  navigator.clipboard.writeText(code)
}

function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = { pending: 'Pendiente', approved: 'Aprobado', paid: 'Pagado' }
  return labels[status] || status
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>
