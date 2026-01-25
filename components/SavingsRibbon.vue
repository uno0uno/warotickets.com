<script setup lang="ts">
interface Props {
  amount: number
  variant?: 'savings' | 'low-stock' | 'sold-out'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'savings'
})

function formatPrice(price: number) {
  return price?.toLocaleString('es-CO') || '0'
}

const variantClasses = {
  savings: 'bg-green-500 text-white',
  'low-stock': 'bg-orange-500 text-white',
  'sold-out': 'bg-secondary-500 text-white'
}

const variantText = {
  savings: (amount: number) => `Ahorras $${formatPrice(amount)}`,
  'low-stock': (amount: number) => `Últimos ${formatPrice(amount)}`,
  'sold-out': () => 'Agotado'
}
</script>

<template>
  <div
    class="absolute top-0 right-0 text-[9px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider"
    :class="variantClasses[variant]"
  >
    {{ variantText[variant](amount) }}
  </div>
</template>
