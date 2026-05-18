<template>
  <div v-if="lastPage > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
    <p class="text-sm text-gray-500">
      Total: <span class="font-medium text-gray-700">{{ total }}</span> registros
    </p>
    <div class="flex items-center gap-1">
      <button
        @click="$emit('change', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >← Anterior</button>

      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="px-2 text-gray-400 select-none">…</span>
        <button
          v-else
          @click="$emit('change', page)"
          :class="page === currentPage
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'border-gray-300 hover:bg-gray-50 text-gray-700'"
          class="px-3 py-1.5 text-sm rounded-lg border transition-colors"
        >{{ page }}</button>
      </template>

      <button
        @click="$emit('change', currentPage + 1)"
        :disabled="currentPage === lastPage"
        class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >Siguiente →</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  lastPage: { type: Number, required: true },
  total: { type: Number, default: 0 }
})

defineEmits(['change'])

const visiblePages = computed(() => {
  const pages = []
  const { currentPage, lastPage } = props
  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(lastPage - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < lastPage - 2) pages.push('...')
    pages.push(lastPage)
  }
  return pages
})
</script>
