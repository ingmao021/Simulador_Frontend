<template>
  <div class="p-4 border-t border-border bg-surface">
    <!-- Rate limit warning -->
    <div
      v-if="store.rateLimit.isBlocked"
      class="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm"
    >
      <ShieldAlert class="w-4 h-4 shrink-0" />
      <span>
        Has alcanzado el límite de solicitudes.
        Intenta nuevamente en <strong>{{ store.rateLimit.retryAfter }}</strong> segundos
      </span>
    </div>

    <!-- Input area -->
    <div class="flex gap-2 items-end">
      <div class="flex-1 relative">
        <textarea
          ref="textareaRef"
          v-model="prompt"
          class="w-full bg-surface-light border border-border rounded-xl px-4 py-3 pr-12 text-sm text-text-primary placeholder-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 leading-relaxed"
          :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
          placeholder="Escribe tu mensaje aquí..."
          rows="1"
          :disabled="isDisabled"
          @input="autoResize"
          @keydown="handleKeydown"
        />
      </div>
      <button
        id="send-button"
        class="px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
        :disabled="isSendDisabled"
        @click="handleSend"
      >
        <SendHorizonal class="w-4 h-4" />
        <span class="hidden sm:inline">Enviar</span>
      </button>
    </div>

    <!-- Token estimation -->
    <div class="mt-2 flex items-center justify-between px-1">
      <p
        v-if="prompt.trim().length > 0"
        class="text-xs text-text-secondary"
      >
        Este mensaje consumirá aproximadamente
        <span class="text-primary font-medium">{{ estimatedTokens }}</span> tokens
      </p>
      <p v-else class="text-xs text-text-secondary opacity-0">—</p>

      <p class="text-xs text-text-secondary">
        <span class="hidden sm:inline">Enviar: </span>Enter · Shift+Enter ↵
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { SendHorizonal, ShieldAlert } from 'lucide-vue-next'
import { useAppStore } from '@/stores/useAppStore'
import { estimateTokens as calcTokens } from '@/utils/tokenEstimator'

const emit = defineEmits(['send'])
const store = useAppStore()

const prompt = ref('')
const textareaRef = ref(null)

const estimatedTokens = computed(() => calcTokens(prompt.value))

const isDisabled = computed(
  () => store.chat.isLoading || store.rateLimit.isBlocked
)

const isSendDisabled = computed(
  () => isDisabled.value || prompt.value.trim().length === 0
)

/**
 * Auto-resize textarea up to 6 rows.
 */
function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  const maxHeight = 6 * 24 // ~6 lines
  el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
}

/**
 * Enter sends the message; Shift+Enter inserts a newline.
 */
function handleKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

/**
 * Emits the send event and clears the input.
 */
async function handleSend() {
  const text = prompt.value.trim()
  if (!text || isSendDisabled.value) return

  emit('send', text)
  prompt.value = ''

  await nextTick()
  autoResize()
  textareaRef.value?.focus()
}
</script>
