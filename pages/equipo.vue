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

useHead({ title: 'Equipo - WaRo Tickets' })

const navigationItems = [
  { to: '/equipo/miembros', label: 'Miembros' }
]
</script>
