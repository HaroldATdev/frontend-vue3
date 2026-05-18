<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Categorías</h1>

    <!-- Form card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
      <h2 class="text-sm font-semibold text-gray-700 mb-3">
        {{ editingForm.id ? 'Editar categoría' : 'Nueva categoría' }}
      </h2>
      <AppAlert :message="formError" type="error" class="mb-3" />
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <input
            v-model.trim="editingForm.name"
            placeholder="Nombre *"
            :class="v.name ? 'border-red-400' : 'border-gray-300'"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <p v-if="v.name" class="text-red-500 text-xs mt-1">{{ v.name }}</p>
        </div>
        <input
          v-model="editingForm.description"
          placeholder="Descripción (opcional)"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <select
          v-model="editingForm.status"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option :value="1">Activa</option>
          <option :value="0">Inactiva</option>
        </select>
      </div>
      <div class="flex items-center gap-2 mt-3">
        <button
          @click="saveCategory"
          :disabled="savingForm"
          class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg v-if="savingForm" class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {{ editingForm.id ? 'Actualizar' : 'Crear' }}
        </button>
        <button
          v-if="editingForm.id"
          @click="cancelEdit"
          class="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >Cancelar</button>
      </div>
    </div>

    <AppAlert :message="store.success" type="success" class="mb-3" dismissible @dismiss="store.success = ''" />
    <AppAlert :message="store.error" type="error" class="mb-3" />

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <AppLoading v-if="store.loading" message="Cargando categorías..." />
      <div v-if="!store.loading" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th class="px-4 py-3 text-left">ID</th>
              <th class="px-4 py-3 text-left">Nombre</th>
              <th class="px-4 py-3 text-left">Descripción</th>
              <th class="px-4 py-3 text-center">Estado</th>
              <th class="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="!store.categories.length">
              <td colspan="5" class="px-4 py-10 text-center text-gray-400">
                No hay categorías registradas
              </td>
            </tr>
            <tr
              v-for="c in store.categories"
              :key="c.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 text-gray-400 font-mono text-xs">{{ c.id }}</td>
              <td class="px-4 py-3 font-medium text-gray-800">{{ c.name }}</td>
              <td class="px-4 py-3 text-gray-500">{{ c.description || '—' }}</td>
              <td class="px-4 py-3 text-center">
                <span
                  :class="c.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-0.5 rounded-full text-xs font-semibold"
                >{{ c.status ? 'Activa' : 'Inactiva' }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-3">
                  <button
                    @click="startEdit(c)"
                    class="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >Editar</button>
                  <button
                    @click="confirmDelete(c)"
                    class="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                  >Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirm delete -->
    <AppConfirm
      v-model="showConfirm"
      title="Eliminar categoría"
      :message="`¿Eliminar la categoría '${categoryToDelete?.name}'?`"
      confirm-text="Eliminar"
      @confirmed="doDelete"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import AppAlert from '@/components/AppAlert.vue'
import AppLoading from '@/components/AppLoading.vue'
import AppConfirm from '@/components/AppConfirm.vue'

const store = useCategoriesStore()

const editingForm = reactive({ id: null, name: '', description: '', status: 1 })
const v = reactive({ name: '' })
const formError = ref('')
const savingForm = ref(false)
const showConfirm = ref(false)
const categoryToDelete = ref(null)

onMounted(() => store.fetchCategories())

function startEdit(c) {
  editingForm.id = c.id
  editingForm.name = c.name
  editingForm.description = c.description || ''
  editingForm.status = c.status
}

function cancelEdit() {
  editingForm.id = null
  editingForm.name = ''
  editingForm.description = ''
  editingForm.status = 1
  v.name = ''
}

async function saveCategory() {
  v.name = ''
  formError.value = ''
  if (!editingForm.name) {
    v.name = 'El nombre es obligatorio'
    return
  }
  savingForm.value = true
  try {
    await store.saveCategory({ ...editingForm })
    cancelEdit()
  } catch (err) {
    formError.value = err.message
  } finally {
    savingForm.value = false
  }
}

function confirmDelete(c) {
  categoryToDelete.value = c
  showConfirm.value = true
}

async function doDelete() {
  try {
    await store.deleteCategory(categoryToDelete.value.id)
  } catch (err) {
    store.error = err.message
  }
}
</script>

