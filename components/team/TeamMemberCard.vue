<template>
  <div class="bg-surface rounded-xl shadow-md hover:shadow-lg transition-shadow border border-border">
    <div class="p-5">
      <!-- Main Content with Dashed Border -->
      <div class="border-2 border-dashed border-border rounded-lg p-5">
        <!-- Header with Avatar and Status -->
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <!-- Avatar -->
            <div class="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center font-semibold text-white text-base flex-shrink-0">
              {{ member.initials }}
            </div>

            <!-- Name and Info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-[17px] font-semibold text-text-primary mb-1">{{ member.name }}</h3>
              <p class="text-sm font-normal text-text-primary opacity-50">{{ getRoleLabel(member.role) }}</p>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="w-2 h-2 rounded-full" :class="member.is_active ? 'bg-emerald-500' : 'bg-gray-400'"></span>
            <span class="text-xs font-medium" :class="member.is_active ? 'text-emerald-600' : 'text-gray-500'">
              {{ member.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="pt-3 mt-4 border-t border-border space-y-1.5">
          <p class="text-[13px] font-medium text-text-primary opacity-70">Contacto</p>
          <p class="text-sm font-normal text-text-primary opacity-65 truncate">{{ member.email }}</p>
        </div>
      </div>

      <!-- Footer with Role and Actions -->
      <div class="flex items-center justify-between mt-4">
        <!-- Role Badge -->
        <span
          :class="[
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
            member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
            member.role === 'promotor' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          ]"
        >
          {{ getRoleLabel(member.role) }}
        </span>

        <!-- Actions Dropdown -->
        <div class="flex items-center gap-1">
          <!-- Edit Profile Button (for current user) -->
          <button
            v-if="isCurrentUser"
            @click="$emit('edit-profile', member)"
            class="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-md text-primary hover:bg-primary/20 transition-colors"
            title="Editar mi perfil"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <!-- Edit Role Button (only for admin, not for self) -->
          <button
            v-if="isAdmin && !isCurrentUser"
            @click="$emit('edit-role', member)"
            class="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-md text-primary hover:bg-primary/20 transition-colors"
            title="Cambiar rol"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <!-- Delete Button (not for self) -->
          <button
            v-if="!isCurrentUser && isAdmin"
            @click="$emit('delete', member)"
            class="w-8 h-8 flex items-center justify-center bg-destructive/10 rounded-md text-destructive hover:bg-destructive/20 transition-colors"
            title="Eliminar miembro"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TeamMember {
  id: string
  full_name: string
  name?: string
  email: string
  role: string
  is_active: boolean
  initials?: string
}

interface Props {
  member: TeamMember
  isCurrentUser?: boolean
  isAdmin?: boolean
}

const props = defineProps<Props>()

// Emits for parent component
defineEmits(['edit-profile', 'edit-role', 'delete'])

// Helper function for role display
const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    promotor: 'Promotor',
    member: 'Miembro'
  }
  return labels[role] || role
}
</script>
