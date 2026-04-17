<template>
  <div class="h-64 relative">
    <div v-if="hasData" class="absolute inset-x-0 bottom-0 top-8">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="h-full flex items-center justify-center pt-8">
      <div class="text-center text-text-secondary">
        <BarChart3 class="w-8 h-8 opacity-50 mx-auto mb-2" />
        <p class="text-sm">Sin actividad registrada</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BarChart3 } from 'lucide-vue-next'
import { useAppStore } from '@/stores/useAppStore'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const store = useAppStore()

const historyData = computed(() => {
  // Ensure we have 7 days of data minimum
  let data = store.usageHistory || []
  if (data.length === 0) return []

  // Get last 7 days from data or current date
  const processed = data.slice(-7).map(item => {
    let dateStr = item.date
    try {
      const parts = new Date(item.date)
      if (!isNaN(parts.getTime())) {
        dateStr = parts.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
      }
    } catch (e) {
      // Keep original date if unparseable
    }
    return {
      date: dateStr,
      tokensUsed: item.tokensUsed || 0,
    }
  })
  return processed
})

const hasData = computed(() => historyData.value.length > 0)

const chartData = computed(() => {
  return {
    labels: historyData.value.map(item => item.date),
    datasets: [
      {
        label: 'Tokens consumidos',
        backgroundColor: '#3B82F6',
        hoverBackgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
        data: historyData.value.map(item => item.tokensUsed),
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Consumo de tokens — Últimos 7 días',
      color: '#9CA3AF',
      font: {
        size: 13,
        weight: 'normal',
        family: "'Inter', sans-serif"
      },
      padding: { bottom: 20 },
    },
    tooltip: {
      backgroundColor: '#1E1E2E',
      titleColor: '#F1F5F9',
      bodyColor: '#9CA3AF',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 10,
      displayColors: false,
      callbacks: {
        label: function(context) {
          return `${context.parsed.y.toLocaleString('es-ES')} tokens`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#334155',
        drawBorder: false,
      },
      ticks: {
        color: '#9CA3AF',
        font: { family: "'Inter', sans-serif", size: 11 },
        maxTicksLimit: 5,
        callback: function(value) {
          if (value >= 1000) return (value / 1000) + 'k'
          return value
        }
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: '#9CA3AF',
        font: { family: "'Inter', sans-serif", size: 11 }
      }
    }
  }
}
</script>
