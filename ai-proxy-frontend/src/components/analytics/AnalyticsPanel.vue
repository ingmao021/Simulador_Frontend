<template>
  <div class="bg-surface rounded-xl border border-border p-4 h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Analíticas de Uso
      </h3>
      <LineChart class="w-4 h-4 text-text-secondary" />
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="bg-surface-light rounded-lg p-3 text-center border border-border/50">
        <p class="text-[11px] text-text-secondary mb-1">Total esta semana</p>
        <p class="text-sm font-bold text-primary">{{ formatNumber(totalTokensThisWeek) }}</p>
      </div>
      <div class="bg-surface-light rounded-lg p-3 text-center border border-border/50">
        <p class="text-[11px] text-text-secondary mb-1">Promedio diario</p>
        <p class="text-sm font-bold text-text-primary">{{ formatNumber(dailyAverage) }}</p>
      </div>
      <div class="bg-surface-light rounded-lg p-3 text-center border border-border/50">
        <p class="text-[11px] text-text-secondary mb-1">Día de mayor consumo</p>
        <p class="text-sm font-bold text-text-primary">{{ maxConsumptionDate }}</p>
      </div>
    </div>

    <!-- Chart -->
    <div class="flex-1 mt-auto">
      <UsageChart />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LineChart } from 'lucide-vue-next'
import { useAppStore } from '@/stores/useAppStore'
import UsageChart from './UsageChart.vue'

const store = useAppStore()

const validHistory = computed(() => {
  return Array.isArray(store.usageHistory) ? store.usageHistory : []
})

const latestHistory = computed(() => {
  return validHistory.value.slice(-7)
})

const totalTokensThisWeek = computed(() => {
  return latestHistory.value.reduce((sum, item) => sum + (item.tokensUsed || 0), 0)
})

const dailyAverage = computed(() => {
  if (latestHistory.value.length === 0) return 0
  return Math.round(totalTokensThisWeek.value / latestHistory.value.length)
})

const maxConsumptionDate = computed(() => {
  if (latestHistory.value.length === 0) return '—'
  
  let maxTokens = -1
  let maxDate = ''

  for (const item of latestHistory.value) {
    if ((item.tokensUsed || 0) > maxTokens) {
      maxTokens = item.tokensUsed || 0
      maxDate = item.date
    }
  }

  try {
    const d = new Date(maxDate)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    }
  } catch (e) {
    // Ignore
  }
  return maxDate || '—'
})

function formatNumber(val) {
  return val.toLocaleString('es-ES')
}
</script>
