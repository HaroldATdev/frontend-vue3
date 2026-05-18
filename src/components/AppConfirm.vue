<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-sm">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ title }}</h3>
            <p class="text-gray-500 text-sm mb-6">{{ message }}</p>
            <div class="flex justify-end gap-3">
              <button
                @click="$emit('update:modelValue', false)"
                class="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >Cancelar</button>
              <button
                @click="confirm"
                :class="confirmClass"
                class="px-4 py-2 text-sm text-white rounded-lg transition-colors"
              >{{ confirmText }}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmar acción' },
  message: { type: String, default: '¿Estás seguro de realizar esta acción?' },
  confirmText: { type: String, default: 'Confirmar' },
  confirmClass: { type: String, default: 'bg-red-600 hover:bg-red-700' }
})

const emit = defineEmits(['update:modelValue', 'confirmed'])

function confirm() {
  emit('confirmed')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
