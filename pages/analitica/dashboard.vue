<template>
  <div>
    <!-- Event Selector -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <label class="block text-sm font-medium text-secondary-700 mb-2">Evento</label>
        <select
          v-model="selectedEvent"
          class="w-full sm:w-64 px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
        >
          <option value="all">Todos los eventos</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.name }}
          </option>
        </select>
      </div>

      <!-- Date Range -->
      <div class="flex items-center gap-2">
        <button
          v-for="range in dateRanges"
          :key="range.value"
          @click="selectedRange = range.value"
          :class="[
            'px-3 py-1.5 text-sm rounded-lg transition-colors',
            selectedRange === range.value
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
          ]"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-secondary-200 p-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-secondary-500">Ingresos Totales</p>
          <CurrencyDollarIcon class="w-5 h-5 text-green-500" />
        </div>
        <p class="text-2xl font-bold text-secondary-900">${{ stats.totalRevenue.toLocaleString() }}</p>
        <p class="text-xs text-green-600 mt-1">+12.5% vs periodo anterior</p>
      </div>

      <div class="bg-white rounded-xl border border-secondary-200 p-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-secondary-500">Boletas Vendidas</p>
          <TicketIcon class="w-5 h-5 text-primary-500" />
        </div>
        <p class="text-2xl font-bold text-secondary-900">{{ stats.ticketsSold.toLocaleString() }}</p>
        <p class="text-xs text-green-600 mt-1">+8.3% vs periodo anterior</p>
      </div>

      <div class="bg-white rounded-xl border border-secondary-200 p-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-secondary-500">Ticket Promedio</p>
          <ChartBarIcon class="w-5 h-5 text-blue-500" />
        </div>
        <p class="text-2xl font-bold text-secondary-900">${{ stats.avgTicket.toLocaleString() }}</p>
        <p class="text-xs text-red-600 mt-1">-2.1% vs periodo anterior</p>
      </div>

      <div class="bg-white rounded-xl border border-secondary-200 p-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-secondary-500">Tasa Conversion</p>
          <ArrowTrendingUpIcon class="w-5 h-5 text-purple-500" />
        </div>
        <p class="text-2xl font-bold text-secondary-900">{{ stats.conversionRate }}%</p>
        <p class="text-xs text-green-600 mt-1">+1.2% vs periodo anterior</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Sales Chart Placeholder -->
      <div class="bg-white rounded-xl border border-secondary-200 p-4">
        <h3 class="font-semibold text-secondary-900 mb-4">Ventas por Dia</h3>
        <div class="h-64 bg-secondary-50 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <ChartBarIcon class="w-12 h-12 text-secondary-300 mx-auto mb-2" />
            <p class="text-sm text-secondary-400">Grafico de ventas</p>
          </div>
        </div>
      </div>

      <!-- Distribution Chart Placeholder -->
      <div class="bg-white rounded-xl border border-secondary-200 p-4">
        <h3 class="font-semibold text-secondary-900 mb-4">Distribucion por Area</h3>
        <div class="h-64 bg-secondary-50 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <ChartPieIcon class="w-12 h-12 text-secondary-300 mx-auto mb-2" />
            <p class="text-sm text-secondary-400">Grafico de distribucion</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Events Table -->
    <div class="bg-white rounded-xl border border-secondary-200 p-4">
      <h3 class="font-semibold text-secondary-900 mb-4">Top Eventos</h3>
      <table class="w-full">
        <thead class="border-b border-secondary-200">
          <tr>
            <th class="pb-3 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">Evento</th>
            <th class="pb-3 text-right text-xs font-semibold text-secondary-600 uppercase tracking-wider">Vendidas</th>
            <th class="pb-3 text-right text-xs font-semibold text-secondary-600 uppercase tracking-wider">Ingresos</th>
            <th class="pb-3 text-right text-xs font-semibold text-secondary-600 uppercase tracking-wider">Ocupacion</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-secondary-100">
          <tr v-for="event in topEvents" :key="event.id">
            <td class="py-3">
              <p class="font-medium text-secondary-900">{{ event.name }}</p>
              <p class="text-xs text-secondary-500">{{ event.date }}</p>
            </td>
            <td class="py-3 text-right text-secondary-600">{{ event.sold }}</td>
            <td class="py-3 text-right font-medium text-secondary-900">${{ event.revenue.toLocaleString() }}</td>
            <td class="py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <div class="w-16 h-2 bg-secondary-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary-600 rounded-full"
                    :style="{ width: `${event.occupancy}%` }"
                  ></div>
                </div>
                <span class="text-sm text-secondary-600">{{ event.occupancy }}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CurrencyDollarIcon,
  TicketIcon,
  ChartBarIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon
} from '@heroicons/vue/24/outline'

useHead({ title: 'Dashboard - WaRo Tickets' })

const selectedEvent = ref('all')
const selectedRange = ref('7d')

const events = ref([
  { id: '1', name: 'Concierto de Rock en el Parque' },
  { id: '2', name: 'Festival de Musica Electronica' }
])

const dateRanges = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: 'Anual', value: '1y' }
]

const stats = ref({
  totalRevenue: 125450000,
  ticketsSold: 1245,
  avgTicket: 100762,
  conversionRate: 3.8
})

const topEvents = ref([
  {
    id: '1',
    name: 'Concierto de Rock en el Parque',
    date: '15 Feb 2025',
    sold: 450,
    revenue: 67500000,
    occupancy: 75
  },
  {
    id: '2',
    name: 'Festival de Musica Electronica',
    date: '1 Mar 2025',
    sold: 320,
    revenue: 38400000,
    occupancy: 45
  },
  {
    id: '3',
    name: 'Teatro: El Fantasma de la Opera',
    date: '20 Ene 2025',
    sold: 320,
    revenue: 19550000,
    occupancy: 100
  }
])
</script>
