<script setup lang="ts">
const authStore = useAuthStore()

// Redirect promotors to their module, others to eventos
if (authStore.isPromotor) {
  navigateTo('/promotores/mis-ventas', { replace: true })
} else {
  navigateTo('/gestion/eventos', { replace: true })
}
</script>
