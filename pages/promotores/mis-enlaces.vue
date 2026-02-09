<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <UiGestionLoader v-if="isLoading" />

    <!-- Error State -->
    <div v-else-if="error" class="bg-surface border border-border rounded-xl p-8 text-center">
      <p class="text-sm text-destructive mb-3">{{ error }}</p>
      <button @click="loadData" class="text-sm text-primary hover:underline">
        Intentar de nuevo
      </button>
    </div>

    <!-- Content -->
    <div v-else class="flex flex-col gap-4">
      <!-- Promoter Code -->
      <div class="bg-surface border border-border rounded-xl p-4 sm:p-5">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <IdentificationIcon class="w-5 h-5 text-primary-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-text-tertiary mb-0.5">Mi Codigo de Promotor</p>
              <div class="flex items-center gap-2">
                <div class="relative flex items-stretch">
                  <div class="bg-background border border-border border-dashed rounded-l-lg px-3 py-1.5">
                    <span class="text-sm sm:text-base font-mono font-semibold text-text-primary tracking-wider select-all">{{ promoterCode }}</span>
                  </div>
                  <button
                    @click="copyText(promoterCode)"
                    class="px-3 py-1.5 border border-l-0 rounded-r-lg text-xs font-medium transition-all duration-200"
                    :class="copiedText === promoterCode
                      ? 'bg-success/10 border-success/30 text-success'
                      : 'bg-surface-secondary border-border text-text-secondary hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200'"
                  >
                    <CheckIcon v-if="copiedText === promoterCode" class="w-4 h-4" />
                    <ClipboardDocumentIcon v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Events Table -->
      <UiResponsiveDataView
        :columns="columns"
        :data="events"
        :sort-field="sortField"
        :sort-direction="sortDirection"
        empty-message="No hay eventos activos"
        empty-sub-message="Cuando haya eventos disponibles, podras compartir tus enlaces aqui"
        @sort="handleSort"
      >
        <!-- Mobile Card -->
        <template #card="{ item }">
          <div class="bg-surface border border-border rounded-xl overflow-hidden">
            <div class="p-4">
              <div class="flex items-center gap-3 mb-3">
                <div
                  v-if="item.cover_image_url"
                  class="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                  :style="{ backgroundImage: `url(${item.cover_image_url})` }"
                ></div>
                <div v-else class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                  <CalendarIcon class="w-5 h-5 text-white/50" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-text-primary truncate">{{ item.cluster_name }}</p>
                  <p v-if="item.start_date" class="text-xs text-text-secondary">{{ formatDate(item.start_date) }}</p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="item.is_active ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'"
                >
                  {{ item.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-background border border-border rounded-lg px-3 py-2 min-w-0">
                  <p class="text-[11px] text-text-tertiary truncate font-mono">
                    {{ getEventUrl(item.slug_cluster) }}
                  </p>
                </div>
                <button
                  @click="copyText(getEventUrl(item.slug_cluster))"
                  class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="copiedText === getEventUrl(item.slug_cluster)
                    ? 'bg-success/10 text-success'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'"
                >
                  {{ copiedText === getEventUrl(item.slug_cluster) ? 'Copiado!' : 'Copiar' }}
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Desktop Header -->
        <template #header>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h3 class="text-base sm:text-lg font-bold text-text-primary">Eventos Disponibles</h3>
              <p class="text-xs text-text-tertiary mt-0.5">Copia el enlace de cada evento para compartir</p>
            </div>
          </div>
        </template>

        <!-- Custom cell: Name -->
        <template #cell-cluster_name="{ value }">
          <div class="flex items-center gap-2">
            <span class="font-bold text-text-primary">{{ value }}</span>
          </div>
        </template>

        <!-- Custom cell: Date -->
        <template #cell-start_date="{ value }">
          {{ formatDate(value) }}
        </template>

        <!-- Custom cell: Status -->
        <template #cell-is_active="{ value }">
          <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="value ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'"
          >
            {{ value ? 'Activo' : 'Inactivo' }}
          </span>
        </template>

        <!-- Custom cell: Link -->
        <template #cell-link="{ row }">
          <div class="flex items-center gap-2 max-w-sm">
            <span class="text-[11px] text-text-tertiary truncate font-mono">
              {{ getEventUrl(row.slug_cluster) }}
            </span>
          </div>
        </template>

        <!-- Custom cell: Actions -->
        <template #cell-actions="{ row }">
          <div class="flex items-center gap-2 justify-center">
            <button
              @click.prevent="copyText(getEventUrl(row.slug_cluster))"
              class="p-1.5 rounded-lg transition-colors"
              :class="copiedText === getEventUrl(row.slug_cluster)
                ? 'text-success bg-success/10'
                : 'text-text-secondary hover:bg-surface-secondary'"
              :title="copiedText === getEventUrl(row.slug_cluster) ? 'Copiado!' : 'Copiar enlace'"
            >
              <CheckIcon v-if="copiedText === getEventUrl(row.slug_cluster)" class="w-4 h-4" />
              <ClipboardDocumentIcon v-else class="w-4 h-4" />
            </button>
            <a
              :href="`/eventos/${row.slug_cluster}`"
              target="_blank"
              class="p-1.5 rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors"
              title="Ver evento"
            >
              <ArrowTopRightOnSquareIcon class="w-4 h-4" />
            </a>
          </div>
        </template>
      </UiResponsiveDataView>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  ArrowTopRightOnSquareIcon,
  IdentificationIcon
} from '@heroicons/vue/24/outline'

useHead({ title: 'Mis Enlaces - Promotor - WaRo Tickets' })

const authStore = useAuthStore()
const { onTenantChange, currentTenant } = useTenantReactive()

const promoterCode = ref('')
const isLoading = ref(true)
const error = ref<string | null>(null)
const copiedText = ref<string | null>(null)
const sortField = ref('cluster_name')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Fetch assigned events for this promoter
const { data: eventsData, refresh } = useAsyncData(
  `promoter-my-events-${currentTenant.value?.id || 'default'}`,
  () => $fetch<any>('/api/promoters/me/events', {
    credentials: 'include'
  }),
  {
    server: false,
    watch: [currentTenant],
    default: () => ({ events: [] }),
    transform: (response: any) => response?.events || []
  }
)

// Load promoter code
async function loadData() {
  isLoading.value = true
  error.value = null
  try {
    const codeResponse = await $fetch<any>('/api/promoters/me/code', { credentials: 'include' })
    promoterCode.value = codeResponse.code || ''
  } catch (err: any) {
    console.error('Error loading promoter code:', err)
    error.value = err?.data?.detail || 'Error al cargar datos'
  } finally {
    isLoading.value = false
  }
}

watch(() => authStore.user, (user) => {
  if (user) loadData()
}, { immediate: true })

onTenantChange(async () => {
  await refresh()
})

// Computed: sorted events
const events = computed(() => {
  let result = eventsData.value || []

  if (sortField.value) {
    result = [...result].sort((a: any, b: any) => {
      const aValue = a[sortField.value]
      const bValue = b[sortField.value]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'boolean') {
        return sortDirection.value === 'asc'
          ? (aValue === bValue ? 0 : aValue ? -1 : 1)
          : (aValue === bValue ? 0 : aValue ? 1 : -1)
      }

      const strA = String(aValue).toLowerCase()
      const strB = String(bValue).toLowerCase()
      return sortDirection.value === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA)
    })
  }

  return result
})

// Table columns
const columns = [
  { key: 'cluster_name', title: 'Evento', sortable: true, align: 'left' as const },
  { key: 'start_date', title: 'Fecha', sortable: true, align: 'center' as const },
  { key: 'is_active', title: 'Estado', sortable: true, align: 'center' as const },
  { key: 'link', title: 'Enlace', sortable: false, align: 'left' as const },
  { key: 'actions', title: 'Acciones', sortable: false, align: 'center' as const }
]

function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function getEventUrl(slug: string): string {
  if (!import.meta.client) return ''
  return `${window.location.origin}/eventos/${slug}?WRPROM=${promoterCode.value}`
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedText.value = text
    setTimeout(() => {
      copiedText.value = null
    }, 2000)
  } catch (err) {
    console.error('Error copying:', err)
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))
}
</script>
