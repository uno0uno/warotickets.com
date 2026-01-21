<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="isLoadingEvent" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-secondary-500">Cargando informacion del evento...</p>
      </div>
    </div>

    <!-- No Event Error -->
    <div v-else-if="!eventId" class="bg-white border border-secondary-200 rounded-lg p-8 text-center">
      <ExclamationTriangleIcon class="w-16 h-16 mx-auto mb-4 text-yellow-500" />
      <p class="text-secondary-600 font-medium">No se especifico un evento</p>
      <p class="text-sm text-secondary-500 mt-1">Debes seleccionar un evento para crear una etapa</p>
      <NuxtLink
        to="/gestion/etapas"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
      >
        Ir a Etapas
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Header Card -->
      <div class="bg-white border-2 border-secondary-200 rounded-lg mb-4 sm:mb-6">
        <div class="p-4 sm:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <!-- Stage Name -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <ClockIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Nueva Etapa
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  {{ form.stage_name || 'Sin nombre' }}
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
                  {{ selectedEvent?.cluster_name || 'Cargando...' }}
                </p>
                <p v-if="selectedEvent?.start_date" class="text-xs text-secondary-500">
                  {{ formatEventDates() }}
                </p>
              </div>
            </div>

            <!-- Discount Preview -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <TagIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Ajuste de Precio
                </p>
                <p class="text-lg font-semibold" :class="form.price_adjustment_value < 0 ? 'text-green-600' : form.price_adjustment_value > 0 ? 'text-red-600' : 'text-secondary-900'">
                  {{ formatDiscountPreview() }}
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
                <CheckIcon v-if="currentStep > 1" class="w-4 h-4 sm:w-5 sm:h-5" />
                <span v-else class="font-semibold text-xs sm:text-sm">1</span>
              </div>
              <div class="ml-2 sm:ml-3 flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 1 ? 'text-secondary-900' : 'text-secondary-500'">
                  Informacion
                </p>
                <p class="text-xs text-secondary-400 hidden sm:block truncate">Nombre y descripcion</p>
              </div>
              <div class="flex-1 h-0.5 mx-2 sm:mx-4" :class="currentStep > 1 ? 'bg-secondary-600' : 'bg-secondary-200'"></div>
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
                <CheckIcon v-if="currentStep > 2" class="w-4 h-4 sm:w-5 sm:h-5" />
                <span v-else class="font-semibold text-xs sm:text-sm">2</span>
              </div>
              <div class="ml-2 sm:ml-3 flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 2 ? 'text-secondary-900' : 'text-secondary-500'">
                  Configuracion
                </p>
                <p class="text-xs text-secondary-400 hidden sm:block truncate">Precios y fechas</p>
              </div>
              <div class="flex-1 h-0.5 mx-2 sm:mx-4" :class="currentStep > 2 ? 'bg-secondary-600' : 'bg-secondary-200'"></div>
            </div>

            <!-- Step 3 -->
            <div class="flex items-center flex-1">
              <div
                class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors border-2 flex-shrink-0"
                :class="{
                  'bg-primary-600 text-white border-primary-600': currentStep === 3,
                  'bg-secondary-600 text-white border-secondary-600': currentStep > 3,
                  'border-secondary-300 text-secondary-400 bg-transparent': currentStep < 3
                }"
              >
                <CheckIcon v-if="currentStep > 3" class="w-4 h-4 sm:w-5 sm:h-5" />
                <span v-else class="font-semibold text-xs sm:text-sm">3</span>
              </div>
              <div class="ml-2 sm:ml-3 flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 3 ? 'text-secondary-900' : 'text-secondary-500'">
                  Areas
                </p>
                <p class="text-xs text-secondary-400 hidden sm:block truncate">Donde aplica</p>
              </div>
              <div class="flex-1 h-0.5 mx-2 sm:mx-4" :class="currentStep > 3 ? 'bg-secondary-600' : 'bg-secondary-200'"></div>
            </div>

            <!-- Step 4 -->
            <div class="flex items-center">
              <div
                class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors border-2 flex-shrink-0"
                :class="{
                  'bg-primary-600 text-white border-primary-600': currentStep === 4,
                  'bg-secondary-600 text-white border-secondary-600': currentStep > 4,
                  'border-secondary-300 text-secondary-400 bg-transparent': currentStep < 4
                }"
              >
                <span class="font-semibold text-xs sm:text-sm">4</span>
              </div>
              <div class="ml-2 sm:ml-3 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 4 ? 'text-secondary-900' : 'text-secondary-500'">
                  Revision
                </p>
                <p class="text-xs text-secondary-400 hidden sm:block">Confirmar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleNext">
        <Transition name="fade" mode="out-in">
          <!-- Step 1: Informacion basica -->
          <div v-if="currentStep === 1" key="step-1" class="bg-white border-secondary-200 border rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-4 sm:mb-6">Informacion de la Etapa</h3>

              <div class="space-y-4 sm:space-y-6">
                <!-- Stage Name -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Nombre de la Etapa *
                  </label>
                  <input
                    type="text"
                    v-model="form.stage_name"
                    placeholder="Ej: Early Bird, Preventa, Venta General"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                    required
                  />
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Descripcion
                  </label>
                  <textarea
                    v-model="form.description"
                    placeholder="Descripcion de la etapa de venta"
                    rows="3"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Configuracion -->
          <div v-else-if="currentStep === 2" key="step-2" class="bg-white border-secondary-200 border rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-4 sm:mb-6">Configuracion de Precios y Fechas</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <!-- Price Adjustment Type -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Tipo de Ajuste *
                  </label>
                  <select
                    v-model="form.price_adjustment_type"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 bg-white"
                    required
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Valor Fijo ($)</option>
                  </select>
                </div>

                <!-- Price Adjustment Value -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Valor del Ajuste *
                    <span class="text-secondary-500 font-normal">(negativo = descuento)</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">
                      {{ form.price_adjustment_type === 'percentage' ? '%' : '$' }}
                    </span>
                    <input
                      type="number"
                      v-model.number="form.price_adjustment_value"
                      placeholder="-20"
                      class="w-full pl-8 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                      required
                    />
                  </div>
                  <p class="text-xs text-secondary-500 mt-1">
                    Ej: -20 para 20% descuento, -50000 para $50,000 descuento
                  </p>
                </div>

                <!-- Quantity Available -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Cantidad Disponible *
                  </label>
                  <input
                    type="number"
                    v-model.number="form.quantity_available"
                    placeholder="100"
                    min="1"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                    required
                  />
                  <p class="text-xs text-secondary-500 mt-1">Cantidad de tickets a este precio (compartido entre areas)</p>
                </div>

                <!-- Priority Order -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Orden de Prioridad
                  </label>
                  <input
                    type="number"
                    v-model.number="form.priority_order"
                    placeholder="1"
                    min="0"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                  />
                  <p class="text-xs text-secondary-500 mt-1">Menor numero = mayor prioridad</p>
                </div>

                <!-- Start Time -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    v-model="form.start_time"
                    type="datetime-local"
                    required
                    :min="eventMinDate"
                    :max="eventMaxDate"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                  />
                  <p v-if="selectedEvent" class="text-xs text-secondary-500 mt-1">
                    Disponible {{ formatStageAvailableRange() }}
                  </p>
                </div>

                <!-- End Time -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Fecha de Fin
                    <span class="text-secondary-500 font-normal">(opcional)</span>
                  </label>
                  <input
                    v-model="form.end_time"
                    type="datetime-local"
                    :min="form.start_time || eventMinDate"
                    :max="eventMaxDate"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Areas -->
          <div v-else-if="currentStep === 3" key="step-3" class="bg-white border-secondary-200 border rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-4 sm:mb-6">Seleccionar Areas</h3>

              <!-- Areas Selection -->
              <div>
                <label class="block text-sm font-medium text-secondary-900 mb-3">
                  Areas donde aplica *
                </label>
                <div v-if="isLoadingAreas" class="text-secondary-500 text-sm py-4">
                  Cargando areas...
                </div>
                <div v-else-if="areas.length === 0" class="text-secondary-500 text-sm py-4 bg-secondary-50 rounded-lg px-4">
                  No hay areas disponibles para este evento. Crea areas primero.
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label
                    v-for="area in areas"
                    :key="area.id"
                    class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors"
                    :class="form.area_ids.includes(area.id) ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'"
                  >
                    <input
                      type="checkbox"
                      :value="area.id"
                      v-model="form.area_ids"
                      class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-secondary-900 truncate">{{ area.area_name }}</p>
                      <p class="text-xs text-secondary-500">${{ Number(area.price).toLocaleString('es-CO') }}</p>
                    </div>
                  </label>
                </div>
                <p v-if="areas.length > 0" class="text-xs text-secondary-500 mt-3">
                  Selecciona al menos un area
                </p>
              </div>

              <!-- Active Checkbox -->
              <div class="mt-6 pt-6 border-t border-secondary-200">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="form.is_active"
                    class="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <span class="text-sm font-medium text-secondary-900">Etapa activa</span>
                </label>
                <p class="text-xs text-secondary-500 mt-1 ml-8">La etapa estara disponible inmediatamente al crearla</p>
              </div>
            </div>
          </div>

          <!-- Step 4: Review -->
          <div v-else-if="currentStep === 4" key="step-4" class="bg-white border border-secondary-200 rounded-lg">
            <!-- Header -->
            <div class="border-b border-secondary-200 p-4 sm:p-6 md:p-8">
              <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 mb-2">NUEVA ETAPA DE VENTA</h1>
                  <p class="text-xs sm:text-sm text-secondary-500">Resumen de la etapa a crear</p>
                </div>
              </div>
            </div>

            <!-- Stage Info -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <div>
                  <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-2">Etapa</p>
                  <p class="text-lg font-bold text-secondary-900">{{ form.stage_name }}</p>
                  <p v-if="form.description" class="text-sm text-secondary-600 mt-2">{{ form.description }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-2">Evento</p>
                  <p class="text-base font-semibold text-secondary-900">{{ selectedEvent?.cluster_name }}</p>
                  <p v-if="selectedEvent?.start_date" class="text-sm text-secondary-500 mt-1">{{ formatEventDates() }}</p>
                </div>
              </div>
            </div>

            <!-- Discount and Quantity -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-secondary-50 border-b border-secondary-200">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
                Ajuste de Precio y Disponibilidad
              </p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Tipo de Ajuste</p>
                  <p class="text-lg font-bold text-secondary-900">{{ form.price_adjustment_type === 'percentage' ? 'Porcentaje' : 'Valor Fijo' }}</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Valor</p>
                  <p class="text-lg font-bold" :class="form.price_adjustment_value < 0 ? 'text-green-600' : 'text-red-600'">
                    {{ formatDiscountPreview() }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Cantidad</p>
                  <p class="text-lg font-bold text-secondary-900">{{ form.quantity_available }} tickets</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Prioridad</p>
                  <p class="text-lg font-bold text-secondary-900">{{ form.priority_order }}</p>
                </div>
              </div>
            </div>

            <!-- Dates -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
                Periodo de Vigencia
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Fecha de Inicio</p>
                  <p class="text-base font-semibold text-secondary-900">{{ formatDateDisplay(form.start_time) }}</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Fecha de Fin</p>
                  <p class="text-base font-semibold text-secondary-900">{{ form.end_time ? formatDateDisplay(form.end_time) : 'Sin fecha de fin' }}</p>
                </div>
              </div>
            </div>

            <!-- Areas -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
                Areas Aplicables ({{ selectedAreas.length }})
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="area in selectedAreas"
                  :key="area.id"
                  class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {{ area.area_name }}
                </span>
              </div>
            </div>

            <!-- Status -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-secondary-50 rounded-b-lg">
              <div class="flex items-center gap-2">
                <span
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="form.is_active ? 'bg-green-100 text-green-700' : 'bg-secondary-200 text-secondary-600'"
                >
                  {{ form.is_active ? 'Activa' : 'Inactiva' }}
                </span>
                <span class="text-sm text-secondary-500">La etapa {{ form.is_active ? 'estara disponible' : 'no estara disponible' }} al crearla</span>
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
              :to="`/gestion/etapas?event=${eventId}`"
              class="px-4 sm:px-6 py-2 sm:py-3 border-2 border-secondary-200 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 font-medium transition-colors"
            >
              Cancelar
            </NuxtLink>

            <button
              v-if="currentStep < 4"
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
              @click="submitStage"
              :disabled="isSubmitting"
              class="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{{ isSubmitting ? 'Creando...' : 'Crear Etapa' }}</span>
            </button>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ClockIcon,
  CalendarIcon,
  TagIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Crear Etapa - WaRo Tickets'
})

