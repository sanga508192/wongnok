// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/wongnok/', // 👈 ชื่อ repo
  plugins: [react()],
})
