import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productService } from '@/services/productService'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const pagination = ref({ current_page: 1, last_page: 1, total: 0, per_page: 15 })
  const loading = ref(false)
  const error = ref('')
  const filters = ref({
    q: '',
    category_id: '',
    status: '',
    min_price: '',
    max_price: '',
    sort_by: 'created_at',
    sort_dir: 'desc'
  })

  async function fetchProducts(page = 1) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await productService.list({ ...filters.value, page })
      // Unwrap nested response: { success, data: { data: [...], meta: {...} } }
      const payload = data.data || data
      products.value = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : []
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

  async function deleteProduct(id) {
    await productService.remove(id)
    await fetchProducts(pagination.value.current_page)
  }

  function resetFilters() {
    filters.value = {
      q: '',
      category_id: '',
      status: '',
      min_price: '',
      max_price: '',
      sort_by: 'created_at',
      sort_dir: 'desc'
    }
  }

  return { products, pagination, loading, error, filters, fetchProducts, deleteProduct, resetFilters }
})
