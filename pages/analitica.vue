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

useHead({ title: 'Analitica - WaRo Tickets' })

const navigationItems = [
  { to: '/analitica/dashboard', label: 'Dashboard' },
  { to: '/analitica/ventas', label: 'Ventas' }
]
</script>
