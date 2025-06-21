import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Serie = {
  id: number
  title: string
}

type Episodio = {
  id: number
  title: string
  season_number?: number
  episode_number?: number
  series_id: number
}

export default function SelecionarEpisodioEditar() {
  const navigate = useNavigate()
  const [series, setSeries] = useState<Serie[]>([])
  const [serieSelecionada, setSerieSelecionada] = useState<number>(0)
  const [episodios, setEpisodios] = useState<Episodio[]>([])
  const [carregando, setCarregando] = useState(false)

  // 🔄 Carrega todas as séries
  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:8000/series/', {
      headers: { Authorization: `Bearer ${token || ''}` }
    })
      .then(res => res.json())
      .then(data => setSeries(data))
      .catch(err => console.error('❌ Erro ao buscar séries:', err))
  }, [])

  // 🔄 Carrega episódios da série selecionada
  useEffect(() => {
    if (!serieSelecionada) return

    setCarregando(true)
    const token = localStorage.getItem('token')
    fetch(`http://localhost:8000/episodes/by_serie/${serieSelecionada}`, {
      headers: { Authorization: `Bearer ${token || ''}` }
    })
      .then(res => res.json())
      .then(data => setEpisodios(data))
      .catch(err => console.error('❌ Erro ao buscar episódios:', err))
      .finally(() => setCarregando(false))
  }, [serieSelecionada])

  const handleEditar = (id: number) => {
    navigate(`/app/episodios/editar/${id}`)
  }

  return (
    <div className="max-w-4xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🎞️ Selecionar Episódio para Editar</h1>

      <div className="mb-6">
        <label className="block text-sm mb-2 text-gray-300 font-medium">
          Escolha uma série:
        </label>
        <select
          value={serieSelecionada}
          onChange={e => setSerieSelecionada(Number(e.target.value))}
          className="w-full p-2 bg-white text-black rounded shadow"
        >
          <option value={0} disabled>Selecione uma série</option>
          {series.map(serie => (
            <option key={serie.id} value={serie.id}>
              {serie.title}
            </option>
          ))}
        </select>
      </div>

      {carregando ? (
        <p className="text-gray-400">🔄 Carregando episódios...</p>
      ) : (
        <>
          {serieSelecionada !== 0 && episodios.length === 0 ? (
            <p className="text-gray-400">📭 Nenhum episódio cadastrado para essa série.</p>
          ) : (
            <div className="space-y-4">
              {episodios.map(ep => (
                <div
                  key={ep.id}
                  className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <div>
                    <h2 className="text-xl font-semibold">{ep.title}</h2>
                    <p className="text-sm text-gray-400">
                      Temporada {ep.season_number || '?'} • Episódio {ep.episode_number || '?'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditar(ep.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold"
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
