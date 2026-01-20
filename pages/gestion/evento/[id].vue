<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-secondary-500">Cargando evento...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <p class="text-xl font-semibold text-secondary-800 mb-2">Error al cargar el evento</p>
        <p class="text-sm text-secondary-600 mb-4">{{ fetchError.message || 'Evento no encontrado' }}</p>
        <NuxtLink to="/gestion/eventos" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Volver a eventos
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Event Information Card -->
      <div class="bg-white border-2 border-secondary-200 rounded-lg mb-4 sm:mb-6">
        <div class="p-4 sm:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <!-- Event Name -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <CalendarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Evento
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  {{ form.cluster_name || 'Sin nombre' }}
                </p>
              </div>
            </div>

            <!-- Event Type -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <TagIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Tipo
                </p>
                <p class="text-sm sm:text-lg font-semibold text-secondary-900">
                  {{ getEventTypeLabel(form.cluster_type) || 'Sin tipo' }}
                </p>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <TicketIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Vendidas
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  {{ eventData?.total_sold || 0 }}
                </p>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <CheckCircleIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Estado
                </p>
                <div class="pt-1">
                  <span
                    :class="form.is_active ? 'bg-green-100 text-green-700' : 'bg-secondary-100 text-secondary-600'"
                    class="px-2 py-1 rounded text-xs font-medium"
                  >
                    {{ form.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="bg-white border-secondary-200 border rounded-lg mb-4 sm:mb-6">
        <div class="p-3 sm:p-6">
          <div class="flex items-center justify-between">
            <!-- Step 1 -->
            <div class="flex items-center flex-1">
              <div
                class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors border-2 flex-shrink-0"
                :class="{
                  'bg-primary-600 text-white border-primary-600': currentStep === 1,
                  'bg-secondary-600 text-white border-secondary-600': currentStep > 1,
                  'border-secondary-300 text-secondary-400 bg-transparent': currentStep < 1
                }"
              >
                <CheckIcon v-if="currentStep > 1" class="w-4 h-4 sm:w-6 sm:h-6" />
                <span v-else class="font-semibold text-sm sm:text-base">1</span>
              </div>
              <div class="ml-1 sm:ml-3 flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 1 ? 'text-secondary-900' : 'text-secondary-500'">
                  <span class="hidden sm:inline">Informacion Basica</span>
                  <span class="sm:hidden">Info</span>
                </p>
                <p class="text-xs text-secondary-500 hidden sm:block">Nombre, tipo y fechas</p>
              </div>
              <div class="flex-1 h-0.5 sm:h-1 mx-1 sm:mx-4" :class="currentStep > 1 ? 'bg-secondary-600' : 'bg-secondary-200'"></div>
            </div>

            <!-- Step 2 -->
            <div class="flex items-center">
              <div
                class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors border-2 flex-shrink-0"
                :class="{
                  'bg-primary-600 text-white border-primary-600': currentStep === 2,
                  'bg-secondary-600 text-white border-secondary-600': currentStep > 2,
                  'border-secondary-300 text-secondary-400 bg-transparent': currentStep < 2
                }"
              >
                <span class="font-semibold text-sm sm:text-base">2</span>
              </div>
              <div class="ml-1 sm:ml-3 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 2 ? 'text-secondary-900' : 'text-secondary-500'">
                  Ubicacion
                </p>
                <p class="text-xs text-secondary-500 hidden sm:block">Lugar y direccion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleNext">
        <!-- Step 1: Informacion Basica -->
        <Transition name="fade" mode="out-in">
          <div v-if="currentStep === 1" key="step-1" class="bg-white border-secondary-200 border rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-4 sm:mb-6">Informacion Basica</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <!-- Event Name -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Nombre del Evento *
                  </label>
                  <input
                    type="text"
                    v-model="form.cluster_name"
                    placeholder="Ej: Concierto de Rock en el Parque"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                    required
                  />
                </div>

                <!-- Event Type -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Tipo de Evento *
                  </label>
                  <select
                    v-model="form.cluster_type"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 bg-white"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="concert">Concierto</option>
                    <option value="festival">Festival</option>
                    <option value="theater">Teatro</option>
                    <option value="sports">Deportes</option>
                    <option value="conference">Conferencia</option>
                    <option value="party">Fiesta</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <!-- Slug (readonly) -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Slug (URL)
                  </label>
                  <input
                    v-model="form.slug_cluster"
                    type="text"
                    disabled
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg text-secondary-500 bg-secondary-50"
                  />
                  <p class="text-xs text-secondary-500 mt-1">El slug no se puede modificar</p>
                </div>

                <!-- Start Date -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    v-model="form.start_date"
                    type="datetime-local"
                    required
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                  />
                </div>

                <!-- End Date -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    v-model="form.end_date"
                    type="datetime-local"
                    :min="form.start_date"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 text-secondary-900"
                    :class="dateErrors.end_date ? 'border-red-500 focus:border-red-500' : 'border-secondary-200 focus:border-primary-500'"
                  />
                  <p v-if="dateErrors.end_date" class="text-xs text-red-500 mt-1">{{ dateErrors.end_date }}</p>
                </div>

                <!-- Description -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Descripcion
                  </label>
                  <textarea
                    v-model="form.description"
                    placeholder="Descripcion del evento, artistas, programa, etc."
                    rows="3"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 resize-none"
                  />
                </div>

                <!-- Status Checkbox -->
                <div class="md:col-span-2">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="form.is_active"
                      class="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <span class="text-sm font-medium text-secondary-900">Evento activo (visible para compradores)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Ubicacion -->
          <div v-else-if="currentStep === 2" key="step-2" class="bg-white border border-secondary-200 rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-4 sm:mb-6">Ubicacion del Evento</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <!-- Venue Name -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Nombre del Lugar
                  </label>
                  <input
                    v-model="form.venue_name"
                    type="text"
                    placeholder="Ej: Estadio El Campin"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                  />
                </div>

                <!-- Address -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Direccion
                  </label>
                  <input
                    v-model="form.venue_address"
                    type="text"
                    placeholder="Direccion completa del evento"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                  />
                </div>

                <!-- Country -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Pais
                  </label>
                  <select
                    v-model="form.country"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 bg-white"
                  >
                    <option value="">Seleccionar pais</option>
                    <option
                      v-for="country in locationsStore.countries"
                      :key="country.code"
                      :value="country.code"
                    >
                      {{ country.name }}
                    </option>
                  </select>
                </div>

                <!-- City -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Ciudad
                  </label>
                  <select
                    v-model="form.city"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 bg-white"
                    :disabled="!form.country"
                  >
                    <option value="">Seleccionar ciudad</option>
                    <option
                      v-for="city in availableCities"
                      :key="city"
                      :value="city"
                    >
                      {{ city }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </Transition>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-4 sm:mt-6 gap-3">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="previousStep"
            class="px-4 sm:px-6 py-2 sm:py-3 border-2 border-secondary-200 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 font-medium transition-colors"
          >
            <span class="hidden sm:inline">&larr; Anterior</span>
            <span class="sm:hidden">&larr;</span>
          </button>
          <div v-else></div>

          <div class="flex gap-3">
            <NuxtLink
              to="/gestion/eventos"
              class="px-4 sm:px-6 py-2 sm:py-3 border-2 border-secondary-200 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 font-medium transition-colors"
            >
              Cancelar
            </NuxtLink>

            <button
              v-if="currentStep < 2"
              type="submit"
              :disabled="!canProceed"
              class="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span class="hidden sm:inline">Siguiente &rarr;</span>
              <span class="sm:hidden">&rarr;</span>
            </button>
            <button
              v-else
              type="button"
              @click="submitEvent"
              :disabled="isSubmitting"
              class="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}</span>
            </button>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarIcon,
  TagIcon,
  CheckCircleIcon,
  CheckIcon,
  TicketIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const eventId = computed(() => route.params.id as string)

useHead({
  title: 'Editar Evento - WaRo Tickets'
})

// State
const currentStep = ref(1)
const isSubmitting = ref(false)

// Locations store
const locationsStore = useLocationsStore()

// Form state
const form = reactive({
  cluster_name: '',
  cluster_type: '',
  slug_cluster: '',
  start_date: '',
  end_date: '',
  description: '',
  venue_name: '',
  venue_address: '',
  city: '',
  country: '', // Stores country code (e.g., 'CO')
  is_active: false
})

// Get cities based on selected country
const availableCities = computed(() => {
  if (!form.country) return []
  return locationsStore.getCitiesByCountry(form.country)
})

// Fetch event data
const { data: eventData, pending: isLoading, error: fetchError } = useAsyncData(
  `event-${eventId.value}`,
  () => $fetch(`/api/events/${eventId.value}`, {
    credentials: 'include'
  }),
  {
    server: false,
    transform: (response: any) => response.data || response
  }
)

// Watch for event data to populate form
watch(eventData, (newData) => {
  if (newData) {
    form.cluster_name = newData.cluster_name || ''
    form.cluster_type = newData.cluster_type || ''
    form.slug_cluster = newData.slug_cluster || ''
    form.start_date = newData.start_date ? formatDateForInput(newData.start_date) : ''
    form.end_date = newData.end_date ? formatDateForInput(newData.end_date) : ''
    form.description = newData.description || ''
    form.is_active = newData.is_active || false

    // Extra attributes
    const extra = newData.extra_attributes || {}
    form.venue_name = extra.venue_name || ''
    form.venue_address = extra.venue_address || ''

    // Convert country name to code
    const countryData = locationsStore.getCountryByName(extra.country || '')
    form.country = countryData?.code || ''
    form.city = extra.city || ''

    // Mark form as initialized after populating
    nextTick(() => {
      formInitialized.value = true
    })
  }
}, { immediate: true })

// Date validation errors
const dateErrors = reactive({
  start_date: '',
  end_date: ''
})

// Validate dates (for edit, we only check end > start, not if start is in past)
function validateDates() {
  dateErrors.start_date = ''
  dateErrors.end_date = ''

  if (form.start_date && form.end_date) {
    const startDate = new Date(form.start_date)
    const endDate = new Date(form.end_date)

    if (endDate <= startDate) {
      dateErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicio'
    }
  }
}

// Watch for date changes to validate
watch(() => form.start_date, validateDates)
watch(() => form.end_date, validateDates)

// Track if form has been initialized to avoid clearing city on initial load
const formInitialized = ref(false)

// Clear city when country changes (but not on initial load)
watch(() => form.country, () => {
  if (formInitialized.value) {
    form.city = ''
  }
})

// Event types labels
const eventTypeLabels: Record<string, string> = {
  concert: 'Concierto',
  festival: 'Festival',
  theater: 'Teatro',
  sports: 'Deportes',
  conference: 'Conferencia',
  party: 'Fiesta',
  other: 'Otro'
}

function getEventTypeLabel(type: string): string {
  return eventTypeLabels[type] || 'Sin tipo'
}

function formatDateForInput(dateString: string): string {
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

// Validation per step
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    validateDates()
    return form.cluster_name && form.cluster_type && form.start_date && !dateErrors.start_date && !dateErrors.end_date
  }
  return true
})

