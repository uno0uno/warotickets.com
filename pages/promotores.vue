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

useHead({ title: 'Promotor - WaRo Tickets' })

const navigationItems = [
  { to: '/promotores/mis-ventas', label: 'Mis Ventas' },
  { to: '/promotores/mis-enlaces', label: 'Mis Enlaces' }
]
</script>
