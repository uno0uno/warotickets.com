<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- Global Loading Overlay -->
  <UiLoadingOverlay />
</template>

<script setup>
if (process.env.NODE_ENV === 'development') {
  useHead({
    script: [{ src: 'https://mcp.figma.com/mcp/html-to-design/capture.js', async: true }]
  })
}
</script>