// Navigation
function handleNext() {
  if (canProceed.value && currentStep.value < 2) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Submit
async function submitEvent() {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    // Build the payload
    const payload: Record<string, any> = {
      cluster_name: form.cluster_name,
      cluster_type: form.cluster_type,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      is_active: form.is_active
    }

    // Optional fields
    if (form.end_date) payload.end_date = new Date(form.end_date).toISOString()
    if (form.description) payload.description = form.description

    // Extra attributes for venue info
    const extraAttributes: Record<string, any> = {}
    if (form.venue_name) extraAttributes.venue_name = form.venue_name
    if (form.venue_address) extraAttributes.venue_address = form.venue_address
    if (form.city) extraAttributes.city = form.city
    if (form.country) {
      const countryData = locationsStore.getCountryByCode(form.country)
      extraAttributes.country = countryData?.name || form.country
    }

    if (Object.keys(extraAttributes).length > 0) {
      payload.extra_attributes = extraAttributes
    }

    await $fetch(`/api/events/${eventId.value}`, {
      method: 'PATCH',
      body: payload,
      credentials: 'include'
    })

    // Clear cache and redirect
    clearNuxtData('events-*')
    clearNuxtData(`event-${eventId.value}`)
    await navigateTo('/gestion/eventos')
  } catch (err: any) {
    console.error('Error updating event:', err)
    const message = err?.data?.detail || err?.message || 'Error al actualizar el evento'
    alert(message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
