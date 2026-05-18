<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Productos</h1>
      <router-link
        to="/products/new"
        class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >+ Nuevo producto</router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <input
          v-model="store.filters.q"
          placeholder="Buscar por nombre..."
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          v-model="store.filters.category_id"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Todas las categorías</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <select
          v-model="store.filters.status"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Todos los estados</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
        <select
          v-model="store.filters.sort_by"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="created_at">Ordenar por fecha</option>
          <option value="price">Ordenar por precio</option>
          <option value="stock">Ordenar por stock</option>
          <option value="name">Ordenar por nombre</option>
        </select>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <input
          v-model="store.filters.min_price"
          type="number"
          min="0"
          placeholder="Precio mínimo"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          v-model="store.filters.max_price"
          type="number"
          min="0"
          placeholder="Precio máximo"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          v-model="store.filters.sort_dir"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="desc">Descendente</option>
          <option value="asc">Ascendente</option>
        </select>
        <div class="flex gap-2">
          <button
            @click="search"
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >Buscar</button>
          <button
            @click="resetAndSearch"
            class="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Limpiar filtros"
          >✕</button>
        </div>
      </div>
    </div>

    <AppAlert :message="store.error" type="error" class="mb-3" />
    <AppAlert :message="successMsg" type="success" class="mb-3" dismissible @dismiss="successMsg = ''" />

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <AppLoading v-if="store.loading" message="Cargando productos..." />

      <div v-if="!store.loading" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th class="px-4 py-3 text-left">ID</th>
              <th class="px-4 py-3 text-left">Nombre</th>
              <th class="px-4 py-3 text-left">Categoría</th>
              <th class="px-4 py-3 text-right">Precio</th>
              <th class="px-4 py-3 text-right">Stock</th>
              <th class="px-4 py-3 text-center">Estado</th>
              <th class="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="!store.products.length">
              <td colspan="7" class="px-4 py-10 text-center text-gray-400">
                No se encontraron productos
              </td>
            </tr>
            <tr
              v-for="p in store.products"
              :key="p.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 text-gray-400 font-mono text-xs">{{ p.id }}</td>
              <td class="px-4 py-3 font-medium text-gray-800">{{ p.name }}</td>
              <td class="px-4 py-3 text-gray-500">{{ p.category?.name ?? '—' }}</td>
              <td class="px-4 py-3 text-right font-medium">S/ {{ Number(p.price).toFixed(2) }}</td>
              <td class="px-4 py-3 text-right">
                <span
                  :class="p.stock <= 5 ? 'text-red-600 font-semibold' : 'text-gray-700'"
                >{{ p.stock }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <span
                  :class="p.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-0.5 rounded-full text-xs font-semibold"
                >{{ p.status ? 'Activo' : 'Inactivo' }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <router-link
                    :to="`/products/${p.id}/edit`"
                    class="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >Editar</router-link>
                  <router-link
                    :to="`/products/${p.id}/stock`"
                    class="text-xs text-green-600 hover:text-green-800 font-medium transition-colors"
                  >Stock</router-link>
                  <button
                    @click="confirmDelete(p)"
                    class="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                  >Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 py-3 border-t border-gray-100">
        <AppPagination
          :current-page="store.pagination.current_page"
          :last-page="store.pagination.last_page"
          :total="store.pagination.total"
          @change="store.fetchProducts($event)"
        />
      </div>
    </div>

    <!-- Confirm modal -->
    <AppConfirm
      v-model="showConfirm"
      title="Eliminar producto"
      :message="`¿Eliminar '${productToDelete?.name}'? Esta acción no se puede deshacer.`"
      confirm-text="Eliminar"
      @confirmed="doDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { categoryService } from '@/services/categoryService'
import AppAlert from '@/components/AppAlert.vue'
import AppLoading from '@/components/AppLoading.vue'
import AppPagination from '@/components/AppPagination.vue'
import AppConfirm from '@/components/AppConfirm.vue'

const store = useProductsStore()
const categories = ref([])
const showConfirm = ref(false)
const productToDelete = ref(null)
const successMsg = ref('')

onMounted(async () => {
  const [, catRes] = await Promise.allSettled([
    store.fetchProducts(),
    categoryService.list()
  ])
  if (catRes.status === 'fulfilled') {
    const d = catRes.value.data
    categories.value = d.data || d.categories || d
  }
})

function search() {
  store.fetchProducts(1)
}

function resetAndSearch() {
  store.resetFilters()
  store.fetchProducts(1)
}

function confirmDelete(product) {
  productToDelete.value = product
  showConfirm.value = true
}

async function doDelete() {
  try {
    await store.deleteProduct(productToDelete.value.id)
    successMsg.value = `Producto "${productToDelete.value.name}" eliminado correctamente`
  } catch (err) {
    store.error = err.message
  }
}
</script>

