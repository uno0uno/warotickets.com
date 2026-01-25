<template>
  <div class="min-h-screen bg-secondary-50">
    <!-- Loading State - Skeleton -->
    <div v-if="pending && !data" class="animate-pulse">
      <!-- Cover Skeleton -->
      <div class="h-72 sm:h-80 lg:h-96 bg-secondary-200"></div>

      <!-- Content Skeleton -->
      <div class="container mx-auto px-4 md:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <!-- Sidebar Skeleton -->
          <div class="lg:w-[380px] flex-shrink-0">
            <div class="bg-white rounded-2xl  border border-secondary-100 overflow-hidden">
              <div class="aspect-video bg-secondary-200"></div>
              <div class="p-6 space-y-4">
                <div class="h-6 bg-secondary-200 rounded-full w-24"></div>
                <div class="h-8 bg-secondary-200 rounded w-full"></div>
                <div class="h-6 bg-secondary-200 rounded w-3/4"></div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-secondary-200 rounded-xl"></div>
                  <div class="space-y-2 flex-1">
                    <div class="h-4 bg-secondary-200 rounded w-full"></div>
                    <div class="h-3 bg-secondary-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-secondary-200 rounded-xl"></div>
                  <div class="space-y-2 flex-1">
                    <div class="h-4 bg-secondary-200 rounded w-3/4"></div>
                    <div class="h-3 bg-secondary-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div class="border-t border-secondary-100 my-6"></div>
                <div class="h-14 bg-secondary-200 rounded-xl"></div>
              </div>
            </div>
          </div>

          <!-- Main Content Skeleton -->
          <div class="flex-1 space-y-6">
            <div class="bg-white rounded-2xl  border border-secondary-100 p-6 lg:p-8">
              <div class="h-6 bg-secondary-200 rounded w-48 mb-4"></div>
              <div class="space-y-3">
                <div class="h-4 bg-secondary-200 rounded w-full"></div>
                <div class="h-4 bg-secondary-200 rounded w-full"></div>
                <div class="h-4 bg-secondary-200 rounded w-3/4"></div>
              </div>
            </div>
            <div class="bg-white rounded-2xl  border border-secondary-100 p-6 lg:p-8">
              <div class="h-6 bg-secondary-200 rounded w-32 mb-6"></div>
              <div class="space-y-3">
                <div class="h-20 bg-secondary-100 rounded-xl"></div>
                <div class="h-20 bg-secondary-100 rounded-xl"></div>
                <div class="h-20 bg-secondary-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !data" class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-2xl font-bold text-secondary-900 mb-2">Evento no encontrado</h2>
        <p class="text-secondary-500 mb-6">El evento que buscas no existe o ya no esta disponible.</p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
        >
          <ArrowLeftIcon class="w-5 h-5" />
          Ver todos los eventos
        </NuxtLink>
      </div>
    </div>

    <!-- Cart Loading State -->
    <div v-else-if="cartLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-secondary-500">{{ currentPhrase }}</p>
      </div>
    </div>

    <!-- Event Content -->
    <template v-else-if="event">
      <!-- Cover Image -->
      <div class="relative h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-primary-800 via-primary-900 to-secondary-900 overflow-hidden">
        <img
          v-if="event.banner_image_url || event.cover_image_url"
          :src="event.banner_image_url || event.cover_image_url"
          :alt="event.cluster_name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <!-- Back Button -->
        <NuxtLink
          to="/"
          class="absolute top-4 left-4 sm:left-6 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-secondary-700 rounded-xl hover:bg-white transition-all  z-10"
        >
          <ArrowLeftIcon class="w-4 h-4" />
          <span class="text-sm font-medium">Eventos</span>
        </NuxtLink>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto px-4 md:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <!-- Sidebar - Event Info Card -->
          <div class="lg:w-[380px] flex-shrink-0 order-1 lg:order-none">
            <div class="bg-white rounded-2xl  border border-secondary-100 overflow-hidden sticky top-4">
              <!-- Cover thumbnail -->
              <div v-if="event.cover_image_url" class="aspect-video bg-secondary-100">
                <img :src="event.cover_image_url" :alt="event.cluster_name" class="w-full h-full object-cover" />
              </div>

              <div class="p-6">
                <!-- Event Type Badge -->
                <div v-if="event.cluster_type" class="mb-4">
                  <span class="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                    {{ getEventTypeLabel(event.cluster_type) }}
                  </span>
                </div>

                <!-- Title -->
                <h1 class="text-2xl font-bold text-secondary-900 mb-4 leading-tight">
                  {{ event.cluster_name }}
                </h1>

                <!-- Date & Time -->
                <div class="flex items-start gap-3 mb-4">
                  <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CalendarIcon class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary-900">{{ formatDateFull(event.start_date) }}</p>
                    <p class="text-sm text-secondary-500">{{ formatTime(event.start_date) }}</p>
                  </div>
                </div>

                <!-- Price Range -->
                <div v-if="summary?.min_price" class="flex items-start gap-3 mb-4">
                  <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TicketIcon class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary-900">
                      <template v-if="summary.min_price === summary.max_price">
                        ${{ formatPrice(summary.min_price) }}
                      </template>
                      <template v-else>
                        ${{ formatPrice(summary.min_price) }} - ${{ formatPrice(summary.max_price) }}
                      </template>
                    </p>
                    <p class="text-sm text-secondary-500">{{ summary.areas_count }} localidades</p>
                  </div>
                </div>

                <!-- Availability -->
                <div v-if="summary" class="flex items-start gap-3 mb-6">
                  <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UserGroupIcon class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary-900">{{ summary.tickets_available }} disponibles</p>
                    <p class="text-sm text-secondary-500">de {{ summary.total_capacity }} total</p>
                  </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-secondary-100 my-6"></div>

                <!-- CTA Button -->
                <button
                  :disabled="summary?.is_sold_out"
                  class="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="summary?.is_sold_out
                    ? 'bg-secondary-400'
                    : 'bg-primary-600 hover:bg-primary-700 active:scale-[0.98]'"
                >
                  <template v-if="summary?.is_sold_out">
                    <span class="flex items-center justify-center gap-2">
                      <XCircleIcon class="w-5 h-5" />
                      Agotado
                    </span>
                  </template>
                  <template v-else>
                    <span class="flex items-center justify-center gap-2">
                      <TicketIcon class="w-5 h-5" />
                      Comprar boletas
                    </span>
                  </template>
                </button>

                <!-- Sold Progress -->
                <div v-if="summary && !summary.is_sold_out" class="mt-4">
                  <div class="flex justify-between text-xs text-secondary-500 mb-1.5">
                    <span>{{ summary.tickets_sold }} vendidas</span>
                    <span>{{ Math.round((summary.tickets_sold / summary.total_capacity) * 100) }}%</span>
                  </div>
                  <div class="h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary-500 rounded-full transition-all duration-500"
                      :style="{ width: `${(summary.tickets_sold / summary.total_capacity) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 min-w-0 space-y-6 order-2">
            <!-- Description Card -->
            <div v-if="event.description" class="bg-white rounded-2xl  border border-secondary-100 p-6 lg:p-8">
              <h2 class="text-xl font-bold text-secondary-900 mb-4">Acerca del evento</h2>
              <div class="prose prose-secondary max-w-none">
                <p class="text-secondary-600 whitespace-pre-line leading-relaxed">{{ event.description }}</p>
              </div>
            </div>

            <!-- Boletas Individuales Section -->
            <div class="space-y-6">
              <!-- Section Header -->
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-extrabold text-secondary-900 tracking-tight">Boletas individuales</h2>
                <p class="text-sm text-secondary-500 font-medium hidden sm:block">
                  Compra por localidad
                </p>
              </div>

              <!-- Ticket Cards - Same style as Combos -->
              <div v-if="areas && areas.length > 0" class="space-y-4">
                <div
                  v-for="area in areas"
                  :key="area.id"
                  class="bg-white rounded-2xl border border-secondary-200 p-5 relative overflow-hidden"
                  :class="{
                    'opacity-60 grayscale': area.units_available === 0
                  }"
                >
                  <!-- Sold Out Overlay -->
                  <div
                    v-if="area.units_available === 0"
                    class="absolute inset-0 bg-secondary-100/10 backdrop-blur-[1px] flex items-center justify-center z-10"
                  >
                    <span class="bg-white/90 border border-secondary-300 px-6 py-2 rounded-full font-bold text-secondary-500 text-xs uppercase tracking-widest">
                      Localidad Agotada
                    </span>
                  </div>

                  <!-- Savings/Low Stock Ribbon -->
                  <div
                    v-if="area.units_available > 0 && getAreaOriginalPrice(area) > getAreaDisplayPrice(area)"
                    class="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider"
                  >
                    Ahorras ${{ formatPrice(getAreaOriginalPrice(area) - getAreaDisplayPrice(area)) }}
                  </div>
                  <div
                    v-else-if="area.units_available > 0 && area.units_available < 20"
                    class="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider"
                  >
                    Últimos {{ area.units_available }}
                  </div>

                  <div class="flex flex-col md:flex-row justify-between gap-4">
                    <!-- Left: Info -->
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                          <TicketIcon class="w-5 h-5 text-secondary-600" />
                        </div>
                        <div>
                          <h3 class="font-extrabold text-lg text-secondary-900">{{ area.area_name }}</h3>
                          <p v-if="area.description" class="text-sm text-secondary-500">{{ area.description }}</p>
                        </div>
                      </div>

                      <!-- Info Badges -->
                      <div class="space-y-2">
                        <span class="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Detalle</span>
                        <div class="flex flex-wrap gap-2">
                          <!-- Stage Badge -->
                          <span
                            v-if="area.active_sale_stage"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-lg text-sm text-green-700"
                          >
                            <CheckIcon class="w-4 h-4" />
                            {{ area.active_sale_stage }}
                          </span>
                          <!-- Bundle Badge -->
                          <span
                            v-if="getAreaQuantityInStage(area.id, area.active_sale_stage) > 1"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 rounded-lg text-sm text-primary-700"
                          >
                            <TicketIcon class="w-4 h-4" />
                            Paquete {{ getAreaQuantityInStage(area.id, area.active_sale_stage) }}x1
                          </span>
                          <!-- Available Badge -->
                          <span
                            v-if="area.units_available > 0"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary-100 rounded-lg text-sm text-secondary-700"
                          >
                            {{ area.units_available }} disponibles
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Right: Price + Controls -->
                    <div class="flex flex-col items-end justify-between md:border-l border-secondary-100 md:pl-5 min-w-[180px]">
                      <div class="text-right mb-3">
                        <p class="text-[10px] text-secondary-400 font-bold uppercase mb-1">
                          {{ getAreaQuantityInStage(area.id, area.active_sale_stage) > 1 ? 'Precio Paquete' : 'Precio Unitario' }}
                        </p>
                        <p class="text-2xl font-extrabold text-secondary-900">
                          ${{ formatPrice(getAreaDisplayPrice(area)) }}
                        </p>
                        <p v-if="getAreaOriginalPrice(area) > getAreaDisplayPrice(area)" class="text-xs text-secondary-400 line-through">
                          Antes ${{ formatPrice(getAreaOriginalPrice(area)) }}
                        </p>
                      </div>

                      <!-- Quantity Controls -->
                      <div v-if="area.units_available > 0" class="flex items-center gap-3 mb-3">
                        <button
                          @click="decrementQuantity(area.id)"
                          :disabled="getSelectedQuantity(area.id) <= 0"
                          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all
                            disabled:opacity-40 disabled:cursor-not-allowed
                            bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
                        >
                          <MinusIcon class="w-4 h-4" />
                        </button>
                        <span class="w-8 text-center font-bold text-secondary-900">{{ getSelectedQuantity(area.id) }}</span>
                        <button
                          @click="incrementQuantity(area.id)"
                          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all
                            bg-primary-100 hover:bg-primary-200 text-primary-700"
                        >
                          <PlusIcon class="w-4 h-4" />
                        </button>
                      </div>

                      <!-- Add to Cart Button -->
                      <button
                        v-if="area.units_available > 0"
                        @click="addToCart(area)"
                        :disabled="getSelectedQuantity(area.id) <= 0 || addingToCart === area.id"
                        class="w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all
                          bg-primary-600 hover:bg-primary-700 text-white
                          disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span v-if="addingToCart === area.id" class="flex items-center justify-center gap-2">
                          <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Agregando...
                        </span>
                        <span v-else class="flex items-center justify-center gap-2">
                          <ShoppingCartIcon class="w-4 h-4" />
                          Agregar
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Areas -->
              <div v-else class="bg-white rounded-3xl border border-secondary-200 p-12 text-center">
                <TicketIcon class="w-12 h-12 mx-auto mb-3 text-secondary-300" />
                <p class="text-secondary-500 font-medium">No hay boletas disponibles</p>
              </div>
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3"
            >
              <ExclamationTriangleIcon class="w-5 h-5 flex-shrink-0" />
              <span class="text-sm font-medium">{{ errorMessage }}</span>
              <button @click="errorMessage = null" class="ml-auto text-red-500 hover:text-red-700">
                <XCircleIcon class="w-5 h-5" />
              </button>
            </div>

            <!-- Combos Section - Promociones -->
            <div v-if="promotions.length > 0" class="space-y-6">
              <!-- Section Header -->
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-extrabold text-secondary-900 tracking-tight">Combos y Paquetes</h2>
                <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  Ahorra mas
                </span>
              </div>

              <!-- Combo Cards -->
              <div class="space-y-4">
                <div
                  v-for="promo in promotions"
                  :key="promo.id"
                  class="bg-white rounded-2xl border border-primary-200 p-5 relative overflow-hidden"
                >

                  <!-- Savings Ribbon -->
                  <div
                    v-if="promo.savings > 0"
                    class="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider"
                  >
                    Ahorras ${{ formatPrice(promo.savings) }}
                  </div>

                  <div class="flex flex-col md:flex-row justify-between gap-4">
                    <!-- Left: Info -->
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                          <GiftIcon class="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 class="font-extrabold text-lg text-secondary-900">{{ promo.promotion_name }}</h3>
                        </div>
                      </div>

                      <!-- Included Items - Badge Style -->
                      <div class="space-y-2">
                        <span class="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Cada combo incluye</span>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="item in promo.items"
                            :key="item.area_id"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary-100 rounded-lg text-sm text-secondary-700"
                          >
                            <CheckIcon class="w-4 h-4 text-green-500" />
                            <strong>{{ item.quantity }}x</strong> {{ item.area_name }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Right: Price + Controls -->
                    <div class="flex flex-col items-end justify-between md:border-l border-secondary-100 md:pl-5 min-w-[180px]">
                      <div class="text-right mb-3">
                        <p class="text-[10px] text-secondary-400 font-bold uppercase mb-1">Precio Combo</p>
                        <p class="text-2xl font-extrabold text-secondary-900">${{ formatPrice(promo.final_price) }}</p>
                        <p v-if="promo.savings > 0" class="text-xs text-secondary-400 line-through">
                          Antes ${{ formatPrice(promo.original_price) }}
                        </p>
                      </div>

                      <!-- Quantity Controls -->
                      <div class="flex items-center gap-3 mb-3">
                        <button
                          @click="decrementPromoQuantity(promo.id)"
                          :disabled="getSelectedPromoQuantity(promo.id) <= 0"
                          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all
                            disabled:opacity-40 disabled:cursor-not-allowed
                            bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
                        >
                          <MinusIcon class="w-4 h-4" />
                        </button>
                        <span class="w-8 text-center font-bold text-secondary-900">{{ getSelectedPromoQuantity(promo.id) }}</span>
                        <button
                          @click="incrementPromoQuantity(promo.id)"
                          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all
                            bg-primary-100 hover:bg-primary-200 text-primary-700"
                        >
                          <PlusIcon class="w-4 h-4" />
                        </button>
                      </div>

                      <!-- Add to Cart Button -->
                      <button
                        @click="addPromoToCart(promo)"
                        :disabled="getSelectedPromoQuantity(promo.id) <= 0 || addingPromoId === promo.id"
                        class="w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all
                          bg-primary-600 hover:bg-primary-700 text-white
                          disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span v-if="addingPromoId === promo.id" class="flex items-center justify-center gap-2">
                          <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Agregando...
                        </span>
                        <span v-else class="flex items-center justify-center gap-2">
                          <ShoppingCartIcon class="w-4 h-4" />
                          Agregar
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Extra Attributes -->
            <div
              v-if="event.extra_attributes && Object.keys(event.extra_attributes).length > 0"
              class="bg-white rounded-2xl  border border-secondary-100 p-6 lg:p-8"
            >
              <h2 class="text-xl font-bold text-secondary-900 mb-6">Informacion adicional</h2>
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="(value, key) in event.extra_attributes"
                  :key="key"
                  class="bg-secondary-50 rounded-xl p-4"
                >
                  <dt class="text-sm text-secondary-500 capitalize mb-1">{{ formatAttributeKey(key) }}</dt>
                  <dd class="text-secondary-900 font-medium">{{ value }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

    </template>

    <!-- Floating Cart Summary -->
    <div
      v-if="!cartLoading && cartStore.summary?.itemsCount > 0"
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 shadow-2xl z-50"
    >
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <!-- Cart Info -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <ShoppingCartIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p class="font-bold text-secondary-900">
                {{ cartStore.summary?.ticketsCount || 0 }} {{ (cartStore.summary?.ticketsCount || 0) === 1 ? 'boleta' : 'boletas' }}
              </p>
              <p class="text-sm text-secondary-500">
                {{ cartStore.summary?.itemsCount || 0 }} {{ (cartStore.summary?.itemsCount || 0) === 1 ? 'item' : 'items' }} en el carrito
              </p>
            </div>
          </div>

          <!-- Total + Button -->
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-xs text-secondary-500 font-medium">Total</p>
              <p class="text-2xl font-black text-secondary-900">${{ formatPrice(cartStore.summary?.total || 0) }}</p>
            </div>
            <button
              @click="goToCart"
              class="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              Ver carrito
              <ArrowLeftIcon class="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  CalendarIcon,
  TicketIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  UserGroupIcon,
  SparklesIcon,
  ClockIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  GiftIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const cartStore = useCartStore()

// Page Meta
definePageMeta({
  layout: 'default'
})

// Fetch all data in parallel from server
const { data, pending, error } = await useAsyncData(
  `event-full-${slug}`,
  async () => {
    const [event, areas, summary, promotions, saleStages] = await Promise.all([
      $fetch(`/api/public/events/${slug}`),
      $fetch(`/api/public/events/${slug}/areas`),
      $fetch(`/api/public/events/${slug}/summary`),
      $fetch(`/api/public/events/${slug}/promotions`),
      $fetch(`/api/public/events/${slug}/sale-stages`)
    ])
    return { event, areas, summary, promotions, saleStages }
  }
)

// Destructure for easier access
const event = computed(() => data.value?.event)
const areas = computed(() => data.value?.areas as any[] || [])
const summary = computed(() => data.value?.summary)
const promotions = computed(() => data.value?.promotions as any[] || [])
const saleStages = computed(() => data.value?.saleStages as any[] || [])

// Cart state
const selectedQuantities = ref<Record<number, number>>({})
const selectedPromoQuantities = ref<Record<string, number>>({})
const addingToCart = ref<number | null>(null)
const addingPromoId = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Check if there might be a cart (from localStorage) - only client side
const mightHaveCart = import.meta.client ? !!localStorage.getItem('cart_session_id') : false
const cartLoading = ref(mightHaveCart)

// Loading phrases
const { currentPhrase, start: startPhraseRotation, stop: stopPhraseRotation } = useLoadingPhrases([
  'Cargando carrito...',
  'Verificando disponibilidad...',
  'Calculando precios...',
  'Casi listo...'
])

watch(cartLoading, (loading) => {
  if (loading) {
    startPhraseRotation()
  } else {
    stopPhraseRotation()
  }
})

// Initialize cart on mount
onMounted(async () => {
  // Start phrase rotation if we might have a cart
  if (mightHaveCart) {
    startPhraseRotation()
  }

  if (!mightHaveCart) return

  try {
    await cartStore.fetchSummary()

    if (cartStore.summary.cartId) {
      await cartStore.fetchCart(cartStore.summary.cartId)
      await nextTick()
      initQuantitiesFromCart()
    }
  } catch (e) {
    console.error('Error loading cart:', e)
  } finally {
    cartLoading.value = false
  }
})

// Initialize quantities from cart (both areas and promos)
function initQuantitiesFromCart() {
  if (!cartStore.cart?.items) return

  // Initialize area quantities (non-promo items)
  for (const item of cartStore.cart.items) {
    if (!item.promotionId) {
      selectedQuantities.value[item.areaId] = item.quantity
    }
  }

  // Initialize promo quantities
  if (promotions.value) {
    for (const promo of promotions.value) {
      const qty = getPromoInCart(promo.id)
      if (qty > 0) {
        selectedPromoQuantities.value[promo.id] = qty
      }
    }
  }
}

// Get area quantity in cart (non-promo)
function getAreaInCart(areaId: number): number {
  if (!cartStore.cart?.items) return 0
  const item = cartStore.cart.items.find(i => i.areaId === areaId && !i.promotionId)
  return item?.quantity || 0
}

// Get quantity selected for an area
function getSelectedQuantity(areaId: number): number {
  return selectedQuantities.value[areaId] || 0
}

// Set quantity for an area
function setQuantity(areaId: number, qty: number) {
  const area = areas.value.find((a: any) => a.id === areaId)
  if (!area) return

  const bundleSize = getAreaQuantityInStage(areaId, area.active_sale_stage) || 1
  const maxBundles = Math.min(10, Math.floor(area.units_available / bundleSize))

  if (qty < 0) qty = 0
  if (qty > maxBundles) qty = maxBundles

  selectedQuantities.value[areaId] = qty
}

// Increment quantity
function incrementQuantity(areaId: number) {
  const current = getSelectedQuantity(areaId)
  setQuantity(areaId, current + 1)
}

// Decrement quantity
function decrementQuantity(areaId: number) {
  const current = getSelectedQuantity(areaId)
  setQuantity(areaId, current - 1)
}

// Get total tickets for selected quantity
function getTicketsForQuantity(areaId: number, stageName: string): number {
  const qty = getSelectedQuantity(areaId)
  const bundleSize = getAreaQuantityInStage(areaId, stageName)
  return qty * bundleSize
}

// Add to cart
async function addToCart(area: any) {
  const qty = getSelectedQuantity(area.id)
  if (qty <= 0) return

  addingToCart.value = area.id

  try {
    const clusterId = event.value?.cluster_id || event.value?.id
    await cartStore.addItem(clusterId, area.id, qty)
    // Keep the quantity as-is (don't reset to 0)
  } finally {
    addingToCart.value = null
  }
}

// Go to cart
function goToCart() {
  router.push('/carrito')
}

// Get selected quantity for a promo
function getSelectedPromoQuantity(promoId: string): number {
  return selectedPromoQuantities.value[promoId] || 0
}

// Set promo quantity
function setPromoQuantity(promoId: string, qty: number) {
  if (qty < 0) qty = 0
  if (qty > 5) qty = 5 // Max 5 packages
  selectedPromoQuantities.value[promoId] = qty
}

// Increment promo quantity
function incrementPromoQuantity(promoId: string) {
  const current = getSelectedPromoQuantity(promoId)
  setPromoQuantity(promoId, current + 1)
}

// Decrement promo quantity
function decrementPromoQuantity(promoId: string) {
  const current = getSelectedPromoQuantity(promoId)
  setPromoQuantity(promoId, current - 1)
}

// Check if promo is already in cart
function getPromoInCart(promoId: string): number {
  if (!cartStore.cart?.items) return 0
  const promoItems = cartStore.cart.items.filter(item => item.promotionId === promoId)
  if (promoItems.length === 0) return 0
  // Count total tickets from this promo and divide by promo total_tickets to get quantity
  const promo = promotions.value.find((p: any) => p.id === promoId)
  if (!promo) return 0
  const totalTickets = promoItems.reduce((sum, item) => sum + item.ticketsCount, 0)
  return Math.floor(totalTickets / promo.total_tickets)
}

// Add promotion package to cart
async function addPromoToCart(promo: any) {
  const qty = getSelectedPromoQuantity(promo.id)
  if (qty <= 0) return

  addingPromoId.value = promo.id
  errorMessage.value = null

  try {
    const clusterId = event.value?.cluster_id || event.value?.id

    // Add the promo package with quantity
    const result = await cartStore.addPromotionPackage(clusterId, promo.id, qty)

    if (!result?.success) {
      errorMessage.value = result?.error || 'Error al agregar el paquete'
      // Auto-hide error after 5 seconds
      setTimeout(() => { errorMessage.value = null }, 5000)
    }
    // Keep the quantity as-is (don't reset to 0)
  } finally {
    addingPromoId.value = null
  }
}

// Dynamic SEO
useHead(() => ({
  title: event.value ? `${event.value.cluster_name} - WaRo Tickets` : 'Evento - WaRo Tickets',
  meta: [
    {
      name: 'description',
      content: event.value?.description || 'Compra tus boletas de forma segura'
    }
  ]
}))

// Helpers
function formatDateFull(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function formatPrice(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num?.toLocaleString('es-CO') || '0'
}

function getEventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    concert: 'Concierto',
    festival: 'Festival',
    theater: 'Teatro',
    sports: 'Deportes',
    conference: 'Conferencia',
    party: 'Fiesta',
    other: 'Otro'
  }
  return labels[type] || type
}

function formatAttributeKey(key: string) {
  return key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function formatDateShort(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Obtener info de una etapa por nombre
function getStageInfo(stageName: string) {
  if (!saleStages.value || !stageName) return null
  return saleStages.value.find((s: any) => s.stage_name === stageName)
}

// Obtener la cantidad de boletas de un area en una etapa (para bundles)
function getAreaQuantityInStage(areaId: number, stageName: string): number {
  const stage = getStageInfo(stageName)
  if (!stage?.areas) return 1
  const areaInStage = stage.areas.find((a: any) => a.area_id === areaId)
  return areaInStage?.quantity || 1
}

// Get display price for an area (considering bundles)
function getAreaDisplayPrice(area: any): number {
  const bundleSize = getAreaQuantityInStage(area.id, area.active_sale_stage)
  const unitPrice = Number(area.current_price || area.price)
  return unitPrice * bundleSize
}

// Get original price for an area (considering bundles)
function getAreaOriginalPrice(area: any): number {
  const bundleSize = getAreaQuantityInStage(area.id, area.active_sale_stage)
  return Number(area.price) * bundleSize
}

</script>
