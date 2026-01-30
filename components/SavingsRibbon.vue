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
    class="absolute top-0 right-0 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-bl-xl tracking-wide shadow-sm"
    :class="variantClasses[variant]"
  >
    {{ variantText[variant](amount) }}
  </div>
</template>
