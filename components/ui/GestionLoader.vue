<template>
  <div class="flex items-center justify-center min-h-[400px]">
    <div class="text-center">
      <PieLoader class="mx-auto mb-4" />
      <p class="text-secondary-600 font-medium">{{ currentPhrase }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { currentPhrase, start: startPhraseRotation, stop: stopPhraseRotation } = useLoadingPhrases([
  'Cargando tu carrito...',
  'Buscando tus boletas debajo del sofá...',
  'Verificando que no seas un bot...',
  'Haciendo cuentas con los dedos...',
  'Consultando el oráculo de precios...',
  'Negociando con el universo...',
  'Asegurando tu lugar en el concierto...',
  'Peleando con la base de datos...',
  'Prometemos no vender tus datos...',
  'Ya casi, paciencia joven padawan...'
])

onMounted(() => {
  startPhraseRotation()
})

onUnmounted(() => {
  stopPhraseRotation()
})
</script>
