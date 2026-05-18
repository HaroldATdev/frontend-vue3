<template>
  <div class="p-6 max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/products" class="text-gray-400 hover:text-gray-600 transition-colors">←</router-link>
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isEdit ? 'Editar producto' : 'Nuevo producto' }}
      </h1>
    </div>

    <AppAlert :message="error" type="error" class="mb-4" dismissible @dismiss="error = ''" />
    <AppAlert :message="success" type="success" class="mb-4" />

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <form @submit.prevent="save" novalidate class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span class="text-red-500">*</span>
          </label>
          <input
            v-model.trim="form.name"
            type="text"
            placeholder="Ej: Laptop Dell XPS"
            :class="v.name ? 'border-red-400' : 'border-gray-300'"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <p v-if="v.name" class="text-red-500 text-xs mt-1">{{ v.name }}</p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Descripción opcional del producto"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
          />
        </div>

        <!-- Price & Stock -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Precio (S/) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              :class="v.price ? 'border-red-400' : 'border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <p v-if="v.price" class="text-red-500 text-xs mt-1">{{ v.price }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Stock inicial <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.stock"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              :class="v.stock ? 'border-red-400' : 'border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <p v-if="v.stock" class="text-red-500 text-xs mt-1">{{ v.stock }}</p>
          </div>
        </div>

        <!-- Category & Status -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category_id"
              :class="v.category_id ? 'border-red-400' : 'border-gray-300'"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="">Seleccionar categoría</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <p v-if="v.category_id" class="text-red-500 text-xs mt-1">{{ v.category_id }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="form.status"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option :value="1">Activo</option>
              <option :value="0">Inactivo</option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <router-link
            to="/products"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >Cancelar</router-link>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import AppAlert from '@/components/AppAlert.vue'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const error = ref('')
const success = ref('')
const categories = ref([])

const form = reactive({
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
  status: 1
})

const v = reactive({
  name: '',
  price: '',
  stock: '',
  category_id: ''
})

function validate() {
  v.name = ''
  v.price = ''
  v.stock = ''
  v.category_id = ''
  let valid = true

  if (!form.name) {
    v.name = 'El nombre es obligatorio'
    valid = false
  }
  if (form.price === '' || form.price === null) {
    v.price = 'El precio es obligatorio'
    valid = false
  } else if (Number(form.price) < 0) {
    v.price = 'El precio no puede ser negativo'
    valid = false
  }
  if (form.stock === '' || form.stock === null) {
    v.stock = 'El stock es obligatorio'
    valid = false
  } else if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
    v.stock = 'El stock debe ser un número entero no negativo'
    valid = false
  }
  if (!form.category_id) {
    v.category_id = 'Selecciona una categoría'
    valid = false
  }
  return valid
}

onMounted(async () => {
  try {
    // Load categories first
    const catRes = await categoryService.list()
    const d = catRes.data
    const payload = d.data || d
    categories.value = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : []

    // Then load product data if editing
    if (isEdit.value) {
      const { data } = await productService.get(route.params.id)
      const p = data.data || data
      form.name = p.name
      form.description = p.description || ''
      form.price = p.price
      form.stock = p.stock
      form.category_id = Number(p.category_id)
      form.status = Number(p.status)
    }
  } catch (err) {
    error.value = err.message || 'No se pudo cargar los datos'
  }
})

async function save() {
  if (!validate()) return
  loading.value = true
  error.value = ''
  try {
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: Number(form.category_id)
    }
    if (isEdit.value) {
      await productService.update(route.params.id, payload)
    } else {
      await productService.create(payload)
    }
    success.value = 'Producto guardado correctamente'
    setTimeout(() => router.push('/products'), 900)
  } catch (err) {
    error.value = err.message || 'Error al guardar el producto'
  } finally {
    loading.value = false
  }
}
</script>

