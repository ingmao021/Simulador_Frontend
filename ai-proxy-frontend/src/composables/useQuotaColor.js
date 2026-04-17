import { computed, unref } from 'vue'

/**
 * Composable that returns a generic Tailwind color class based on usage percentage.
 * 
 * @param {number|import('vue').Ref<number>} percentage - Usage percent (0 to 100)
 * @returns {object} { colorClass: ComputedRef<string> }
 */
export function useQuotaColor(percentage) {
  const colorClass = computed(() => {
    const val = unref(percentage)
    if (val <= 60) return 'bg-green-500'
    if (val <= 85) return 'bg-yellow-500'
    return 'bg-red-500'
  })

  return { colorClass }
}
