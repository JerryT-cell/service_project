import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Configuration du bundler Vite. Les plugins et alias techniques globaux
 * vivent ici ; aucune configuration propre à une fonctionnalité ne doit y être ajoutée.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
