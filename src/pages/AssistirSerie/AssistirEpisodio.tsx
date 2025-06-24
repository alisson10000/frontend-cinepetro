import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import VideoSeriePlayer from '@/components/VideoSeriePlayer/VideoSeriePlayer'

type Episodio = {
  id: number
  title: string
  description?: string
  duration?: number
  season_number?: number
  episode_number?: number
  series_id: number
}

type LocationState = {
  episodios: Episodio[]
  episodioAtual: number
  temporada: number
}

export default function AssistirEpisodio() {
  const { serieId, episodioId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [episodio, setEpisodio] = useState<Episodio | null>(null)
  const [tempoSalvo, setTempoSalvo] = useState(0)
  const ultimoTempoEnviado = useRef(0)

  const state = location.state as LocationState | null
  const episodios = state?.episodios || []
  const episodioAtualId = parseInt(episodioId || '0')

  const episodioIndex = episodios.findIndex(ep => ep.id === episodioAtualId)
  const proximo = episodioIndex >= 0 ? episodios[episodioIndex + 1] : null

  useEffect(() => {
    const episodioEncontrado = episodios.find(ep => ep.id === episodioAtualId)
    if (episodioEncontrado) {
      setEpisodio(episodioEncontrado)
    } else {
      // fallback para busca por ID (opcional)
      fetch(`http://localhost:8000/episodes/${episodioId}`)
        .then(res => res.json())
        .then(data => setEpisodio(data))
        .catch(() => setEpisodio(null))
    }

    const tempoLocal = localStorage.getItem(`episodio_${episodioId}_tempo`)
    setTempoSalvo(tempoLocal ? parseFloat(tempoLocal) : 0)
  }, [episodioId, episodios])

  const handleSalvarTempo = (tempo: number) => {
    if (!episodioId || typeof tempo !== 'number') return
    const tempoArredondado = Math.floor(tempo)

    if (tempoArredondado - ultimoTempoEnviado.current < 5) return
    ultimoTempoEnviado.current = tempoArredondado

    localStorage.setItem(`episodio_${episodioId}_tempo`, tempoArredondado.toString())

    const token = localStorage.getItem('token')
    if (!token) return

    fetch('http://localhost:8000/progress/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        episode_id: parseInt(episodioId),
        time_seconds: tempoArredondado
      })
    }).catch(console.error)
  }

  const handleProximo = () => {
    if (proximo) {
      navigate(`/app/assistir/${serieId}/${proximo.id}`, {
        state: {
          episodios,
          episodioAtual: proximo.id,
          temporada: state?.temporada || 1
        }
      })
    }
  }

  if (!episodio) {
    return <div className="text-white text-center mt-24">❌ Episódio não encontrado.</div>
  }

  const seasonNumber = episodio.season_number || 1

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center pt-20 px-4">
      <h1 className="text-2xl font-bold mb-2">🎞️ {episodio.title}</h1>

      {tempoSalvo > 0 && (
        <p className="text-sm text-gray-400 mb-4">
          ⏱️ Retomando de <strong>{Math.floor(tempoSalvo / 60)}min</strong> ({Math.floor(tempoSalvo)}s)
        </p>
      )}

      <VideoSeriePlayer
        src={`http://localhost:8000/static/videos_series/${serieId}/${seasonNumber}/${episodio.id}.mp4`}
        tempoSalvo={tempoSalvo}
        onTimeUpdate={handleSalvarTempo}
        title={episodio.title}
        videoId={episodioId}
        onNextEpisode={proximo ? handleProximo : undefined}
        proximoTitulo={proximo?.title || ''}
        proximoThumbnail={`http://localhost:8000/static/posters/ep${proximo?.id || 'x'}.jpg`}
        resumoTemporada={episodio.description}
      />
    </div>
  )
}
