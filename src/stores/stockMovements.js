import { defineStore } from 'pinia'
import { ref } from 'vue'
import { stockService } from '@/services/stockService'

export const useStockMovementsStore = defineStore('stockMovements', () => {
  const movements = ref([])
  const pagination = ref({ current_page: 1, last_page: 1, total: 0, per_page: 15 })
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  async function fetchMovements(productId, page = 1) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await stockService.list(productId, { page })
      // Unwrap nested response: { success, data: { data: [...], meta: {...} } }
      const payload = data.data || data
      movements.value = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : []
      pagination.value = {
        current_page: payload.meta?.current_page ?? 1,
        last_page: payload.meta?.last_page ?? 1,
        total: payload.meta?.total ?? 0,
        per_page: payload.meta?.per_page ?? 15
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createMovement(productId, formData) {
    error.value = ''
    success.value = ''
    await stockService.create(productId, formData)
    success.value = 'Movimiento registrado correctamente'
    await fetchMovements(productId)
  }

  return { movements, pagination, loading, error, success, fetchMovements, createMovement }
})
