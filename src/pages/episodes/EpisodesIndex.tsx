import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EpisodiosIndex() {
  const navigate = useNavigate()

  // 🔒 Verifica se o token está presente
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn("🚫 Token ausente. Redirecionando para login...")
      navigate('/')
    }
  }, [navigate])

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6 text-center text-white">
      <h1 className="text-3xl font-bold mb-8">📺 Gerenciar Episódios</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {/* 📋 Listar episódios */}
        <button
          onClick={() => navigate('/app/episodios/listar')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-6 rounded-lg font-semibold transition"
        >
          📋 Listar Episódios
        </button>

        {/* ➕ Criar novo episódio */}
        <button
          onClick={() => navigate('/app/episodios/criar')}
          className="bg-green-500 hover:bg-green-600 text-black py-3 px-6 rounded-lg font-semibold transition"
        >
          ➕ Cadastrar Episódio
        </button>

        {/* ✏️ Selecionar para editar */}
        <button
          onClick={() => navigate('/app/episodios/selecionar-editar')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition"
        >
          ✏️ Editar Episódio
        </button>

        {/* 🗑️ Selecionar para excluir */}
        <button
          onClick={() => navigate('/app/episodios/selecionar-excluir')}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition"
        >
          🗑️ Excluir Episódio
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Para editar ou excluir, primeiro selecione o episódio desejado.
      </p>
    </div>
  )
}
