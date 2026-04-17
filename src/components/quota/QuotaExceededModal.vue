<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div
        v-if="store.ui.showQuotaExceededModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        @click="closeModal"
      >
        <Transition name="modal-content" appear>
          <div
            class="bg-surface border border-border w-full h-full md:h-auto md:max-w-md md:rounded-2xl shadow-2xl p-6 relative flex flex-col justify-center"
            @click.stop
          >
            <!-- Header -->
            <div class="flex flex-col items-center text-center mb-6">
              <div class="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-5 animate-pulse">
                <AlertTriangle class="w-8 h-8 text-danger" />
              </div>
              <h2 class="text-2xl font-bold text-text-primary mb-3">Cuota mensual agotada</h2>
              <p class="text-[15px] text-text-secondary leading-relaxed max-w-[90%] mx-auto">
                Has utilizado todos tus tokens disponibles este mes. Actualiza tu plan para continuar usando el servicio.
              </p>
            </div>

            <!-- Details -->
            <div class="bg-surface-light rounded-2xl p-5 mb-8 space-y-4 border border-border/50">
              <div class="flex items-center justify-between">
                <span class="text-[15px] text-text-secondary">Plan actual</span>
                <PlanBadge :plan="store.user.plan" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[15px] text-text-secondary">Reinicio de cuota</span>
                <span class="text-[15px] font-semibold text-text-primary">{{ formattedResetDate }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col-reverse md:flex-row items-stretch md:items-center gap-3 mt-auto md:mt-0">
              <button
                class="flex-1 px-4 py-3.5 md:py-3 rounded-xl text-[15px] font-medium border border-border hover:bg-surface-light hover:text-text-primary text-text-secondary transition-all"
                @click="closeModal"
              >
                Cancelar
              </button>
              <button
                class="flex-1 px-4 py-3.5 md:py-3 rounded-xl text-[15px] font-medium bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
                @click="openUpgrade"
              >
                Actualizar Plan
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'
import { useAppStore } from '@/stores/useAppStore'
import PlanBadge from '@/components/shared/PlanBadge.vue'

const store = useAppStore()

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

function closeModal() {
  store.ui.showQuotaExceededModal = false
}

function openUpgrade() {
  store.ui.showQuotaExceededModal = false
  store.ui.showUpgradePlanModal = true
}
</script>
