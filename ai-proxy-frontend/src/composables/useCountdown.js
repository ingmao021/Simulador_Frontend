import { ref, onUnmounted } from 'vue'

/**
 * Composable that manages a simple countdown timer.
 * 
 * @param {number} initialSeconds - Starting seconds for the countdown
 * @returns {object} { seconds, isActive, start, stop, reset }
 */
export function useCountdown(initialSeconds = 60) {
  const seconds = ref(initialSeconds)
  const isActive = ref(false)
  let timerId = null

  const stop = () => {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
    isActive.value = false
  }

  const start = () => {
    stop() // Ensure no overlapping timers
    isActive.value = true
    timerId = setInterval(() => {
      if (seconds.value > 0) {
        seconds.value--
      } else {
        stop()
      }
    }, 1000)
  }

  const reset = (newSeconds) => {
    stop()
    if (newSeconds !== undefined) {
      seconds.value = newSeconds
    } else {
      seconds.value = initialSeconds
    }
  }

  // Cleanup on component unmount
  onUnmounted(() => {
    stop()
  })

  return {
    seconds,
    isActive,
    start,
    stop,
    reset,
  }
}
