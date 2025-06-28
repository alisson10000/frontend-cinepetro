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

type Serie = {
  id: number
  title: string
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

export default function ListarEpisodios() {
  const [series, setSeries] = useState<Serie[]>([])
  const [serieSelecionada, setSerieSelecionada] = useState<number | null>(null)
  const [episodios, setEpisodios] = useState<Episodio[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      setErro('❌ Usuário não autenticado.')
      return
    }
    fetchSeries()
  }, [])

  useEffect(() => {
    if (serieSelecionada !== null) {
      fetchEpisodios(serieSelecionada)
    }
  }, [serieSelecionada])

  const fetchSeries = async () => {
    try {
      const res = await fetch(`${backendUrl}/series/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSeries(data)
    } catch {
      setErro('❌ Erro ao carregar as séries.')
    }
  }

  const fetchEpisodios = async (serieId: number) => {
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/episodes/?series_id=${serieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setEpisodios(data)
      setErro('')
    } catch (err) {
      console.error('❌ Erro ao buscar episódios:', err)
      setErro('❌ Não foi possível carregar os episódios.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: number) => navigate(`/app/episodios/editar/${id}`)
  const handleDelete = (id: number) => navigate(`/app/episodios/excluir/${id}`)

  const episodiosPorTemporada = episodios.reduce((acc, ep) => {
    const temporada = ep.season_number ?? 0
    if (!acc[temporada]) acc[temporada] = []
    acc[temporada].push(ep)
    return acc
  }, {} as Record<number, Episodio[]>)

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6">
      <h1 className="text-3xl font-bold text-white mb-6">📺 Gerenciar Episódios</h1>

      <div className="mb-6">
        <label htmlFor="serie" className="block text-white mb-2">
          🎬 Selecione uma série:
        </label>
        <select
          id="serie"
          className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600"
          onChange={(e) => setSerieSelecionada(Number(e.target.value))}
          value={serieSelecionada ?? ''}
        >
          <option value="" disabled>-- Escolha uma série --</option>
          {series.map(serie => (
            <option key={serie.id} value={serie.id}>
              {serie.title}
            </option>
          ))}
        </select>
      </div>

      {serieSelecionada && (
        <>
          {loading ? (
            <p className="text-gray-400">⏳ Carregando episódios...</p>
          ) : erro ? (
            <p className="text-red-400">{erro}</p>
          ) : episodios.length === 0 ? (
            <p className="text-gray-400">Nenhum episódio encontrado para esta série.</p>
          ) : (
            Object.entries(episodiosPorTemporada).map(([temporada, eps]) => (
              <div key={temporada} className="mb-10">
                <h2 className="text-2xl text-yellow-400 font-bold mb-4">
                  🗂️ Temporada {temporada === "0" ? "Indefinida" : temporada}
                </h2>

                <ul className="space-y-4">
                  {eps
                    .sort((a, b) => (a.episode_number ?? 0) - (b.episode_number ?? 0))
                    .map((ep) => (
                      <li
                        key={ep.id}
                        className="bg-gray-800 p-4 rounded-lg shadow flex justify-between items-start gap-4"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
                            {ep.episode_number
                              ? `Episódio ${ep.episode_number}: `
                              : 'Episódio:'}{' '}
                            {ep.title}
                          </h3>
                          <p className="text-gray-300 text-sm mt-1">
                            {ep.description || 'Sem descrição.'}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            Duração: {ep.duration || '?'} min
                          </p>
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
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}
