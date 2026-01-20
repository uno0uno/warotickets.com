<template>
  <!-- Dashboard Content -->
  <div class="h-screen flex flex-col lg:flex-row overflow-hidden bg-secondary-50">
    <!-- Sidebar (Desktop) -->
    <DashboardSidebar />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white border-b border-secondary-200 px-4 lg:px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-secondary-900">{{ pageTitle }}</h1>
            <p v-if="pageSubtitle" class="text-sm text-secondary-500 mt-1">{{ pageSubtitle }}</p>
          </div>
          <div v-if="$slots.headerAction" class="hidden lg:block">
            <slot name="headerAction" />
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
        <slot />
      </div>
    </main>

    <!-- Bottom Nav (Mobile) -->
    <DashboardBottomNav />
  </div>
</template>

<script setup lang="ts">
const pageTitle = ref('Dashboard')
const pageSubtitle = ref('')

// Provide functions to child components
provide('setPageTitle', (title: string) => {
  pageTitle.value = title
})

provide('setPageSubtitle', (subtitle: string) => {
  pageSubtitle.value = subtitle
})
</script>

