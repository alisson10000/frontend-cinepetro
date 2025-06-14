import { useNavigate } from 'react-router-dom'

export default function FilmesIndex() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6 text-center text-white">
      <h1 className="text-3xl font-bold mb-8">🎬 Gerenciar Filmes</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {/* 📋 Listar filmes */}
        <button
          onClick={() => navigate('/app/filmes/listar')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-6 rounded-lg font-semibold transition"
        >
          📋 Listar Filmes
        </button>

        {/* ➕ Criar novo filme */}
        <button
          onClick={() => navigate('/app/filmes/criar')}
          className="bg-green-500 hover:bg-green-600 text-black py-3 px-6 rounded-lg font-semibold transition"
        >
          ➕ Cadastrar Filme
        </button>

        {/* ✏️ Selecionar para editar */}
        <button
          onClick={() => navigate('/app/filmes/selecionar-editar')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition"
        >
          ✏️ Editar Filme
        </button>

        {/* 🗑️ Selecionar para excluir */}
        <button
          onClick={() => navigate('/app/filmes/selecionar-excluir')}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition"
        >
          🗑️ Excluir Filme
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Para editar ou excluir, primeiro selecione o filme desejado.
      </p>
    </div>
  )
}
