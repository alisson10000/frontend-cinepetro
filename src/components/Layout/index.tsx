import { Outlet } from 'react-router-dom'
import Menu from '@/components/Menu'

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* ✅ Menu topo fixo */}
      <Menu />

      {/* ✅ Conteúdo das rotas protegidas */}
      <main className="pt-20 px-6 pb-10">
        <Outlet />
      </main>
    </div>
  )
}
