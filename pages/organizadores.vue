<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-30">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'hsl(254, 83%, 75%)\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <div class="container mx-auto px-4 md:px-8 relative">
        <div class="py-20 md:py-32 lg:py-40 text-center max-w-4xl mx-auto">
          <span
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6 animate-fade-in-up"
            style="animation-delay: 0.1s"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
            </svg>
            Plataforma de eventos en Colombia
          </span>

          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-secondary-900 mb-6 leading-tight animate-fade-in-up"
            style="animation-delay: 0.2s"
          >
            Vende boletas para tu evento
            <span class="text-gradient">sin complicaciones</span>
          </h1>

          <p
            class="text-lg md:text-xl text-secondary-600 mb-8 max-w-2xl mx-auto animate-fade-in-up"
            style="animation-delay: 0.3s"
          >
            Crea tu evento, vende entradas online, controla accesos con QR y gestiona todo desde un solo lugar. Simple, rapido y confiable.
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style="animation-delay: 0.4s"
          >
            <NuxtLink to="/auth/register" class="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform">
              Crear mi evento gratis
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </NuxtLink>
            <a href="#features" class="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform">
              Ver funcionalidades
            </a>
          </div>

          <!-- Trust Badges -->
          <div
            class="mt-12 flex flex-wrap justify-center items-center gap-8 text-secondary-400 animate-fade-in-up"
            style="animation-delay: 0.5s"
          >
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm">Sin cuota mensual</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm">Pagos con Wompi</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm">QR para check-in</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="section bg-white">
      <div class="container mx-auto px-4 md:px-8">
        <div class="text-center mb-16">
          <h2 class="section-title mb-4 animate-fade-in-up-scroll">Todo lo que necesitas para tu evento</h2>
          <p class="section-subtitle mx-auto animate-fade-in-up-scroll" style="animation-delay: 0.1s">
            Herramientas pensadas para organizadores de eventos que quieren vender mas y preocuparse menos.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card-hover p-8 animate-fade-in-up-scroll" style="animation-delay: 0.1s">
            <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 animate-float">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-3">Venta de Boletas</h3>
            <p class="text-secondary-600">
              Vende entradas online 24/7. Multiples zonas, precios diferentes, codigos promocionales y mas.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card-hover p-8 animate-fade-in-up-scroll" style="animation-delay: 0.2s">
            <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 animate-float" style="animation-delay: 0.5s">
              <svg class="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-3">Control con QR</h3>
            <p class="text-secondary-600">
              Cada boleta tiene un QR unico. Escanea en la entrada y controla quien entra en tiempo real.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card-hover p-8 animate-fade-in-up-scroll" style="animation-delay: 0.3s">
            <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 animate-float" style="animation-delay: 1s">
              <svg class="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-3">Dashboard en Vivo</h3>
            <p class="text-secondary-600">
              Ve tus ventas, check-ins y estadisticas en tiempo real. Sabe exactamente como va tu evento.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="card-hover p-8 animate-fade-in-up-scroll" style="animation-delay: 0.4s">
            <div class="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 animate-float" style="animation-delay: 1.5s">
              <svg class="w-7 h-7 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-3">Pagos Seguros</h3>
            <p class="text-secondary-600">
              Integrado con Wompi. Acepta tarjetas, PSE, Nequi y mas. El dinero llega directo a tu cuenta.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="card-hover p-8 animate-fade-in-up-scroll" style="animation-delay: 0.5s">
            <div class="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 animate-float" style="animation-delay: 2s">
              <svg class="w-7 h-7 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-3">Transferir Boletas</h3>
            <p class="text-secondary-600">
              Tus asistentes pueden transferir sus boletas a amigos. Simple y seguro con un link.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="card-hover p-8 animate-fade-in-up-scroll" style="animation-delay: 0.6s">
            <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 animate-float" style="animation-delay: 2.5s">
              <svg class="w-7 h-7 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-3">Promociones</h3>
            <p class="text-secondary-600">
              Crea codigos de descuento, early bird, y etapas de venta. Maximiza tus ventas.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="contact" class="section bg-gradient-dark text-white">
      <div class="container mx-auto px-4 md:px-8 text-center">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 animate-fade-in-up-scroll">
          Listo para vender boletas?
        </h2>
        <p class="text-xl text-secondary-300 mb-8 max-w-2xl mx-auto animate-fade-in-up-scroll" style="animation-delay: 0.1s">
          Crea tu evento en minutos y empieza a vender hoy. Sin costos fijos, solo pagas cuando vendes.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-scroll" style="animation-delay: 0.2s">
          <NuxtLink to="/auth/register" class="btn bg-white text-secondary-900 hover:bg-secondary-100 text-lg px-8 py-4 hover:scale-105 transition-transform">
            Empezar ahora
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </NuxtLink>
          <a href="mailto:hola@warotickets.com" class="btn border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 hover:scale-105 transition-transform">
            Contactar ventas
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: 'WaRo Tickets - Vende Boletas para tu Evento',
  meta: [
    { name: 'description', content: 'Plataforma de venta de boleteria para eventos en Colombia. Vende entradas online, controla accesos con QR y gestiona tu evento facilmente.' }
  ]
})
</script>

<style scoped>
/* Fade in up animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in-up-scroll {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Floating animation for icons */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Gradient text */
.text-gradient {
  background: linear-gradient(135deg, hsl(var(--crocus-600)) 0%, hsl(var(--crocus-400)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
