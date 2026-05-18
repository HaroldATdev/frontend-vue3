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
      products.value = data.data
      pagination.value = {
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        per_page: data.per_page
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
