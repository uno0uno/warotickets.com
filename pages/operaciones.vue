<template>
  <div class="space-y-4">
    <UiModuleNavigation :navigation-items="navigationItems" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useHead({ title: 'Operaciones - WaRo Tickets' })

const navigationItems = [
  { to: '/operaciones/check-in', label: 'Check-in' },
  { to: '/operaciones/reservas', label: 'Reservas', matchPath: '/operaciones/reservas' },
  { to: '/operaciones/transfers', label: 'Transfers' }
]
</script>
