import axios from 'axios'

// Lee la URL del backend según el entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!BASE_URL) {
  console.error(
    '⚠️ VITE_API_BASE_URL no está definida.',
    'Crea un archivo .env.development con esta variable.'
  )
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor de REQUEST — log en desarrollo
api.interceptors.request.use(
  config => {
    if (import.meta.env.VITE_APP_ENV === 'development') {
      console.log(`→ ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  error => Promise.reject(error)
)

// Interceptor de RESPONSE — manejo de errores HTTP
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Sin conexión o backend dormido (Render free tier)
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message: 'Sin conexión con el servidor. Verifica tu red o espera que el servidor despierte.'
      })
    }

    const { status, headers, data } = error.response

    if (status === 429) {
      return Promise.reject({
        type: 'RATE_LIMIT',
        retryAfter: parseInt(headers['retry-after'] || '60'),
        message: data?.message || 'Límite de solicitudes.'
      })
    }

    if (status === 402) {
      return Promise.reject({
        type: 'QUOTA_EXCEEDED',
        message: data?.message || 'Cuota mensual agotada.'
      })
    }

    if (status === 500) {
      return Promise.reject({
        type: 'SERVER_ERROR',
        message: 'Error interno del servidor.'
      })
    }

    return Promise.reject({
      type: 'UNKNOWN_ERROR',
      status,
      message: data?.message || 'Error desconocido.'
    })
  }
)

// Wake-up para el plan gratuito de Render
export const wakeUpBackend = async () => {
  try {
    await api.get('/api/health')
    console.log('✅ Backend activo')
  } catch {
    console.warn('⏳ Despertando backend...')
  }
}

export default api
