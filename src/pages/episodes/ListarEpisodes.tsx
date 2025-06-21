import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit, FiTrash } from 'react-icons/fi'

type Episodio = {
  id: number
  title: string
  description?: string
  season_number?: number
  episode_number?: number
  duration?: number
  series_id: number
}

export default function ListarEpisodios() {
  const [episodios, setEpisodios] = useState<Episodio[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchEpisodios()
  }, [])

  const fetchEpisodios = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setErro('❌ Usuário não autenticado.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('http://localhost:8000/episodes/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (!res.ok) throw new Error('Erro ao buscar episódios')
      const data = await res.json()
      setEpisodios(data)
    } catch (err) {
      console.error('❌ Erro ao buscar episódios:', err)
      setErro('❌ Não foi possível carregar os episódios.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/app/episodios/editar/${id}`)
  }

  const handleDelete = (id: number) => {
    navigate(`/app/episodios/excluir/${id}`)
  }

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6">
      <h1 className="text-3xl font-bold text-white mb-6">📺 Episódios Cadastrados</h1>

      {loading ? (
        <p className="text-gray-400">⏳ Carregando episódios...</p>
      ) : erro ? (
        <p className="text-red-400">{erro}</p>
      ) : episodios.length === 0 ? (
        <p className="text-gray-400">Nenhum episódio cadastrado ainda.</p>
      ) : (
        <ul className="space-y-4">
          {episodios.map(ep => (
            <li key={ep.id} className="bg-gray-800 p-4 rounded-lg shadow flex justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-yellow-400">
                  {ep.title}{' '}
                  <span className="text-sm text-white">
                    (T{ep.season_number || '?'}E{ep.episode_number || '?'})
                  </span>
                </h2>
                <p className="text-gray-300 text-sm mt-1">{ep.description || 'Sem descrição.'}</p>
                <p className="text-gray-500 text-xs mt-1">Duração: {ep.duration || '?'} min</p>
                <p className="text-gray-600 text-xs mt-1">Série ID: {ep.series_id}</p>
              </div>

              <div className="flex flex-row gap-3">
                <button
                  title="Editar episódio"
                  className="text-blue-400 hover:text-blue-500"
                  onClick={() => handleEdit(ep.id)}
                >
                  <FiEdit size={18} />
                </button>
                <button
                  title="Excluir episódio"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(ep.id)}
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
