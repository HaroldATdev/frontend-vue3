<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <AppAlert :message="error" type="error" class="mb-4" />
    <AppLoading v-if="loading" message="Cargando indicadores..." />

    <template v-if="!loading && summary">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p class="text-sm text-gray-500 mb-1">Productos</p>
          <p class="text-3xl font-bold text-indigo-600">{{ summary.stats?.total_products ?? '—' }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p class="text-sm text-gray-500 mb-1">Categorías</p>
          <p class="text-3xl font-bold text-green-600">{{ summary.stats?.total_categories ?? '—' }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p class="text-sm text-gray-500 mb-1">Bajo stock</p>
          <p class="text-3xl font-bold text-yellow-600">{{ summary.stats?.low_stock_count ?? '—' }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p class="text-sm text-gray-500 mb-1">Total movimientos</p>
          <p class="text-3xl font-bold text-purple-600">{{ summary.stats?.total_movements ?? '—' }}</p>
        </div>
      </div>

      <!-- Low stock warning -->
      <div v-if="lowStockProducts.length" class="bg-white rounded-xl border border-yellow-200 shadow-sm mb-6">
        <div class="px-5 py-3 border-b border-yellow-100 flex items-center gap-2">
          <span class="text-yellow-500">⚠</span>
          <h2 class="font-semibold text-yellow-700">Productos con bajo stock</h2>
        </div>
        <ul class="divide-y divide-gray-100">
          <li
            v-for="p in lowStockProducts"
            :key="p.id"
            class="px-5 py-3 flex items-center justify-between text-sm"
          >
            <span class="text-gray-800 font-medium">{{ p.name }}</span>
            <span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              {{ p.stock }} uds.
            </span>
          </li>
        </ul>
      </div>

      <!-- Last movements -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div class="px-5 py-3 border-b border-gray-100">
          <h2 class="font-semibold text-gray-700">Últimos movimientos</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th class="px-4 py-3 text-left">Tipo</th>
                <th class="px-4 py-3 text-left">Producto</th>
                <th class="px-4 py-3 text-left">Cantidad</th>
                <th class="px-4 py-3 text-left">Motivo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="!lastMovements.length">
                <td colspan="4" class="px-4 py-8 text-center text-gray-400">Sin movimientos recientes</td>
              </tr>
              <tr v-for="m in lastMovements" :key="m.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <span
                    :class="m.type === 'entrada'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'"
                    class="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                  >{{ m.type }}</span>
                </td>
                <td class="px-4 py-3 text-gray-700">{{ m.product?.name ?? '—' }}</td>
                <td class="px-4 py-3 font-medium">{{ m.quantity }}</td>
                <td class="px-4 py-3 text-gray-500">{{ m.reason || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { dashboardService } from '@/services/dashboardService'
import AppAlert from '@/components/AppAlert.vue'
import AppLoading from '@/components/AppLoading.vue'

const loading = ref(false)
const error = ref('')
const summary = ref(null)

const lowStockProducts = computed(() =>
  Array.isArray(summary.value?.low_stock) ? summary.value.low_stock : []
)
const lastMovements = computed(() =>
  Array.isArray(summary.value?.last_movements) ? summary.value.last_movements : []
)

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await dashboardService.getSummary()
    summary.value = data.data || data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

