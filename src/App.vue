<template>
  <div class="min-h-screen bg-gray-100">
    <nav v-if="authStore.isAuthenticated" class="bg-gray-900 text-white px-6 py-3 flex items-center gap-6">
      <span class="font-bold text-indigo-400 mr-2">Inventario</span>
      <router-link
        to="/dashboard"
        class="text-sm hover:text-indigo-300 transition-colors"
        active-class="text-indigo-400 font-semibold"
      >Dashboard</router-link>
      <router-link
        to="/products"
        class="text-sm hover:text-indigo-300 transition-colors"
        active-class="text-indigo-400 font-semibold"
      >Productos</router-link>
      <router-link
        to="/categories"
        class="text-sm hover:text-indigo-300 transition-colors"
        active-class="text-indigo-400 font-semibold"
      >Categorías</router-link>
      <div class="ml-auto flex items-center gap-3">
        <span class="text-sm text-gray-400">{{ authStore.user?.name || 'Usuario' }}</span>
        <button
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
        >Salir</button>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

