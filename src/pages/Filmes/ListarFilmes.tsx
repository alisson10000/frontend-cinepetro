import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit, FiTrash } from 'react-icons/fi'

type Filme = {
  id: number
  title: string
  description: string
  release_year: number
  poster?: string
}

export default function ListarFilmes() {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:8000/movies/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
        setFilmes(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erro ao buscar filmes:', err)
        setLoading(false)
      })
  }, [])

  const handleEditar = (id: number) => {
    navigate(`/app/filmes/editar/${id}`)
  }

  const handleExcluir = (id: number) => {
    navigate(`/app/filmes/excluir/${id}`)
  }

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6">
      <h1 className="text-3xl font-bold text-white mb-6">📽️ Filmes Cadastrados</h1>

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : filmes.length === 0 ? (
        <p className="text-gray-400">Nenhum filme cadastrado ainda.</p>
      ) : (
        <ul className="space-y-4">
          {filmes.map(filme => (
            <li key={filme.id} className="bg-gray-800 p-4 rounded-lg shadow flex gap-4">
              {/* Poster do filme */}
              {filme.poster ? (
                <img
                  src={`http://localhost:8000/static/${filme.poster}`}
                  alt={filme.title}
                  className="w-24 h-36 object-cover rounded"
                />
              ) : (
                <div className="w-24 h-36 bg-gray-700 flex items-center justify-center text-xs text-white rounded">
                  Sem pôster
                </div>
              )}

              {/* Descrição do filme */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-yellow-400">{filme.title}</h2>
                <p className="text-gray-300 text-sm mt-1">{filme.description}</p>
                <p className="text-gray-500 text-xs mt-1">Lançado em {filme.release_year}</p>
              </div>

              {/* Ações */}
              <div className="flex flex-col justify-center gap-2">
                <button
                  onClick={() => handleEditar(filme.id)}
                  className="text-blue-400 hover:text-blue-500"
                  title="Editar"
                >
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => handleExcluir(filme.id)}
                  className="text-red-500 hover:text-red-600"
                  title="Excluir"
                >
                  <FiTrash size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
