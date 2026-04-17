import { defineStore } from 'pinia'
import { generateText } from '@/services/aiService'
import { getStatus, getHistory, upgradePlan } from '@/services/quotaService'
import { estimateTokens } from '@/utils/tokenEstimator'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: {
      id: 'user-001',
      plan: 'FREE',
    },

    quota: {
      tokensUsed: 0,
      tokensRemaining: 0,
      tokensLimit: 50000,
      resetDate: '',
    },

    rateLimit: {
      remainingRequests: 10,
      maxRequests: 10,
      retryAfter: 0,
      isBlocked: false,
    },

    chat: {
      messages: [],
      isLoading: false,
    },

    usageHistory: [],

    // UI state
    ui: {
      showQuotaExceededModal: false,
      showUpgradePlanModal: false,
      toasts: [],
    },
  }),

  getters: {
    /**
     * Percentage of quota used (0–100).
     */
    quotaPercentage(state) {
      const total = state.quota.tokensUsed + state.quota.tokensRemaining
      if (total === 0) return 0
      return Math.min(Math.round((state.quota.tokensUsed / total) * 100), 100)
    },

    /**
     * Percentage of rate limit used (0–100).
     */
    rateLimitPercentage(state) {
      if (state.rateLimit.maxRequests === 0) return 0
      const used = state.rateLimit.maxRequests - state.rateLimit.remainingRequests
      return Math.min(Math.round((used / state.rateLimit.maxRequests) * 100), 100)
    },

    /**
     * Total tokens limit (used + remaining).
     */
    totalTokensLimit(state) {
      return state.quota.tokensUsed + state.quota.tokensRemaining
    },

    /**
     * Plan display name in Spanish.
     */
    planDisplayName(state) {
      const names = {
        FREE: 'Plan Gratuito',
        PRO: 'Plan Pro',
        ENTERPRISE: 'Plan Empresarial',
      }
      return names[state.user.plan] || state.user.plan
    },
  },

  actions: {
    /**
     * Fetches the current quota status from the backend.
     */
    async fetchQuotaStatus() {
      try {
        const data = await getStatus(this.user.id)
        this.quota.tokensUsed = data.tokensUsed ?? this.quota.tokensUsed
        this.quota.tokensRemaining = data.tokensRemaining ?? this.quota.tokensRemaining
        this.quota.tokensLimit = data.tokensLimit ?? this.quota.tokensLimit
        this.quota.resetDate = data.resetDate ?? this.quota.resetDate
        this.user.plan = data.plan ?? this.user.plan

        // Update rate limit info if provided
        if (data.remainingRequests !== undefined) {
          this.rateLimit.remainingRequests = data.remainingRequests
        }
        if (data.maxRequests !== undefined) {
          this.rateLimit.maxRequests = data.maxRequests
        }
      } catch (error) {
        this.addToast('error', 'No se pudo obtener el estado de la cuota.')
        console.error('fetchQuotaStatus error:', error)
      }
    },

    /**
     * Fetches the usage history from the backend.
     */
    async fetchUsageHistory() {
      try {
        const data = await getHistory(this.user.id)
        this.usageHistory = Array.isArray(data) ? data : (data.history || [])
      } catch (error) {
        this.addToast('error', 'No se pudo obtener el historial de uso.')
        console.error('fetchUsageHistory error:', error)
      }
    },

    /**
     * Orchestrates sending a message through the chat:
     * 1. Adds user message to the list
     * 2. Estimates tokens
     * 3. Calls AI generate endpoint
     * 4. Adds AI response to the list
     * 5. Refreshes quota status
     */
    async sendMessage(prompt) {
      if (!prompt.trim() || this.chat.isLoading || this.rateLimit.isBlocked) {
        return
      }

      const tokens = estimateTokens(prompt)

      // Add user message
      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        text: prompt,
        timestamp: new Date().toISOString(),
        tokens,
      }
      this.chat.messages.push(userMessage)
      this.chat.isLoading = true

      try {
        const response = await generateText(this.user.id, prompt, tokens)

        // Add AI response
        const aiMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: response.generatedText || response.text || response.content || 'Sin respuesta.',
          timestamp: new Date().toISOString(),
          tokens: response.tokensUsed || tokens,
        }
        this.chat.messages.push(aiMessage)

        // Update rate limit from response headers (if provided)
        if (response.remainingRequests !== undefined) {
          this.rateLimit.remainingRequests = response.remainingRequests
        } else if (this.rateLimit.remainingRequests > 0) {
          this.rateLimit.remainingRequests--
        }

        // Refresh quota after successful message
        await this.fetchQuotaStatus()
      } finally {
        this.chat.isLoading = false
      }
    },

    /**
     * Activates rate limit blocking with a countdown.
     * @param {number} seconds - Seconds until rate limit resets
     */
    handleRateLimit(seconds) {
      this.rateLimit.isBlocked = true
      this.rateLimit.retryAfter = seconds
      this.rateLimit.remainingRequests = 0
      this.addToast(
        'warning',
        `Límite de solicitudes alcanzado. Intenta en ${seconds} segundos.`
      )
      this.startRateLimitCountdown()
    },

    /**
     * Opens the quota exceeded modal.
     */
    handleQuotaExceeded() {
      this.ui.showQuotaExceededModal = true
    },

    /**
     * Upgrades the user's plan via the backend.
     * @param {string} newPlan - Target plan: "FREE" | "PRO" | "ENTERPRISE"
     */
    async upgradePlan(newPlan) {
      try {
        const data = await upgradePlan(this.user.id, newPlan)
        this.user.plan = newPlan

        // Refresh quota after upgrade
        if (data.tokensRemaining !== undefined) {
          this.quota.tokensRemaining = data.tokensRemaining
        }
        if (data.tokensUsed !== undefined) {
          this.quota.tokensUsed = data.tokensUsed
        }
        if (data.tokensLimit !== undefined) {
          this.quota.tokensLimit = data.tokensLimit
        }

        await this.fetchQuotaStatus()

        this.ui.showUpgradePlanModal = false
        this.ui.showQuotaExceededModal = false
        this.addToast('success', '¡Plan actualizado exitosamente!')
      } catch (error) {
        this.addToast('error', 'No se pudo actualizar el plan. Intenta de nuevo.')
        console.error('upgradePlan error:', error)
      }
    },

    /**
     * Starts a countdown that decrements retryAfter every second.
     * Unblocks rate limit when countdown reaches 0.
     */
    startRateLimitCountdown() {
      // Clear any existing countdown
      if (this._countdownInterval) {
        clearInterval(this._countdownInterval)
      }

      this._countdownInterval = setInterval(() => {
        if (this.rateLimit.retryAfter > 0) {
          this.rateLimit.retryAfter--
        }

        if (this.rateLimit.retryAfter <= 0) {
          this.rateLimit.isBlocked = false
          this.rateLimit.remainingRequests = this.rateLimit.maxRequests
          clearInterval(this._countdownInterval)
          this._countdownInterval = null
          this.addToast('success', '¡Límite de solicitudes restablecido!')
        }
      }, 1000)
    },

    /**
     * Adds a toast notification.
     * @param {'success' | 'warning' | 'error'} type
     * @param {string} message
     */
    addToast(type, message) {
      const toast = {
        id: crypto.randomUUID(),
        type,
        message,
        createdAt: Date.now(),
      }
      this.ui.toasts.push(toast)

      // Auto-remove after 4 seconds
      setTimeout(() => {
        this.removeToast(toast.id)
      }, 4000)
    },

    /**
     * Removes a toast notification by id.
     * @param {string} toastId
     */
    removeToast(toastId) {
      const index = this.ui.toasts.findIndex((t) => t.id === toastId)
      if (index !== -1) {
        this.ui.toasts.splice(index, 1)
      }
    },

    /**
     * Cleans up intervals (call on app unmount or store disposal).
     */
    cleanup() {
      if (this._countdownInterval) {
        clearInterval(this._countdownInterval)
        this._countdownInterval = null
      }
    },
  },
})
