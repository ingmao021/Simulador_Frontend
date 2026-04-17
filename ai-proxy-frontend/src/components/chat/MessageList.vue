<template>
  <div ref="messageContainer" class="flex-1 overflow-y-auto px-4 py-6 space-y-4">
    <!-- Welcome message when no messages -->
    <div
      v-if="store.chat.messages.length === 0 && !store.chat.isLoading"
      class="flex items-center justify-center h-full"
    >
      <div class="text-center max-w-md">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BotMessageSquare class="w-9 h-9 text-primary" />
        </div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">
          ¡Hola! Soy tu asistente de IA.
        </h2>
        <p class="text-sm text-text-secondary leading-relaxed">
          ¿En qué puedo ayudarte? Escribe tu mensaje abajo para comenzar.
        </p>
      </div>
    </div>

    <!-- Messages list -->
    <template v-for="message in store.chat.messages" :key="message.id">
      <!-- User Message -->
      <div v-if="message.role === 'user'" class="flex justify-end">
        <div class="max-w-[75%] group">
          <div class="bg-primary text-white px-4 py-3 rounded-2xl rounded-br-md shadow-md shadow-primary/10">
            <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.text }}</p>
          </div>
          <div class="flex justify-end items-center gap-2 mt-1 px-1">
            <span class="text-[11px] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              {{ message.tokens }} tokens
            </span>
            <span class="text-[11px] text-text-secondary">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>
        </div>
      </div>

      <!-- AI Message -->
      <div v-else class="flex justify-start">
        <div class="max-w-[75%] group">
          <div class="flex items-start gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-surface-lighter flex items-center justify-center shrink-0 mt-0.5">
              <BotMessageSquare class="w-4 h-4 text-primary" />
            </div>
            <div class="bg-surface-light border border-border px-4 py-3 rounded-2xl rounded-bl-md">
              <p class="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">{{ message.text }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-1 pl-10">
            <span class="text-[11px] text-text-secondary">
              {{ formatTime(message.timestamp) }}
            </span>
            <span class="text-[11px] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              {{ message.tokens }} tokens
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Typing indicator -->
    <div v-if="store.chat.isLoading" class="flex justify-start">
      <div class="flex items-start gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-surface-lighter flex items-center justify-center shrink-0 mt-0.5">
          <BotMessageSquare class="w-4 h-4 text-primary" />
        </div>
        <div class="bg-surface-light border border-border px-4 py-3.5 rounded-2xl rounded-bl-md">
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-text-secondary mr-1">Escribiendo</span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary typing-dot" />
            <span class="w-1.5 h-1.5 rounded-full bg-primary typing-dot" />
            <span class="w-1.5 h-1.5 rounded-full bg-primary typing-dot" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { BotMessageSquare } from 'lucide-vue-next'
import { useAppStore } from '@/stores/useAppStore'

const store = useAppStore()
const messageContainer = ref(null)

/**
 * Formats an ISO timestamp to HH:mm.
 */
function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Auto-scroll to the bottom whenever new messages arrive or loading state changes.
 */
watch(
  () => [store.chat.messages.length, store.chat.isLoading],
  async () => {
    await nextTick()
    if (messageContainer.value) {
      messageContainer.value.scrollTo({
        top: messageContainer.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  }
)
</script>
