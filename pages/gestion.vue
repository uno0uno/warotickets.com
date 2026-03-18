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

useHead({ title: 'Gestion de Eventos - WaRo Tickets' })

const navigationItems = [
  { to: '/gestion/eventos', label: 'Eventos' },
  { to: '/gestion/areas', label: 'Áreas' },
  { to: '/gestion/etapas', label: 'Etapas' },
  { to: '/gestion/promociones', label: 'Promociones' },
  { to: '/gestion/promotores', label: 'Promotores' },
  { to: '/gestion/comisiones', label: 'Comisiones' }
]
</script>
