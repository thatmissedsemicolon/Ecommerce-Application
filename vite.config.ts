import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/script.js',
        assetFileNames: (assetInfo) => {
          if (/\.png$/.test(assetInfo.name)) {
            return `assets/${assetInfo.name}`;
          }
          return 'assets/style.css';
        },
      },
    },
  },
})
