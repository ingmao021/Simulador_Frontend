<template>
  <div class="p-4 space-y-4">
    <!-- Plan Section -->
    <div class="bg-surface rounded-xl border border-border p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Tu Plan
        </h3>
        <CreditCard class="w-4 h-4 text-text-secondary" />
      </div>
      <div class="flex items-center justify-between">
        <PlanBadge :plan="store.user.plan" />
        <button
          class="text-xs text-primary hover:text-primary-light font-medium transition-colors flex items-center gap-1"
          @click="store.ui.showUpgradePlanModal = true"
        >
          <ArrowUpCircle class="w-3.5 h-3.5" />
          Mejorar
        </button>
      </div>
    </div>

    <!-- Quota Indicator -->
    <QuotaIndicator />

    <!-- Rate Limit Indicator -->
    <RateLimitIndicator />

    <!-- Quick Stats -->
    <div class="bg-surface rounded-xl border border-border p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Sesión Actual
        </h3>
        <Activity class="w-4 h-4 text-text-secondary" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-surface-light rounded-lg p-3 text-center">
          <p class="text-lg font-bold text-primary">{{ store.chat.messages.length }}</p>
          <p class="text-[11px] text-text-secondary mt-0.5">Mensajes</p>
        </div>
        <div class="bg-surface-light rounded-lg p-3 text-center">
          <p class="text-lg font-bold text-primary">{{ sessionTokens }}</p>
          <p class="text-[11px] text-text-secondary mt-0.5">Tokens usados</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CreditCard, ArrowUpCircle, Activity } from 'lucide-vue-next'
import { useAppStore } from '@/stores/useAppStore'
import PlanBadge from '@/components/shared/PlanBadge.vue'
import QuotaIndicator from '@/components/quota/QuotaIndicator.vue'
import RateLimitIndicator from '@/components/quota/RateLimitIndicator.vue'

const store = useAppStore()

const sessionTokens = computed(() => {
  return store.chat.messages.reduce((sum, msg) => sum + (msg.tokens || 0), 0)
})
</script>
