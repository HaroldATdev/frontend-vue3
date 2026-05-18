import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials) {
    const { data } = await authService.login(credentials)
    const payload = data.data || data
    token.value = payload.token
    user.value = payload.user || null
    localStorage.setItem('token', payload.token)
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  async function fetchUser() {
    const { data } = await authService.me()
    user.value = data.data || data
  }

  return { token, user, isAuthenticated, login, logout, fetchUser }
})
