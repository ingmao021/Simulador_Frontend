<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div
        v-if="store.ui.showUpgradePlanModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        @click="closeModal"
      >
        <Transition name="modal-content" appear>
          <div
            class="bg-surface border border-border w-full h-full md:h-auto md:max-w-2xl md:rounded-2xl shadow-2xl p-6 md:p-8 relative flex flex-col overflow-y-auto"
            @click.stop
          >
            <!-- Close icon -->
            <button
              class="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors p-2 z-10 bg-surface/80 rounded-full md:bg-transparent"
              @click="closeModal"
            >
              <X class="w-5 h-5" />
            </button>

            <!-- Header -->
            <div class="text-center mb-8 mt-4 md:mt-0">
              <h2 class="text-2xl font-bold text-text-primary mb-2">Mejora tu plan</h2>
              <p class="text-text-secondary">
                Elige el plan que mejor se adapte a tus necesidades.
              </p>
            </div>

            <!-- Plans grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-8 flex-1">
              <div
                v-for="plan in plans"
                :key="plan.id"
                class="relative border rounded-xl p-5 hover:shadow-lg transition-all"
                :class="[
                  getPlanCardClass(plan.id),
                  { 'cursor-pointer hover:border-primary/50': !isPlanDisabled(plan.id) }
                ]"
                @click="!isPlanDisabled(plan.id) && selectPlan(plan.id)"
              >
                <!-- Current plan ribbon -->
                <div
                  v-if="store.user.plan === plan.id"
                  class="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface text-[10px] font-bold tracking-wider px-3 py-1 rounded-full border shadow-sm uppercase z-10 shadow-primary/20"
                  :class="getRibbonClass(plan.id)"
                >
                  Tu plan actual
                </div>

                <div class="flex items-center gap-2 mb-2">
                  <component :is="plan.icon" class="w-5 h-5" :class="plan.iconClass" />
                  <h3 class="font-bold text-text-primary">{{ plan.title }}</h3>
                </div>

                <p class="text-sm font-medium mb-1">{{ plan.tokens }}</p>
                <p class="text-xs text-text-secondary">{{ plan.description }}</p>
                
                <!-- Selection ring -->
                <div 
                  v-if="selectedPlan === plan.id" 
                  class="absolute -inset-px rounded-xl border-2 border-primary pointer-events-none" 
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col-reverse md:flex-row justify-end gap-3 mt-auto pt-4 border-t border-border">
              <button
                class="px-4 py-3 md:py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors hover:bg-surface-light rounded-xl md:rounded-none"
                @click="closeModal"
              >
                Cancelar
              </button>
              <button
                class="px-6 py-3 md:py-2 rounded-xl text-sm font-medium bg-primary hover:bg-primary-dark text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-primary/20"
                :disabled="!selectedPlan || isUpgrading"
                @click="confirmUpgrade"
              >
                <span v-if="isUpgrading" class="flex items-center justify-center gap-2">
                  <Loader2 class="w-4 h-4 animate-spin" />
                  Actualizando...
                </span>
                <span v-else>Confirmar Plan</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Sparkles, Zap, Building2, X, Loader2 } from 'lucide-vue-next'
import { useAppStore } from '@/stores/useAppStore'

const store = useAppStore()
const selectedPlan = ref(null)
const isUpgrading = ref(false)

const plans = [
  {
    id: 'FREE',
    title: 'Plan Gratuito',
    tokens: '50.000 tokens/mes',
    description: 'Perfecto para empezar',
    icon: Sparkles,
    iconClass: 'text-neutral-light',
  },
  {
    id: 'PRO',
    title: 'Plan Pro',
    tokens: '500.000 tokens/mes',
    description: 'Para usuarios frecuentes',
    icon: Zap,
    iconClass: 'text-primary-light',
  },
  {
    id: 'ENTERPRISE',
    title: 'Plan Empresarial',
    tokens: 'Ilimitado',
    description: 'Para grandes equipos',
    icon: Building2,
    iconClass: 'text-warning',
  },
]

const planHierarchy = {
  'FREE': 0,
  'PRO': 1,
  'ENTERPRISE': 2,
}

// Ensure selected plan syncs with current plan or is null initially
function openInit() {
  selectedPlan.value = null
}

function isPlanDisabled(planId) {
  const currentLevel = planHierarchy[store.user.plan]
  const targetLevel = planHierarchy[planId]
  return targetLevel <= currentLevel
}

function selectPlan(planId) {
  if (isPlanDisabled(planId)) return
  selectedPlan.value = planId
}

function getPlanCardClass(planId) {
  if (store.user.plan === planId) {
    return 'border-primary/40 bg-primary/5 opacity-80'
  }
  if (isPlanDisabled(planId)) {
    return 'border-border/50 bg-surface-lighter opacity-40 cursor-not-allowed'
  }
  return 'border-border bg-surface-light border-transparent hover:bg-surface-lighter'
}

function getRibbonClass(planId) {
  const mapping = {
    'FREE': 'text-neutral-light border-neutral/30',
    'PRO': 'text-primary border-primary/30',
    'ENTERPRISE': 'text-warning border-warning/30'
  }
  return mapping[planId] || mapping['FREE']
}

function closeModal() {
  store.ui.showUpgradePlanModal = false
  selectedPlan.value = null
}

async function confirmUpgrade() {
  if (!selectedPlan.value) return
  isUpgrading.value = true
  await store.upgradePlan(selectedPlan.value)
  isUpgrading.value = false
}
</script>
