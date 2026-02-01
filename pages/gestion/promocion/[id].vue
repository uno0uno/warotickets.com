<template>
  <div class="w-full">
    <!-- Loading State -->
    <UiGestionLoader v-if="isLoadingPromotion || isLoadingEvent" />

    <!-- Error State -->
    <div v-else-if="loadError" class="bg-white border border-secondary-200 rounded-lg p-8 text-center">
      <ExclamationTriangleIcon class="w-16 h-16 mx-auto mb-4 text-red-500" />
      <p class="text-secondary-600 font-medium">{{ loadError }}</p>
      <NuxtLink
        :to="`/gestion/promociones${eventId ? `?event=${eventId}` : ''}`"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
      >
        Volver a Promociones
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
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">Editar Promocion</p>
                <p class="text-lg font-semibold text-secondary-900">{{ form.promotion_name || 'Sin nombre' }}</p>
              </div>
            </div>

            <!-- Event -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <CalendarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">Evento</p>
                <p class="text-sm sm:text-lg font-semibold text-secondary-900">{{ selectedEvent?.cluster_name || 'Cargando...' }}</p>
              </div>
            </div>

            <!-- Total Tickets -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <UsersIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">Boletas en Combo</p>
                <p class="text-lg font-semibold text-secondary-900">{{ totalTickets }} boletas</p>
              </div>
            </div>

            <!-- Price Preview -->
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
                <TagIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">Precio</p>
                <p class="text-lg font-semibold text-green-600">{{ formatPricePreview() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="bg-white border-secondary-200 border rounded-lg mb-4 sm:mb-6">
        <div class="p-3 sm:p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
              <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors border-2 flex-shrink-0" :class="{ 'bg-primary-600 text-white border-primary-600': currentStep === 1, 'bg-secondary-600 text-white border-secondary-600': currentStep > 1, 'border-secondary-300 text-secondary-400': currentStep < 1 }">
                <CheckIcon v-if="currentStep > 1" class="w-4 h-4 sm:w-5 sm:h-5" />
                <span v-else class="font-semibold text-xs sm:text-sm">1</span>
              </div>
              <div class="ml-2 sm:ml-3 flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 1 ? 'text-secondary-900' : 'text-secondary-500'">Informacion</p>
                <p class="text-xs text-secondary-400 hidden sm:block truncate">Nombre y descripcion</p>
              </div>
              <div class="flex-1 h-0.5 mx-2 sm:mx-4" :class="currentStep > 1 ? 'bg-secondary-600' : 'bg-secondary-200'"></div>
            </div>

            <div class="flex items-center flex-1">
              <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors border-2 flex-shrink-0" :class="{ 'bg-primary-600 text-white border-primary-600': currentStep === 2, 'bg-secondary-600 text-white border-secondary-600': currentStep > 2, 'border-secondary-300 text-secondary-400': currentStep < 2 }">
                <CheckIcon v-if="currentStep > 2" class="w-4 h-4 sm:w-5 sm:h-5" />
                <span v-else class="font-semibold text-xs sm:text-sm">2</span>
              </div>
              <div class="ml-2 sm:ml-3 flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 2 ? 'text-secondary-900' : 'text-secondary-500'">Combo</p>
                <p class="text-xs text-secondary-400 hidden sm:block truncate">Areas y cantidades</p>
              </div>
              <div class="flex-1 h-0.5 mx-2 sm:mx-4" :class="currentStep > 2 ? 'bg-secondary-600' : 'bg-secondary-200'"></div>
            </div>

            <div class="flex items-center flex-1">
              <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors border-2 flex-shrink-0" :class="{ 'bg-primary-600 text-white border-primary-600': currentStep === 3, 'bg-secondary-600 text-white border-secondary-600': currentStep > 3, 'border-secondary-300 text-secondary-400': currentStep < 3 }">
                <CheckIcon v-if="currentStep > 3" class="w-4 h-4 sm:w-5 sm:h-5" />
                <span v-else class="font-semibold text-xs sm:text-sm">3</span>
              </div>
              <div class="ml-2 sm:ml-3 flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 3 ? 'text-secondary-900' : 'text-secondary-500'">Precio</p>
                <p class="text-xs text-secondary-400 hidden sm:block truncate">Tipo y valor</p>
              </div>
              <div class="flex-1 h-0.5 mx-2 sm:mx-4" :class="currentStep > 3 ? 'bg-secondary-600' : 'bg-secondary-200'"></div>
            </div>

            <div class="flex items-center">
              <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors border-2 flex-shrink-0" :class="{ 'bg-primary-600 text-white border-primary-600': currentStep === 4, 'border-secondary-300 text-secondary-400': currentStep < 4 }">
                <span class="font-semibold text-xs sm:text-sm">4</span>
              </div>
              <div class="ml-2 sm:ml-3 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate" :class="currentStep >= 4 ? 'text-secondary-900' : 'text-secondary-500'">Revision</p>
                <p class="text-xs text-secondary-400 hidden sm:block">Confirmar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleNext">
        <Transition name="fade" mode="out-in">
          <!-- Step 1: Info -->
          <div v-if="currentStep === 1" key="step-1" class="bg-white border-secondary-200 border rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-4 sm:mb-6">Informacion de la Promocion</h3>
              <div class="space-y-4 sm:space-y-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">Nombre de la Promocion *</label>
                  <input type="text" v-model="form.promotion_name" placeholder="Ej: Pack Familiar, 2x1 VIP" class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900" required />
                </div>
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-2">Descripcion</label>
                  <textarea v-model="form.description" placeholder="Descripcion del combo" rows="3" class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900 resize-none"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Combo Builder -->
          <div v-else-if="currentStep === 2" key="step-2" class="bg-white border-secondary-200 border rounded-lg">
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-semibold text-secondary-900 mb-2">Armar el Combo</h3>
              <p class="text-sm text-secondary-500 mb-4 sm:mb-6">Areas y cantidad de boletas del combo</p>

              <div v-if="isLoadingAreas" class="text-secondary-500 text-sm py-4">Cargando areas...</div>
              <div v-else-if="areas.length === 0" class="text-secondary-500 text-sm py-4 bg-secondary-50 rounded-lg px-4">No hay areas disponibles.</div>
              <div v-else class="space-y-4">
                <div v-if="form.items.length > 0" class="space-y-3">
                  <div v-for="(item, index) in form.items" :key="index" class="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                    <div class="flex-1">
                      <p class="font-medium text-secondary-900">{{ getAreaName(item.area_id) }}</p>
                      <p class="text-xs text-secondary-500">${{ getAreaPrice(item.area_id).toLocaleString('es-CO') }} c/u</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button type="button" @click="decrementQuantity(index)" class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-secondary-200 hover:bg-secondary-50"><MinusIcon class="w-4 h-4" /></button>
                      <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>
                      <button type="button" @click="incrementQuantity(index)" class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-secondary-200 hover:bg-secondary-50"><PlusIcon class="w-4 h-4" /></button>
                    </div>
                    <button type="button" @click="removeItem(index)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg"><TrashIcon class="w-4 h-4" /></button>
                  </div>
                </div>

                <div class="border-2 border-dashed border-secondary-200 rounded-lg p-4">
                  <p class="text-sm font-medium text-secondary-700 mb-3">Agregar area:</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <button v-for="area in availableAreas" :key="area.id" type="button" @click="addArea(area.id)" class="flex items-center gap-2 p-3 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
                      <PlusCircleIcon class="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <div class="flex-1 min-w-0">
                        <p class="font-medium text-secondary-900 truncate">{{ area.area_name }}</p>
                        <p class="text-xs text-secondary-500">${{ Number(area.price).toLocaleString('es-CO') }}</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div v-if="form.items.length > 0" class="mt-4 p-4 bg-secondary-50 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="text-sm text-secondary-600">Total boletas:</p>
                      <p class="text-2xl font-bold text-secondary-900">{{ totalTickets }}</p>
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
              <p class="text-sm text-secondary-500 mb-4 sm:mb-6">Como se calcula el precio del combo</p>

              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-900 mb-3">Tipo de Promocion *</label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors" :class="form.pricing_type === 'fixed_price' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'">
                      <input type="radio" v-model="form.pricing_type" value="fixed_price" class="sr-only" />
                      <div class="flex items-center gap-2 mb-2"><CurrencyDollarIcon class="w-5 h-5 text-primary-600" /><span class="font-semibold text-secondary-900">Precio Fijo</span></div>
                      <p class="text-xs text-secondary-500">Precio total fijo del combo</p>
                    </label>
                    <label class="relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors" :class="form.pricing_type === 'percentage' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'">
                      <input type="radio" v-model="form.pricing_type" value="percentage" class="sr-only" />
                      <div class="flex items-center gap-2 mb-2"><ReceiptPercentIcon class="w-5 h-5 text-primary-600" /><span class="font-semibold text-secondary-900">Porcentaje</span></div>
                      <p class="text-xs text-secondary-500">Descuento porcentual</p>
                    </label>
                    <label class="relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors" :class="form.pricing_type === 'fixed_discount' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'">
                      <input type="radio" v-model="form.pricing_type" value="fixed_discount" class="sr-only" />
                      <div class="flex items-center gap-2 mb-2"><BanknotesIcon class="w-5 h-5 text-primary-600" /><span class="font-semibold text-secondary-900">Descuento Fijo</span></div>
                      <p class="text-xs text-secondary-500">Monto fijo de descuento</p>
                    </label>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-900 mb-2">{{ pricingValueLabel }} *</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">{{ form.pricing_type === 'percentage' ? '%' : '$' }}</span>
                      <input type="number" v-model.number="form.pricing_value" :placeholder="pricingValuePlaceholder" min="0" class="w-full pl-8 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900" required />
                    </div>
                  </div>
                  <div v-if="form.pricing_type === 'percentage'">
                    <label class="block text-sm font-medium text-secondary-900 mb-2">Descuento Maximo</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">$</span>
                      <input type="number" v-model.number="form.max_discount_amount" placeholder="50000" min="0" class="w-full pl-8 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900" />
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="text-sm text-green-700">Original:</p>
                      <p class="text-lg font-semibold text-secondary-500 line-through">${{ originalPrice.toLocaleString('es-CO') }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-green-700">Con promocion:</p>
                      <p class="text-2xl font-bold text-green-600">${{ finalPrice.toLocaleString('es-CO') }}</p>
                    </div>
                  </div>
                  <p class="text-sm text-green-600 mt-2 font-medium">Ahorro: ${{ savings.toLocaleString('es-CO') }} ({{ savingsPercent }}%)</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-secondary-200">
                  <div>
                    <label class="block text-sm font-medium text-secondary-900 mb-2">Usos Disponibles</label>
                    <input type="number" v-model.number="form.quantity_available" :placeholder="maxAvailableUses ? `Max: ${maxAvailableUses}` : 'Ilimitado'" min="1" :max="maxAvailableUses || undefined" class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900" />
                    <p class="text-xs text-secondary-500 mt-1">
                      <template v-if="maxAvailableUses">Maximo segun capacidad: <strong>{{ maxAvailableUses }}</strong></template>
                      <template v-else>Dejar vacio = ilimitado</template>
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-900 mb-2">Fecha de Inicio *</label>
                    <input v-model="form.start_time" type="datetime-local" required class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-secondary-900 mb-2">Fecha de Fin</label>
                    <input v-model="form.end_time" type="datetime-local" :min="form.start_time" class="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-secondary-900" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Review -->
          <div v-else-if="currentStep === 4" key="step-4" class="bg-white border border-secondary-200 rounded-lg">
            <div class="border-b border-secondary-200 p-4 sm:p-6 md:p-8">
              <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900 mb-2">EDITAR PROMOCION</h1>
                  <p class="text-xs sm:text-sm text-secondary-500">Resumen de los cambios</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-secondary-500">Usos:</span>
                  <span class="font-bold text-secondary-900">{{ originalPromotion?.uses_count || 0 }}</span>
                </div>
              </div>
            </div>

            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3">Combo ({{ totalTickets }} boletas)</p>
              <div class="space-y-2">
                <div v-for="item in form.items" :key="item.area_id" class="flex justify-between items-center py-2 border-b border-secondary-100 last:border-0">
                  <div>
                    <p class="font-medium text-secondary-900">{{ getAreaName(item.area_id) }}</p>
                    <p class="text-xs text-secondary-500">${{ getAreaPrice(item.area_id).toLocaleString('es-CO') }} c/u</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-secondary-900">x{{ item.quantity }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-green-50 border-b border-secondary-200">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p class="text-sm text-secondary-600 mb-1">Tipo</p><p class="text-lg font-bold text-secondary-900">{{ pricingTypeLabel }}</p></div>
                <div><p class="text-sm text-secondary-600 mb-1">Original</p><p class="text-lg font-bold text-secondary-500 line-through">${{ originalPrice.toLocaleString('es-CO') }}</p></div>
                <div><p class="text-sm text-secondary-600 mb-1">Final</p><p class="text-lg font-bold text-green-600">${{ finalPrice.toLocaleString('es-CO') }}</p></div>
                <div><p class="text-sm text-secondary-600 mb-1">Ahorro</p><p class="text-lg font-bold text-green-600">${{ savings.toLocaleString('es-CO') }}</p></div>
              </div>
            </div>

            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-secondary-200">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><p class="text-sm text-secondary-600 mb-1">Inicio</p><p class="text-base font-semibold text-secondary-900">{{ formatDateDisplay(form.start_time) }}</p></div>
                <div><p class="text-sm text-secondary-600 mb-1">Fin</p><p class="text-base font-semibold text-secondary-900">{{ form.end_time ? formatDateDisplay(form.end_time) : 'Sin fin' }}</p></div>
                <div><p class="text-sm text-secondary-600 mb-1">Usos</p><p class="text-base font-semibold text-secondary-900">{{ form.quantity_available || 'Ilimitado' }}</p></div>
              </div>
            </div>

            <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-secondary-50 rounded-b-lg">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="form.is_active" class="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500" />
                <span class="text-sm font-medium text-secondary-900">Promocion activa</span>
              </label>
            </div>
          </div>
        </Transition>

        <!-- Navigation -->
        <div class="flex justify-between mt-4 sm:mt-6 gap-3">
          <button v-if="currentStep > 1" type="button" @click="previousStep" class="px-4 sm:px-6 py-2 sm:py-3 border-2 border-secondary-200 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 font-medium transition-colors">
            <span class="hidden sm:inline">&larr; Anterior</span><span class="sm:hidden">&larr;</span>
          </button>
          <div v-else></div>

          <div class="flex gap-3">
            <NuxtLink :to="`/gestion/promociones?event=${eventId}`" class="px-4 sm:px-6 py-2 sm:py-3 border-2 border-secondary-200 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 font-medium transition-colors">Cancelar</NuxtLink>

            <button v-if="currentStep < 4" type="submit" :disabled="!canProceed" class="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <span class="hidden sm:inline">Siguiente &rarr;</span><span class="sm:hidden">&rarr;</span>
            </button>
            <button v-else type="button" @click="submitPromotion" :disabled="isSubmitting" class="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
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
import { TicketIcon, CalendarIcon, TagIcon, CheckIcon, ExclamationTriangleIcon, PlusIcon, MinusIcon, TrashIcon, PlusCircleIcon, UsersIcon, CurrencyDollarIcon, ReceiptPercentIcon, BanknotesIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Editar Promocion - WaRo Tickets' })

interface PromotionItem { area_id: number; quantity: number }

const route = useRoute()
const promoId = computed(() => route.params.id as string)
const eventId = computed(() => route.query.event ? Number(route.query.event) : null)

const currentStep = ref(1)
const isSubmitting = ref(false)
const isLoadingPromotion = ref(true)
const isLoadingEvent = ref(true)
const isLoadingAreas = ref(false)
const loadError = ref<string | null>(null)
const areas = ref<any[]>([])
const selectedEvent = ref<any>(null)
const originalPromotion = ref<any>(null)

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

async function loadPromotion() {
  if (!promoId.value || !eventId.value) { loadError.value = 'ID no especificado'; isLoadingPromotion.value = false; return }
  isLoadingPromotion.value = true
  try {
    const r = await $fetch(`/api/promotions/event/${eventId.value}/${promoId.value}`, { credentials: 'include' }) as any
    originalPromotion.value = r
    form.promotion_name = r.promotion_name
    form.description = r.description || ''
    form.pricing_type = r.pricing_type
    form.pricing_value = Number(r.pricing_value)
    form.max_discount_amount = r.max_discount_amount ? Number(r.max_discount_amount) : null
    form.quantity_available = r.quantity_available
    form.priority_order = r.priority_order || 0
    form.is_active = r.is_active
    if (r.start_time) form.start_time = new Date(r.start_time).toISOString().slice(0, 16)
    if (r.end_time) form.end_time = new Date(r.end_time).toISOString().slice(0, 16)
    if (r.items && Array.isArray(r.items)) form.items = r.items.map((i: any) => ({ area_id: i.area_id, quantity: i.quantity }))
  } catch (err: any) { loadError.value = err?.data?.detail || 'Error al cargar' }
  finally { isLoadingPromotion.value = false }
}

async function loadEvent() {
  if (!eventId.value) { isLoadingEvent.value = false; return }
  isLoadingEvent.value = true
  try { selectedEvent.value = await $fetch(`/api/events/${eventId.value}`, { credentials: 'include' }) }
  catch (err) { console.error(err) }
  finally { isLoadingEvent.value = false }
}

async function loadAreas() {
  if (!eventId.value) return
  isLoadingAreas.value = true
  try { areas.value = (await $fetch(`/api/areas/event/${eventId.value}`, { credentials: 'include' }) as any) || [] }
  catch (err) { areas.value = [] }
  finally { isLoadingAreas.value = false }
}

onMounted(() => { loadEvent(); loadAreas(); loadPromotion() })

const availableAreas = computed(() => { const ids = form.items.map(i => i.area_id); return areas.value.filter(a => !ids.includes(a.id)) })
function getAreaName(id: number) { return areas.value.find(a => a.id === id)?.area_name || 'Desconocida' }
function getAreaPrice(id: number) { const a = areas.value.find(a => a.id === id); return a ? Number(a.price) : 0 }
function addArea(id: number) { form.items.push({ area_id: id, quantity: 1 }) }
function removeItem(i: number) { form.items.splice(i, 1) }
function incrementQuantity(i: number) { form.items[i].quantity++ }
function decrementQuantity(i: number) { if (form.items[i].quantity > 1) form.items[i].quantity-- }

const totalTickets = computed(() => form.items.reduce((s, i) => s + i.quantity, 0))
const originalPrice = computed(() => form.items.reduce((s, i) => s + getAreaPrice(i.area_id) * i.quantity, 0))

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
  if (form.pricing_type === 'fixed_price') return form.pricing_value || 0
  if (form.pricing_type === 'percentage') { let d = originalPrice.value * (form.pricing_value / 100); if (form.max_discount_amount && d > form.max_discount_amount) d = form.max_discount_amount; return Math.max(0, originalPrice.value - d) }
  return Math.max(0, originalPrice.value - (form.pricing_value || 0))
})
const savings = computed(() => Math.max(0, originalPrice.value - finalPrice.value))
const savingsPercent = computed(() => originalPrice.value === 0 ? 0 : Math.round((savings.value / originalPrice.value) * 100))

const pricingValueLabel = computed(() => ({ fixed_price: 'Precio del Combo', percentage: 'Porcentaje', fixed_discount: 'Descuento Fijo' }[form.pricing_type] || 'Valor'))
const pricingValuePlaceholder = computed(() => ({ fixed_price: '200000', percentage: '50', fixed_discount: '50000' }[form.pricing_type] || '0'))
const pricingTypeLabel = computed(() => ({ fixed_price: 'Precio Fijo', percentage: 'Porcentaje', fixed_discount: 'Descuento Fijo' }[form.pricing_type] || '-'))

function formatPricePreview() { return form.items.length === 0 ? 'Sin items' : `$${finalPrice.value.toLocaleString('es-CO')}` }
function formatDateDisplay(d: string) { if (!d) return ''; return new Date(d).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }

const canProceed = computed(() => {
  if (currentStep.value === 1) return form.promotion_name.trim().length > 0
  if (currentStep.value === 2) return form.items.length > 0
  if (currentStep.value === 3) return form.pricing_type && form.pricing_value > 0 && form.start_time
  return true
})

function handleNext() { if (canProceed.value && currentStep.value < 4) currentStep.value++ }
function previousStep() { if (currentStep.value > 1) currentStep.value-- }

async function submitPromotion() {
  if (isSubmitting.value || !eventId.value || !promoId.value) return
  isSubmitting.value = true
  try {
    const p: any = { promotion_name: form.promotion_name, pricing_type: form.pricing_type, pricing_value: form.pricing_value, priority_order: form.priority_order || 0, start_time: new Date(form.start_time).toISOString(), is_active: form.is_active, items: form.items }
    if (form.description) p.description = form.description
    if (form.max_discount_amount) p.max_discount_amount = form.max_discount_amount
    if (form.quantity_available) p.quantity_available = form.quantity_available
    if (form.end_time) p.end_time = new Date(form.end_time).toISOString()
    await $fetch(`/api/promotions/event/${eventId.value}/${promoId.value}`, { method: 'PATCH', body: p, credentials: 'include' })
    await navigateTo(`/gestion/promociones?event=${eventId.value}`)
  } catch (err: any) { alert(err?.data?.detail || 'Error al actualizar') }
  finally { isSubmitting.value = false }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
