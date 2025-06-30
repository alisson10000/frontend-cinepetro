import { useNavigate } from 'react-router-dom'

export default function BannerIndex() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6 text-center text-white">
      <h1 className="text-3xl font-bold mb-8">🖼️ Gerenciar Banners</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {/* 📋 Listar banners */}
        <button
          onClick={() => navigate('/app/banners/listar')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-6 rounded-lg font-semibold transition"
        >
          📋 Listar Banners
        </button>

        {/* ➕ Criar novo banner */}
        <button
          onClick={() => navigate('/app/banners/criar')}
          className="bg-green-500 hover:bg-green-600 text-black py-3 px-6 rounded-lg font-semibold transition"
        >
          ➕ Cadastrar Banner
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Cadastre novos banners ou visualize os existentes.
      </p>
    </div>
  )
}
