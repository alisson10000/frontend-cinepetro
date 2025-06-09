import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite" // Plugin oficial Tailwind CSS v4 para Vite
import path from "node:path" // ✅ Compatível com moduleResolution: "bundler" (Node ESM)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // TailwindCSS como plugin Vite (v4)
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Alias "@" aponta para a pasta "src/"
    },
  },
})
