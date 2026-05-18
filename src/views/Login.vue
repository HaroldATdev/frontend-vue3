<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-1">Inventario App</h1>
      <p class="text-gray-400 text-sm mb-6">Inicia sesión para continuar</p>

      <AppAlert :message="error" type="error" class="mb-4" />

      <form @submit.prevent="handleLogin" novalidate class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            placeholder="admin@example.com"
            :class="v.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-400'"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition"
          />
          <p v-if="v.email" class="text-red-500 text-xs mt-1">{{ v.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            :class="v.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-400'"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition"
          />
          <p v-if="v.password" class="text-red-500 text-xs mt-1">{{ v.password }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppAlert from '@/components/AppAlert.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const v = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

function validate() {
  v.email = ''
  v.password = ''
  let valid = true
  if (!form.email) {
    v.email = 'El correo es obligatorio'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    v.email = 'Ingresa un correo válido'
    valid = false
  }
  if (!form.password) {
    v.password = 'La contraseña es obligatoria'
    valid = false
  } else if (form.password.length < 6) {
    v.password = 'Mínimo 6 caracteres'
    valid = false
  }
  return valid
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>

