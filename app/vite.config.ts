import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// GitHub Pages sirve el sitio bajo /<nombre-repo>/ (subcarpeta del dominio).
// La variable GITHUB_ACTIONS='true' es inyectada automáticamente por el runner de CI.
const base = process.env.GITHUB_ACTIONS === 'true' ? '/PanelArt3D/' : '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
