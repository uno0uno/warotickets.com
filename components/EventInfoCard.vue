<script setup lang="ts">
import { computed } from 'vue'
import { TicketIcon, CalendarIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

interface Props {
  eventName: string
  eventSlug: string
  eventDate?: string | null
  capacity?: number | null
  linkable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  linkable: true
})

// Dynamic grid: 2 columns if no capacity, 3 columns if capacity exists
const gridClass = computed(() => {
  return props.capacity
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1 sm:grid-cols-2'
})

function formatDateShort(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatNumber(num: number) {
  return num?.toLocaleString('es-CO') || '0'
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-secondary-100 p-4 sm:p-6">
    <div class="grid gap-4 sm:gap-6" :class="gridClass">
      <!-- Event Name -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
          <TicketIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">Evento</p>
          <NuxtLink
            v-if="linkable"
            :to="`/eventos/${eventSlug}`"
            class="text-sm sm:text-lg font-semibold text-secondary-900 hover:text-primary-600"
          >
            {{ eventName }}
          </NuxtLink>
          <h1 v-else class="text-sm sm:text-lg font-semibold text-secondary-900">
            {{ eventName }}
          </h1>
        </div>
      </div>

      <!-- Event Date -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
          <CalendarIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">Fecha</p>
          <p v-if="eventDate" class="text-sm sm:text-lg font-semibold text-secondary-900">
            {{ formatDateShort(eventDate) }}
          </p>
          <p v-else class="text-sm sm:text-lg font-semibold text-secondary-400">-</p>
        </div>
      </div>

      <!-- Capacity (Aforo) -->
      <div v-if="capacity" class="flex items-center space-x-2 sm:space-x-3">
        <div class="bg-secondary-50 p-2 sm:p-3 rounded-lg border border-secondary-200 flex-shrink-0">
          <UserGroupIcon class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-secondary-500 uppercase tracking-wide">Aforo</p>
          <p class="text-sm sm:text-lg font-semibold text-secondary-900">
            {{ formatNumber(capacity) }} personas
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
