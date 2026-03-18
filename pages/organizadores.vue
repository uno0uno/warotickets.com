<template>
  <div>
    <!-- 1. HERO — Dark sólido, layout 60/40 desktop -->
    <section class="bg-secondary-900">
      <div class="container mx-auto px-4 md:px-8 py-20 md:py-32">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">

          <!-- Texto (60%) -->
          <div class="lg:col-span-3 text-white">
            <span class="inline-flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-full text-sm font-medium mb-6">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
              </svg>
              Plataforma colombiana de boletería
            </span>

            <h1
              class="font-bold font-heading text-white mb-6 leading-tight"
              style="font-size: clamp(2.5rem, 1.5rem + 4vw, 4rem)"
            >
              Vende boletas, gestiona
              <span class="text-gradient">tu evento.</span>
            </h1>

            <p class="text-lg text-secondary-300 leading-relaxed mb-8 max-w-xl">
              Crea áreas, define etapas de venta, activa una red de promotores con comisiones automáticas y controla los accesos con QR. Todo desde un solo lugar.
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink
                to="/contacto"
                class="btn-primary text-base min-h-[48px] px-8 py-3"
              >
                Solicitar acceso
              </NuxtLink>
              <a
                href="#funcionalidades"
                class="btn border-2 border-white/20 text-white hover:bg-white/10 min-h-[48px] px-8 py-3 transition-all"
              >
                Ver funcionalidades
              </a>
            </div>

            <!-- Badges de confianza -->
            <div class="mt-10 flex flex-wrap items-center gap-6">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-base text-secondary-300">Sin costo mensual</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-base text-secondary-300">Pagos con Wompi</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-base text-secondary-300">100% colombiano</span>
              </div>
            </div>
          </div>

          <!-- Imagen (40%) -->
          <div class="lg:col-span-2 flex justify-center lg:justify-end">
            <img
              src="/hero_bogota_waro_tickets.png"
              alt="Eventos en Bogotá gestionados con WaRo Tickets"
              class="w-full max-w-sm rounded-2xl border border-secondary-700 object-cover"
            />
          </div>

        </div>
      </div>
    </section>

    <!-- 2. HIGHLIGHTS — Banda de color sólido -->
    <section class="bg-primary-700 py-10" aria-label="Características principales">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div class="text-white font-bold font-heading mb-1" style="font-size: clamp(1.8rem, 1rem + 2.5vw, 3rem)">7+</div>
            <div class="text-primary-200 text-sm font-medium">Años de experiencia</div>
          </div>
          <div class="md:border-l md:border-primary-600">
            <div class="text-white font-bold font-heading mb-1" style="font-size: clamp(1.8rem, 1rem + 2.5vw, 3rem)">100+</div>
            <div class="text-primary-200 text-sm font-medium">Eventos gestionados</div>
          </div>
          <div class="md:border-l md:border-primary-600">
            <div class="text-white font-bold font-heading mb-1" style="font-size: clamp(1.8rem, 1rem + 2.5vw, 3rem)">QR</div>
            <div class="text-primary-200 text-sm font-medium">Check-in en tiempo real</div>
          </div>
          <div class="md:border-l md:border-primary-600">
            <div class="text-white font-bold font-heading mb-1" style="font-size: clamp(1.8rem, 1rem + 2.5vw, 3rem)">$0</div>
            <div class="text-primary-200 text-sm font-medium">Costo mensual</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. FUNCIONALIDADES — Grid limpio -->
    <section id="funcionalidades" class="section bg-white">
      <div class="container mx-auto px-4 md:px-8">
        <div class="text-center mb-16">
          <h2 class="section-title mb-4">Funcionalidades</h2>
          <p class="section-subtitle mx-auto">
            Todo lo que necesitas para crear, vender y gestionar tu evento.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <!-- Etapas de venta — destacada -->
          <div class="lg:col-span-2 border-2 border-primary-100 bg-primary-50 rounded-2xl p-8">
            <div class="flex flex-col md:flex-row gap-8 items-start">
              <div class="flex-1">
                <div class="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center mb-5">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-secondary-900 mb-2 font-heading">Etapas de venta</h3>
                <p class="text-base text-secondary-600 leading-relaxed">
                  Define preventa, early bird y precio general. Cada etapa tiene su cupo, precio y período de vigencia. El sistema aplica la etapa correcta automáticamente.
                </p>
              </div>
              <div class="flex flex-col gap-2 md:min-w-[160px]">
                <div class="bg-white border border-secondary-100 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary-700">Early bird</div>
                <div class="bg-white border border-secondary-100 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary-700">Preventa</div>
                <div class="bg-white border border-secondary-100 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary-700">Precio general</div>
                <div class="bg-primary-100 border border-primary-200 rounded-lg px-4 py-2.5 text-sm font-medium text-primary-800">Automático</div>
              </div>
            </div>
          </div>

          <!-- QR Check-in -->
          <div class="border border-secondary-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-secondary-900 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-2 font-heading">Check-in con QR</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Cada boleta tiene un QR único. Escanea en la entrada desde cualquier celular y ve las estadísticas de asistencia en tiempo real.
            </p>
          </div>

          <!-- Transferencia de boletas -->
          <div class="border border-secondary-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-secondary-900 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-2 font-heading">Transferencia de boletas</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Tu comprador puede ceder su boleta a otra persona por email. El sistema invalida la boleta original y genera una nueva. Trazable y seguro.
            </p>
          </div>

          <!-- Paquetes y combos -->
          <div class="border border-secondary-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-secondary-900 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-2 font-heading">Paquetes y combos</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Crea paquetes como "2 VIP + 2 General" con precio especial. Define descuento porcentual, monto fijo o precio total cerrado.
            </p>
          </div>

          <!-- Dashboard de ventas -->
          <div class="border border-secondary-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-secondary-900 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-2 font-heading">Dashboard en vivo</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Reservas, pagos y check-ins actualizados en tiempo real. Sabe exactamente cuántas boletas se han vendido y cuántas personas han entrado.
            </p>
          </div>

          <!-- Imágenes del evento -->
          <div class="border border-secondary-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-secondary-900 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-2 font-heading">Imágenes del evento</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Sube banner, flyer, portada y galería. Las imágenes se almacenan en la nube y se muestran automáticamente en la página pública del evento.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- 4. PROMOTORES — Sección nueva, fondo oscuro sólido -->
    <section class="section bg-secondary-900">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <!-- Texto -->
          <div class="text-white">
            <span class="inline-block px-4 py-2 bg-primary-700 text-white text-sm font-medium rounded-full mb-6">
              Red de Promotores
            </span>
            <h2
              class="font-bold font-heading text-white mb-6"
              style="font-size: clamp(1.8rem, 1rem + 3vw, 3rem)"
            >
              Tu propia red de promotores dentro de la plataforma
            </h2>
            <p class="text-base text-secondary-300 leading-relaxed mb-8">
              Tú defines quiénes son tus promotores y los activas en la plataforma. Cada uno recibe un código único (<code class="bg-secondary-800 text-primary-300 px-2 py-0.5 rounded text-sm">WRPROM-XXXXX</code>). Cuando alguien compra con su link, la comisión se calcula y registra automáticamente.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start gap-3 text-base text-secondary-300">
                <svg class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Comisión configurable por promotor y por evento
              </li>
              <li class="flex items-start gap-3 text-base text-secondary-300">
                <svg class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Estado de cada comisión: pendiente → aprobado → pagado
              </li>
              <li class="flex items-start gap-3 text-base text-secondary-300">
                <svg class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                El promotor ve su historial y sus ganancias desde su portal
              </li>
              <li class="flex items-start gap-3 text-base text-secondary-300">
                <svg class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Tú apruebas y pagas cada comisión manualmente
              </li>
            </ul>
            <NuxtLink to="/contacto" class="btn-primary text-base min-h-[48px] px-8 py-3">
              Solicitar acceso
            </NuxtLink>
          </div>

          <!-- Flujo visual -->
          <div class="space-y-4">
            <div class="flex items-start gap-5 bg-secondary-800 border border-secondary-700 rounded-2xl p-6">
              <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center text-white font-bold font-heading text-base flex-shrink-0">1</div>
              <div>
                <h3 class="text-white font-semibold text-base mb-1 font-heading">Creas el código del promotor</h3>
                <p class="text-secondary-300 text-sm leading-relaxed">Asignas la comisión y los eventos que puede promover.</p>
              </div>
            </div>
            <div class="flex items-start gap-5 bg-secondary-800 border border-secondary-700 rounded-2xl p-6">
              <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center text-white font-bold font-heading text-base flex-shrink-0">2</div>
              <div>
                <h3 class="text-white font-semibold text-base mb-1 font-heading">El promotor comparte su link</h3>
                <p class="text-secondary-300 text-sm leading-relaxed">Cada compra con su link queda registrada automáticamente.</p>
              </div>
            </div>
            <div class="flex items-start gap-5 bg-secondary-800 border border-secondary-700 rounded-2xl p-6">
              <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center text-white font-bold font-heading text-base flex-shrink-0">3</div>
              <div>
                <h3 class="text-white font-semibold text-base mb-1 font-heading">Apruebas y pagas la comisión</h3>
                <p class="text-secondary-300 text-sm leading-relaxed">Desde tu dashboard apruebas las comisiones y registras el pago.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 5. WOMPI — Fondo claro, tarjeta limpia -->
    <section class="section bg-secondary-50">
      <div class="container mx-auto px-4 md:px-8">
        <div class="max-w-3xl mx-auto">
          <div class="border border-secondary-200 rounded-2xl p-8 md:p-12 bg-white text-center">

            <div class="inline-flex items-center gap-3 border border-secondary-200 rounded-xl px-6 py-3 mb-8">
              <div class="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true"></div>
              <span class="text-secondary-900 font-bold text-lg">wompi</span>
              <span class="text-secondary-500 text-sm">por Bancolombia</span>
            </div>

            <h2 class="section-title mb-4">Pagos seguros con Wompi</h2>
            <p class="section-subtitle mx-auto mb-10">
              La pasarela de pagos líder en Colombia. El dinero llega directo a tu cuenta, sin intermediarios.
            </p>

            <!-- Métodos de pago -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div class="border border-secondary-100 rounded-xl p-5 text-center">
                <svg class="w-7 h-7 text-secondary-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                <p class="text-secondary-900 text-sm font-semibold">Tarjeta</p>
                <p class="text-secondary-500 text-xs mt-0.5">Crédito / Débito</p>
              </div>
              <div class="border border-secondary-100 rounded-xl p-5 text-center">
                <svg class="w-7 h-7 text-secondary-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                </svg>
                <p class="text-secondary-900 text-sm font-semibold">PSE</p>
                <p class="text-secondary-500 text-xs mt-0.5">Débito bancario</p>
              </div>
              <div class="border border-secondary-100 rounded-xl p-5 text-center">
                <svg class="w-7 h-7 text-secondary-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <p class="text-secondary-900 text-sm font-semibold">Nequi</p>
                <p class="text-secondary-500 text-xs mt-0.5">Billetera digital</p>
              </div>
              <div class="border border-secondary-100 rounded-xl p-5 text-center">
                <svg class="w-7 h-7 text-secondary-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <p class="text-secondary-900 text-sm font-semibold">Efectivo</p>
                <p class="text-secondary-500 text-xs mt-0.5">Corresponsales</p>
              </div>
            </div>

            <p class="text-secondary-500 text-sm">
              Transacciones cifradas · Regulado por la Superfinanciera de Colombia
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. PRICING — Fondo blanco, tarjeta limpia -->
    <section id="precios" class="section bg-white">
      <div class="container mx-auto px-4 md:px-8">
        <div class="text-center mb-12">
          <h2 class="section-title mb-4">¿Cuánto cuesta?</h2>
          <p class="section-subtitle mx-auto">
            Sin sorpresas. Solo pagas cuando vendes una boleta.
          </p>
        </div>

        <div class="max-w-xl mx-auto">
          <div class="border-2 border-secondary-900 rounded-2xl p-8 md:p-10">
            <div class="text-center mb-8">
              <div
                class="font-bold font-heading text-secondary-900 leading-none"
                style="font-size: clamp(2.5rem, 2rem + 2vw, 4rem)"
              >3.26%</div>
              <div class="text-secondary-600 text-lg mt-2">+ $1,894 COP por boleta vendida</div>
            </div>

            <!-- Bullets -->
            <div class="space-y-3 mb-8">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-secondary-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-base text-secondary-700">Sin mensualidad ni suscripción</span>
              </div>
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-secondary-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-base text-secondary-700">Sin contrato ni permanencia</span>
              </div>
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-secondary-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-base text-secondary-700">Si no vendes, no pagas</span>
              </div>
            </div>

            <!-- Cálculo de ejemplo -->
            <div class="bg-secondary-50 border border-secondary-100 rounded-xl p-5 mb-8">
              <p class="text-sm font-semibold text-secondary-500 mb-3 uppercase tracking-wide">Ejemplo</p>
              <div class="space-y-2">
                <div class="flex justify-between items-center text-base">
                  <span class="text-secondary-600">500 boletas a $30,000 COP</span>
                  <span class="font-semibold text-secondary-900">$15,000,000</span>
                </div>
                <div class="flex justify-between items-center text-base">
                  <span class="text-secondary-600">Fee WaRo</span>
                  <span class="font-semibold text-secondary-700">≈ $1,437,000</span>
                </div>
                <div class="border-t border-secondary-200 pt-2 flex justify-between items-center font-bold">
                  <span class="text-secondary-900 text-base">Tú recibes</span>
                  <span class="text-secondary-900 text-lg">≈ $13,563,000</span>
                </div>
              </div>
            </div>

            <NuxtLink
              to="/contacto"
              class="btn-primary text-base min-h-[48px] w-full justify-center px-8 py-3"
            >
              Solicitar acceso
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. CTA FINAL — Oscuro sólido -->
    <section class="section bg-secondary-900">
      <div class="container mx-auto px-4 md:px-8 text-center">
        <h2
          class="font-bold font-heading text-white mb-4"
          style="font-size: clamp(2rem, 1rem + 4vw, 3.5rem)"
        >
          Tu evento, listo en 10 minutos
        </h2>
        <p class="text-lg text-secondary-300 leading-relaxed mb-12 max-w-xl mx-auto">
          Sin burocracia, sin esperas. Crea tu evento, configura áreas y etapas de venta, y empieza a recibir pedidos.
        </p>

        <!-- 3 pasos -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold font-heading">1</span>
            </div>
            <h3 class="text-white font-semibold text-base mb-1 font-heading">Crea el evento</h3>
            <p class="text-secondary-300 text-sm leading-relaxed">Nombre, fecha, lugar, imagen</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold font-heading">2</span>
            </div>
            <h3 class="text-white font-semibold text-base mb-1 font-heading">Configura áreas y etapas</h3>
            <p class="text-secondary-300 text-sm leading-relaxed">VIP, General, early bird, preventa</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold font-heading">3</span>
            </div>
            <h3 class="text-white font-semibold text-base mb-1 font-heading">Comparte y vende</h3>
            <p class="text-secondary-300 text-sm leading-relaxed">Activa promotores, recibe pagos</p>
          </div>
        </div>

        <NuxtLink
          to="/contacto"
          class="inline-flex items-center justify-center gap-2 btn-primary text-lg min-h-[52px] px-10 py-4"
        >
          Solicitar acceso
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'WaRo Tickets — Vende Boletas para tu Evento | Colombia',
  meta: [
    {
      name: 'description',
      content: 'Plataforma de boletería para eventos en Colombia. Etapas de venta, red de promotores con comisiones, check-in QR, transferencia de boletas y pagos con Wompi.'
    }
  ]
})
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
