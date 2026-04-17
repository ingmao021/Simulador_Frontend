# AI Proxy Platform - Frontend

Interfaz web construida con Vue.js 3 para gestionar la iteración con un modelo de IA, proveyendo un robusto seguimiento de la cuota de tokens y límite de solicitudes (*Rate Limiting*).

## Requisitos Previos
- **Node.js** v18+
- Backend API previamente ejecutándose (por defecto en `http://localhost:8080`)

## Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto para apuntar a la URL de tu API:
```env
VITE_API_BASE_URL=http://localhost:8080
```

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Correr en servidor de desarrollo local
npm run dev

# Compilar para producción a la carpeta /dist
npm run build
```

## Arquitectura de Componentes (Ascii)

```
App.vue
 │
 ├── [Header]
 │    └── PlanBadge.vue
 │
 ├── ToastNotification.vue (Teleport)
 │
 ├── Modals (Teleport)
 │    ├── QuotaExceededModal.vue
 │    └── UpgradePlanModal.vue
 │
 └── RouterView
      │
      ├── DemoView.vue
      │    └── Selección de simulador usuarios (FREE, PRO, ENTER)
      │
      └── HomeView.vue
           │
           ├── [Columna Izquierda]
           │    └── ChatView.vue
           │         ├── MessageList.vue
           │         └── MessageInput.vue
           │
           └── [Columna Derecha]
                ├── MetricsPanel.vue
                │    ├── PlanBadge.vue
                │    ├── QuotaIndicator.vue
                │    └── RateLimitIndicator.vue
                │
                └── AnalyticsPanel.vue
                     └── UsageChart.vue
```

## Tabla de Componentes

| Nombre / Ruta | Responsabilidad Principal |
|---------------|---------------------------|
| `App.vue` | Layout raíz y proveedor de estructura envolviendo la app (header y globals). |
| `HomeView.vue` | Vista principal (`/`). Layout en 2 columnas (responsivo) del Dashboard. |
| `DemoView.vue` | Vista de demostración (`/demo`) para alternar rápidamente entre identidades. |
| **CHAT** | |
| `ChatView.vue` | Wrapper padre del chat que conecta los sub-componentes. |
| `MessageList.vue` | Renderiza historial del chat. Soporta burbujas, typing states y auto-scroll. |
| `MessageInput.vue` | Textarea autoajustable con conteo de tokens que restringe envío si estás bajo Rate Limit. |
| **QUOTA** | |
| `MetricsPanel.vue` | Contenedor principal para encapsular widgets e indicadores de progreso. |
| `QuotaIndicator.vue` | Visualiza los tokens consumidos contra el límite mensual. |
| `RateLimitIndicator.vue` | Muestra límite por minuto de la API, bloquea UI e inicia countdown (*retry-after*). |
| `QuotaExceededModal.vue` | Modal 402 cuando la cuota mensual se interrumpe y se alcanza el límite. |
| `UpgradePlanModal.vue` | Permite subir (*Upgrade*) entre FREE -> PRO -> ENTERPRISE. |
| **ANALYTICS** | |
| `AnalyticsPanel.vue` | Wrapper contenedor para resumen histórico del usuario activo en la sesión. |
| `UsageChart.vue` | Gráfica embebida Chart.js (Barras) resumiendo consumos de 7 días. |
| **SHARED & STORE** | |
| `PlanBadge.vue` | Etiqueta renderizable con el plan y color (*Verde, Amarillo, Rojo, Dorado*). |
| `ToastNotification.vue` | Sistema custom que flota notificaciones (usando teleports) con dismiss timeout asíncrono. |
| `useAppStore.js` | Corazón global que manipula estado de Pinia, enruta llamadas al backend, formatea payloads y reacciona de lado a posibles errores asíncronos en los interceptores. |

---

*Aplicación construida paso a paso con Tailwind CSS puro + Composables responsivos nativos de Vue3.*
