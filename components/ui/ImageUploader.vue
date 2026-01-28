<template>
  <div class="image-uploader">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-text-secondary mb-2">
      {{ label }}
      <span v-if="recommendedSize" class="text-text-tertiary font-normal ml-1">
        ({{ recommendedSize }})
      </span>
    </label>

    <!-- Upload Area -->
    <div
      class="relative border-2 border-dashed rounded-xl transition-all duration-200"
      :class="[
        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
        previewUrl ? 'p-2' : 'p-6'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <!-- Preview -->
      <div v-if="previewUrl" class="relative">
        <img
          :src="previewUrl"
          :alt="alt || 'Preview'"
          class="w-full rounded-lg object-cover"
          :class="previewClass"
        />

        <!-- Remove Button -->
        <button
          type="button"
          @click="removeImage"
          class="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-lg"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>

        <!-- Uploading Overlay -->
        <div
          v-if="isUploading"
          class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
        >
          <div class="flex flex-col items-center gap-2">
            <div class="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span class="text-white text-sm">Subiendo...</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center">
        <PhotoIcon class="w-12 h-12 mx-auto text-text-tertiary mb-3" />
        <p class="text-text-secondary mb-1">
          Arrastra una imagen o
          <label class="text-primary cursor-pointer hover:underline">
            selecciona un archivo
            <input
              type="file"
              class="hidden"
              :accept="accept"
              @change="handleFileSelect"
            />
          </label>
        </p>
        <p class="text-xs text-text-tertiary">
          {{ acceptText }}. Max {{ maxSizeMB }}MB
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-2 text-sm text-destructive">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PhotoIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue?: string | null
  label?: string
  type?: 'banner' | 'flyer' | 'cover' | 'gallery'
  eventId?: number | null  // ID del evento para guardar en BD
  recommendedSize?: string
  maxSize?: number // in bytes
  accept?: string
  previewClass?: string
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'cover',
  eventId: null,
  maxSize: 5 * 1024 * 1024, // 5MB
  accept: 'image/jpeg,image/png,image/webp',
  previewClass: 'max-h-48'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'uploading': [value: boolean]
  'error': [value: string]
  'uploaded': [value: { url: string; width?: number; height?: number; size?: number }]
}>()

// State
const isDragging = ref(false)
const isUploading = ref(false)
const error = ref<string | null>(null)
const localPreview = ref<string | null>(null)

// Computed
const previewUrl = computed(() => localPreview.value || props.modelValue)

const maxSizeMB = computed(() => Math.round(props.maxSize / (1024 * 1024)))

const acceptText = computed(() => {
  const types = props.accept.split(',').map(t => t.split('/')[1]?.toUpperCase()).filter(Boolean)
  return types.join(', ')
})

// Methods
function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    processFile(file)
  }
  // Reset input
  input.value = ''
}

async function processFile(file: File) {
  error.value = null

  // Validate file type
  const allowedTypes = props.accept.split(',')
  if (!allowedTypes.includes(file.type)) {
    error.value = `Tipo de archivo no permitido. Usa: ${acceptText.value}`
    emit('error', error.value)
    return
  }

  // Validate file size
  if (file.size > props.maxSize) {
    error.value = `El archivo es muy grande. Max: ${maxSizeMB.value}MB`
    emit('error', error.value)
    return
  }

  // Create local preview
  localPreview.value = URL.createObjectURL(file)

  // Get image dimensions
  const dimensions = await getImageDimensions(file)

  // Upload
  await uploadFile(file, dimensions)
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      resolve({ width: 0, height: 0 })
    }
    img.src = URL.createObjectURL(file)
  })
}

async function uploadFile(file: File, dimensions: { width: number; height: number }) {
  isUploading.value = true
  emit('uploading', true)

  try {
    let finalUrl: string

    // Si hay eventId, usar endpoint que sube a R2 + guarda en BD
    if (props.eventId) {
      const formData = new FormData()
      formData.append('file', file)

      const response = await $fetch(`/api/uploads/event-image?event_id=${props.eventId}&image_type=${props.type}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }) as { success: boolean; url: string; image_id: number }

      finalUrl = response.url

    } else {
      // Sin eventId, usar presigned URL (solo sube a R2, sin guardar en BD)
      const presignedResponse = await $fetch('/api/uploads/presigned-url', {
        method: 'POST',
        body: {
          filename: file.name,
          content_type: file.type,
          folder: `events/${props.type}`
        },
        credentials: 'include'
      }) as { upload_url: string; final_url: string }

      // Upload directly to R2
      await fetch(presignedResponse.upload_url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      finalUrl = presignedResponse.final_url
    }

    // Emit success
    emit('update:modelValue', finalUrl)
    emit('uploaded', {
      url: finalUrl,
      width: dimensions.width,
      height: dimensions.height,
      size: file.size
    })

    // Clear local preview since we now have the real URL
    localPreview.value = null

  } catch (err: any) {
    console.error('Upload error:', err)
    error.value = 'Error al subir la imagen. Intenta de nuevo.'
    emit('error', error.value)
    localPreview.value = null
  } finally {
    isUploading.value = false
    emit('uploading', false)
  }
}

function removeImage() {
  localPreview.value = null
  emit('update:modelValue', null)
}

// Cleanup
onUnmounted(() => {
  if (localPreview.value) {
    URL.revokeObjectURL(localPreview.value)
  }
})
</script>

<style scoped>
.image-uploader {
  width: 100%;
}
</style>
