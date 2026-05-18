import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import http from '@/api/http'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials) {
    const { data } = await authService.login(credentials)
    const payload = data?.data ?? data ?? {}
    const tokenValue = String(payload.token ?? payload.access_token ?? '').trim()

    if (!tokenValue || tokenValue === 'undefined' || tokenValue === 'null') {
      throw new Error('No se recibio un token valido en login.')
    }

    token.value = tokenValue
    user.value = payload.user || null
    localStorage.setItem('token', tokenValue)
    http.defaults.headers.common.Authorization = `Bearer ${tokenValue}`
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      delete http.defaults.headers.common.Authorization
    }
  }

  async function fetchUser() {
    const { data } = await authService.me()
    user.value = data.data || data
  }

  return { token, user, isAuthenticated, login, logout, fetchUser }
})
