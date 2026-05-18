<template>
  <div class="flex items-center justify-center gap-2 py-10 text-gray-500">
    <svg class="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <span class="text-sm">{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: 'Cargando...' }
})
</script>
