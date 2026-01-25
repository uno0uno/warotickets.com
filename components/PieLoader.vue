<template>
  <div class="pie-loader"></div>
</template>

<style scoped>
.pie-loader {
  position: relative;
  width: 48px;
  height: 48px;
  border: 24px solid transparent;
  border-radius: 50%;
  animation: piefill 2s linear infinite;
}

@keyframes piefill {
  0%, 19% { border-color: transparent transparent transparent transparent }
  20%, 39% { border-color: var(--loader-color, #6366f1) transparent transparent transparent }
  40%, 59% { border-color: var(--loader-color, #6366f1) var(--loader-color, #6366f1) transparent transparent }
  60%, 79% { border-color: var(--loader-color, #6366f1) var(--loader-color, #6366f1) var(--loader-color, #6366f1) transparent }
  80%, 100% { border-color: var(--loader-color, #6366f1) var(--loader-color, #6366f1) var(--loader-color, #6366f1) var(--loader-color, #6366f1) }
}
</style>
