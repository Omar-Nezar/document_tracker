import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { qrcode } from "vite-plugin-qrcode"
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    qrcode()
  ],
  server: {
    host: true, // For testing on mobile with qr code
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
      "@shared": path.resolve(import.meta.dirname, "../shared"),
      "@misc": path.resolve(import.meta.dirname, "./src/comps/misc"),
    }
  }
})
