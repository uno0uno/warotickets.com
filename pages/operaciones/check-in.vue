<template>
  <div>
    <!-- Loading Events State -->
    <UiGestionLoader v-if="isLoadingEvents" />

    <template v-else>
      <!-- Event Selector -->
      <div class="bg-surface border border-border rounded-xl p-4 mb-6">
        <label class="block text-sm font-bold text-text-primary mb-2">
          Seleccionar Evento
        </label>
        <select
          v-model="selectedEventId"
          class="w-full sm:max-w-md h-10 px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-primary bg-background"
        >
          <option value="">Seleccionar evento</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.cluster_name }}
          </option>
        </select>
      </div>

      <!-- No Event Selected -->
      <div v-if="!selectedEventId" class="bg-surface border border-border rounded-xl p-8 text-center">
        <QrCodeIcon class="w-16 h-16 mx-auto mb-4 text-text-tertiary" />
        <p class="text-text-primary font-bold">Selecciona un evento</p>
        <p class="text-sm text-text-secondary mt-1">Elige un evento para comenzar el check-in</p>
      </div>

      <!-- Check-in Interface -->
      <div v-else class="max-w-lg mx-auto">
        <div class="bg-surface rounded-xl border border-border p-6">
          <h3 class="font-bold text-text-primary mb-4">Escanear Boleta</h3>

          <!-- Camera Scanner -->
          <div v-if="isScannerOpen" class="relative">
            <div class="aspect-square rounded-lg overflow-hidden bg-black">
              <ClientOnly>
                <QrcodeStream
                  @detect="onQrDetected"
                  @camera-on="onCameraReady"
                  @error="onCameraError"
                >
                  <!-- Scanning overlay -->
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div class="w-2/3 h-2/3 border-2 border-white/50 rounded-2xl" />
                  </div>
                </QrcodeStream>
              </ClientOnly>
            </div>

            <!-- Camera loading -->
            <div v-if="isCameraLoading" class="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
              <div class="text-center text-white">
                <div class="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                <p class="text-sm">Abriendo camara...</p>
              </div>
            </div>

            <button
              @click="closeScanner"
              class="mt-3 w-full h-10 bg-surface-secondary text-text-primary rounded-lg text-sm font-bold hover:bg-border transition-colors"
            >
              Cerrar camara
            </button>
          </div>

          <!-- Scan Button (camera closed) -->
          <div v-else>
            <button
              @click="openScanner"
              :disabled="isValidating"
              class="w-full aspect-square max-h-80 bg-surface-secondary rounded-lg flex flex-col items-center justify-center gap-3 hover:bg-border transition-colors cursor-pointer border-2 border-dashed border-border hover:border-primary"
            >
              <CameraIcon class="w-16 h-16 text-text-tertiary" />
              <span class="text-text-secondary font-bold">Escanear QR</span>
              <span class="text-xs text-text-tertiary">Toca para abrir la camara</span>
            </button>
          </div>

          <!-- Camera Error -->
          <div v-if="cameraError" class="mt-3 rounded-lg p-3 bg-destructive/10 border border-destructive/30">
            <p class="text-sm text-destructive">{{ cameraError }}</p>
          </div>

          <!-- Validating indicator -->
          <div v-if="isValidating" class="mt-4 flex items-center justify-center gap-2 text-text-secondary">
            <div class="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span class="text-sm">Validando...</span>
          </div>

          <!-- Validation Result -->
          <div v-if="lastResult" class="mt-4 rounded-lg p-4 border" :class="lastResult.is_valid ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'">
            <div class="flex items-center gap-2 mb-2">
              <CheckCircleIcon v-if="lastResult.is_valid" class="w-5 h-5 text-success" />
              <XCircleIcon v-else class="w-5 h-5 text-destructive" />
              <span class="font-bold" :class="lastResult.is_valid ? 'text-success' : 'text-destructive'">
                {{ lastResult.message }}
              </span>
            </div>
            <div v-if="lastResult.ticket_info" class="text-sm space-y-1 text-text-secondary">
              <p v-if="lastResult.ticket_info.owner_name"><span class="font-medium">Nombre:</span> {{ lastResult.ticket_info.owner_name }}</p>
              <p v-if="lastResult.ticket_info.area_name"><span class="font-medium">Area:</span> {{ lastResult.ticket_info.area_name }}</p>
              <p v-if="lastResult.ticket_info.unit_display_name"><span class="font-medium">Unidad:</span> {{ lastResult.ticket_info.unit_display_name }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { QrCodeIcon, CameraIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { QrcodeStream } from 'vue-qrcode-reader'

useHead({ title: 'Check-in - WaRo Tickets' })

// State
const selectedEventId = ref<number | ''>('')
const isValidating = ref(false)
const isScannerOpen = ref(false)
const isCameraLoading = ref(false)
const cameraError = ref('')
const lastResult = ref<any>(null)

// Load events for selector
const { data: eventsData, pending: isLoadingEvents } = useAsyncData('checkin-events-list', () =>
  $fetch('/api/events', {
    credentials: 'include'
  }),
  {
    server: false,
    lazy: true,
    transform: (response: any) => response.data || response || []
  }
)

const events = computed(() => eventsData.value || [])
const selectedEvent = computed(() =>
  events.value.find((e: any) => e.id === selectedEventId.value)
)

// Query param sync + shared store
const route = useRoute()
const router = useRouter()
const eventStore = useEventSelectionStore()

const initialEventId = route.query.event ? Number(route.query.event) : (eventStore.selectedEventId || '')
selectedEventId.value = initialEventId

// Watch for event selection changes
watch(selectedEventId, async (newEventId, oldEventId) => {
  // Skip if this is the initial mount (oldEventId will be '' or undefined)
  if (oldEventId === undefined || oldEventId === '') return

  lastResult.value = null
  closeScanner()

  eventStore.setEvent(newEventId ? Number(newEventId) : null)

  if (newEventId) {
    router.replace({ query: { event: String(newEventId) } })
  } else {
    router.replace({ query: {} })
  }
})

function openScanner() {
  cameraError.value = ''
  lastResult.value = null
  isCameraLoading.value = true
  isScannerOpen.value = true
}

function closeScanner() {
  isScannerOpen.value = false
  isCameraLoading.value = false
}

function onCameraReady() {
  isCameraLoading.value = false
}

function onCameraError(error: any) {
  isCameraLoading.value = false
  const name = error?.name || ''
  if (name === 'NotAllowedError') {
    cameraError.value = 'Permiso de camara denegado. Permite el acceso a la camara en la configuracion del navegador.'
  } else if (name === 'NotFoundError') {
    cameraError.value = 'No se encontro una camara en este dispositivo.'
  } else if (name === 'NotReadableError') {
    cameraError.value = 'La camara esta siendo usada por otra aplicacion.'
  } else {
    cameraError.value = `Error al acceder a la camara: ${error?.message || name}`
  }
  isScannerOpen.value = false
}

async function onQrDetected(detectedCodes: any[]) {
  if (!detectedCodes?.length || isValidating.value) return

  const rawValue = detectedCodes[0].rawValue
  if (!rawValue) return

  closeScanner()
  await validateCode(rawValue)
}

async function validateCode(code: string) {
  isValidating.value = true
  lastResult.value = null

  try {
    const result = await $fetch('/api/qr/validate', {
      method: 'POST',
      credentials: 'include',
      body: {
        qr_data: code,
        event_slug: selectedEvent.value?.slug_cluster || ''
      }
    })

    lastResult.value = result
  } catch (err: any) {
    lastResult.value = {
      is_valid: false,
      message: err?.data?.detail || 'Error al validar el codigo'
    }
  } finally {
    isValidating.value = false
  }
}
</script>
