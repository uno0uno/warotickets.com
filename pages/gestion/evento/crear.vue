<template>
  <div class="w-full">
    <!-- Event Information Card -->
    <div class="bg-white border-2 border-secondary-200 rounded-lg mb-4 sm:mb-6">
      <div class="p-4 sm:p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <!-- Event Name -->
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
              <CalendarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            </div>
            <div class="space-y-1">
              <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                Nuevo Evento
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
          <div class="flex items-center flex-1">
            <div
              class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors border-2 flex-shrink-0"
              :class="{
                'bg-primary-600 text-white border-primary-600': currentStep === 2,
                'bg-secondary-600 text-white border-secondary-600': currentStep > 2,
                'border-secondary-300 text-secondary-400 bg-transparent': currentStep < 2
              }"
            >
              <CheckIcon v-if="currentStep > 2" class="w-4 h-4 sm:w-6 sm:h-6" />
              <span v-else class="font-semibold text-sm sm:text-base">2</span>
            </div>
            <div class="ml-1 sm:ml-3 flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 2 ? 'text-secondary-900' : 'text-secondary-500'">
                Ubicacion
              </p>
              <p class="text-xs text-secondary-500 hidden sm:block">Lugar y direccion</p>
            </div>
            <div class="flex-1 h-0.5 sm:h-1 mx-1 sm:mx-4" :class="currentStep > 2 ? 'bg-secondary-600' : 'bg-secondary-200'"></div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-center">
            <div
              class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors border-2 flex-shrink-0"
              :class="{
                'bg-primary-600 text-white border-primary-600': currentStep === 3,
                'bg-secondary-600 text-white border-secondary-600': currentStep > 3,
                'border-secondary-300 text-secondary-400 bg-transparent': currentStep < 3
              }"
            >
              <span class="font-semibold text-sm sm:text-base">3</span>
            </div>
            <div class="ml-1 sm:ml-3 min-w-0">
              <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 3 ? 'text-secondary-900' : 'text-secondary-500'">
                <span class="hidden sm:inline">Revision y Confirmacion</span>
                <span class="sm:hidden">Revisar</span>
              </p>
              <p class="text-xs text-secondary-500 hidden sm:block">Verificar y crear</p>
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
                  <option value="standup">Standup Comedy</option>
                  <option value="sports">Deportes</option>
                  <option value="conference">Conferencia</option>
                  <option value="party">Fiesta</option>
                  <option value="other">Otro</option>
                </select>
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
                  :min="minStartDate"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 text-secondary-900"
                  :class="dateErrors.start_date ? 'border-red-500 focus:border-red-500' : 'border-secondary-200 focus:border-primary-500'"
                />
                <p v-if="dateErrors.start_date" class="text-xs text-red-500 mt-1">{{ dateErrors.start_date }}</p>
              </div>

              <!-- End Date -->
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-2">
                  Fecha de Fin
                </label>
                <input
                  v-model="form.end_date"
                  type="datetime-local"
                  :min="form.start_date || minStartDate"
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

              <!-- Banner Image -->
              <div class="md:col-span-2">
                <UiImageUploader
                  v-model="form.banner_url"
                  label="Banner del Evento"
                  type="banner"
                  recommended-size="1960 x 600 px"
                  preview-class="max-h-40"
                  @uploaded="handleBannerUploaded"
                  @uploading="(v) => isUploadingBanner = v"
                />
              </div>

              <!-- Flyer Image -->
              <div>
                <UiImageUploader
                  v-model="form.flyer_url"
                  label="Flyer del Evento"
                  type="flyer"
                  recommended-size="Vertical o cuadrado"
                  preview-class="max-h-64"
                  @uploaded="handleFlyerUploaded"
                  @uploading="(v) => isUploadingFlyer = v"
                />
              </div>

              <!-- Cover Image -->
              <div>
                <UiImageUploader
                  v-model="form.cover_url"
                  label="Imagen de Portada"
                  type="cover"
                  recommended-size="400 x 400 px"
                  preview-class="max-h-48"
                  @uploaded="handleCoverUploaded"
                  @uploading="(v) => isUploadingCover = v"
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

        <!-- Step 3: Review -->
        <div v-else-if="currentStep === 3" key="step-3" class="bg-white border border-secondary-200 rounded-lg">
          <!-- Header -->
          <div class="border-b border-secondary-200 p-4 sm:p-6 md:p-8">
            <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 mb-2">NUEVO EVENTO</h1>
                <p class="text-xs sm:text-sm text-secondary-500">Resumen del evento a crear</p>
              </div>
            </div>
          </div>

          <!-- Event Info -->
          <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div>
                <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-2">Evento</p>
                <p class="text-lg font-bold text-secondary-900">{{ form.cluster_name }}</p>
                <p v-if="form.description" class="text-sm text-secondary-600 mt-2">{{ form.description }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-2">Tipo</p>
                <p class="text-base font-semibold text-secondary-900">{{ getEventTypeLabel(form.cluster_type) }}</p>
                <div class="flex gap-2 mt-3">
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

          <!-- Date Information -->
          <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200 bg-secondary-50">
            <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
              Fecha y Hora
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p class="text-sm text-secondary-600 mb-1">Inicio</p>
                <p class="text-lg font-bold text-secondary-900">{{ formatDatePreview(form.start_date) }}</p>
              </div>
              <div v-if="form.end_date">
                <p class="text-sm text-secondary-600 mb-1">Fin</p>
                <p class="text-lg font-bold text-secondary-900">{{ formatDatePreview(form.end_date) }}</p>
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div v-if="form.venue_name || form.venue_address || form.city" class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
            <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
              Ubicacion
            </p>
            <div class="space-y-2">
              <p v-if="form.venue_name" class="text-lg font-bold text-secondary-900">{{ form.venue_name }}</p>
              <p v-if="form.venue_address" class="text-sm text-secondary-600">{{ form.venue_address }}</p>
              <p v-if="form.city || form.country" class="text-sm text-secondary-600">
                {{ [form.city, locationsStore.getCountryByCode(form.country)?.name].filter(Boolean).join(', ') }}
              </p>
            </div>
          </div>

          <!-- Images Preview -->
          <div v-if="form.banner_url || form.flyer_url || form.cover_url" class="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
            <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
              Imagenes del Evento
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Banner Preview -->
              <div v-if="form.banner_url" class="md:col-span-3">
                <p class="text-sm text-secondary-600 mb-2">Banner (1960x600)</p>
                <img
                  :src="form.banner_url"
                  alt="Banner del evento"
                  class="w-full max-h-32 object-cover rounded-lg border border-secondary-200"
                />
              </div>

              <!-- Flyer Preview -->
              <div v-if="form.flyer_url">
                <p class="text-sm text-secondary-600 mb-2">Flyer</p>
                <img
                  :src="form.flyer_url"
                  alt="Flyer del evento"
                  class="w-full max-h-48 object-contain rounded-lg border border-secondary-200"
                />
              </div>

              <!-- Cover Preview -->
              <div v-if="form.cover_url">
                <p class="text-sm text-secondary-600 mb-2">Portada</p>
                <img
                  :src="form.cover_url"
                  alt="Portada del evento"
                  class="w-32 h-32 object-cover rounded-lg border border-secondary-200"
                />
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
            v-if="currentStep < 3"
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
            :disabled="isSubmitting || isUploadingImages"
            class="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <div v-if="isSubmitting || isUploadingImages" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ isUploadingImages ? 'Subiendo imagenes...' : isSubmitting ? 'Creando...' : 'Crear Evento' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarIcon,
  TagIcon,
  CheckCircleIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Crear Evento - WaRo Tickets'
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
  start_date: '',
  end_date: '',
  description: '',
  venue_name: '',
  venue_address: '',
  city: '',
  country: 'CO', // Default to Colombia
  is_active: false,
  // Images
  banner_url: null as string | null,
  flyer_url: null as string | null,
  cover_url: null as string | null
})

