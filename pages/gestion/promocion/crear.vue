<template>
  <div class="w-full">
    <!-- Loading State -->
    <UiGestionLoader v-if="isLoadingEvent" />

    <!-- No Event Error -->
    <div v-else-if="!eventId" class="bg-white border border-secondary-200 rounded-lg p-8 text-center">
      <ExclamationTriangleIcon class="w-16 h-16 mx-auto mb-4 text-yellow-500" />
      <p class="text-secondary-600 font-medium">No se especifico un evento</p>
      <p class="text-sm text-secondary-500 mt-1">Debes seleccionar un evento para crear una promocion</p>
      <NuxtLink
        to="/gestion/promociones"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
      >
        Ir a Promociones
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Header Card -->
      <div class="bg-white border-2 border-secondary-200 rounded-lg mb-4 sm:mb-6">
        <div class="p-4 sm:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <!-- Promotion Name -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <TicketIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Nueva Promocion
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  {{ form.promotion_name || 'Sin nombre' }}
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
              </div>
            </div>

            <!-- Total Tickets -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <UsersIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Boletas en Combo
                </p>
                <p class="text-lg font-semibold text-secondary-900">
                  {{ totalTickets }} boletas
                </p>
              </div>
            </div>

            <!-- Price Preview -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <TagIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  Precio
                </p>
                <p class="text-lg font-semibold text-green-600">
                  {{ formatPricePreview() }}
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
                  Combo
                </p>
                <p class="text-xs text-secondary-400 hidden sm:block truncate">Areas y cantidades</p>
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
                  Precio
                </p>
                <p class="text-xs text-secondary-400 hidden sm:block truncate">Tipo y valor</p>
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
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-4 sm:mb-6">Informacion de la Promocion</h3>

              <div class="space-y-4 sm:space-y-6">
                <!-- Promotion Name -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">
                    Nombre de la Promocion *
                  </label>
                  <input
                    type="text"
                    v-model="form.promotion_name"
                    placeholder="Ej: Pack Familiar, 2x1 VIP, Combo Amigos"
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
                    placeholder="Descripcion del combo o paquete promocional"
                    rows="3"
                    class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Combo Builder -->
          <div v-else-if="currentStep === 2" key="step-2" class="bg-white border-secondary-200 border rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-2">Armar el Combo</h3>
              <p class="text-sm text-secondary-500 mb-4 sm:mb-6">Selecciona las areas y cantidad de boletas que incluye este combo/paquete</p>

              <!-- Areas Selection -->
              <div v-if="isLoadingAreas" class="text-secondary-500 text-sm py-4">
                Cargando areas...
              </div>
              <div v-else-if="areas.length === 0" class="text-secondary-500 text-sm py-4 bg-secondary-50 rounded-lg px-4">
                No hay areas disponibles para este evento. Crea areas primero.
              </div>
              <div v-else class="space-y-4">
                <!-- Current Items -->
                <div v-if="form.items.length > 0" class="space-y-3">
                  <div
                    v-for="(item, index) in form.items"
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
                  <p class="text-sm font-medium text-secondary-700 mb-3">Agregar area al combo:</p>
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
                    Todas las areas ya fueron agregadas al combo
                  </p>
                </div>

                <!-- Summary -->
                <div v-if="form.items.length > 0" class="mt-4 p-4 bg-secondary-50 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="text-sm text-secondary-600">Total boletas en el combo:</p>
                      <p class="text-2xl font-bold text-secondary-900">{{ totalTickets }} boletas</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-secondary-600">Precio original:</p>
                      <p class="text-2xl font-bold text-secondary-900">${{ originalPrice.toLocaleString('es-CO') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Pricing -->
          <div v-else-if="currentStep === 3" key="step-3" class="bg-white border-secondary-200 border rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-2">Configuracion del Precio</h3>
              <p class="text-sm text-secondary-500 mb-4 sm:mb-6">Define como se calcula el precio del combo</p>

              <div class="space-y-6">
                <!-- Pricing Type Selection -->
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-3">
                    Tipo de Promocion *
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <!-- Fixed Price -->
                    <label
                      class="relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors"
                      :class="form.pricing_type === 'fixed_price' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'"
                    >
                      <input type="radio" v-model="form.pricing_type" value="fixed_price" class="sr-only" />
                      <div class="flex items-center gap-2 mb-2">
                        <CurrencyDollarIcon class="w-5 h-5 text-primary-600" />
                        <span class="font-semibold text-secondary-900">Precio Fijo</span>
                      </div>
                      <p class="text-xs text-secondary-500">El combo tiene un precio total fijo</p>
                      <p class="text-xs text-primary-600 mt-1">Ej: Pack 4 boletas = $200,000</p>
                    </label>

                    <!-- Percentage -->
                    <label
                      class="relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors"
                      :class="form.pricing_type === 'percentage' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'"
                    >
                      <input type="radio" v-model="form.pricing_type" value="percentage" class="sr-only" />
                      <div class="flex items-center gap-2 mb-2">
                        <ReceiptPercentIcon class="w-5 h-5 text-primary-600" />
                        <span class="font-semibold text-secondary-900">Porcentaje</span>
                      </div>
                      <p class="text-xs text-secondary-500">Descuento porcentual sobre el precio</p>
                      <p class="text-xs text-primary-600 mt-1">Ej: 2x1 = 50% descuento</p>
                    </label>

                    <!-- Fixed Discount -->
                    <label
                      class="relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors"
                      :class="form.pricing_type === 'fixed_discount' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'"
                    >
                      <input type="radio" v-model="form.pricing_type" value="fixed_discount" class="sr-only" />
                      <div class="flex items-center gap-2 mb-2">
                        <BanknotesIcon class="w-5 h-5 text-primary-600" />
                        <span class="font-semibold text-secondary-900">Descuento Fijo</span>
                      </div>
                      <p class="text-xs text-secondary-500">Monto fijo de descuento en pesos</p>
                      <p class="text-xs text-primary-600 mt-1">Ej: -$50,000 del total</p>
                    </label>
                  </div>
                </div>

                <!-- Pricing Value -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-900 mb-2">
                      {{ pricingValueLabel }} *
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">
                        {{ form.pricing_type === 'percentage' ? '%' : '$' }}
                      </span>
                      <input
                        type="number"
                        v-model.number="form.pricing_value"
                        :placeholder="pricingValuePlaceholder"
                        min="0"
                        class="w-full pl-8 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                        required
                      />
                    </div>
                    <p class="text-xs text-secondary-500 mt-1">{{ pricingValueHint }}</p>
                  </div>

                  <!-- Max Discount Amount (only for percentage) -->
                  <div v-if="form.pricing_type === 'percentage'">
                    <label class="block text-sm font-medium text-secondary-900 mb-2">
                      Descuento Maximo
                      <span class="text-secondary-500 font-normal">(opcional)</span>
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">$</span>
                      <input
                        type="number"
                        v-model.number="form.max_discount_amount"
                        placeholder="50000"
                        min="0"
                        class="w-full pl-8 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                      />
                    </div>
                    <p class="text-xs text-secondary-500 mt-1">Limite maximo de descuento en pesos</p>
                  </div>
                </div>

                <!-- Price Preview -->
                <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="text-sm text-green-700">Precio original del combo:</p>
                      <p class="text-lg font-semibold text-secondary-500 line-through">${{ originalPrice.toLocaleString('es-CO') }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-green-700">Precio con promocion:</p>
                      <p class="text-2xl font-bold text-green-600">${{ finalPrice.toLocaleString('es-CO') }}</p>
                    </div>
                  </div>
                  <p class="text-sm text-green-600 mt-2 font-medium">
                    Ahorro: ${{ savings.toLocaleString('es-CO') }} ({{ savingsPercent }}%)
                  </p>
                </div>

                <!-- Additional Config -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-secondary-200">
                  <!-- Quantity Available -->
                  <div>
                    <label class="block text-sm font-medium text-secondary-900 mb-2">
                      Usos Disponibles
                    </label>
                    <input
                      type="number"
                      v-model.number="form.quantity_available"
                      :placeholder="maxAvailableUses ? `Max: ${maxAvailableUses}` : 'Ilimitado'"
                      min="1"
                      :max="maxAvailableUses || undefined"
                      class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                    />
                    <p class="text-xs text-secondary-500 mt-1">
                      <template v-if="maxAvailableUses">
                        Maximo segun capacidad: <strong>{{ maxAvailableUses }}</strong> usos
                      </template>
                      <template v-else>
                        Dejar vacio = ilimitado
                      </template>
                    </p>
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
                      class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                    />
                    <p class="text-xs text-secondary-500 mt-1">Por defecto: ahora</p>
                  </div>

                  <!-- End Time -->
                  <div>
                    <label class="block text-sm font-medium text-secondary-900 mb-2">
                      Fecha de Fin
                    </label>
                    <input
                      v-model="form.end_time"
                      type="datetime-local"
                      :min="form.start_time"
                      class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900"
                    />
                    <p class="text-xs text-secondary-500 mt-1">Por defecto: fecha del evento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Review -->
          <div v-else-if="currentStep === 4" key="step-4" class="bg-white border border-secondary-200 rounded-lg">
            <!-- Header -->
            <div class="border-b border-secondary-200 p-4 sm:p-6 md:p-8">
              <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 mb-2">NUEVA PROMOCION</h1>
                  <p class="text-xs sm:text-sm text-secondary-500">Resumen del combo/paquete a crear</p>
                </div>
              </div>
            </div>

            <!-- Promotion Info -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <div>
                  <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-2">Promocion</p>
                  <p class="text-lg font-bold text-secondary-900">{{ form.promotion_name }}</p>
                  <p v-if="form.description" class="text-sm text-secondary-600 mt-2">{{ form.description }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-2">Evento</p>
                  <p class="text-base font-semibold text-secondary-900">{{ selectedEvent?.cluster_name }}</p>
                </div>
              </div>
            </div>

            <!-- Combo Items -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
                Contenido del Combo ({{ totalTickets }} boletas)
              </p>
              <div class="space-y-2">
                <div
                  v-for="item in form.items"
                  :key="item.area_id"
                  class="flex justify-between items-center py-2 border-b border-secondary-100 last:border-0"
                >
                  <div>
                    <p class="font-medium text-secondary-900">{{ getAreaName(item.area_id) }}</p>
                    <p class="text-xs text-secondary-500">${{ getAreaPrice(item.area_id).toLocaleString('es-CO') }} c/u</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-secondary-900">x{{ item.quantity }}</p>
                    <p class="text-xs text-secondary-500">${{ (getAreaPrice(item.area_id) * item.quantity).toLocaleString('es-CO') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pricing -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-green-50 border-b border-secondary-200">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
                Precio de la Promocion
              </p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Tipo</p>
                  <p class="text-lg font-bold text-secondary-900">{{ pricingTypeLabel }}</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Precio Original</p>
                  <p class="text-lg font-bold text-secondary-500 line-through">${{ originalPrice.toLocaleString('es-CO') }}</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Precio Final</p>
                  <p class="text-lg font-bold text-green-600">${{ finalPrice.toLocaleString('es-CO') }}</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Ahorro</p>
                  <p class="text-lg font-bold text-green-600">${{ savings.toLocaleString('es-CO') }}</p>
                </div>
              </div>
            </div>

            <!-- Dates and Config -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3 sm:mb-4">
                Configuracion
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Fecha de Inicio</p>
                  <p class="text-base font-semibold text-secondary-900">{{ formatDateDisplay(form.start_time) }}</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Fecha de Fin</p>
                  <p class="text-base font-semibold text-secondary-900">{{ form.end_time ? formatDateDisplay(form.end_time) : 'Sin fecha de fin' }}</p>
                </div>
                <div>
                  <p class="text-sm text-secondary-600 mb-1">Usos Disponibles</p>
                  <p class="text-base font-semibold text-secondary-900">{{ form.quantity_available || 'Ilimitado' }}</p>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-secondary-50 rounded-b-lg">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="form.is_active"
                  class="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <span class="text-sm font-medium text-secondary-900">Promocion activa al crear</span>
              </label>
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
              :to="`/gestion/promociones?event=${eventId}`"
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
              @click="submitPromotion"
              :disabled="isSubmitting"
              class="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{{ isSubmitting ? 'Creando...' : 'Crear Promocion' }}</span>
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
  TagIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  PlusCircleIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Crear Promocion - WaRo Tickets'
})

interface PromotionItem {
  area_id: number
  quantity: number
}

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
  promotion_name: '',
  description: '',
  pricing_type: 'fixed_price' as 'percentage' | 'fixed_discount' | 'fixed_price',
  pricing_value: 0,
  max_discount_amount: null as number | null,
  quantity_available: null as number | null,
  priority_order: 0,
  start_time: '',
  end_time: '',
  items: [] as PromotionItem[],
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

    // Set default dates: start = now, end = event start date
    if (!form.start_time) {
      form.start_time = new Date().toISOString().slice(0, 16)
    }
    if (!form.end_time && (response as any)?.start_date) {
      form.end_time = new Date((response as any).start_date).toISOString().slice(0, 16)
    }
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

// Available areas (not yet added to combo)
const availableAreas = computed(() => {
  const addedIds = form.items.map(item => item.area_id)
  return areas.value.filter(a => !addedIds.includes(a.id))
})

// Helper functions for areas
function getAreaName(areaId: number): string {
  const area = areas.value.find(a => a.id === areaId)
  return area?.area_name || 'Area desconocida'
}

function getAreaPrice(areaId: number): number {
  const area = areas.value.find(a => a.id === areaId)
  return area ? Number(area.price) : 0
}

// Combo management
function addArea(areaId: number) {
  form.items.push({ area_id: areaId, quantity: 1 })
}

function removeItem(index: number) {
  form.items.splice(index, 1)
}

function incrementQuantity(index: number) {
  form.items[index].quantity++
}

function decrementQuantity(index: number) {
  if (form.items[index].quantity > 1) {
    form.items[index].quantity--
  }
}

// Calculated values
const totalTickets = computed(() => {
  return form.items.reduce((sum, item) => sum + item.quantity, 0)
})

const originalPrice = computed(() => {
  return form.items.reduce((sum, item) => {
    return sum + (getAreaPrice(item.area_id) * item.quantity)
  }, 0)
})

// Calculate max available uses based on area capacities
const maxAvailableUses = computed(() => {
  if (form.items.length === 0) return null

  const maxPerArea = form.items.map(item => {
    const area = areas.value.find(a => a.id === item.area_id)
    if (!area || !area.capacity || item.quantity <= 0) return Infinity
    return Math.floor(area.capacity / item.quantity)
  })

  const minValue = Math.min(...maxPerArea)
  return minValue === Infinity ? null : minValue
})

const finalPrice = computed(() => {
  if (form.pricing_type === 'fixed_price') {
    return form.pricing_value || 0
  } else if (form.pricing_type === 'percentage') {
    let discount = originalPrice.value * (form.pricing_value / 100)
    if (form.max_discount_amount && discount > form.max_discount_amount) {
      discount = form.max_discount_amount
    }
    return Math.max(0, originalPrice.value - discount)
  } else {
    return Math.max(0, originalPrice.value - (form.pricing_value || 0))
  }
})

const savings = computed(() => {
  return Math.max(0, originalPrice.value - finalPrice.value)
})

const savingsPercent = computed(() => {
  if (originalPrice.value === 0) return 0
  return Math.round((savings.value / originalPrice.value) * 100)
})

// Labels for pricing type
const pricingValueLabel = computed(() => {
  switch (form.pricing_type) {
    case 'fixed_price': return 'Precio del Combo'
    case 'percentage': return 'Porcentaje de Descuento'
    case 'fixed_discount': return 'Monto de Descuento'
    default: return 'Valor'
  }
})

const pricingValuePlaceholder = computed(() => {
  switch (form.pricing_type) {
    case 'fixed_price': return '200000'
    case 'percentage': return '50'
    case 'fixed_discount': return '50000'
    default: return '0'
  }
})

const pricingValueHint = computed(() => {
  switch (form.pricing_type) {
    case 'fixed_price': return 'Precio total fijo del paquete en pesos'
    case 'percentage': return 'Porcentaje de descuento sobre el precio original'
    case 'fixed_discount': return 'Monto fijo de descuento en pesos'
    default: return ''
  }
})

const pricingTypeLabel = computed(() => {
  switch (form.pricing_type) {
    case 'fixed_price': return 'Precio Fijo'
    case 'percentage': return 'Porcentaje'
    case 'fixed_discount': return 'Descuento Fijo'
    default: return '-'
  }
})

// Format price preview for header
function formatPricePreview() {
  if (form.items.length === 0) return 'Sin items'
  return `$${finalPrice.value.toLocaleString('es-CO')}`
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
    return form.promotion_name.trim().length > 0
  }
  if (currentStep.value === 2) {
    return form.items.length > 0
  }
  if (currentStep.value === 3) {
    return form.pricing_type &&
      form.pricing_value > 0 &&
      form.start_time
  }
  return true
})

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
async function submitPromotion() {
  if (isSubmitting.value || !eventId.value) return

  isSubmitting.value = true

  try {
    const payload: Record<string, any> = {
      promotion_name: form.promotion_name,
      pricing_type: form.pricing_type,
      pricing_value: form.pricing_value,
      priority_order: form.priority_order || 0,
      start_time: new Date(form.start_time).toISOString(),
      items: form.items
    }

    if (form.description) payload.description = form.description
    if (form.max_discount_amount) payload.max_discount_amount = form.max_discount_amount
    if (form.quantity_available) payload.quantity_available = form.quantity_available
    if (form.end_time) payload.end_time = new Date(form.end_time).toISOString()

    await $fetch(`/api/promotions/event/${eventId.value}`, {
      method: 'POST',
      body: payload,
      credentials: 'include'
    })

    await navigateTo(`/gestion/promociones?event=${eventId.value}`)
  } catch (err: any) {
    console.error('Error creating promotion:', err)
    const message = err?.data?.detail || err?.message || 'Error al crear la promocion'
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
