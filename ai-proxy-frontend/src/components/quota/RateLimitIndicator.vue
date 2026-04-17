<template>
  <div class="bg-surface rounded-xl border border-border p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Límite de Solicitudes
      </h3>
      <Gauge class="w-4 h-4 text-text-secondary" />
    </div>

    <!-- Progress bar -->
    <div class="w-full h-2.5 bg-surface-lighter rounded-full overflow-hidden mb-3">
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="barColorClass"
        :style="{ width: `${usagePercentage}%` }"
      />
    </div>

    <!-- Requests info -->
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-text-secondary">Solicitudes disponibles</span>
      <span class="text-sm font-semibold text-text-primary">
        {{ store.rateLimit.remainingRequests }} / {{ store.rateLimit.maxRequests }}
      </span>
    </div>

    <!-- Status badge -->
    <div class="flex items-center justify-between">
      <span class="text-sm text-text-secondary">Estado</span>
      <span
        v-if="!store.rateLimit.isBlocked"
        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        Disponible
      </span>
      <span
        v-else
        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger/10 text-danger border border-danger/20"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
        Bloqueado
      </span>
    </div>

    <!-- Countdown when blocked -->
    <div
      v-if="store.rateLimit.isBlocked"
      class="mt-3 p-2.5 rounded-lg bg-danger/5 border border-danger/15 text-center"
    >
      <div class="flex items-center justify-center gap-2 text-danger">
        <Timer class="w-4 h-4" />
        <span class="text-sm font-medium">
          Disponible en: <strong class="text-base">{{ store.rateLimit.retryAfter }}s</strong>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Gauge, Timer } from 'lucide-vue-next'
import { useAppStore } from '@/stores/useAppStore'

const store = useAppStore()

const usagePercentage = computed(() => {
  if (store.rateLimit.maxRequests === 0) return 0
  const used = store.rateLimit.maxRequests - store.rateLimit.remainingRequests
  return Math.min(Math.round((used / store.rateLimit.maxRequests) * 100), 100)
})

const barColorClass = computed(() => {
  if (usagePercentage.value <= 60) return 'bg-success'
  if (usagePercentage.value <= 85) return 'bg-warning'
  return 'bg-danger'
})
</script>
