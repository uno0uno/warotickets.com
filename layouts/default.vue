<template>
  <div class="min-h-screen flex flex-col bg-background">
    <NuxtLoadingIndicator color="hsl(var(--primary))" />

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

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
