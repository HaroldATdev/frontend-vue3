import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryService } from '@/services/categoryService'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  async function fetchCategories(params = {}) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await categoryService.list(params)
      // Compatibilidad con distintas estructuras de respuesta del backend
      categories.value = data.data || data.categories || data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function saveCategory(form) {
    error.value = ''
    success.value = ''
    if (form.id) {
      await categoryService.update(form.id, form)
    } else {
      await categoryService.create(form)
    }
    success.value = 'Categoría guardada correctamente'
    await fetchCategories()
  }

  async function deleteCategory(id) {
    await categoryService.remove(id)
    await fetchCategories()
  }

  return { categories, loading, error, success, fetchCategories, saveCategory, deleteCategory }
})
