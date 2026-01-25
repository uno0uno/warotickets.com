<script setup lang="ts">
import { TicketIcon } from '@heroicons/vue/24/outline'

interface Props {
  variant?: 'stage' | 'bundle' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info'
})

const variantClasses = {
  stage: 'bg-green-100 text-green-700',
  bundle: 'bg-primary-100 text-primary-700',
  info: 'bg-secondary-100 text-secondary-700'
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
    :class="variantClasses[variant]"
  >
    <TicketIcon v-if="variant === 'bundle'" class="w-4 h-4" />
    <slot />
  </span>
</template>