// Get event ID from query
const route = useRoute()
const eventId = computed(() => route.query.event ? Number(route.query.event) : null)

// State
const currentStep = ref(1)
const isSubmitting = ref(false)
const isLoadingEvent = ref(true)
const isLoadingAreas = ref(false)
const areas = ref<any[]>([])
const selectedEvent = ref<any>(null)

// Form state
const form = reactive({
  stage_name: '',
  description: '',
  price_adjustment_type: 'percentage' as 'percentage' | 'fixed',
  price_adjustment_value: -20,
  quantity_available: 100,
  priority_order: 1,
  start_time: '',
  end_time: '',
  area_ids: [] as number[],
  is_active: true
})

// Load event info
async function loadEvent() {
  if (!eventId.value) {
    isLoadingEvent.value = false
    return
  }
  isLoadingEvent.value = true
  try {
    const response = await $fetch(`/api/events/${eventId.value}`, {
      credentials: 'include'
    })
    selectedEvent.value = response
  } catch (err) {
    console.error('Error loading event:', err)
  } finally {
    isLoadingEvent.value = false
  }
}

// Load areas for the event
async function loadAreas() {
  if (!eventId.value) return
  isLoadingAreas.value = true
  try {
    const response = await $fetch(`/api/areas/event/${eventId.value}`, {
      credentials: 'include'
    })
    areas.value = (response as any) || []
  } catch (err) {
    console.error('Error loading areas:', err)
    areas.value = []
  } finally {
    isLoadingAreas.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadEvent()
  loadAreas()
})

