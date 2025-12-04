import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/camera-api': {
        target: 'http://172.20.10.2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/camera-api/, ''),
      },
    },
  },  
})
