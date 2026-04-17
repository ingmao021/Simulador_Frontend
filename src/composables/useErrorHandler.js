import { useAppStore } from '@/stores/useAppStore'

/**
 * Composable to handle generic API errors globally.
 */
export function useErrorHandler() {
  const store = useAppStore()

  /**
   * Processes the error based on its mapped type from the Axios interceptor.
   * 
   * @param {Error} error - The caught error object
   */
  const handleApiError = (error) => {
    // Determine the error type based on Axios interceptor mapping
    // or fallback to inspecting standard network error signatures.
    const errorType = error.type || 'UNKNOWN'

    if (errorType === 'RATE_LIMIT') {
      const retryAfter = error.retryAfter || 60
      store.handleRateLimit(retryAfter)
      // Note: store.handleRateLimit already triggers a toast warning and countdown
    } 
    else if (errorType === 'QUOTA_EXCEEDED') {
      store.handleQuotaExceeded()
    } 
    else if (errorType === 'SERVER_ERROR' || error.response?.status >= 500) {
      store.addToast('error', 'Error del servidor. Por favor intenta más tarde.')
    } 
    else if (errorType === 'NETWORK_ERROR' || !error.response) {
      store.addToast('error', 'Sin conexión con el servidor. Verifica tu red.')
    } 
    else {
      store.addToast('error', 'Ocurrió un error inesperado al procesar la solicitud.')
      console.error('Unhandled API error:', error)
    }
  }

  return {
    handleApiError
  }
}
