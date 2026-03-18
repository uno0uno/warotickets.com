<template>
  <div>

    <!-- 1. HERO -->
    <section class="bg-secondary-900 overflow-hidden">
      <div class="container mx-auto px-4 md:px-8 py-20 md:py-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div class="text-white">
            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white/80 rounded-full text-xs font-medium tracking-widest uppercase mb-6">
              Plataforma colombiana de boletería
            </span>

            <h1
              class="font-bold font-heading text-white mb-6 leading-tight"
              style="font-size: clamp(2.4rem, 1.5rem + 4vw, 3.8rem)"
            >
              Vende boletas,<br>gestiona tu evento.
            </h1>

            <p class="text-base text-secondary-300 leading-relaxed mb-8 max-w-lg">
              Crea áreas, define etapas de venta, activa una red de promotores con comisiones automáticas y controla los accesos con QR. Todo desde un solo lugar.
            </p>

            <div class="flex flex-col sm:flex-row gap-3">
              <NuxtLink to="/contacto" class="btn-primary">
                Solicitar acceso
              </NuxtLink>
              <a
                href="#funcionalidades"
                class="inline-flex items-center justify-center border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/10 min-h-[48px] px-6 transition-colors"
              >
                Ver funcionalidades
              </a>
            </div>

            <div class="mt-10 flex flex-wrap items-center gap-6">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm text-secondary-300">Sin costo mensual</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm text-secondary-300">Pagos con Wompi</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm text-secondary-300">100% colombiano</span>
              </div>
            </div>
          </div>

          <!-- Tickets demo — mismo componente que mis-boletas -->
          <div class="select-none" aria-hidden="true">

            <!-- Event Header -->
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-secondary-800 border border-secondary-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-bold text-white truncate">Festival Bogotá</h2>
                <p class="text-sm text-secondary-400">Sáb, 19 de abril de 2025</p>
              </div>
              <span class="ml-auto text-xs font-medium text-secondary-400 bg-secondary-800 border border-secondary-700 px-2.5 py-1 rounded-full flex-shrink-0">2 boletas</span>
            </div>

            <!-- Ticket Cards -->
            <div class="space-y-4">

              <!-- Ticket 1 — VIP -->
              <div class="group relative flex bg-white rounded-2xl border border-secondary-200 overflow-hidden transition-all duration-500 min-h-[180px]"
                style="box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
                <!-- Left Section -->
                <div class="flex-1 p-6 flex flex-col justify-between min-w-0 bg-white">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                        Confirmada
                      </span>
                    </div>
                    <h3 class="text-xl font-black text-secondary-900 truncate leading-tight uppercase tracking-tight">VIP</h3>
                    <p class="text-sm font-bold text-primary-600 font-mono">BOLETA · A001</p>
                  </div>
                  <div class="flex items-end justify-between flex-wrap gap-2">
                    <div class="min-w-0">
                      <p class="text-[10px] text-secondary-400 font-bold uppercase tracking-[0.2em] mb-0.5">Referencia</p>
                      <p class="text-xs font-mono text-secondary-600 font-bold">A3F9B21C</p>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs text-secondary-500 font-bold bg-secondary-50 px-3 py-1.5 rounded-lg border border-secondary-100 flex-shrink-0 whitespace-nowrap">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      TRANSFERIR
                    </div>
                  </div>
                </div>

                <!-- Perforation Divider -->
                <div class="relative flex flex-col items-center justify-between py-3 w-px">
                  <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full z-10" style="background: #1F1D35;"></div>
                  <div class="h-full border-l-2 border-dashed border-secondary-100"></div>
                  <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full z-10" style="background: #1F1D35;"></div>
                </div>

                <!-- QR Stub -->
                <div class="w-[160px] bg-secondary-50/50 p-4 flex flex-col items-center justify-center relative overflow-hidden border-l border-secondary-100">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                  <div class="relative z-10">
                    <div class="bg-white p-2 rounded-xl shadow-sm border border-secondary-100 transform group-hover:scale-105 transition-transform duration-500">
                      <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 block">
                        <rect width="21" height="21" fill="white"/>
                        <rect x="1" y="1" width="7" height="7" rx="1" fill="#1F1D35"/><rect x="2" y="2" width="5" height="5" rx="0.5" fill="white"/><rect x="3" y="3" width="3" height="3" fill="#1F1D35"/>
                        <rect x="13" y="1" width="7" height="7" rx="1" fill="#1F1D35"/><rect x="14" y="2" width="5" height="5" rx="0.5" fill="white"/><rect x="15" y="3" width="3" height="3" fill="#1F1D35"/>
                        <rect x="1" y="13" width="7" height="7" rx="1" fill="#1F1D35"/><rect x="2" y="14" width="5" height="5" rx="0.5" fill="white"/><rect x="3" y="15" width="3" height="3" fill="#1F1D35"/>
                        <rect x="9" y="1" width="1" height="1" fill="#1F1D35"/><rect x="11" y="1" width="1" height="1" fill="#1F1D35"/>
                        <rect x="9" y="3" width="3" height="1" fill="#1F1D35"/><rect x="9" y="5" width="1" height="1" fill="#1F1D35"/><rect x="11" y="5" width="1" height="1" fill="#1F1D35"/>
                        <rect x="9" y="7" width="3" height="1" fill="#1F1D35"/><rect x="1" y="9" width="1" height="1" fill="#1F1D35"/>
                        <rect x="3" y="9" width="3" height="1" fill="#1F1D35"/><rect x="7" y="9" width="1" height="1" fill="#1F1D35"/>
                        <rect x="9" y="9" width="1" height="3" fill="#1F1D35"/><rect x="11" y="9" width="1" height="1" fill="#1F1D35"/>
                        <rect x="13" y="9" width="3" height="1" fill="#1F1D35"/><rect x="17" y="9" width="3" height="1" fill="#1F1D35"/>
                        <rect x="1" y="11" width="3" height="1" fill="#1F1D35"/><rect x="5" y="11" width="1" height="1" fill="#1F1D35"/>
                        <rect x="7" y="11" width="1" height="1" fill="#1F1D35"/><rect x="11" y="11" width="3" height="1" fill="#1F1D35"/>
                        <rect x="15" y="11" width="1" height="1" fill="#1F1D35"/><rect x="17" y="11" width="3" height="1" fill="#1F1D35"/>
                        <rect x="13" y="13" width="1" height="1" fill="#1F1D35"/><rect x="15" y="13" width="1" height="3" fill="#1F1D35"/>
                        <rect x="17" y="13" width="3" height="1" fill="#1F1D35"/><rect x="13" y="15" width="3" height="1" fill="#1F1D35"/>
                        <rect x="17" y="15" width="1" height="1" fill="#1F1D35"/><rect x="19" y="15" width="1" height="1" fill="#1F1D35"/>
                        <rect x="13" y="17" width="1" height="3" fill="#1F1D35"/><rect x="15" y="19" width="5" height="1" fill="#1F1D35"/>
                        <rect x="17" y="17" width="3" height="1" fill="#1F1D35"/>
                      </svg>
                    </div>
                    <p class="text-[10px] text-secondary-400 mt-3 font-mono text-center tracking-widest font-bold">A3F9B21C</p>
                  </div>
                </div>
              </div>

              <!-- Ticket 2 — General -->
              <div class="group relative flex bg-white rounded-2xl border border-secondary-200 overflow-hidden transition-all duration-500 min-h-[180px]"
                style="box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
                <div class="flex-1 p-6 flex flex-col justify-between min-w-0 bg-white">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                        Confirmada
                      </span>
                    </div>
                    <h3 class="text-xl font-black text-secondary-900 truncate leading-tight uppercase tracking-tight">General</h3>
                    <p class="text-sm font-bold text-primary-600 font-mono">BOLETA · B047</p>
                  </div>
                  <div class="flex items-end justify-between flex-wrap gap-2">
                    <div class="min-w-0">
                      <p class="text-[10px] text-secondary-400 font-bold uppercase tracking-[0.2em] mb-0.5">Referencia</p>
                      <p class="text-xs font-mono text-secondary-600 font-bold">C7D4E83A</p>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs text-secondary-500 font-bold bg-secondary-50 px-3 py-1.5 rounded-lg border border-secondary-100 flex-shrink-0 whitespace-nowrap">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      TRANSFERIR
                    </div>
                  </div>
                </div>

                <div class="relative flex flex-col items-center justify-between py-3 w-px">
                  <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full z-10" style="background: #1F1D35;"></div>
                  <div class="h-full border-l-2 border-dashed border-secondary-100"></div>
                  <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full z-10" style="background: #1F1D35;"></div>
                </div>

                <div class="w-[160px] bg-secondary-50/50 p-4 flex flex-col items-center justify-center relative overflow-hidden border-l border-secondary-100">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                  <div class="relative z-10">
                    <div class="bg-white p-2 rounded-xl shadow-sm border border-secondary-100 transform group-hover:scale-105 transition-transform duration-500">
                      <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 block">
                        <rect width="21" height="21" fill="white"/>
                        <rect x="1" y="1" width="7" height="7" rx="1" fill="#1F1D35"/><rect x="2" y="2" width="5" height="5" rx="0.5" fill="white"/><rect x="3" y="3" width="3" height="3" fill="#1F1D35"/>
                        <rect x="13" y="1" width="7" height="7" rx="1" fill="#1F1D35"/><rect x="14" y="2" width="5" height="5" rx="0.5" fill="white"/><rect x="15" y="3" width="3" height="3" fill="#1F1D35"/>
                        <rect x="1" y="13" width="7" height="7" rx="1" fill="#1F1D35"/><rect x="2" y="14" width="5" height="5" rx="0.5" fill="white"/><rect x="3" y="15" width="3" height="3" fill="#1F1D35"/>
                        <rect x="9" y="1" width="3" height="1" fill="#1F1D35"/><rect x="9" y="3" width="1" height="1" fill="#1F1D35"/>
                        <rect x="11" y="3" width="1" height="3" fill="#1F1D35"/><rect x="9" y="5" width="1" height="3" fill="#1F1D35"/>
                        <rect x="1" y="9" width="3" height="1" fill="#1F1D35"/><rect x="5" y="9" width="1" height="1" fill="#1F1D35"/>
                        <rect x="7" y="9" width="5" height="1" fill="#1F1D35"/><rect x="13" y="9" width="1" height="1" fill="#1F1D35"/>
                        <rect x="15" y="9" width="5" height="1" fill="#1F1D35"/><rect x="1" y="11" width="1" height="1" fill="#1F1D35"/>
                        <rect x="3" y="11" width="3" height="1" fill="#1F1D35"/><rect x="7" y="11" width="3" height="1" fill="#1F1D35"/>
                        <rect x="11" y="11" width="1" height="1" fill="#1F1D35"/><rect x="13" y="11" width="3" height="1" fill="#1F1D35"/>
                        <rect x="17" y="11" width="3" height="1" fill="#1F1D35"/><rect x="13" y="13" width="3" height="1" fill="#1F1D35"/>
                        <rect x="17" y="13" width="1" height="3" fill="#1F1D35"/><rect x="19" y="13" width="1" height="1" fill="#1F1D35"/>
                        <rect x="13" y="15" width="1" height="5" fill="#1F1D35"/><rect x="15" y="15" width="1" height="1" fill="#1F1D35"/>
                        <rect x="19" y="15" width="1" height="1" fill="#1F1D35"/><rect x="15" y="17" width="3" height="1" fill="#1F1D35"/>
                        <rect x="19" y="17" width="1" height="3" fill="#1F1D35"/><rect x="15" y="19" width="3" height="1" fill="#1F1D35"/>
                      </svg>
                    </div>
                    <p class="text-[10px] text-secondary-400 mt-3 font-mono text-center tracking-widest font-bold">C7D4E83A</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 2. MÉTRICAS -->
    <section class="bg-secondary-900 border-t border-secondary-700 py-10" aria-label="Resultados">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-secondary-800">
          <div class="bg-secondary-900 px-8 py-6 text-center">
            <div class="text-4xl font-bold font-heading text-white leading-none mb-1">7+</div>
            <div class="text-white/75 text-sm">Años de experiencia</div>
          </div>
          <div class="bg-secondary-900 px-8 py-6 text-center">
            <div class="text-4xl font-bold font-heading text-white leading-none mb-1">100+</div>
            <div class="text-white/75 text-sm">Eventos gestionados</div>
          </div>
          <div class="bg-secondary-900 px-8 py-6 text-center">
            <div class="text-4xl font-bold font-heading text-white leading-none mb-1">QR</div>
            <div class="text-white/75 text-sm">Check-in en tiempo real</div>
          </div>
          <div class="bg-secondary-900 px-8 py-6 text-center">
            <div class="text-4xl font-bold font-heading text-white leading-none mb-1">$0</div>
            <div class="text-white/75 text-sm">Costo mensual</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. FUNCIONALIDADES -->
    <section id="funcionalidades" class="bg-white py-20 md:py-28">
      <div class="container mx-auto px-4 md:px-8">

        <div class="mb-14">
          <p class="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-3">Plataforma</p>
          <h2 class="text-3xl md:text-4xl font-bold font-heading text-secondary-900 mb-4">Funcionalidades</h2>
          <p class="text-base text-secondary-600 leading-relaxed max-w-xl">
            Todo lo que necesitas para crear, vender y gestionar tu evento.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <!-- Etapas de venta -->
          <div class="lg:col-span-2 border-2 border-primary-100 bg-primary-50 rounded-2xl p-8">
            <div class="flex flex-col md:flex-row gap-8 items-start">
              <div class="flex-1">
                <div class="w-11 h-11 bg-primary-700 rounded-xl flex items-center justify-center mb-5">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-secondary-900 mb-2 font-heading">Etapas de venta</h3>
                <p class="text-base text-secondary-600 leading-relaxed">
                  Define preventa, early bird y precio general. Cada etapa tiene su cupo, precio y período de vigencia. El sistema aplica la etapa correcta automáticamente.
                </p>
              </div>
              <div class="flex flex-row flex-wrap gap-2 md:flex-col md:min-w-[148px]">
                <div class="bg-white border border-secondary-200 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary-700">Early bird</div>
                <div class="bg-white border border-secondary-200 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary-700">Preventa</div>
                <div class="bg-white border border-secondary-200 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary-700">Precio general</div>
                <div class="bg-primary-700 rounded-lg px-4 py-2.5 text-sm font-medium text-white">Automático ✓</div>
              </div>
            </div>
          </div>

          <!-- QR Check-in -->
          <div class="border border-secondary-200 bg-white rounded-2xl p-8">
            <div class="w-11 h-11 bg-secondary-900 rounded-xl flex items-center justify-center mb-5">
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
          <div class="border border-secondary-200 bg-white rounded-2xl p-8">
            <div class="w-11 h-11 bg-secondary-900 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-2 font-heading">Transferencia de boletas</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Tu comprador puede ceder su boleta a otra persona por email. El sistema invalida la original y genera una nueva. Trazable y seguro.
            </p>
          </div>

          <!-- Paquetes y combos -->
          <div class="border border-secondary-200 bg-white rounded-2xl p-8">
            <div class="w-11 h-11 bg-secondary-900 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-2 font-heading">Paquetes y combos</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Crea paquetes como "2 VIP + 2 General" con precio especial. Define descuento porcentual, monto fijo o precio total cerrado.
            </p>
          </div>

          <!-- Dashboard en vivo -->
          <div class="border border-secondary-200 bg-white rounded-2xl p-8">
            <div class="w-11 h-11 bg-secondary-900 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-secondary-900 mb-2 font-heading">Dashboard en vivo</h3>
            <p class="text-base text-secondary-600 leading-relaxed">
              Reservas, pagos y check-ins actualizados en tiempo real. Sabe exactamente cuántas boletas se han vendido y cuántas personas han entrado.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- 4. PROMOTORES -->
    <section class="bg-secondary-900 py-20 md:py-28">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div class="text-white">
            <p class="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">Red de Promotores</p>
            <h2 class="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
              Tu propia red de promotores dentro de la plataforma
            </h2>
            <p class="text-base text-secondary-300 leading-relaxed mb-8">
              Activa un código único por promotor (<code class="bg-secondary-800 text-primary-300 px-2 py-0.5 rounded text-sm font-mono">WRPROM-XXXXX</code>). Cada compra que llegue por ese código queda registrada automáticamente — sabes exactamente cuántas ventas generó cada promotor.
            </p>
            <ul class="space-y-3 mb-10">
              <li class="flex items-center gap-3 text-base text-secondary-300">
                <svg class="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Porcentaje de comisión configurable por promotor
              </li>
              <li class="flex items-center gap-3 text-base text-secondary-300">
                <svg class="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Registro automático de cada compra por código
              </li>
              <li class="flex items-center gap-3 text-base text-secondary-300">
                <svg class="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Control de ventas por promotor desde el dashboard
              </li>
            </ul>
            <NuxtLink to="/contacto" class="btn-primary">
              Solicitar acceso
            </NuxtLink>
          </div>

          <!-- Pasos -->
          <div class="space-y-4">
            <div class="flex items-start gap-5 bg-secondary-800 border border-secondary-700 rounded-2xl p-6">
              <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center text-white font-bold font-heading flex-shrink-0">1</div>
              <div>
                <h3 class="text-white font-semibold text-base mb-1 font-heading">Creas el código del promotor</h3>
                <p class="text-secondary-300 text-sm leading-relaxed">Asignas la comisión y los eventos que puede promover.</p>
              </div>
            </div>
            <div class="flex items-start gap-5 bg-secondary-800 border border-secondary-700 rounded-2xl p-6">
              <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center text-white font-bold font-heading flex-shrink-0">2</div>
              <div>
                <h3 class="text-white font-semibold text-base mb-1 font-heading">El promotor comparte su link</h3>
                <p class="text-secondary-300 text-sm leading-relaxed">Cada compra con su link queda registrada automáticamente.</p>
              </div>
            </div>
            <div class="flex items-start gap-5 bg-secondary-800 border border-secondary-700 rounded-2xl p-6">
              <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center text-white font-bold font-heading flex-shrink-0">3</div>
              <div>
                <h3 class="text-white font-semibold text-base mb-1 font-heading">Consultas el reporte de ventas</h3>
                <p class="text-secondary-300 text-sm leading-relaxed">El dashboard muestra cuántas ventas y cuánto monto generó cada código. Tú decides cómo y cuándo reconocer esa gestión.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 5. WOMPI -->
    <section class="bg-white py-20 md:py-28">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <p class="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-3">Pagos</p>
            <h2 class="text-3xl md:text-4xl font-bold font-heading text-secondary-900 mb-5">
              Pagos seguros con Wompi
            </h2>
            <p class="text-base text-secondary-600 leading-relaxed mb-6">
              La pasarela de pagos líder en Colombia. El dinero llega directo a tu cuenta, sin intermediarios.
            </p>
            <div class="inline-flex items-center gap-3 border border-secondary-200 rounded-xl px-5 py-3 mb-6">
              <div class="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true"></div>
              <span class="text-secondary-900 font-bold text-base">wompi</span>
              <span class="text-secondary-600 text-sm">por Bancolombia</span>
            </div>
            <p class="text-sm text-secondary-400">
              Transacciones cifradas · Regulado por la Superfinanciera de Colombia
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="border border-secondary-200 rounded-2xl p-6 text-center">
              <svg class="w-8 h-8 text-secondary-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
              <p class="text-base font-semibold text-secondary-900">Tarjeta</p>
              <p class="text-sm text-secondary-500 mt-0.5">Crédito / Débito</p>
            </div>
            <div class="border border-secondary-200 rounded-2xl p-6 text-center">
              <svg class="w-8 h-8 text-secondary-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
              </svg>
              <p class="text-base font-semibold text-secondary-900">PSE</p>
              <p class="text-sm text-secondary-500 mt-0.5">Débito bancario</p>
            </div>
            <div class="border border-secondary-200 rounded-2xl p-6 text-center">
              <svg class="w-8 h-8 text-secondary-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <p class="text-base font-semibold text-secondary-900">Nequi</p>
              <p class="text-sm text-secondary-500 mt-0.5">Billetera digital</p>
            </div>
            <div class="border border-secondary-200 rounded-2xl p-6 text-center">
              <svg class="w-8 h-8 text-secondary-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <p class="text-base font-semibold text-secondary-900">Efectivo</p>
              <p class="text-sm text-secondary-500 mt-0.5">Corresponsales</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 6. PRICING -->
    <section id="precios" class="bg-secondary-50 py-16 md:py-20">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div>
            <p class="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-3">Tarifas</p>
            <h2 class="text-3xl md:text-4xl font-bold font-heading text-secondary-900 mb-5">¿Cuánto cuesta?</h2>
            <p class="text-base text-secondary-600 leading-relaxed mb-8">
              El fee se agrega al valor de la boleta — lo paga el comprador. Tú recibes el precio íntegro de cada boleta.
            </p>
            <ul class="space-y-3">
              <li class="flex items-center gap-3 text-base text-secondary-700">
                <svg class="w-5 h-5 text-secondary-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Sin mensualidad ni suscripción
              </li>
              <li class="flex items-center gap-3 text-base text-secondary-700">
                <svg class="w-5 h-5 text-secondary-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Sin contrato ni permanencia
              </li>
              <li class="flex items-center gap-3 text-base text-secondary-700">
                <svg class="w-5 h-5 text-secondary-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Si no vendes, no pagas
              </li>
            </ul>
          </div>

          <div class="bg-white border-2 border-secondary-200 rounded-2xl overflow-hidden">
            <div class="bg-secondary-900 px-8 py-6">
              <div class="text-5xl font-bold font-heading text-white leading-none">3.26%</div>
              <div class="text-secondary-400 text-base mt-1.5">+ $1,894 COP por boleta vendida</div>
            </div>

            <div class="px-8 py-5">
              <p class="text-xs font-semibold text-secondary-500 uppercase tracking-widest mb-4">Ejemplo — boleta de $30,000 COP</p>
              <div class="space-y-2.5">
                <div class="flex justify-between items-center">
                  <span class="text-base text-secondary-600">Precio que defines tú</span>
                  <span class="text-base font-semibold text-secondary-900">$30,000</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-base text-secondary-600">Fee WaRo (se suma)</span>
                  <span class="text-base font-semibold text-secondary-600">+ $2,872</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-base text-secondary-600">El comprador paga</span>
                  <span class="text-base font-semibold text-secondary-900">$32,872</span>
                </div>
                <div class="border-t border-secondary-200 pt-3 flex justify-between items-center">
                  <span class="text-base font-bold text-secondary-900">Tú recibes</span>
                  <span class="text-xl font-bold text-secondary-900">$30,000</span>
                </div>
              </div>
            </div>

            <div class="px-8 pb-6">
              <NuxtLink to="/contacto" class="btn-primary w-full justify-center">
                Solicitar acceso
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 7. CTA FINAL -->
    <section class="bg-secondary-900 py-20 md:py-28">
      <div class="container mx-auto px-4 md:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <h2
            class="font-bold font-heading text-white mb-5 leading-tight"
            style="font-size: clamp(2rem, 1rem + 4vw, 3.5rem)"
          >
            Tu evento, listo en 10 minutos
          </h2>
          <p class="text-base text-white/80 leading-relaxed mb-12 max-w-xl mx-auto">
            Sin burocracia, sin esperas. Crea tu evento, configura áreas y etapas de venta, y empieza a recibir pedidos.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div class="bg-secondary-800 border border-secondary-700 rounded-2xl px-6 py-5 text-center">
              <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span class="text-white font-bold font-heading">1</span>
              </div>
              <p class="text-white font-semibold text-base mb-1">Crea el evento</p>
              <p class="text-white/70 text-sm">Nombre, fecha, lugar, imagen</p>
            </div>
            <div class="bg-secondary-800 border border-secondary-700 rounded-2xl px-6 py-5 text-center">
              <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span class="text-white font-bold font-heading">2</span>
              </div>
              <p class="text-white font-semibold text-base mb-1">Configura áreas y etapas</p>
              <p class="text-white/70 text-sm">VIP, General, early bird, preventa</p>
            </div>
            <div class="bg-secondary-800 border border-secondary-700 rounded-2xl px-6 py-5 text-center">
              <div class="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span class="text-white font-bold font-heading">3</span>
              </div>
              <p class="text-white font-semibold text-base mb-1">Comparte y vende</p>
              <p class="text-white/70 text-sm">Activa promotores, recibe pagos</p>
            </div>
          </div>

          <NuxtLink
            to="/contacto"
            class="inline-flex items-center gap-2 bg-white text-primary-700 font-bold text-base rounded-xl min-h-[52px] px-10 py-3 hover:bg-primary-50 transition-colors"
          >
            Solicitar acceso
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </NuxtLink>
        </div>
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
