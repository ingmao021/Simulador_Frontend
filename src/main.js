import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { wakeUpBackend } from './services/api'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Mostrar entorno activo en consola (solo desarrollo)
if (import.meta.env.VITE_APP_ENV === 'development') {
  console.log('🛠️ Modo: Desarrollo')
  console.log('🔗 Backend:', import.meta.env.VITE_API_BASE_URL)
}

// Despertar el backend al cargar la app
wakeUpBackend()

app.mount('#app')
