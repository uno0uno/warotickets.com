<template>
  <div class="min-h-screen flex flex-col bg-white">
    <NuxtLoadingIndicator color="#7c3aed" />

    <LayoutHeader />

    <main class="flex-1">
      <slot />
    </main>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
// Default layout with header and footer
</script>
