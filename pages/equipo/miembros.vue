<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <UiGestionLoader v-if="isLoading" />

    <!-- Error State -->
    <div v-else-if="error" class="bg-surface border border-border rounded-xl p-8 text-center">
      <p class="text-sm text-destructive mb-3">{{ error }}</p>
      <button @click="refresh" class="text-sm text-primary hover:underline">
        Intentar de nuevo
      </button>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Members Table -->
      <div class="bg-surface border border-border rounded-xl overflow-hidden">
        <div class="p-4 border-b border-border flex justify-between items-center">
          <h3 class="text-lg font-bold text-text-primary">Miembros del equipo</h3>
          <button
            @click="openInviteModal"
            class="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 shadow-none hover:shadow-none"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Invitar miembro
          </button>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-background border-b border-border">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Usuario</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Rol</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Fecha</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-if="sortedMembers.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-text-secondary">
                  <p class="text-sm">No hay miembros registrados</p>
                  <p class="text-xs text-text-tertiary mt-1">Invita a tu equipo para empezar</p>
                </td>
              </tr>
              <tr v-for="member in sortedMembers" :key="member.id" class="hover:bg-background transition-colors">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                      {{ getInitials(member.full_name) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-text-primary">{{ member.full_name || 'Sin nombre' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-text-secondary">
                  {{ member.email }}
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      member.role === 'promotor' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ getRoleLabel(member.role) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      member.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ member.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-text-secondary">
                  {{ formatDate(member.created_at) }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1">
                    <!-- Edit Profile Button (for current user) -->
                    <button
                      v-if="isCurrentUser(member)"
                      @click="openEditProfileModal(member)"
                      class="text-blue-500 hover:text-blue-700 transition-colors p-1"
                      title="Editar mi perfil"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <!-- Edit Role Button (only for admin, not for self) -->
                    <button
                      v-if="isAdmin && !isCurrentUser(member)"
                      @click="openEditRoleModal(member)"
                      class="text-blue-500 hover:text-blue-700 transition-colors p-1"
                      title="Cambiar rol"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <!-- Delete Button (not for self) -->
                    <button
                      v-if="!isCurrentUser(member) && isAdmin"
                      @click="openDeleteModal(member)"
                      class="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Eliminar miembro"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden divide-y divide-border">
          <div v-if="sortedMembers.length === 0" class="p-8 text-center text-text-secondary">
            <p class="text-sm">No hay miembros registrados</p>
            <p class="text-xs text-text-tertiary mt-1">Invita a tu equipo para empezar</p>
          </div>
          <div v-for="member in sortedMembers" :key="member.id" class="p-4">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                {{ getInitials(member.full_name) }}
              </div>
              <div class="flex-1">
                <p class="font-medium text-text-primary">{{ member.full_name || 'Sin nombre' }}</p>
                <p class="text-sm text-text-secondary">{{ member.email }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      member.role === 'promotor' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ getRoleLabel(member.role) }}
                  </span>
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      member.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ member.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <button
                  v-if="isCurrentUser(member)"
                  @click="openEditProfileModal(member)"
                  class="text-blue-500 hover:text-blue-700 transition-colors p-1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="isAdmin && !isCurrentUser(member)"
                  @click="openEditRoleModal(member)"
                  class="text-blue-500 hover:text-blue-700 transition-colors p-1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="!isCurrentUser(member) && isAdmin"
                  @click="openDeleteModal(member)"
                  class="text-red-500 hover:text-red-700 transition-colors p-1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!-- Pending Invitations Section -->
    <div v-if="pendingInvitations.length > 0" class="bg-surface rounded-xl border border-border">
      <div class="p-4 border-b border-border">
        <h3 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Invitaciones pendientes
          <span class="text-sm font-normal text-text-secondary">({{ pendingInvitations.length }})</span>
        </h3>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-background border-b border-border">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Invitado</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Rol</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Expira</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="invitation in pendingInvitations" :key="invitation.id" class="hover:bg-background transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 bg-amber-500">
                    {{ getInitials(invitation.email.split('@')[0]) }}
                  </div>
                  <div class="text-sm font-medium text-text-primary">{{ invitation.email.split('@')[0] }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-text-primary">{{ invitation.email }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {{ getRoleLabel(invitation.role) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ formatExpirationDate(invitation.expires_at) }}</td>
              <td class="px-4 py-3 text-center">
                <button
                  @click="openCancelInvitationModal(invitation)"
                  class="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Cancelar invitacion"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden divide-y divide-border">
        <div v-for="invitation in pendingInvitations" :key="invitation.id" class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 bg-amber-500">
                {{ getInitials(invitation.email.split('@')[0]) }}
              </div>
              <div>
                <div class="text-sm font-medium text-text-primary">{{ invitation.email.split('@')[0] }}</div>
                <div class="text-xs text-text-secondary">{{ invitation.email }}</div>
              </div>
            </div>
            <button
              @click="openCancelInvitationModal(invitation)"
              class="text-red-500 hover:text-red-700 transition-colors p-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              {{ getRoleLabel(invitation.role) }}
            </span>
            <span class="text-xs text-text-secondary">Expira: {{ formatExpirationDate(invitation.expires_at) }}</span>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Cancel Invitation Modal -->
    <Teleport to="body">
      <div v-if="showCancelInvitationModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeCancelInvitationModal"></div>
        <div class="relative bg-surface rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 border border-border">
          <div class="text-center">
            <div class="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-text-primary mb-2">Cancelar invitación</h3>
            <p class="text-sm text-text-secondary mb-6">
              ¿Estás seguro de cancelar la invitación para <strong>{{ invitationToCancel?.email }}</strong>?
            </p>
            <div class="flex gap-3">
              <button
                @click="closeCancelInvitationModal"
                class="flex-1 px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-background"
              >
                No, mantener
              </button>
              <button
                @click="cancelInvitation"
                :disabled="cancelingInvitation"
                class="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                {{ cancelingInvitation ? 'Cancelando...' : 'Sí, cancelar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Invite Modal -->
    <Teleport to="body">
      <div v-if="showInviteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeInviteModal"></div>

        <!-- Modal -->
        <div class="relative bg-surface rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 border border-border">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-text-primary">Invitar miembro</h2>
            <button @click="closeInviteModal" class="text-text-secondary hover:text-text-primary">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="sendInvitation" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-1">Nombre</label>
              <input
                v-model="inviteForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-primary"
                placeholder="Nombre completo"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-1">Email</label>
              <input
                v-model="inviteForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-primary"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-1">Teléfono (opcional)</label>
              <input
                v-model="inviteForm.phone"
                type="tel"
                class="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-primary"
                placeholder="3001234567"
              />
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-1">Rol</label>
              <select
                v-model="inviteForm.role"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-primary"
              >
                <option value="admin">Administrador</option>
                <option value="promotor">Promotor</option>
                <option value="member">Miembro</option>
              </select>
            </div>

            <!-- Error message -->
            <div v-if="inviteError" class="text-sm text-destructive bg-red-50 p-3 rounded-lg">
              {{ inviteError }}
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="closeInviteModal"
                class="flex-1 px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-background"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="inviteSending"
                class="flex-1 btn-primary px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {{ inviteSending ? 'Enviando...' : 'Enviar invitación' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeDeleteModal"></div>

        <!-- Modal -->
        <div class="relative bg-surface rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 border border-border">
          <div class="text-center">
            <!-- Warning Icon -->
            <div class="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 class="text-lg font-bold text-text-primary mb-2">Eliminar miembro</h3>
            <p class="text-sm text-text-secondary mb-6">
              ¿Estás seguro de eliminar a <strong>{{ memberToDelete?.full_name }}</strong> del equipo? Esta acción no se puede deshacer.
            </p>

            <div class="flex gap-3">
              <button
                @click="closeDeleteModal"
                class="flex-1 px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-background"
              >
                Cancelar
              </button>
              <button
                @click="deleteMember"
                :disabled="deleting"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {{ deleting ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Profile Modal -->
    <Teleport to="body">
      <div v-if="showEditProfileModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeEditProfileModal"></div>

        <!-- Modal -->
        <div class="relative bg-surface rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 border border-border">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-text-primary">Editar mi perfil</h2>
            <button @click="closeEditProfileModal" class="text-text-secondary hover:text-text-primary">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <!-- Avatar Preview -->
            <div class="flex justify-center">
              <div class="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center font-bold text-2xl text-white">
                {{ getInitials(profileToEdit?.full_name) }}
              </div>
            </div>

            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-1">Nombre</label>
              <input
                v-model="editProfileForm.name"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-primary"
                placeholder="Tu nombre completo"
              />
            </div>

            <!-- Email (read-only) -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-1">Email</label>
              <input
                :value="profileToEdit?.email"
                type="email"
                disabled
                class="w-full px-3 py-2 border border-border rounded-lg bg-background/50 text-text-secondary cursor-not-allowed"
              />
              <p class="text-xs text-text-secondary mt-1">El email no se puede cambiar</p>
            </div>

            <!-- Error message -->
            <div v-if="editProfileError" class="text-sm text-destructive bg-red-50 p-3 rounded-lg">
              {{ editProfileError }}
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="closeEditProfileModal"
                class="flex-1 px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-background"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="editProfileLoading"
                class="flex-1 btn-primary px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {{ editProfileLoading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Edit Role Modal -->
    <Teleport to="body">
      <div v-if="showEditRoleModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeEditRoleModal"></div>

        <!-- Modal -->
        <div class="relative bg-surface rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 border border-border">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-text-primary">Cambiar rol</h2>
            <button @click="closeEditRoleModal" class="text-text-secondary hover:text-text-primary">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="updateRole" class="space-y-4">
            <!-- Member Info -->
            <div class="flex items-center gap-3 p-3 bg-background rounded-lg">
              <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-semibold text-white flex-shrink-0">
                {{ getInitials(memberToEdit?.full_name) }}
              </div>
              <div>
                <div class="font-medium text-text-primary">{{ memberToEdit?.full_name }}</div>
                <div class="text-sm text-text-secondary">{{ memberToEdit?.email }}</div>
              </div>
            </div>

            <!-- Current Role -->
            <div class="text-sm text-text-secondary">
              Rol actual: <span class="font-medium text-text-primary">{{ getRoleLabel(memberToEdit?.role) }}</span>
            </div>

            <!-- New Role Select -->
            <div>
              <label class="block text-sm font-medium text-text-primary mb-1">Nuevo rol</label>
              <select
                v-model="editRoleForm.role"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-primary"
              >
                <option value="admin">Administrador</option>
                <option value="promotor">Promotor</option>
                <option value="member">Miembro</option>
              </select>
            </div>

            <!-- Error message -->
            <div v-if="editRoleError" class="text-sm text-destructive bg-red-50 p-3 rounded-lg">
              {{ editRoleError }}
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="closeEditRoleModal"
                class="flex-1 px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-background"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="editRoleLoading || editRoleForm.role === memberToEdit?.role"
                class="flex-1 btn-primary px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {{ editRoleLoading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

// Set page title
const setPageTitle = inject('setPageTitle', () => {})
const setPageSubtitle = inject('setPageSubtitle', () => {})

onMounted(() => {
  setPageTitle('Miembros del Equipo')
  setPageSubtitle('Gestiona los miembros y roles de tu organización')
})

// Tenant reactivity
const { onTenantChange, currentTenant } = useTenantReactive()

// Data
const members = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Auth store for current user
const authStore = useAuthStore()
const currentUserEmail = computed(() => authStore.user?.email)

// Check if current user is admin or superuser
const isAdmin = computed(() => {
  if (!currentUserEmail.value || !members.value.length) return false
  const currentMember = members.value.find(m =>
    m.email?.toLowerCase() === currentUserEmail.value?.toLowerCase()
  )
  return currentMember?.role === 'admin' || currentMember?.role === 'superuser'
})

// Check if a member is the current user
const isCurrentUser = (member: any) => {
  return member.email?.toLowerCase() === currentUserEmail.value?.toLowerCase()
}

// Sort members by role hierarchy
const sortedMembers = computed(() => {
  const roleOrder: Record<string, number> = {
    'superuser': 1,
    'admin': 2,
    'promotor': 3,
    'member': 4
  }

  return [...members.value].sort((a, b) => {
    const orderA = roleOrder[a.role] || 999
    const orderB = roleOrder[b.role] || 999
    return orderA - orderB
  })
})

// Fetch members
async function loadMembers() {
  isLoading.value = true
  error.value = null

  try {
    const response = await $fetch('/api/tenants/members', {
      credentials: 'include'
    })
    members.value = response.members || []
  } catch (err: any) {
    error.value = err.data?.detail || 'Error al cargar miembros'
    console.error('Error loading members:', err)
  } finally {
    isLoading.value = false
  }
}

async function refresh() {
  await loadMembers()
  await loadPendingInvitations()
}

function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    promotor: 'Promotor',
    member: 'Miembro'
  }
  return labels[role] || role
}

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

function formatExpirationDate(dateString: string): string {
  if (!dateString) return 'Sin fecha'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Expirada'
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Mañana'
  if (diffDays <= 7) return `${diffDays} días`

  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

// Pending Invitations
const pendingInvitations = ref<any[]>([])

async function loadPendingInvitations() {
  try {
    const response = await $fetch('/api/invitations/pending', {
      credentials: 'include'
    })
    pendingInvitations.value = response.invitations || []
  } catch (err: any) {
    console.error('Error loading invitations:', err)
  }
}

// Cancel Invitation Modal State
const showCancelInvitationModal = ref(false)
const invitationToCancel = ref<any>(null)
const cancelingInvitation = ref(false)

const openCancelInvitationModal = (invitation: any) => {
  invitationToCancel.value = invitation
  showCancelInvitationModal.value = true
}

const closeCancelInvitationModal = () => {
  showCancelInvitationModal.value = false
  invitationToCancel.value = null
}

const cancelInvitation = async () => {
  if (!invitationToCancel.value) return

  cancelingInvitation.value = true
  try {
    const response = await $fetch(`/api/invitations/${invitationToCancel.value.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (response.success) {
      alert(`Invitación para ${invitationToCancel.value.email} cancelada`)
      closeCancelInvitationModal()
      await loadPendingInvitations()
    }
  } catch (err: any) {
    console.error('Error canceling invitation:', err)
    alert(err.data?.detail || 'Error al cancelar invitación')
  } finally {
    cancelingInvitation.value = false
  }
}

// Invite Modal State
const showInviteModal = ref(false)
const inviteSending = ref(false)
const inviteError = ref('')
const inviteForm = reactive({
  name: '',
  email: '',
  phone: '',
  role: 'admin'
})

const openInviteModal = () => {
  inviteForm.name = ''
  inviteForm.email = ''
  inviteForm.phone = ''
  inviteForm.role = 'admin'
  inviteError.value = ''
  showInviteModal.value = true
}

const closeInviteModal = () => {
  showInviteModal.value = false
}

const sendInvitation = async () => {
  inviteSending.value = true
  inviteError.value = ''

  try {
    const response = await $fetch('/api/invitations/send', {
      method: 'POST',
      credentials: 'include',
      body: {
        name: inviteForm.name,
        email: inviteForm.email,
        phone: inviteForm.phone || null,
        role: inviteForm.role
      }
    })

    if (response.success) {
      // Show success message
      alert(`Invitación enviada a ${inviteForm.email}`)
      closeInviteModal()
      refresh()
    }
  } catch (err: any) {
    console.error('Error sending invitation:', err)
    inviteError.value = err.data?.detail || err.data?.message || 'Error al enviar la invitación'
  } finally {
    inviteSending.value = false
  }
}

// Delete Modal State
const showDeleteModal = ref(false)
const memberToDelete = ref<any>(null)
const deleting = ref(false)

const openDeleteModal = (member: any) => {
  memberToDelete.value = member
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  memberToDelete.value = null
}

const deleteMember = async () => {
  if (!memberToDelete.value) return

  deleting.value = true
  try {
    const response = await $fetch(`/api/tenants/members/${memberToDelete.value.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (response.success) {
      alert(`${memberToDelete.value.full_name} ha sido eliminado del equipo`)
      closeDeleteModal()
      await refresh()
    }
  } catch (err: any) {
    console.error('Error deleting member:', err)
    alert(err.data?.detail || 'Error al eliminar miembro')
  } finally {
    deleting.value = false
  }
}

// Edit Profile Modal State
const showEditProfileModal = ref(false)
const profileToEdit = ref<any>(null)
const editProfileLoading = ref(false)
const editProfileError = ref('')
const editProfileForm = reactive({
  name: ''
})

const openEditProfileModal = (member: any) => {
  profileToEdit.value = member
  editProfileForm.name = member.full_name || ''
  editProfileError.value = ''
  showEditProfileModal.value = true
}

const closeEditProfileModal = () => {
  showEditProfileModal.value = false
  profileToEdit.value = null
}

const updateProfile = async () => {
  if (!profileToEdit.value) return

  editProfileLoading.value = true
  editProfileError.value = ''

  try {
    alert('Funcionalidad de edición de perfil próximamente')
    closeEditProfileModal()
    // TODO: Implementar endpoint de actualización de perfil
    // const response = await $fetch('/api/auth/update-profile', {
    //   method: 'PUT',
    //   body: { name: editProfileForm.name }
    // })
    // if (response.success) {
    //   closeEditProfileModal()
    //   refresh()
    // }
  } catch (err: any) {
    console.error('Error updating profile:', err)
    editProfileError.value = err.data?.message || 'Error al actualizar perfil'
  } finally {
    editProfileLoading.value = false
  }
}

// Edit Role Modal State
const showEditRoleModal = ref(false)
const memberToEdit = ref<any>(null)
const editRoleLoading = ref(false)
const editRoleError = ref('')
const editRoleForm = reactive({
  role: 'admin'
})

const openEditRoleModal = (member: any) => {
  memberToEdit.value = member
  editRoleForm.role = member.role
  editRoleError.value = ''
  showEditRoleModal.value = true
}

const closeEditRoleModal = () => {
  showEditRoleModal.value = false
  memberToEdit.value = null
}

const updateRole = async () => {
  if (!memberToEdit.value) return

  editRoleLoading.value = true
  editRoleError.value = ''

  try {
    alert('Funcionalidad de cambio de rol próximamente')
    closeEditRoleModal()
    // TODO: Implementar endpoint de actualización de rol
    // const response = await $fetch(`/api/tenants/members/${memberToEdit.value.id}/role`, {
    //   method: 'PUT',
    //   body: { role: editRoleForm.role }
    // })
    // if (response.success) {
    //   closeEditRoleModal()
    //   refresh()
    // }
  } catch (err: any) {
    console.error('Error updating role:', err)
    editRoleError.value = err.data?.message || 'Error al actualizar rol'
  } finally {
    editRoleLoading.value = false
  }
}

// Refresh on tenant change
onTenantChange(async () => {
  await loadMembers()
  await loadPendingInvitations()
})

// Load on mount
onMounted(() => {
  loadMembers()
  loadPendingInvitations()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
