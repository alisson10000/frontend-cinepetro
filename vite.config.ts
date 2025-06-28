import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite" // Plugin oficial do TailwindCSS (v4) para Vite
import path from "node:path" // Utilitário nativo do Node para resolver caminhos

// ⚙️ Configuração principal do Vite
export default defineConfig({
  // 📦 Plugins utilizados no projeto
  plugins: [
    react(),          // Suporte ao React
    tailwindcss(),    // Integração com TailwindCSS
  ],

  // 📁 Atalhos para importar arquivos com "@" apontando para "src/"
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // 🌐 Configurações do servidor de desenvolvimento (vite dev server)
  server: {
    host: true, // Permite acesso via IP local, ex: 192.168.0.104:5173
    port: 5173, // Porta do servidor de desenvolvimento

    // ✅ Libera domínios personalizados, como cinepetro.local
    allowedHosts: ['cinepetro.local', '192.168.0.104'], // Evita o erro "host not allowed"
  },
})
