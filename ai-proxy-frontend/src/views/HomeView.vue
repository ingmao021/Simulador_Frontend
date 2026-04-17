<template>
  <div class="h-[calc(100vh-65px)] flex flex-col md:flex-row overflow-hidden bg-background">
    <!-- Left Column: Chat Area -->
    <div class="flex-1 md:w-[65%] lg:w-[70%] flex flex-col h-full border-b md:border-b-0 md:border-r border-border shrink-0">
      <ChatView />
    </div>

    <!-- Right Column: Dashboard & Metrics -->
    <div class="w-full md:w-[35%] lg:w-[30%] h-full overflow-y-auto bg-surface/30 custom-scrollbar">
      <div class="flex flex-col gap-4 p-4 md:p-6 lg:p-4">
        <MetricsPanel />
        <AnalyticsPanel />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import ChatView from '@/components/chat/ChatView.vue'
import MetricsPanel from '@/components/quota/MetricsPanel.vue'
import AnalyticsPanel from '@/components/analytics/AnalyticsPanel.vue'

const store = useAppStore()

onMounted(async () => {
  await Promise.all([
    store.fetchQuotaStatus(),
    store.fetchUsageHistory(),
  ])
})
</script>

<style scoped>
/* Responsive height fixes for mobile when soft-keyboards appear */
@media (max-width: 767px) {
  .h-\[calc\(100vh-65px\)\] {
    height: auto;
    min-height: calc(100vh - 65px);
    overflow: visible;
  }
}
</style>
