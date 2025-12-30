import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {

            '/api': {
                // VIKTIGT: Byt ut URL:en nedan mot din Patient Service i CBH Cloud
                // T.ex: https://journal-system-patient-xyz.app.cloud.cbh.kth.se
                target: 'https://journal-system-patient.app.cloud.cbh.kth.se',
                changeOrigin: true,
                secure: false, // Ignorera SSL-certifikatfel om det behövs
                // Vi tar INTE bort /api prefixet eftersom din backend förväntar sig det (enligt dina controllers)
                // Om din backend INTE har /api i sina @RequestMapping, avkommentera raden nedan:
                // rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
