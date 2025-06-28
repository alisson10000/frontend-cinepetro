import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

type Episodio = {
  id: number
  title: string
  description?: string
  duration?: number
  season_number?: number
}

type Serie = {
  id: number
  title: string
  poster?: string
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

export default function SelecionarEpisodio() {
  const { serieId } = useParams()
  const navigate = useNavigate()

  const [serie, setSerie] = useState<Serie | null>(null)
  const [episodiosPorTemporada, setEpisodiosPorTemporada] = useState<Record<number, Episodio[]>>({})
  const [temporadas, setTemporadas] = useState<number[]>([])
  const [temporadaSelecionada, setTemporadaSelecionada] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const carregarDados = async () => {
      try {
        const [resSerie, resEp] = await Promise.all([
          fetch(`${backendUrl}/series/${serieId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${backendUrl}/episodes/by_serie/${serieId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        if (!resSerie.ok || !resEp.ok) throw new Error('Erro ao buscar dados')

        const serieData: Serie = await resSerie.json()
        const episodios: Episodio[] = await resEp.json()

        const agrupado: Record<number, Episodio[]> = {}
        episodios.forEach(ep => {
          const temporada = ep.season_number ?? 1
          if (!agrupado[temporada]) agrupado[temporada] = []
          agrupado[temporada].push(ep)
        })

        const temporadasOrdenadas = Object.keys(agrupado).map(Number).sort((a, b) => a - b)

        setSerie(serieData)
        setEpisodiosPorTemporada(agrupado)
        setTemporadas(temporadasOrdenadas)
        setTemporadaSelecionada(temporadasOrdenadas[0] ?? null)
      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err)
        navigate('/login')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [serieId, navigate])

  const handleAssistir = (episodioId: number) => {
    const episodios = episodiosPorTemporada[temporadaSelecionada ?? 1] || []
    const ordenado = [...episodios].sort((a, b) => a.id - b.id)

    navigate(`/app/assistir/${serieId}/${episodioId}`, {
      state: {
        episodios,
        episodioAtual: episodioId,
        temporada: temporadaSelecionada
      }
    })
  }

  const episodios = temporadaSelecionada ? episodiosPorTemporada[temporadaSelecionada] || [] : []

  if (carregando) return <div className="text-white mt-20 text-center">🔄 Carregando...</div>
  if (!serie) return <div className="text-white mt-20 text-center">❌ Série não encontrada.</div>

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6">
      <div className="flex flex-col items-center mb-6">
        {serie.poster && (
          <img
            src={`${backendUrl}/static/${serie.poster}`}
            alt={serie.title}
            className="w-48 h-auto rounded shadow mb-2"
          />
        )}
        <h1 className="text-2xl text-white font-bold">{serie.title}</h1>
      </div>

      <div className="mb-4">
        <label className="text-white font-semibold">Temporada:</label>
        <select
          className="ml-2 p-2 bg-gray-800 text-white rounded"
          value={temporadaSelecionada ?? ''}
          onChange={(e) => setTemporadaSelecionada(Number(e.target.value))}
        >
          {temporadas.map(t => (
            <option key={t} value={t}>Temporada {t}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {episodios.map(ep => (
          <li
            key={ep.id}
            className="bg-gray-800 p-4 rounded shadow text-white flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-bold">{ep.title}</h2>
              <p className="text-sm text-gray-300">{ep.description || 'Sem descrição.'}</p>
            </div>
            <button
              onClick={() => handleAssistir(ep.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Assistir
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