// Selected areas for review
const selectedAreas = computed(() => {
  return areas.value.filter(a => form.area_ids.includes(a.id))
})

// Event date constraints for datetime inputs
const eventMinDate = computed(() => {
  if (!selectedEvent.value?.created_at) return ''
  return toDatetimeLocal(selectedEvent.value.created_at)
})

const eventMaxDate = computed(() => {
  if (!selectedEvent.value?.start_date) return ''
  return toDatetimeLocal(selectedEvent.value.start_date)
})

// Convert ISO date to datetime-local format (YYYY-MM-DDTHH:MM)
function toDatetimeLocal(isoDate: string): string {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Format event dates for header (actual event start and end dates)
function formatEventDates(): string {
  if (!selectedEvent.value?.start_date) return ''
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }

  const start = new Date(selectedEvent.value.start_date)
  const end = selectedEvent.value.end_date ? new Date(selectedEvent.value.end_date) : null

  if (end) {
    return `${start.toLocaleDateString('es-CO', options)} - ${end.toLocaleDateString('es-CO', options)}`
  }
  return start.toLocaleDateString('es-CO', options)
}

// Format available range for sale stages (from event creation to event start)
function formatStageAvailableRange(): string {
  if (!selectedEvent.value) return ''
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }

  const created = selectedEvent.value.created_at ? new Date(selectedEvent.value.created_at) : null
  const start = selectedEvent.value.start_date ? new Date(selectedEvent.value.start_date) : null

  if (created && start) {
    return `desde ${created.toLocaleDateString('es-CO', options)} hasta ${start.toLocaleDateString('es-CO', options)}`
  } else if (start) {
    return `hasta ${start.toLocaleDateString('es-CO', options)}`
  }
  return ''
}

