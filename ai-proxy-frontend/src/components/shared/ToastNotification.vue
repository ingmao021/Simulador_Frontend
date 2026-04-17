<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <TransitionGroup name="toast">
        <div
          v-for="toast in store.ui.toasts"
          :key="toast.id"
          :class="[
            'flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm cursor-pointer transition-all duration-200 hover:scale-[1.02]',
            toastClasses(toast.type)
          ]"
          @click="store.removeToast(toast.id)"
        >
          <component :is="toastIcon(toast.type)" class="w-5 h-5 shrink-0 mt-0.5" />
          <div class="flex-1">
            <p class="text-sm font-medium leading-snug">{{ toast.message }}</p>
          </div>
          <button
            class="shrink-0 mt-0.5 opacity-60 hover:opacity-100 transition-opacity"
            @click.stop="store.removeToast(toast.id)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useAppStore } from '@/stores/useAppStore'
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-vue-next'

const store = useAppStore()

function toastClasses(type) {
  const map = {
    success: 'bg-success/10 border-success/30 text-success',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    error: 'bg-danger/10 border-danger/30 text-danger',
  }
  return map[type] || map.error
}

function toastIcon(type) {
  const map = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
  }
  return map[type] || XCircle
}
</script>

<style scoped>
.toast-enter-active {
  animation: slide-in-right 0.3s ease-out;
}

.toast-leave-active {
  animation: slide-out-right 0.25s ease-in forwards;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes slide-in-right {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out-right {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(120%);
    opacity: 0;
  }
}
</style>
