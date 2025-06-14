import { useNavigate } from 'react-router-dom'

export default function SeriesIndex() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6 text-center text-white">
      <h1 className="text-3xl font-bold mb-8">📺 Gerenciar Séries</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {/* 📋 Listar séries */}
        <button
          onClick={() => navigate('/app/series/listar')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-6 rounded-lg font-semibold transition"
        >
          📋 Listar Séries
        </button>

        {/* ➕ Criar nova série */}
        <button
          onClick={() => navigate('/app/series/criar')}
          className="bg-green-500 hover:bg-green-600 text-black py-3 px-6 rounded-lg font-semibold transition"
        >
          ➕ Cadastrar Série
        </button>

        {/* ✏️ Selecionar para editar */}
        <button
          onClick={() => navigate('/app/series/selecionar-editar')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition"
        >
          ✏️ Editar Série
        </button>

        {/* 🗑️ Selecionar para excluir */}
        <button
          onClick={() => navigate('/app/series/selecionar-excluir')}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition"
        >
          🗑️ Excluir Série
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Para editar ou excluir, primeiro selecione a série desejada.
      </p>
    </div>
  )
}
