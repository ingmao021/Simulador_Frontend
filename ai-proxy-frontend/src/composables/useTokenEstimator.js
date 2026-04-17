import { computed } from 'vue'
import { estimateTokens as utilsEstimateTokens } from '@/utils/tokenEstimator'

/**
 * Composable to estimate token count from a text ref.
 * 
 * @param {import('vue').Ref<string>} textRef - Ref wrapping the prompt string
 * @returns {object} { estimatedTokens: ComputedRef<number> }
 */
export function useTokenEstimator(textRef) {
  const estimatedTokens = computed(() => {
    return utilsEstimateTokens(textRef.value)
  })

  return { estimatedTokens }
}
