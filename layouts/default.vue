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

// Global SEO Schema for all public pages
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://warotickets.com'

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "WaRo Tickets",
        "url": siteUrl,
        "description": "Plataforma de venta de boletería y gestión de eventos",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      })
    }
  ]
})
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
