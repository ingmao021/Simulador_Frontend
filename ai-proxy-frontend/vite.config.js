import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      tailwindcss()
    ],

    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },

    build: {
      outDir: 'dist',
      sourcemap: false,        // Sin sourcemaps en prod
      minify: 'terser',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('chart.js') || id.includes('vue-chartjs')) {
                return 'charts'
              }
              if (id.includes('vue') || id.includes('pinia') || id.includes('axios') || id.includes('vue-router') || id.includes('lucide')) {
                return 'vendor'
              }
            }
          }
        }
      }
    },

    server: {
      port: 5173,
      proxy: {
        // En desarrollo, redirige /api al backend local u online según .env
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        }
      }
    },

    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV)
    }
  }
})
