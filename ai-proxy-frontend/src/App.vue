<template>
  <div id="app-root" class="min-h-screen bg-background text-text-primary flex flex-col">
    <!-- Top Bar -->
    <header class="bg-surface border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BotMessageSquare class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-lg font-semibold tracking-tight text-text-primary">
            AI Proxy Platform
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <PlanBadge :plan="store.user.plan" />
        <div class="flex items-center gap-2 text-sm text-text-secondary">
          <UserCircle class="w-5 h-5" />
          <span class="hidden sm:inline">{{ store.user.id }}</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden">
      <RouterView />
    </main>

    <!-- Global Modals -->
    <QuotaExceededModal />
    <UpgradePlanModal />

    <!-- Toast Notifications -->
    <ToastNotification />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { BotMessageSquare, UserCircle } from 'lucide-vue-next'
import { useAppStore } from '@/stores/useAppStore'
import PlanBadge from '@/components/shared/PlanBadge.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'
import QuotaExceededModal from '@/components/quota/QuotaExceededModal.vue'
import UpgradePlanModal from '@/components/quota/UpgradePlanModal.vue'

const store = useAppStore()
</script>
