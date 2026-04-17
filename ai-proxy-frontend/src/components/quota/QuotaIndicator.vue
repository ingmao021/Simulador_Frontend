<template>
  <div class="bg-surface rounded-xl border border-border p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Uso de Tokens
      </h3>
      <Database class="w-4 h-4 text-text-secondary" />
    </div>

    <!-- Progress bar -->
    <div class="w-full h-2.5 bg-surface-lighter rounded-full overflow-hidden mb-3">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        :class="barColorClass"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <!-- Stats -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm text-text-secondary">Tokens usados</span>
        <span class="text-sm font-semibold text-text-primary">
          {{ formatNumber(store.quota.tokensUsed) }}
          <span class="text-text-secondary font-normal">de</span>
          {{ formatNumber(totalLimit) }}
        </span>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-sm text-text-secondary">Tokens restantes</span>
        <span class="text-sm font-semibold" :class="remainingColorClass">
          {{ formatNumber(store.quota.tokensRemaining) }}
        </span>
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-border">
        <span class="text-sm text-text-secondary flex items-center gap-1.5">
          <CalendarClock class="w-3.5 h-3.5" />
          Reinicio
        </span>
        <span class="text-sm text-text-primary">
          {{ formattedResetDate }}
        </span>
      </div>
    </div>

    <!-- Percentage badge -->
    <div class="mt-3 flex justify-center">
      <span
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
        :class="badgeClasses"
      >
        <TrendingUp class="w-3 h-3" />
        {{ percentage }}% utilizado
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Database, CalendarClock, TrendingUp } from 'lucide-vue-next'
import { useAppStore } from '@/stores/useAppStore'

const store = useAppStore()

const totalLimit = computed(() =>
  store.quota.tokensUsed + store.quota.tokensRemaining || store.quota.tokensLimit
)

const percentage = computed(() => {
  if (totalLimit.value === 0) return 0
  return Math.min(Math.round((store.quota.tokensUsed / totalLimit.value) * 100), 100)
})

const barColorClass = computed(() => {
  if (percentage.value <= 60) return 'bg-success'
  if (percentage.value <= 85) return 'bg-warning'
  return 'bg-danger'
})

const remainingColorClass = computed(() => {
  if (percentage.value <= 60) return 'text-success'
  if (percentage.value <= 85) return 'text-warning'
  return 'text-danger'
})

const badgeClasses = computed(() => {
  if (percentage.value <= 60) return 'bg-success/10 text-success border-success/20'
  if (percentage.value <= 85) return 'bg-warning/10 text-warning border-warning/20'
  return 'bg-danger/10 text-danger border-danger/20'
})

const formattedResetDate = computed(() => {
  if (!store.quota.resetDate) return '—'
  try {
    const date = new Date(store.quota.resetDate)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return store.quota.resetDate
  }
})

function formatNumber(num) {
  if (num == null) return '0'
  return num.toLocaleString('es-ES')
}
</script>
