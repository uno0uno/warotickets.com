<template>
  <div class="w-full">
    <!-- No Event Error -->
    <div v-if="!eventId" class="bg-white border border-secondary-200 rounded-lg p-8 text-center">
      <ExclamationTriangleIcon class="w-16 h-16 mx-auto mb-4 text-yellow-500" />
      <p class="text-secondary-600 font-medium">No se especifico un evento</p>
      <p class="text-sm text-secondary-500 mt-1">Debes especificar el evento del area</p>
      <NuxtLink
        to="/gestion/areas"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
      >
        Ir a Areas
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <UiGestionLoader v-else-if="isLoading" />

    <!-- Error State -->
    <div v-else-if="fetchError" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <p class="text-xl font-semibold text-secondary-800 mb-2">Error al cargar el area</p>
        <p class="text-sm text-secondary-600 mb-4">{{ fetchError.message || 'Area no encontrada' }}</p>
        <NuxtLink :to="`/gestion/areas?event=${eventId}`" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Volver a areas
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Area Information Card -->
      <div class="bg-white border-2 border-secondary-200 rounded-lg mb-4 sm:mb-6">
        <div class="p-4 sm:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <!-- Area Name -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <TicketIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Area
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  {{ form.area_name || 'Sin nombre' }}
                </p>
              </div>
            </div>

            <!-- Capacity -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <UsersIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Capacidad
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  {{ form.capacity || 0 }}
                </p>
              </div>
            </div>

            <!-- Available -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <CheckCircleIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Disponibles
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  {{ areaData?.units_available ?? '-' }}
                </p>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <TagIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Estado
                </p>
                <div class="pt-1">
                  <span
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="getStatusClass(form.status)"
                  >
                    {{ getStatusLabel(form.status) }}
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
                  Configuracion
                </p>
                <p class="text-xs text-secondary-500 hidden sm:block">Estado y opciones</p>
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

                <!-- Nomenclature Letter (Read-only) -->
                <div>
                  <label class="block text-sm font-medium text-secondary-500 mb-2">
                    Letra/Codigo
                    <LockClosedIcon class="inline w-3 h-3 ml-1" />
                  </label>
                  <input
                    type="text"
                    :value="form.nomenclature_letter || '-'"
                    disabled
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-500 cursor-not-allowed"
                  />
                </div>

                <!-- Capacity (Read-only) -->
                <div>
                  <label class="block text-sm font-medium text-secondary-500 mb-2">
                    Capacidad Total
                    <LockClosedIcon class="inline w-3 h-3 ml-1" />
                  </label>
                  <input
                    type="text"
                    :value="form.capacity"
                    disabled
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-500 cursor-not-allowed"
                  />
                  <p class="text-xs text-secondary-400 mt-1">No editable - afecta tier de servicio</p>
                </div>

                <!-- Price (Read-only) -->
                <div>
                  <label class="block text-sm font-medium text-secondary-500 mb-2">
                    Precio Base
                    <LockClosedIcon class="inline w-3 h-3 ml-1" />
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                    <input
                      type="text"
                      :value="form.price ? Number(form.price).toLocaleString('es-CO') : '0'"
                      disabled
                      class="w-full pl-8 pr-4 py-2 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-500 cursor-not-allowed"
                    />
                  </div>
                  <p class="text-xs text-secondary-400 mt-1">No editable - precio pactado</p>
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
              </div>
            </div>
          </div>

          <!-- Step 2: Configuration -->
          <div v-else-if="currentStep === 2" key="step-2" class="bg-white border border-secondary-200 rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-4 sm:mb-6">Configuracion</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Estado
                  </label>
                  <select
                    v-model="form.status"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 bg-white"
                  >
                    <option value="available">Disponible</option>
                    <option value="sold_out">Agotada</option>
                    <option value="disabled">Deshabilitada</option>
                  </select>
                </div>

                <!-- Unit Capacity (Read-only) -->
                <div>
                  <label class="block text-sm font-medium text-secondary-500 mb-2">
                    Capacidad por Unidad
                    <LockClosedIcon class="inline w-3 h-3 ml-1" />
                  </label>
                  <input
                    type="text"
                    :value="form.unit_capacity || '1'"
                    disabled
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-500 cursor-not-allowed"
                  />
                  <p class="text-xs text-secondary-400 mt-1">No editable - configuracion de mesas/palcos</p>
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
  TicketIcon,
  UsersIcon,
  CheckCircleIcon,
  TagIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LockClosedIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const areaId = computed(() => route.params.id as string)
const eventId = computed(() => route.query.event ? Number(route.query.event) : null)

useHead({
  title: 'Editar Area - WaRo Tickets'
})

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
  unit_capacity: null as number | null,
  status: 'available'
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

// Fetch area data
const { data: areaData, pending: isLoading, error: fetchError } = useAsyncData(
  `area-${areaId.value}`,
  () => eventId.value ? $fetch(`/api/areas/event/${eventId.value}/${areaId.value}`, { credentials: 'include' }) : Promise.resolve(null),
  {
    server: false,
    transform: (response: any) => response?.data || response
  }
)

// Watch for area data to populate form
watch(areaData, (newData) => {
  if (newData) {
    form.area_name = newData.area_name || ''
    form.description = newData.description || ''
    form.capacity = newData.capacity || null
    form.price = newData.price ? Number(newData.price) : null
    form.currency = newData.currency || 'COP'
    form.nomenclature_letter = newData.nomenclature_letter || ''
    form.unit_capacity = newData.unit_capacity || null
    form.status = newData.status || 'available'
  }
}, { immediate: true })

// Status helpers
function getStatusClass(status: string) {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-700'
    case 'sold_out':
      return 'bg-red-100 text-red-700'
    case 'disabled':
      return 'bg-secondary-100 text-secondary-600'
    default:
      return 'bg-secondary-100 text-secondary-600'
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

// Validation per step
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    // Only area_name is editable and required
    return form.area_name && form.area_name.trim().length > 0
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
    // Build the payload - only editable fields
    // Non-editable (pactados al crear): capacity, price, nomenclature_letter, unit_capacity
    const payload: Record<string, any> = {
      area_name: form.area_name,
      currency: form.currency,
      status: form.status
    }

    // Optional editable field
    if (form.description !== undefined) payload.description = form.description

    await $fetch(`/api/areas/event/${eventId.value}/${areaId.value}`, {
      method: 'PATCH',
      body: payload,
      credentials: 'include'
    })

    // Redirect back to areas
    await navigateTo(`/gestion/areas?event=${eventId.value}`)
  } catch (err: any) {
    console.error('Error updating area:', err)
    const message = err?.data?.detail || err?.message || 'Error al actualizar el area'
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
