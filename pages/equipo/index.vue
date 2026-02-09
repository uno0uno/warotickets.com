<template>
  <div></div>
</template>

<script setup lang="ts">
// Redirect to miembros by default
definePageMeta({
  layout: 'dashboard'
})

navigateTo('/equipo/miembros', { replace: true })
</script>
