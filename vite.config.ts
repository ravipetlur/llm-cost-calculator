import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // relative base so the build works at any hosting path (GitHub Pages subpath, Vercel root, file://)
  base: './',
  plugins: [react(), tailwindcss()],
})
