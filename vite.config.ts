import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src', // 👈 Tells Vite your source files are in `src`
  build: {
    outDir: '../dist', // 👈 Output goes to root-level `dist`
    emptyOutDir: true,
  }
})