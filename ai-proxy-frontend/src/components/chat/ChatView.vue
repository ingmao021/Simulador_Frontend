<template>
  <div class="flex flex-col h-full">
    <MessageList />
    <MessageInput @send="handleSendMessage" />
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/useAppStore'
import { useErrorHandler } from '@/composables/useErrorHandler'
import MessageList from '@/components/chat/MessageList.vue'
import MessageInput from '@/components/chat/MessageInput.vue'

const store = useAppStore()
const { handleApiError } = useErrorHandler()

/**
 * Handles sending a message through the store, which orchestrates the full flow.
 */
async function handleSendMessage(prompt) {
  try {
    await store.sendMessage(prompt)
  } catch (error) {
    handleApiError(error)
  }
}
</script>
