<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/products" class="text-gray-400 hover:text-gray-600 transition-colors">←</router-link>
      <h1 class="text-2xl font-bold text-gray-800">Movimientos de Stock</h1>
    </div>

    <!-- Register movement form -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
      <h2 class="text-sm font-semibold text-gray-700 mb-3">Registrar movimiento</h2>

      <AppAlert :message="store.error" type="error" class="mb-3" />
      <AppAlert :message="store.success" type="success" class="mb-3" dismissible @dismiss="store.success = ''" />

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
          <select
            v-model="form.type"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Cantidad <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.quantity"
            type="number"
            min="1"
            step="1"
            placeholder="Ej: 10"
            :class="v.quantity ? 'border-red-400' : 'border-gray-300'"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <p v-if="v.quantity" class="text-red-500 text-xs mt-1">{{ v.quantity }}</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Motivo</label>
          <input
            v-model="form.reason"
            placeholder="Ej: Compra a proveedor"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
      </div>
      <button
        @click="saveMovement"
        :disabled="saving"
        class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <svg v-if="saving" class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Registrar
      </button>
    </div>

    <!-- History -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-5 py-3 border-b border-gray-100">
        <h2 class="font-semibold text-gray-700">Historial de movimientos</h2>
      </div>
      <AppLoading v-if="store.loading" message="Cargando historial..." />
      <div v-if="!store.loading" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th class="px-4 py-3 text-left">Tipo</th>
              <th class="px-4 py-3 text-right">Cantidad</th>
              <th class="px-4 py-3 text-left">Motivo</th>
              <th class="px-4 py-3 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="!store.movements.length">
              <td colspan="4" class="px-4 py-8 text-center text-gray-400">
                Sin movimientos registrados
              </td>
            </tr>
            <tr
              v-for="m in store.movements"
              :key="m.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <span
                  :class="m.type === 'entrada'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'"
                  class="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                >{{ m.type }}</span>
              </td>
              <td class="px-4 py-3 text-right font-medium">{{ m.quantity }}</td>
              <td class="px-4 py-3 text-gray-500">{{ m.reason || '—' }}</td>
              <td class="px-4 py-3 text-gray-400 text-xs">{{ formatDate(m.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-4 py-3 border-t border-gray-100">
        <AppPagination
          :current-page="store.pagination.current_page"
          :last-page="store.pagination.last_page"
          :total="store.pagination.total"
          @change="store.fetchMovements(productId, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStockMovementsStore } from '@/stores/stockMovements'
import AppAlert from '@/components/AppAlert.vue'
import AppLoading from '@/components/AppLoading.vue'
import AppPagination from '@/components/AppPagination.vue'

const route = useRoute()
const store = useStockMovementsStore()

const productId = route.params.id
const saving = ref(false)

const form = reactive({ type: 'entrada', quantity: '', reason: '' })
const v = reactive({ quantity: '' })

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(() => store.fetchMovements(productId))

async function saveMovement() {
  v.quantity = ''
  if (!form.quantity || Number(form.quantity) <= 0 || !Number.isInteger(Number(form.quantity))) {
    v.quantity = 'Ingresa una cantidad entera mayor a cero'
    return
  }
  saving.value = true
  try {
    await store.createMovement(productId, {
      type: form.type,
      quantity: Number(form.quantity),
      reason: form.reason
    })
    form.quantity = ''
    form.reason = ''
  } catch (err) {
    // error ya está en store.error via el interceptor
  } finally {
    saving.value = false
  }
}
</script>

