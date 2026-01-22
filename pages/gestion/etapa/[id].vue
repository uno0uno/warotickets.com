<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-secondary-500">Cargando etapa...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <p class="text-xl font-semibold text-secondary-800 mb-2">Error al cargar la etapa</p>
        <p class="text-sm text-secondary-600 mb-4">{{ fetchError }}</p>
        <NuxtLink :to="`/gestion/etapas?event=${eventId}`" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Volver a Etapas
        </NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Header Card -->
      <div class="bg-white border-2 border-secondary-200 rounded-lg mb-4 sm:mb-6">
        <div class="p-4 sm:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <!-- Stage Name -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <ClockIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Etapa
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

            <!-- Total Tickets -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <TicketIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Boletas en Pack
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  {{ totalTickets }} boletas
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
                <p class="text-lg font-semibold" :class="form.price_adjustment_type === 'fixed_price' ? 'text-primary-600' : form.price_adjustment_value < 0 ? 'text-green-600' : form.price_adjustment_value > 0 ? 'text-red-600' : 'text-secondary-900'">
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

              <!-- Price Adjustment Type -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-secondary-900 mb-3">
                  Tipo de Precio *
                </label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <!-- Percentage -->
                  <label
                    class="relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors"
                    :class="form.price_adjustment_type === 'percentage' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'"
                  >
                    <input type="radio" v-model="form.price_adjustment_type" value="percentage" class="sr-only" />
                    <span class="font-semibold text-secondary-900 mb-1">Porcentaje</span>
                    <p class="text-xs text-secondary-500">Descuento porcentual</p>
                    <p class="text-xs text-primary-600 mt-1">Ej: -20% descuento</p>
                  </label>

                  <!-- Fixed Discount -->
                  <label
                    class="relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors"
                    :class="form.price_adjustment_type === 'fixed' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'"
                  >
                    <input type="radio" v-model="form.price_adjustment_type" value="fixed" class="sr-only" />
                    <span class="font-semibold text-secondary-900 mb-1">Descuento Fijo</span>
                    <p class="text-xs text-secondary-500">Monto fijo de descuento</p>
                    <p class="text-xs text-primary-600 mt-1">Ej: -$50,000 del total</p>
                  </label>

                  <!-- Fixed Price (Bundle) -->
                  <label
                    class="relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors"
                    :class="form.price_adjustment_type === 'fixed_price' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'"
                  >
                    <input type="radio" v-model="form.price_adjustment_type" value="fixed_price" class="sr-only" />
                    <span class="font-semibold text-secondary-900 mb-1">Precio Fijo</span>
                    <p class="text-xs text-secondary-500">Precio total del paquete</p>
                    <p class="text-xs text-primary-600 mt-1">Ej: 2 boletas = $80,000</p>
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <!-- Price Adjustment Value -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    {{ form.price_adjustment_type === 'fixed_price' ? 'Precio Total del Paquete *' : 'Valor del Ajuste *' }}
                    <span v-if="form.price_adjustment_type !== 'fixed_price'" class="text-secondary-500 font-normal">(negativo = descuento)</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">
                      {{ form.price_adjustment_type === 'percentage' ? '%' : '$' }}
                    </span>
                    <input
                      type="number"
                      v-model.number="form.price_adjustment_value"
                      :placeholder="form.price_adjustment_type === 'fixed_price' ? '80000' : '-20'"
                      class="w-full pl-8 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                      required
                    />
                  </div>
                  <p class="text-xs text-secondary-500 mt-1">
                    {{ form.price_adjustment_type === 'fixed_price'
                      ? 'Precio total que pagara el comprador por el paquete'
                      : 'Ej: -20 para 20% descuento, -50000 para $50,000 descuento' }}
                  </p>
                </div>

                <!-- Overlap Warning -->
                <div v-if="overlapWarning" class="md:col-span-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div class="flex items-start gap-3">
                    <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="text-sm font-medium text-yellow-800">Conflicto de fechas detectado</p>
                      <p class="text-sm text-yellow-700 mt-1">{{ overlapWarning }}</p>
                      <p class="text-xs text-yellow-600 mt-2">Ajusta las fechas o selecciona otras areas en el siguiente paso.</p>
                    </div>
                  </div>
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
                  <p class="text-xs text-secondary-500 mt-1">
                    Vendidos: {{ originalStage?.quantity_sold || 0 }}
                  </p>
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
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-2">Armar el Paquete</h3>
              <p class="text-sm text-secondary-500 mb-4 sm:mb-6">Selecciona las areas y cantidad de boletas que incluye esta etapa</p>

              <!-- Areas Selection -->
              <div v-if="isLoadingAreas" class="text-secondary-500 text-sm py-4">
                Cargando areas...
              </div>
              <div v-else-if="areas.length === 0" class="text-secondary-500 text-sm py-4 bg-secondary-50 rounded-lg px-4">
                No hay areas disponibles para este evento.
              </div>
              <div v-else class="space-y-4">
                <!-- Current Items -->
                <div v-if="form.area_items.length > 0" class="space-y-3">
                  <div
                    v-for="(item, index) in form.area_items"
                    :key="index"
                    class="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-lg"
                  >
                    <div class="flex-1">
                      <p class="font-medium text-secondary-900">{{ getAreaName(item.area_id) }}</p>
                      <p class="text-xs text-secondary-500">${{ getAreaPrice(item.area_id).toLocaleString('es-CO') }} c/u</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click="decrementQuantity(index)"
                        class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-secondary-200 hover:bg-secondary-50"
                      >
                        <MinusIcon class="w-4 h-4" />
                      </button>
                      <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>
                      <button
                        type="button"
                        @click="incrementQuantity(index)"
                        class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-secondary-200 hover:bg-secondary-50"
                      >
                        <PlusIcon class="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="removeItem(index)"
                      class="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Add Area -->
                <div class="border-2 border-dashed border-secondary-200 rounded-lg p-4">
                  <p class="text-sm font-medium text-secondary-700 mb-3">Agregar area al paquete:</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <button
                      v-for="area in availableAreas"
                      :key="area.id"
                      type="button"
                      @click="addArea(area.id)"
                      class="flex items-center gap-2 p-3 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                    >
                      <PlusCircleIcon class="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <div class="flex-1 min-w-0">
                        <p class="font-medium text-secondary-900 truncate">{{ area.area_name }}</p>
                        <p class="text-xs text-secondary-500">${{ Number(area.price).toLocaleString('es-CO') }}</p>
                      </div>
                    </button>
                  </div>
                  <p v-if="availableAreas.length === 0 && areas.length > 0" class="text-xs text-secondary-500 mt-2">
                    Todas las areas ya fueron agregadas al paquete
                  </p>
                </div>

                <!-- Summary -->
                <div v-if="form.area_items.length > 0" class="mt-4 p-4 bg-secondary-50 rounded-lg">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p class="text-sm text-secondary-600">Total boletas:</p>
                      <p class="text-xl font-bold text-secondary-900">{{ totalTickets }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-secondary-600">Precio original:</p>
                      <p class="text-xl font-bold text-secondary-900">${{ originalPrice.toLocaleString('es-CO') }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-secondary-600">Precio final:</p>
                      <p class="text-xl font-bold text-primary-600">${{ calculatedPrice.toLocaleString('es-CO') }}</p>
                    </div>
                    <div v-if="savings > 0">
                      <p class="text-sm text-secondary-600">Ahorro:</p>
                      <p class="text-xl font-bold text-green-600">${{ savings.toLocaleString('es-CO') }}</p>
                    </div>
                  </div>
                </div>

                <!-- Overlap Warning in Step 3 -->
                <div v-if="overlapWarning" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div class="flex items-start gap-3">
                    <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="text-sm font-medium text-yellow-800">Conflicto de fechas detectado</p>
                      <p class="text-sm text-yellow-700 mt-1">{{ overlapWarning }}</p>
                      <p class="text-xs text-yellow-600 mt-2">Vuelve al paso anterior para ajustar las fechas.</p>
                    </div>
                  </div>
                </div>
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
                <p class="text-xs text-secondary-500 mt-1 ml-8">La etapa estara disponible para los compradores</p>
              </div>
            </div>
          </div>

          <!-- Step 4: Review -->
          <div v-else-if="currentStep === 4" key="step-4" class="bg-white border border-secondary-200 rounded-lg">
            <!-- Header -->
            <div class="border-b border-secondary-200 p-4 sm:p-6 md:p-8">
              <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 mb-2">EDITAR ETAPA DE VENTA</h1>
                  <p class="text-xs sm:text-sm text-secondary-500">Resumen de los cambios</p>
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

            <!-- Pricing Summary -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-secondary-50 border-b border-secondary-200">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
                Precio y Disponibilidad
              </p>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Tipo de Precio</p>
                  <p class="text-lg font-bold text-secondary-900">
                    {{ form.price_adjustment_type === 'fixed_price' ? 'Precio Fijo' : form.price_adjustment_type === 'percentage' ? 'Porcentaje' : 'Descuento Fijo' }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Precio Original</p>
                  <p class="text-lg font-bold text-secondary-500 line-through">${{ originalPrice.toLocaleString('es-CO') }}</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Precio Final</p>
                  <p class="text-lg font-bold text-primary-600">${{ calculatedPrice.toLocaleString('es-CO') }}</p>
                </div>
                <div v-if="savings > 0">
                  <p class="text-sm text-secondary-600 mb-1">Ahorro</p>
                  <p class="text-lg font-bold text-green-600">${{ savings.toLocaleString('es-CO') }}</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Disponibles</p>
                  <p class="text-lg font-bold text-secondary-900">{{ form.quantity_available }} paquetes</p>
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

            <!-- Areas/Bundle -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
                Paquete: {{ totalTickets }} boletas
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="area in selectedAreas"
                  :key="area.id"
                  class="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {{ area.quantity }}x {{ area.area_name }}
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
                <span class="text-sm text-secondary-500">La etapa {{ form.is_active ? 'esta disponible' : 'no esta disponible' }} para los compradores</span>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-4 sm:mt-6 gap-3">
          <div class="flex gap-3">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="previousStep"
              class="px-4 sm:px-6 py-2 sm:py-3 border-2 border-secondary-200 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 font-medium transition-colors"
            >
              <span class="hidden sm:inline">&larr; Anterior</span>
              <span class="sm:hidden">&larr;</span>
            </button>
            <button
              v-if="currentStep === 4"
              type="button"
              @click="confirmDelete"
              class="px-4 sm:px-6 py-2 sm:py-3 border-2 border-red-200 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
            >
              Eliminar
            </button>
          </div>

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
              <span>{{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}</span>
            </button>
          </div>
        </div>
      </form>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-secondary-900 mb-2">Eliminar Etapa</h3>
          <p class="text-secondary-600 mb-6">
            ¿Estas seguro de eliminar la etapa <strong>{{ form.stage_name }}</strong>? Esta accion no se puede deshacer.
          </p>
          <div class="flex gap-3 justify-end">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="deleteStage"
              :disabled="isDeleting"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 transition-colors"
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
import {
  ClockIcon,
  CalendarIcon,
  TagIcon,
  TicketIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  PlusCircleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Editar Etapa - WaRo Tickets'
})

// Get IDs from route
const route = useRoute()
const stageId = computed(() => route.params.id as string)
const eventId = computed(() => route.query.event ? Number(route.query.event) : null)

// Redirect if no event
if (!eventId.value) {
  navigateTo('/gestion/etapas')
}

// State
const currentStep = ref(1)
const isLoading = ref(true)
const fetchError = ref<string | null>(null)
const isSubmitting = ref(false)
const isLoadingAreas = ref(false)
const areas = ref<any[]>([])
const selectedEvent = ref<any>(null)
const originalStage = ref<any>(null)

// Delete modal
const showDeleteModal = ref(false)
const isDeleting = ref(false)

// Overlap validation
const existingStages = ref<any[]>([])
const overlapWarning = ref<string | null>(null)

// Form state
const form = reactive({
  stage_name: '',
  description: '',
  price_adjustment_type: 'percentage' as 'percentage' | 'fixed' | 'fixed_price',
  price_adjustment_value: 0,
  quantity_available: 100,
  priority_order: 0,
  start_time: '',
  end_time: '',
  area_items: [] as { area_id: number; quantity: number }[],
  is_active: true
})

// Computed: area_ids for backwards compatibility
const formAreaIds = computed(() => form.area_items.map(item => item.area_id))

// Computed: total tickets in bundle
const totalTickets = computed(() => {
  return form.area_items.reduce((sum, item) => sum + item.quantity, 0)
})

// Computed: original price (sum of all areas * quantities)
const originalPrice = computed(() => {
  return form.area_items.reduce((sum, item) => {
    const area = areas.value.find(a => a.id === item.area_id)
    return sum + (area ? Number(area.price) * item.quantity : 0)
  }, 0)
})

// Available areas (not yet added to bundle)
const availableAreas = computed(() => {
  const usedIds = form.area_items.map(item => item.area_id)
  return areas.value.filter(a => !usedIds.includes(a.id))
})

// Calculate final price for preview
const calculatedPrice = computed(() => {
  if (form.price_adjustment_type === 'fixed_price') {
    return Math.abs(form.price_adjustment_value)
  } else if (form.price_adjustment_type === 'percentage') {
    return originalPrice.value * (1 + form.price_adjustment_value / 100)
  } else {
    return originalPrice.value + form.price_adjustment_value
  }
})

// Calculate savings
const savings = computed(() => {
  return originalPrice.value - calculatedPrice.value
})

// Area helpers
function getAreaName(areaId: number): string {
  const area = areas.value.find(a => a.id === areaId)
  return area?.area_name || 'Area desconocida'
}

function getAreaPrice(areaId: number): number {
  const area = areas.value.find(a => a.id === areaId)
  return area ? Number(area.price) : 0
}

// Bundle management
function addArea(areaId: number) {
  form.area_items.push({ area_id: areaId, quantity: 1 })
}

function removeItem(index: number) {
  form.area_items.splice(index, 1)
}

function incrementQuantity(index: number) {
  form.area_items[index].quantity++
}

function decrementQuantity(index: number) {
  if (form.area_items[index].quantity > 1) {
    form.area_items[index].quantity--
  }
}

// Load stage data
async function loadStage() {
  if (!eventId.value || !stageId.value) return

  isLoading.value = true
  fetchError.value = null

  try {
    const response = await $fetch(`/api/sale-stages/event/${eventId.value}/${stageId.value}`, {
      credentials: 'include'
    }) as any

    originalStage.value = response

    // Populate form
    form.stage_name = response.stage_name || ''
    form.description = response.description || ''
    form.price_adjustment_type = response.price_adjustment_type || 'percentage'
    form.price_adjustment_value = response.price_adjustment_value || 0
    form.quantity_available = response.quantity_available || 100
    form.priority_order = response.priority_order || 0
    form.is_active = response.is_active ?? true

    // Convert areas with quantities to area_items format
    if (response.areas && response.areas.length > 0) {
      form.area_items = response.areas.map((a: any) => ({
        area_id: a.id,
        quantity: a.quantity || 1
      }))
    } else if (response.area_ids && response.area_ids.length > 0) {
      // Fallback for old format without quantities
      form.area_items = response.area_ids.map((id: number) => ({
        area_id: id,
        quantity: 1
      }))
    }

    // Format dates for datetime-local input
    if (response.start_time) {
      form.start_time = formatDateForInput(response.start_time)
    }
    if (response.end_time) {
      form.end_time = formatDateForInput(response.end_time)
    }
  } catch (err: any) {
    console.error('Error loading stage:', err)
    fetchError.value = err?.data?.detail || 'Error al cargar la etapa'
  } finally {
    isLoading.value = false
  }
}

// Load event info
async function loadEvent() {
  if (!eventId.value) return
  try {
    const response = await $fetch(`/api/events/${eventId.value}`, {
      credentials: 'include'
    })
    selectedEvent.value = response
  } catch (err) {
    console.error('Error loading event:', err)
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

// Load existing stages for the event
async function loadStages() {
  if (!eventId.value) return
  try {
    const response = await $fetch(`/api/sale-stages/event/${eventId.value}`, {
      credentials: 'include'
    })
    existingStages.value = (response as any) || []
  } catch (err) {
    console.error('Error loading stages:', err)
    existingStages.value = []
  }
}

// Check for overlapping stages (excluding current stage)
function checkOverlappingStages(): string | null {
  if (!form.start_time || formAreaIds.value.length === 0) return null

  const newStart = new Date(form.start_time)
  const newEnd = form.end_time ? new Date(form.end_time) : null

  for (const stage of existingStages.value) {
    // Skip current stage and inactive stages
    if (stage.id === stageId.value || !stage.is_active) continue

    // Get areas for this stage
    const stageAreaIds = stage.areas?.map((a: any) => a.id) || []
    const overlappingAreas = formAreaIds.value.filter(id => stageAreaIds.includes(id))

    if (overlappingAreas.length === 0) continue

    const stageStart = new Date(stage.start_time)
    const stageEnd = stage.end_time ? new Date(stage.end_time) : null

    // Check date overlap: start1 < end2 AND start2 < end1
    let datesOverlap = false

    if (newEnd && stageEnd) {
      datesOverlap = newStart < stageEnd && stageStart < newEnd
    } else if (!newEnd && stageEnd) {
      datesOverlap = newStart < stageEnd
    } else if (newEnd && !stageEnd) {
      datesOverlap = stageStart < newEnd
    } else {
      datesOverlap = true
    }

    if (datesOverlap) {
      const areaNames = areas.value
        .filter(a => overlappingAreas.includes(a.id))
        .map(a => a.area_name)
        .join(', ')
      return `Las fechas se superponen con la etapa "${stage.stage_name}" en las areas: ${areaNames}`
    }
  }

  return null
}

// Watch for changes and validate
watch([() => form.start_time, () => form.end_time, () => form.area_items], () => {
  overlapWarning.value = checkOverlappingStages()
}, { deep: true })

// Format date for datetime-local input
function formatDateForInput(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Load data on mount
onMounted(() => {
  loadStage()
  loadEvent()
  loadAreas()
  loadStages()
})

// Selected areas for review (includes quantity)
const selectedAreas = computed(() => {
  return form.area_items.map(item => {
    const area = areas.value.find(a => a.id === item.area_id)
    return {
      ...area,
      quantity: item.quantity
    }
  }).filter(a => a.id)
})

// Event date constraints for datetime inputs
const eventMinDate = computed(() => {
  if (!selectedEvent.value?.created_at) return ''
  return formatDateForInput(selectedEvent.value.created_at)
})

const eventMaxDate = computed(() => {
  if (!selectedEvent.value?.start_date) return ''
  return formatDateForInput(selectedEvent.value.start_date)
})

// Format event dates for header
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

// Format available range for sale stages
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
      form.start_time &&
      !overlapWarning.value
  }
  if (currentStep.value === 3) {
    return form.area_items.length > 0 && !overlapWarning.value
  }
  return true
})

// Format discount preview
function formatDiscountPreview() {
  const value = form.price_adjustment_value
  if (value === null || value === undefined) return 'Sin ajuste'

  if (form.price_adjustment_type === 'fixed_price') {
    return `$${Math.abs(value).toLocaleString('es-CO')} total`
  } else if (form.price_adjustment_type === 'percentage') {
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

// Submit update
async function submitStage() {
  if (isSubmitting.value || !eventId.value) return

  isSubmitting.value = true

  try {
    const payload: Record<string, any> = {
      stage_name: form.stage_name,
      price_adjustment_type: form.price_adjustment_type,
      price_adjustment_value: form.price_adjustment_type === 'fixed_price'
        ? Math.abs(form.price_adjustment_value)
        : form.price_adjustment_value,
      quantity_available: form.quantity_available,
      priority_order: form.priority_order || 0,
      start_time: new Date(form.start_time).toISOString(),
      area_items: form.area_items,
      is_active: form.is_active
    }

    if (form.description) payload.description = form.description
    if (form.end_time) {
      payload.end_time = new Date(form.end_time).toISOString()
    } else {
      payload.end_time = null
    }

    await $fetch(`/api/sale-stages/event/${eventId.value}/${stageId.value}`, {
      method: 'PATCH',
      body: payload,
      credentials: 'include'
    })

    await navigateTo(`/gestion/etapas?event=${eventId.value}`)
  } catch (err: any) {
    console.error('Error updating stage:', err)
    const message = err?.data?.detail || err?.message || 'Error al actualizar la etapa'
    alert(message)
  } finally {
    isSubmitting.value = false
  }
}

// Delete
function confirmDelete() {
  showDeleteModal.value = true
}

async function deleteStage() {
  if (isDeleting.value || !eventId.value) return

  isDeleting.value = true

  try {
    await $fetch(`/api/sale-stages/event/${eventId.value}/${stageId.value}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    await navigateTo(`/gestion/etapas?event=${eventId.value}`)
  } catch (err: any) {
    console.error('Error deleting stage:', err)
    const message = err?.data?.detail || err?.message || 'Error al eliminar la etapa'
    alert(message)
  } finally {
    isDeleting.value = false
    showDeleteModal.value = false
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