// Image upload state
const isUploadingBanner = ref(false)
const isUploadingFlyer = ref(false)
const isUploadingCover = ref(false)

// Image dimensions (stored when uploaded)
const imageDimensions = reactive({
  banner: { width: 0, height: 0, size: 0 },
  flyer: { width: 0, height: 0, size: 0 },
  cover: { width: 0, height: 0, size: 0 }
})

// Image upload handlers
function handleBannerUploaded(data: { url: string; width?: number; height?: number; size?: number }) {
  imageDimensions.banner = {
    width: data.width || 0,
    height: data.height || 0,
    size: data.size || 0
  }
}

function handleFlyerUploaded(data: { url: string; width?: number; height?: number; size?: number }) {
  imageDimensions.flyer = {
    width: data.width || 0,
    height: data.height || 0,
    size: data.size || 0
  }
}

function handleCoverUploaded(data: { url: string; width?: number; height?: number; size?: number }) {
  imageDimensions.cover = {
    width: data.width || 0,
    height: data.height || 0,
    size: data.size || 0
  }
}

// Check if any image is uploading
const isUploadingImages = computed(() => {
  return isUploadingBanner.value || isUploadingFlyer.value || isUploadingCover.value
})

// Get cities based on selected country
const availableCities = computed(() => {
  if (!form.country) return []
  return locationsStore.getCitiesByCountry(form.country)
})

