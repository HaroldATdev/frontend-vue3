<template>
  <transition name="fade">
    <div
      v-if="message"
      :class="classes"
      class="flex items-start gap-3 rounded-lg px-4 py-3 text-sm font-medium"
    >
      <span class="flex-1">{{ message }}</span>
      <button
        v-if="dismissible"
        @click="$emit('dismiss')"
        class="opacity-60 hover:opacity-100 transition-opacity leading-none text-base"
        aria-label="Cerrar"
      >✕</button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'error' }, // error | success | warning | info
  dismissible: { type: Boolean, default: false }
})

defineEmits(['dismiss'])

const classes = computed(() => ({
  'bg-red-50 border border-red-300 text-red-700': props.type === 'error',
  'bg-green-50 border border-green-300 text-green-700': props.type === 'success',
  'bg-yellow-50 border border-yellow-300 text-yellow-700': props.type === 'warning',
  'bg-blue-50 border border-blue-300 text-blue-700': props.type === 'info'
}))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
