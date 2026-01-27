<template>
  <div class="w-full">
    <!-- No Event Error -->
    <div v-if="!eventId" class="bg-white border border-secondary-200 rounded-lg p-8 text-center">
      <ExclamationTriangleIcon class="w-16 h-16 mx-auto mb-4 text-yellow-500" />
      <p class="text-secondary-600 font-medium">No se especifico un evento</p>
      <p class="text-sm text-secondary-500 mt-1">Debes seleccionar un evento para crear un area</p>
      <NuxtLink
        to="/gestion/areas"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
      >
        Ir a Areas
      </NuxtLink>
    </div>

    <!-- Loading Event State -->
    <UiGestionLoader v-else-if="!eventData && !fetchError" />

    <template v-else>
      <!-- Area Information Card -->
      <div class="bg-white border-2 border-secondary-200 rounded-lg mb-4 sm:mb-6">
        <div class="p-4 sm:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <!-- Area Name -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <TicketIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Nueva Area
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  {{ form.area_name || 'Sin nombre' }}
                </p>
              </div>
            </div>

            <!-- Event -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <CalendarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Evento
                </p>
                <p class="text-sm sm:text-lg font-semibold text-secondary-900">
                  {{ eventData?.cluster_name || 'Cargando...' }}
                </p>
              </div>
            </div>

            <!-- Price -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <CurrencyDollarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Precio
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  ${{ form.price ? Number(form.price).toLocaleString('es-CO') : '0' }}
                </p>
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
                  <span class="hidden sm:inline">Informacion del Area</span>
                  <span class="sm:hidden">Info</span>
                </p>
                <p class="text-xs text-secondary-500 hidden sm:block">Nombre, capacidad y precio</p>
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
        <!-- Step 1: Informacion del Area -->
        <Transition name="fade" mode="out-in">
          <div v-if="currentStep === 1" key="step-1" class="bg-white border-secondary-200 border rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-4 sm:mb-6">Informacion del Area</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <!-- Area Name -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Nombre del Area *
                  </label>
                  <input
                    type="text"
                    v-model="form.area_name"
                    placeholder="Ej: VIP, General, Palco A"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                    required
                  />
                </div>

                <!-- Nomenclature Letter -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Letra/Codigo
                  </label>
                  <input
                    type="text"
                    v-model="form.nomenclature_letter"
                    placeholder="Ej: A, B, VIP"
                    maxlength="10"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                  />
                  <p class="text-xs text-secondary-500 mt-1">Identificador corto para boletas</p>
                </div>

                <!-- Capacity -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Capacidad Total *
                  </label>
                  <input
                    type="number"
                    v-model.number="form.capacity"
                    min="1"
                    placeholder="100"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                    required
                  />
                </div>

                <!-- Price -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Precio Base *
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">$</span>
                    <input
                      type="number"
                      v-model.number="form.price"
                      min="0"
                      step="1000"
                      placeholder="50000"
                      class="w-full pl-8 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                      required
                    />
                  </div>
                </div>

                <!-- Currency -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Moneda
                  </label>
                  <select
                    v-model="form.currency"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 bg-white"
                  >
                    <option value="COP">COP - Peso Colombiano</option>
                    <option value="USD">USD - Dolar Americano</option>
                  </select>
                </div>

                <!-- Unit Capacity (for tables/boxes) -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Capacidad por Unidad
                  </label>
                  <input
                    type="number"
                    v-model.number="form.unit_capacity"
                    min="1"
                    placeholder="1"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                  />
                  <p class="text-xs text-secondary-500 mt-1">Para mesas o palcos (personas por unidad)</p>
                </div>

                <!-- Description -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Descripcion
                  </label>
                  <textarea
                    v-model="form.description"
                    placeholder="Descripcion del area, beneficios incluidos, ubicacion, etc."
                    rows="3"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 resize-none"
                  />
                </div>

                <!-- Dynamic Service Cost Info -->
                <div v-if="form.price && form.price > 0" class="md:col-span-2 bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                  <div class="flex items-center gap-2 mb-3">
                    <InformationCircleIcon class="w-5 h-5 text-primary-600" />
                    <p class="text-sm font-medium text-secondary-900">Costo de Servicio Waro Tickets</p>
                  </div>
                  <p class="text-xs text-secondary-600 mb-3">El costo de servicio varia segun el volumen de boletas vendidas:</p>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div
                      v-for="tier in serviceTiers"
                      :key="tier.label"
                      class="rounded-lg p-3 transition-all"
                      :class="tier.isActive ? 'bg-primary-50 border-2 border-primary-500 ring-2 ring-primary-100' : 'bg-white border border-secondary-200'"
                    >
                      <p class="text-xs font-medium mb-1" :class="tier.isActive ? 'text-primary-700' : 'text-secondary-700'">{{ tier.label }}</p>
                      <p class="text-xs text-secondary-500 mb-2">2.39% + ${{ tier.fixedFee.toLocaleString('es-CO') }}</p>
                      <p class="text-sm font-bold" :class="tier.isActive ? 'text-primary-700' : 'text-secondary-900'">${{ tier.serviceCost.toLocaleString('es-CO') }}</p>
                      <p class="text-xs text-secondary-500">Publico: ${{ tier.publicPrice.toLocaleString('es-CO') }}</p>
                      <span v-if="tier.isActive" class="inline-block mt-2 text-xs font-medium text-primary-600 bg-primary-100 px-2 py-0.5 rounded">Aplica</span>
                    </div>
                  </div>
                  <p class="text-xs text-secondary-500 mt-3 italic">* Tu recibes: ${{ Number(form.price).toLocaleString('es-CO') }} por boleta. Tarifas incluyen IVA.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Review -->
          <div v-else-if="currentStep === 2" key="step-2" class="bg-white border border-secondary-200 rounded-lg">
            <!-- Header -->
            <div class="border-b border-secondary-200 p-4 sm:p-6 md:p-8">
              <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 mb-2">NUEVA AREA</h1>
                  <p class="text-xs sm:text-sm text-secondary-500">Resumen del area a crear</p>
                </div>
              </div>
            </div>

            <!-- Area Info -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <div>
                  <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-2">Area</p>
                  <p class="text-lg font-bold text-secondary-900">{{ form.area_name }}</p>
                  <p v-if="form.nomenclature_letter" class="text-sm text-secondary-600 mt-1">Codigo: {{ form.nomenclature_letter }}</p>
                  <p v-if="form.description" class="text-sm text-secondary-600 mt-2">{{ form.description }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-2">Evento</p>
                  <p class="text-base font-semibold text-secondary-900">{{ eventData?.cluster_name }}</p>
                </div>
              </div>
            </div>

            <!-- Capacity and Pricing -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-secondary-50">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
                Capacidad y Precios
              </p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Capacidad</p>
                  <p class="text-lg font-bold text-secondary-900">{{ form.capacity }} unidades</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Tu recibes</p>
                  <p class="text-lg font-bold text-secondary-900">${{ Number(form.price).toLocaleString('es-CO') }}</p>
                </div>
                <div v-if="form.unit_capacity">
                  <p class="text-sm text-secondary-600 mb-1">Por Unidad</p>
                  <p class="text-lg font-bold text-secondary-900">{{ form.unit_capacity }} personas</p>
                </div>
              </div>
            </div>

            <!-- Service Cost - Active Tier Only -->
            <div v-if="activeTier" class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t border-secondary-200">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
                Costo de Servicio Aplicado
              </p>
              <div class="bg-primary-50 border-2 border-primary-500 rounded-lg p-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p class="text-sm font-medium text-primary-700 mb-1">Volumen: {{ activeTier.label }} boletas</p>
                    <p class="text-xs text-secondary-600">Tarifa: 2.39% + ${{ activeTier.fixedFee.toLocaleString('es-CO') }}</p>
                  </div>
                  <div class="text-left sm:text-right">
                    <p class="text-xs text-secondary-500">Costo servicio</p>
                    <p class="text-lg font-bold text-primary-700">${{ activeTier.serviceCost.toLocaleString('es-CO') }}</p>
                  </div>
                  <div class="text-left sm:text-right">
                    <p class="text-xs text-secondary-500">Precio publico</p>
                    <p class="text-xl font-bold text-secondary-900">${{ activeTier.publicPrice.toLocaleString('es-CO') }}</p>
                  </div>
                </div>
              </div>
              <p class="text-xs text-secondary-500 mt-3 italic">* Tarifas incluyen IVA sobre la comision de procesamiento.</p>
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
              :to="`/gestion/areas?event=${eventId}`"
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
              @click="submitArea"
              :disabled="isSubmitting"
              class="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{{ isSubmitting ? 'Creando...' : 'Crear Area' }}</span>
            </button>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  TicketIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Crear Area - WaRo Tickets'
})

