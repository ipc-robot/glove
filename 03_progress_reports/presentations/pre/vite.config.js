import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 监听所有地址，暴露局域网IP
    port: 5173,
    strictPort: false,
  },
  base: command === 'build' ? '/research-slides/' : '/'
}))
