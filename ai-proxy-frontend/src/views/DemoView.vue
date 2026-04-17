<template>
  <div class="h-[calc(100vh-65px)] bg-background flex flex-col pt-8 p-4">
    <div class="max-w-2xl w-full mx-auto bg-surface rounded-2xl border border-border p-6 shadow-xl">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-text-primary mb-2">Simulador de Usuarios</h1>
        <p class="text-text-secondary text-sm">
          Cambia la identidad activa para probar la aplicación con distintos planes y cuotas. 
          Al hacer clic se reseteará el estado y te redirigirá a la interfaz principal.
        </p>
      </div>

      <div class="space-y-4">
        <!-- FREE USER -->
        <button
          class="w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group"
          :class="getCardClass('FREE')"
          @click="selectUser('user-free', 'FREE')"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-neutral/10 flex items-center justify-center shrink-0 border border-neutral/20">
              <Sparkles class="w-6 h-6 text-neutral-light" />
            </div>
            <div>
              <p class="font-bold text-text-primary">Usuario Gratuito</p>
              <p class="text-xs text-text-secondary mt-0.5">ID: user-free · Límite bajo</p>
            </div>
          </div>
          <div class="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center group-hover:border-primary transition-colors">
            <div v-if="store.user.id === 'user-free'" class="w-3 h-3 bg-primary rounded-full" />
          </div>
        </button>

        <!-- PRO USER -->
        <button
          class="w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group"
          :class="getCardClass('PRO')"
          @click="selectUser('user-pro', 'PRO')"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Zap class="w-6 h-6 text-primary-light" />
            </div>
            <div>
              <p class="font-bold text-text-primary">Usuario PRO</p>
              <p class="text-xs text-text-secondary mt-0.5">ID: user-pro · Límite medio</p>
            </div>
          </div>
          <div class="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center group-hover:border-primary transition-colors">
            <div v-if="store.user.id === 'user-pro'" class="w-3 h-3 bg-primary rounded-full" />
          </div>
        </button>

        <!-- ENTERPRISE USER -->
        <button
          class="w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group"
          :class="getCardClass('ENTERPRISE')"
          @click="selectUser('user-enterprise', 'ENTERPRISE')"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center shrink-0 border border-warning/20">
              <Building2 class="w-6 h-6 text-warning" />
            </div>
            <div>
              <p class="font-bold text-text-primary">Usuario Empresarial</p>
              <p class="text-xs text-text-secondary mt-0.5">ID: user-enterprise · Ilimitado</p>
            </div>
          </div>
          <div class="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center group-hover:border-primary transition-colors">
            <div v-if="store.user.id === 'user-enterprise'" class="w-3 h-3 bg-primary rounded-full" />
          </div>
        </button>
      </div>

      <div class="mt-8 text-center pt-6 border-t border-border">
        <button
          class="px-6 py-2.5 bg-surface-light border border-border hover:bg-surface-lighter rounded-xl text-sm font-medium transition-colors"
          @click="$router.push('/')"
        >
          Volver a la App
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Sparkles, Zap, Building2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'

const router = useRouter()
const store = useAppStore()

function getCardClass(planId) {
  if (store.user.plan === planId) {
    return 'border-primary bg-primary/5 ring-1 ring-primary/20'
  }
  return 'border-border bg-surface-light hover:border-text-secondary hover:bg-surface-lighter'
}

async function selectUser(id, plan) {
  // Update state immediately
  store.user.id = id
  store.user.plan = plan
  
  // Clear chat if switching user
  store.chat.messages = []
  
  // Fetch fresh data for this user implicitly
  store.addToast('success', `Identidad cambiada a ${plan}`)
  await Promise.all([
    store.fetchQuotaStatus(),
    store.fetchUsageHistory()
  ])
  
  router.push('/')
}
</script>