// Format date for display in review
function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  return date.toLocaleDateString('es-CO', options)
}

// Validation per step
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return form.stage_name.trim().length > 0
  }
  if (currentStep.value === 2) {
    return form.price_adjustment_type &&
      form.price_adjustment_value !== null &&
      form.quantity_available > 0 &&
      form.start_time
  }
  if (currentStep.value === 3) {
    return form.area_ids.length > 0
  }
  return true
})

// Format discount preview
function formatDiscountPreview() {
  const value = form.price_adjustment_value
  if (value === null || value === undefined) return 'Sin ajuste'

  if (form.price_adjustment_type === 'percentage') {
    return `${value > 0 ? '+' : ''}${value}%`
  } else {
    const absValue = Math.abs(value)
    const formatted = absValue.toLocaleString('es-CO')
    return value < 0 ? `-$${formatted}` : value > 0 ? `+$${formatted}` : '$0'
  }
}

// Navigation
function handleNext() {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Submit
async function submitStage() {
  if (isSubmitting.value || !eventId.value) return

  isSubmitting.value = true

  try {
    const payload: Record<string, any> = {
      stage_name: form.stage_name,
      price_adjustment_type: form.price_adjustment_type,
      price_adjustment_value: form.price_adjustment_value,
      quantity_available: form.quantity_available,
      priority_order: form.priority_order || 0,
      start_time: new Date(form.start_time).toISOString(),
      area_ids: form.area_ids,
      is_active: form.is_active
    }

    if (form.description) payload.description = form.description
    if (form.end_time) payload.end_time = new Date(form.end_time).toISOString()

    await $fetch(`/api/sale-stages/event/${eventId.value}`, {
      method: 'POST',
      body: payload,
      credentials: 'include'
    })

    await navigateTo(`/gestion/etapas?event=${eventId.value}`)
  } catch (err: any) {
    console.error('Error creating stage:', err)
    const message = err?.data?.detail || err?.message || 'Error al crear la etapa'
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
