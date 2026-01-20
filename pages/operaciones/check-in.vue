<template>
  <div>
    <!-- Event Selector -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-secondary-700 mb-2">Seleccionar Evento</label>
      <select
        v-model="selectedEvent"
        class="w-full sm:w-64 px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
      >
        <option value="">Selecciona un evento</option>
        <option v-for="event in events" :key="event.id" :value="event.id">
          {{ event.name }}
        </option>
      </select>
    </div>

    <!-- No Event Selected -->
    <div v-if="!selectedEvent" class="text-center py-12">
      <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <QrCodeIcon class="w-8 h-8 text-secondary-400" />
      </div>
      <h3 class="text-lg font-medium text-secondary-900 mb-2">Selecciona un evento</h3>
      <p class="text-secondary-500">Elige un evento para comenzar el check-in</p>
    </div>

    <!-- Check-in Interface -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Scanner Section -->
      <div class="bg-white rounded-xl border border-secondary-200 p-6">
        <h3 class="font-semibold text-secondary-900 mb-4">Escanear Boleta</h3>

        <!-- QR Scanner Placeholder -->
        <div class="aspect-square bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
          <div class="text-center">
            <QrCodeIcon class="w-16 h-16 text-secondary-400 mx-auto mb-2" />
            <p class="text-secondary-500 text-sm">Camara QR</p>
          </div>
        </div>

        <!-- Manual Entry -->
        <div class="relative">
          <input
            v-model="ticketCode"
            type="text"
            placeholder="O ingresa el codigo manualmente..."
            class="w-full px-4 py-3 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
            @keyup.enter="handleCheckIn"
          />
          <button
            @click="handleCheckIn"
            class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
          >
            Validar
          </button>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="space-y-4">
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white rounded-xl border border-secondary-200 p-4">
            <p class="text-sm text-secondary-500 mb-1">Check-ins Hoy</p>
            <p class="text-2xl font-bold text-secondary-900">{{ stats.todayCheckIns }}</p>
          </div>
          <div class="bg-white rounded-xl border border-secondary-200 p-4">
            <p class="text-sm text-secondary-500 mb-1">Total Vendidas</p>
            <p class="text-2xl font-bold text-secondary-900">{{ stats.totalSold }}</p>
          </div>
          <div class="bg-white rounded-xl border border-secondary-200 p-4">
            <p class="text-sm text-secondary-500 mb-1">Tasa de Ingreso</p>
            <p class="text-2xl font-bold text-primary-600">{{ stats.checkInRate }}%</p>
          </div>
          <div class="bg-white rounded-xl border border-secondary-200 p-4">
            <p class="text-sm text-secondary-500 mb-1">Pendientes</p>
            <p class="text-2xl font-bold text-secondary-900">{{ stats.pending }}</p>
          </div>
        </div>

        <!-- Recent Check-ins -->
        <div class="bg-white rounded-xl border border-secondary-200 p-4">
          <h4 class="font-medium text-secondary-900 mb-3">Ultimos Check-ins</h4>
          <div class="space-y-2">
            <div
              v-for="checkIn in recentCheckIns"
              :key="checkIn.id"
              class="flex items-center justify-between py-2 border-b border-secondary-100 last:border-0"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckIcon class="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-secondary-900">{{ checkIn.name }}</p>
                  <p class="text-xs text-secondary-500">{{ checkIn.area }}</p>
                </div>
              </div>
              <span class="text-xs text-secondary-400">{{ checkIn.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QrCodeIcon, CheckIcon } from '@heroicons/vue/24/outline'

useHead({ title: 'Check-in - WaRo Tickets' })

const selectedEvent = ref('')
const ticketCode = ref('')

// Mock data
const events = ref([
  { id: '1', name: 'Concierto de Rock en el Parque' },
  { id: '2', name: 'Festival de Musica Electronica' }
])

const stats = ref({
  todayCheckIns: 245,
  totalSold: 450,
  checkInRate: 54,
  pending: 205
})

const recentCheckIns = ref([
  { id: '1', name: 'Juan Perez', area: 'VIP', time: 'Hace 2 min' },
  { id: '2', name: 'Maria Garcia', area: 'General', time: 'Hace 5 min' },
  { id: '3', name: 'Carlos Lopez', area: 'Preferencial', time: 'Hace 8 min' },
  { id: '4', name: 'Ana Martinez', area: 'VIP', time: 'Hace 12 min' }
])

function handleCheckIn() {
  if (!ticketCode.value) return
  // Mock check-in logic
  alert(`Check-in para boleta: ${ticketCode.value}`)
  ticketCode.value = ''
}
</script>