// Min date for datetime-local input (current date/time)
const minStartDate = computed(() => {
  const now = new Date()
  // Format as YYYY-MM-DDTHH:mm
  return now.toISOString().slice(0, 16)
})

// Event types labels
const eventTypeLabels: Record<string, string> = {
  concert: 'Concierto',
  festival: 'Festival',
  theater: 'Teatro',
  standup: 'Standup Comedy',
  sports: 'Deportes',
  conference: 'Conferencia',
  party: 'Fiesta',
  other: 'Otro'
}

function getEventTypeLabel(type: string): string {
  return eventTypeLabels[type] || 'Sin tipo'
}

function formatDatePreview(dateString: string): string {
  if (!dateString) return 'Sin fecha'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Date validation errors
const dateErrors = reactive({
  start_date: '',
  end_date: ''
})

// Validate dates
function validateDates() {
  dateErrors.start_date = ''
  dateErrors.end_date = ''

  if (form.start_date) {
    const startDate = new Date(form.start_date)
    const now = new Date()

    if (startDate < now) {
      dateErrors.start_date = 'La fecha de inicio no puede ser anterior a la fecha actual'
    }
  }

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

// Clear city when country changes
watch(() => form.country, () => {
  form.city = ''
})

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
  if (canProceed.value && currentStep.value < 3) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Submit
async function submitEvent() {
  if (isSubmitting.value || isUploadingImages.value) return

  isSubmitting.value = true

  try {
    // Build the payload
    const payload: Record<string, any> = {
      cluster_name: form.cluster_name,
      cluster_type: form.cluster_type,
      slug_cluster: generateSlug(form.cluster_name), // Auto-generate slug
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

    // Create the event
    const createdEvent = await $fetch<{ id: number }>('/api/events', {
      method: 'POST',
      body: payload,
      credentials: 'include'
    })

    // Save images to the new event_images table
    const imagePromises: Promise<any>[] = []

    if (form.banner_url) {
      imagePromises.push(
        $fetch(`/api/events/${createdEvent.id}/event-images`, {
          method: 'POST',
          body: {
            image_type: 'banner',
            image_url: form.banner_url,
            width: imageDimensions.banner.width || null,
            height: imageDimensions.banner.height || null,
            file_size: imageDimensions.banner.size || null
          },
          credentials: 'include'
        })
      )
    }

    if (form.flyer_url) {
      imagePromises.push(
        $fetch(`/api/events/${createdEvent.id}/event-images`, {
          method: 'POST',
          body: {
            image_type: 'flyer',
            image_url: form.flyer_url,
            width: imageDimensions.flyer.width || null,
            height: imageDimensions.flyer.height || null,
            file_size: imageDimensions.flyer.size || null
          },
          credentials: 'include'
        })
      )
    }

    if (form.cover_url) {
      imagePromises.push(
        $fetch(`/api/events/${createdEvent.id}/event-images`, {
          method: 'POST',
          body: {
            image_type: 'cover',
            image_url: form.cover_url,
            width: imageDimensions.cover.width || null,
            height: imageDimensions.cover.height || null,
            file_size: imageDimensions.cover.size || null
          },
          credentials: 'include'
        })
      )
    }

    // Wait for all images to be saved
    if (imagePromises.length > 0) {
      await Promise.all(imagePromises)
    }

    // Clear cache and redirect
    clearNuxtData('events-*')
    await navigateTo('/gestion/eventos')
  } catch (err: any) {
    console.error('Error creating event:', err)
    const message = err?.data?.detail || err?.message || 'Error al crear el evento'
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
