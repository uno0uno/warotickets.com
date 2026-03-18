<template>
  <div>
    <!-- 1. HERO — Dark ebony-900, layout 60/40 desktop -->
    <section class="relative overflow-hidden bg-secondary-900">
      <!-- Mesh gradient blobs -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/25 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-800/15 rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 md:px-8 relative py-20 md:py-32">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <!-- Text column (60%) -->
          <div class="lg:col-span-3 text-white">
            <span class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 border border-primary-500/30 text-primary-300 rounded-full text-sm font-medium mb-6">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
              </svg>
              Plataforma colombiana de boletería
            </span>

            <h1
              class="font-bold font-heading text-white mb-6 leading-tight"
              style="font-size: clamp(2.5rem, 1.5rem + 4vw, 4rem)"
            >
              Tu evento, tu comunidad,
              <span class="text-gradient">tus reglas.</span>
            </h1>

            <p class="text-lg text-secondary-300 leading-relaxed mb-8 max-w-xl">
              Crea tu evento, vende boletas online, gestiona accesos con QR y activa una red de promotores con comisiones automáticas. Sin mensualidades, sin contratos.
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink
                to="/auth/register"
                class="btn-primary text-base min-h-[48px] px-8 py-3 shadow-glow"
              >
                Crea tu evento gratis
              </NuxtLink>
              <a
                href="#features"
                class="btn border-2 border-white/20 text-white hover:bg-white/10 min-h-[48px] px-8 py-3 transition-all"
              >
                Ver funcionalidades
              </a>
            </div>

            <!-- Trust badges -->
            <div class="mt-10 flex flex-wrap items-center gap-6">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-base text-secondary-300">Sin mensualidad</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-base text-secondary-300">Pagos con Wompi</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-base text-secondary-300">QR para check-in</span>
              </div>
            </div>
          </div>

          <!-- Visual column (40%) -->
          <div class="lg:col-span-2 flex justify-center lg:justify-end">
            <div class="relative w-full max-w-sm">
              <div class="absolute inset-0 bg-primary-600/25 rounded-3xl blur-2xl transform scale-110" aria-hidden="true"></div>
              <img
                src="/hero_bogota_waro_tickets.png"
                alt="Eventos en Bogotá gestionados con WaRo Tickets"
                class="relative w-full rounded-3xl shadow-glow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. METRICS — Stat bar -->
    <section class="bg-primary-50 py-12 border-y border-primary-100" aria-label="Métricas de la plataforma">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div
              class="font-bold font-heading text-primary-700 leading-none mb-2"
              style="font-size: clamp(2rem, 1rem + 3vw, 3.5rem)"
            >500+</div>
            <!-- TODO: actualizar con datos reales de la plataforma -->
            <div class="text-secondary-600 text-base font-medium">Eventos realizados</div>
          </div>
          <div class="text-center md:border-l md:border-primary-200">
            <div
              class="font-bold font-heading text-primary-700 leading-none mb-2"
              style="font-size: clamp(2rem, 1rem + 3vw, 3.5rem)"
            >25k+</div>
            <div class="text-secondary-600 text-base font-medium">Boletas vendidas</div>
          </div>
          <div class="text-center md:border-l md:border-primary-200">
            <div
              class="font-bold font-heading text-primary-700 leading-none mb-2"
              style="font-size: clamp(2rem, 1rem + 3vw, 3.5rem)"
            >200+</div>
            <div class="text-secondary-600 text-base font-medium">Promotores activos</div>
          </div>
          <div class="text-center md:border-l md:border-primary-200">
            <div
              class="font-bold font-heading text-primary-700 leading-none mb-2"
              style="font-size: clamp(2rem, 1rem + 3vw, 3.5rem)"
            >$0</div>
            <div class="text-secondary-600 text-base font-medium">Costo mensual</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. FEATURES — Bento grid asimétrico -->
    <section id="features" class="section bg-white">
      <div class="container mx-auto px-4 md:px-8">
        <div class="text-center mb-16">
          <h2 class="section-title mb-4 animate-fade-in-up-scroll">
            Todo lo que necesitas<br>
            <span class="text-gradient">en un solo lugar</span>
          </h2>
          <p class="section-subtitle mx-auto animate-fade-in-up-scroll" style="animation-delay: 0.1s">
            Herramientas pensadas para organizadores que quieren vender más y preocuparse menos.
          </p>
        </div>

        <!-- Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <!-- Card principal (col-span-2) — Venta de boletas -->
          <div class="lg:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up-scroll" style="animation-delay: 0.1s">
            <div class="flex flex-col md:flex-row gap-8 items-start">
              <div class="flex-1">
                <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-secondary-900 mb-3 font-heading">Venta de Boletas</h3>
                <p class="text-base text-secondary-600 leading-relaxed">
                  Vende entradas online 24/7. Múltiples zonas, precios por etapas, descuentos automáticos y códigos promocionales. Tu comprador paga en segundos.
                </p>
              </div>
              <div class="flex flex-col gap-3 md:min-w-[170px]">
                <div class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-secondary-100">
                  <div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true"></div>
                  <span class="text-sm font-medium text-secondary-700">Múltiples zonas</span>
                </div>
                <div class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-secondary-100">
                  <div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true"></div>
                  <span class="text-sm font-medium text-secondary-700">Precio por etapas</span>
                </div>
                <div class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-secondary-100">
                  <div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true"></div>
                  <span class="text-sm font-medium text-secondary-700">Ventas 24/7</span>
                </div>
              </div>
            </div>
          </div>

          <!-- QR Check-in -->
          <div class="card-hover p-8 animate-fade-in-up-scroll" style="animation-delay: 0.2s">
            <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-3 font-heading">Control con QR</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Cada boleta tiene un QR único. Escanea en la entrada y controla quién entra en tiempo real desde cualquier celular.
            </p>
          </div>

          <!-- Dashboard en vivo -->
          <div class="card-hover p-8 animate-fade-in-up-scroll" style="animation-delay: 0.3s">
            <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-3 font-heading">Dashboard en Vivo</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Ve tus ventas, check-ins y estadísticas en tiempo real. Sabe exactamente cómo va tu evento.
            </p>
          </div>

          <!-- Transferir boletas -->
          <div class="card-hover p-8 animate-fade-in-up-scroll" style="animation-delay: 0.4s">
            <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-3 font-heading">Transferir Boletas</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Tus asistentes pueden transferir sus boletas a amigos con un link. Simple y seguro.
            </p>
          </div>

          <!-- Promociones -->
          <div class="card-hover p-8 animate-fade-in-up-scroll" style="animation-delay: 0.5s">
            <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-3 font-heading">Promociones</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Crea códigos de descuento, ventas early bird y etapas de precio. Maximiza tus ventas.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. PROMOTORES — Sección nueva -->
    <section class="section bg-secondary-900 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-600/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 md:px-8 relative">
        <!-- Header -->
        <div class="text-center mb-16">
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 border border-primary-500/30 text-primary-300 rounded-full text-sm font-medium mb-6">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
            Red de Promotores
          </span>
          <h2
            class="font-bold font-heading text-white mb-4"
            style="font-size: clamp(1.8rem, 1rem + 3vw, 3rem)"
          >
            Convierte a tus asistentes<br>
            en <span class="text-gradient">vendedores</span>
          </h2>
          <p class="text-lg text-secondary-300 leading-relaxed max-w-2xl mx-auto">
            Crea códigos de promotor, asigna comisiones personalizadas y deja que tu red haga crecer tus ventas. Tú pagas solo cuando ellos venden.
          </p>
        </div>

        <!-- 3-step flow -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Paso 1 -->
          <div class="bg-secondary-800 border border-secondary-700 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-primary-600/20 border border-primary-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
            <div class="text-4xl font-bold font-heading text-primary-400 mb-2" aria-hidden="true">01</div>
            <h3 class="text-xl font-bold text-white mb-3 font-heading">Crea un código</h3>
            <p class="text-base text-secondary-400 leading-relaxed">
              Genera un código único para cada promotor y asigna la comisión que deseas (ej. 10–30%).
            </p>
          </div>

          <!-- Paso 2 -->
          <div class="bg-secondary-800 border border-secondary-700 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-primary-600/20 border border-primary-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
            </div>
            <div class="text-4xl font-bold font-heading text-primary-400 mb-2" aria-hidden="true">02</div>
            <h3 class="text-xl font-bold text-white mb-3 font-heading">El promotor comparte</h3>
            <p class="text-base text-secondary-400 leading-relaxed">
              Usa su link con el código. Cada venta que genera queda registrada automáticamente a su nombre.
            </p>
          </div>

          <!-- Paso 3 -->
          <div class="bg-secondary-800 border border-secondary-700 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-primary-600/20 border border-primary-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div class="text-4xl font-bold font-heading text-primary-400 mb-2" aria-hidden="true">03</div>
            <h3 class="text-xl font-bold text-white mb-3 font-heading">Pagas la comisión</h3>
            <p class="text-base text-secondary-400 leading-relaxed">
              Desde tu dashboard ves cuánto le debes a cada promotor. Tú decides cuándo y cómo pagarles.
            </p>
          </div>
        </div>

        <div class="text-center mt-12">
          <NuxtLink
            to="/auth/register"
            class="btn-primary text-base min-h-[48px] px-8 py-3 shadow-glow"
          >
            Activar red de promotores
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 5. WOMPI — Confianza de pagos -->
    <section class="section bg-gradient-dark relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 md:px-8 relative">
        <div class="max-w-3xl mx-auto">
          <!-- Glassmorphism card -->
          <div class="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-glow">
            <!-- Wompi badge -->
            <div class="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-6 py-3 mb-8">
              <div class="w-3 h-3 rounded-full bg-green-400 flex-shrink-0" aria-hidden="true"></div>
              <span class="text-white font-bold text-lg tracking-wide">wompi</span>
              <span class="text-secondary-300 text-sm">por Bancolombia</span>
            </div>

            <h2
              class="font-bold font-heading text-white mb-4"
              style="font-size: clamp(1.8rem, 1rem + 2.5vw, 2.5rem)"
            >
              Pagos seguros para tu evento
            </h2>
            <p class="text-base text-secondary-300 leading-relaxed mb-8 max-w-xl mx-auto">
              Integrado con Wompi — la pasarela de pagos líder en Colombia. El dinero llega directo a tu cuenta, sin intermediarios.
            </p>

            <!-- Payment methods -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div class="bg-white/10 border border-white/10 rounded-xl p-4 text-center">
                <svg class="w-8 h-8 text-primary-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                <p class="text-white text-sm font-medium">Tarjeta</p>
                <p class="text-secondary-400 text-xs">Crédito / Débito</p>
              </div>
              <div class="bg-white/10 border border-white/10 rounded-xl p-4 text-center">
                <svg class="w-8 h-8 text-primary-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                </svg>
                <p class="text-white text-sm font-medium">PSE</p>
                <p class="text-secondary-400 text-xs">Débito bancario</p>
              </div>
              <div class="bg-white/10 border border-white/10 rounded-xl p-4 text-center">
                <svg class="w-8 h-8 text-primary-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <p class="text-white text-sm font-medium">Nequi</p>
                <p class="text-secondary-400 text-xs">Billetera digital</p>
              </div>
              <div class="bg-white/10 border border-white/10 rounded-xl p-4 text-center">
                <svg class="w-8 h-8 text-primary-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <p class="text-white text-sm font-medium">Efectivo</p>
                <p class="text-secondary-400 text-xs">Corresponsales</p>
              </div>
            </div>

            <!-- Security badge -->
            <div class="inline-flex items-center gap-2 text-secondary-300 text-sm">
              <svg class="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              Transacciones cifradas · Regulado por la Superfinanciera de Colombia
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. PRICING — Fee transparente -->
    <section id="pricing" class="section bg-white">
      <div class="container mx-auto px-4 md:px-8">
        <div class="text-center mb-12">
          <h2 class="section-title mb-4 animate-fade-in-up-scroll">¿Cuánto cuesta?</h2>
          <p class="section-subtitle mx-auto animate-fade-in-up-scroll" style="animation-delay: 0.1s">
            Sin sorpresas. Solo pagas cuando vendes una boleta.
          </p>
        </div>

        <div class="max-w-2xl mx-auto">
          <!-- Pricing card -->
          <div class="border-2 border-primary-200 rounded-3xl p-8 md:p-10 bg-primary-50 text-center relative">
            <span class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-700 text-white text-sm font-semibold px-5 py-1.5 rounded-full whitespace-nowrap">
              Sin mensualidad
            </span>

            <div class="mb-6 mt-2">
              <div
                class="font-bold font-heading text-primary-700 leading-none"
                style="font-size: clamp(2.5rem, 2rem + 2vw, 4rem)"
              >3.26%</div>
              <div class="text-secondary-600 text-lg mt-2">+ $1,894 COP por boleta vendida</div>
            </div>

            <!-- Bullets -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <div class="flex items-center justify-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm">
                <svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm font-medium text-secondary-700">Sin mensualidad</span>
              </div>
              <div class="flex items-center justify-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm">
                <svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm font-medium text-secondary-700">Sin contrato</span>
              </div>
              <div class="flex items-center justify-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm">
                <svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm font-medium text-secondary-700">Sin permanencia</span>
              </div>
            </div>

            <!-- Example calculation -->
            <div class="bg-white border border-secondary-100 rounded-2xl p-6 mb-8 text-left">
              <p class="text-sm font-semibold text-secondary-500 mb-3 uppercase tracking-wide">Ejemplo de cálculo</p>
              <div class="space-y-2">
                <div class="flex justify-between items-center text-base">
                  <span class="text-secondary-600">500 boletas a $30,000 COP</span>
                  <span class="font-semibold text-secondary-900">$15,000,000</span>
                </div>
                <div class="flex justify-between items-center text-base">
                  <span class="text-secondary-600">Fee WaRo (3.26% + $1,894 c/u)</span>
                  <span class="font-semibold text-primary-700">≈ $1,437,000</span>
                </div>
                <div class="border-t border-secondary-100 pt-2 flex justify-between items-center font-bold">
                  <span class="text-secondary-900 text-base">Tú recibes</span>
                  <span class="text-green-700 text-lg">≈ $13,563,000</span>
                </div>
              </div>
            </div>

            <NuxtLink
              to="/auth/register"
              class="btn-primary text-base min-h-[48px] w-full justify-center px-8 py-3"
            >
              Comienza gratis
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. CTA FINAL — 3 pasos + botón grande -->
    <section class="section bg-secondary-900 relative overflow-hidden">
      <!-- Gradient accent top -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-primary-600/20 blur-3xl rounded-full pointer-events-none" aria-hidden="true"></div>

      <div class="container mx-auto px-4 md:px-8 relative text-center">
        <h2
          class="font-bold font-heading text-white mb-4"
          style="font-size: clamp(2rem, 1rem + 4vw, 3.5rem)"
        >
          Tu evento, listo en<br>
          <span class="text-gradient">10 minutos</span>
        </h2>
        <p class="text-lg text-secondary-300 leading-relaxed mb-12 max-w-xl mx-auto">
          Sin burocracia, sin esperas. En minutos tu evento está publicado y listo para vender.
        </p>

        <!-- 3 steps -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div class="flex flex-col items-center">
            <div class="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-glow" aria-hidden="true">
              <span class="text-white font-bold text-xl font-heading">1</span>
            </div>
            <h3 class="text-white font-semibold text-base mb-1 font-heading">Crea tu evento</h3>
            <p class="text-secondary-400 text-sm leading-relaxed">Nombre, fecha, lugar y descripción</p>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-glow" aria-hidden="true">
              <span class="text-white font-bold text-xl font-heading">2</span>
            </div>
            <h3 class="text-white font-semibold text-base mb-1 font-heading">Configura boletas</h3>
            <p class="text-secondary-400 text-sm leading-relaxed">Zonas, precios, cupos y etapas</p>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-glow" aria-hidden="true">
              <span class="text-white font-bold text-xl font-heading">3</span>
            </div>
            <h3 class="text-white font-semibold text-base mb-1 font-heading">Comparte y vende</h3>
            <p class="text-secondary-400 text-sm leading-relaxed">Activa promotores y difunde tu evento</p>
          </div>
        </div>

        <NuxtLink
          to="/auth/register"
          class="inline-flex items-center justify-center gap-2 btn-primary text-lg min-h-[56px] px-10 py-4 shadow-glow-lg"
        >
          Crea tu evento gratis
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

// SEO
useHead({
  title: 'WaRo Tickets — Vende Boletas para tu Evento | Colombia',
  meta: [
    {
      name: 'description',
      content: 'Crea tu evento, vende boletas online, gestiona accesos con QR y activa una red de promotores con comisiones automáticas. Sin mensualidades. Pagos con Wompi.'
    }
  ]
})
</script>

<style scoped>
/* Fade in up — hero (immediate) */
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

/* Scroll-triggered fade in */
.animate-fade-in-up-scroll {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Respect reduced motion — accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-fade-in-up-scroll {
    animation: none;
    opacity: 1;
    transform: none;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