// Get event ID from query
const route = useRoute()
const eventId = computed(() => route.query.event ? Number(route.query.event) : null)

// State
const currentStep = ref(1)
const isSubmitting = ref(false)

// Form state
const form = reactive({
  area_name: '',
  description: '',
  capacity: null as number | null,
  price: null as number | null,
  currency: 'COP',
  nomenclature_letter: '',
  unit_capacity: null as number | null
})

// Service cost tiers based on volume (from COTIZACION_WARO_TICKETS_2026.pdf)
// Formula: price * 2.39% + fixed fee (varies by volume, already includes IVA)
const RATE = 0.0239

const serviceTiers = computed(() => {
  const price = form.price || 0
  if (price <= 0) return []

  const tiers = [
    { label: '1 - 500', fixedFee: 1290 },
    { label: '501 - 2,000', fixedFee: 1190 },
    { label: '2,001 - 5,000', fixedFee: 1090 },
    { label: '+ 5,000', fixedFee: 990 }
  ]

  const capacity = form.capacity || 0

  return tiers.map((tier, index) => {
    const serviceCost = Math.round(price * RATE + tier.fixedFee)
    // Determine if this tier is active based on capacity
    let isActive = false
    if (capacity > 0) {
      if (index === 0 && capacity <= 500) isActive = true
      else if (index === 1 && capacity > 500 && capacity <= 2000) isActive = true
      else if (index === 2 && capacity > 2000 && capacity <= 5000) isActive = true
      else if (index === 3 && capacity > 5000) isActive = true
    }
    return {
      label: tier.label,
      fixedFee: tier.fixedFee,
      serviceCost,
      publicPrice: price + serviceCost,
      isActive
    }
  })
})

