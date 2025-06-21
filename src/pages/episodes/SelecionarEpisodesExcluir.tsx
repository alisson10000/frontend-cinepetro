import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Serie {
  id: number
  title: string
}

interface Episodio {
  id: number
  title: string
  season_number?: number
  episode_number?: number
  series_id: number
}

export default function SelecionarEpisodioExcluir() {
  const navigate = useNavigate()
  const [series, setSeries] = useState<Serie[]>([])
  const [serieSelecionada, setSerieSelecionada] = useState<number | null>(null)
  const [episodios, setEpisodios] = useState<Episodio[]>([])
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  // 🔄 Carrega todas as séries
  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:8000/series/', {
      headers: { Authorization: `Bearer ${token || ''}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro na resposta da API de séries')
        return res.json()
      })
      .then(data => setSeries(data))
      .catch(() => setMensagem('❌ Erro ao carregar séries.'))
  }, [])

  // 🔄 Carrega episódios da série selecionada
  useEffect(() => {
    if (!serieSelecionada) return

    setLoading(true)
    setMensagem('')
    const token = localStorage.getItem('token')
    fetch(`http://localhost:8000/episodes/by_serie/${serieSelecionada}`, {
      headers: { Authorization: `Bearer ${token || ''}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro na resposta da API de episódios')
        return res.json()
      })
      .then(data => setEpisodios(data))
      .catch(() => setMensagem('❌ Erro ao carregar episódios.'))
      .finally(() => setLoading(false))
  }, [serieSelecionada])

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">🗑️ Selecione um Episódio para Excluir</h1>

      <label className="block mb-4">
        <span className="block mb-1 text-gray-300">Escolha uma série:</span>
        <select
          value={serieSelecionada || ''}
          onChange={e => setSerieSelecionada(Number(e.target.value))}
          className="w-full p-2 bg-white text-black rounded"
        >
          <option value="" disabled>Selecione...</option>
          {series.map(serie => (
            <option key={serie.id} value={serie.id}>
              {serie.title}
            </option>
          ))}
        </select>
      </label>

      {mensagem && <p className="text-red-400 mb-4">{mensagem}</p>}

      {loading ? (
        <p className="text-gray-400">🔄 Carregando episódios...</p>
      ) : serieSelecionada ? (
        episodios.length === 0 ? (
          <p className="text-gray-400">📭 Nenhum episódio cadastrado para essa série.</p>
        ) : (
          <ul className="space-y-2">
            {episodios.map(ep => (
              <li key={ep.id} className="flex justify-between items-center bg-gray-800 p-3 rounded shadow">
                <span>
                  {ep.title} (T{ep.season_number || '?'}E{ep.episode_number || '?'})
                </span>
                <button
                  onClick={() => navigate(`/app/episodios/excluir/${ep.id}`)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className="text-gray-400">👈 Selecione uma série para visualizar os episódios.</p>
      )}
    </div>
  )
}
