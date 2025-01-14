import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  server: { https: true }, // Not needed for Vite 5+
  plugins: [react(), mkcert()],
})