// Get only the active tier for the review section
const activeTier = computed(() => {
  return serviceTiers.value.find(tier => tier.isActive) || null
})

// Fetch event data for display
const { data: eventData } = useAsyncData(
  `event-${eventId.value}`,
  () => eventId.value ? $fetch(`/api/events/${eventId.value}`, { credentials: 'include' }) : Promise.resolve(null),
  {
    server: false,
    transform: (response: any) => response?.data || response
  }
)

// Validation per step
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return form.area_name && form.capacity && form.capacity > 0 && form.price !== null && form.price >= 0
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
async function submitArea() {
  if (isSubmitting.value || !eventId.value) return

  isSubmitting.value = true

  try {
    // Build the payload
    const payload: Record<string, any> = {
      area_name: form.area_name,
      capacity: form.capacity,
      price: form.price,
      currency: form.currency
    }

    // Optional fields
    if (form.description) payload.description = form.description
    if (form.nomenclature_letter) payload.nomenclature_letter = form.nomenclature_letter
    if (form.unit_capacity) payload.unit_capacity = form.unit_capacity

    await $fetch(`/api/areas/event/${eventId.value}`, {
      method: 'POST',
      body: payload,
      credentials: 'include'
    })

    // Redirect back to areas
    await navigateTo(`/gestion/areas?event=${eventId.value}`)
  } catch (err: any) {
    console.error('Error creating area:', err)
    const message = err?.data?.detail || err?.message || 'Error al crear el area'
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
