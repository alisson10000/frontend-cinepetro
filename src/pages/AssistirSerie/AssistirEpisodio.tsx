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
  episodios?: Episodio[]
  episodioAtual?: number
  temporada?: number
  tempoSalvo?: number
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

export default function AssistirEpisodio() {
  const { serieId, episodioId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [episodio, setEpisodio] = useState<Episodio | null>(null)
  const [tempoSalvo, setTempoSalvo] = useState(0)
  const ultimoTempoEnviado = useRef(0)

  const state = location.state as LocationState || {}
  const episodios = state.episodios || []
  const episodioAtualId = parseInt(episodioId || '0')

  const episodioIndex = episodios.findIndex(ep => ep.id === episodioAtualId)
  const proximo = episodioIndex >= 0 ? episodios[episodioIndex + 1] : null

  useEffect(() => {
    const carregarEpisodio = async () => {
      // Se já veio no state, usa diretamente
      const episodioLocal = episodios.find(ep => ep.id === episodioAtualId)

      if (episodioLocal) {
        setEpisodio(episodioLocal)
      } else {
        try {
          const res = await fetch(`${backendUrl}/episodes/${episodioId}`)
          if (res.ok) {
            const data = await res.json()
            setEpisodio(data)
          } else {
            setEpisodio(null)
          }
        } catch {
          setEpisodio(null)
        }
      }

      // Tempo salvo: do state (preferencial) ou localStorage
      const tempoState = state.tempoSalvo
      const tempoLocal = localStorage.getItem(`episodio_${episodioId}_tempo`)
      const tempoFinal = tempoState ?? (tempoLocal ? parseFloat(tempoLocal) : 0)

      setTempoSalvo(tempoFinal)
    }

    carregarEpisodio()
  }, [episodioId, episodios, state])

  const handleSalvarTempo = (tempo: number) => {
    if (!episodioId || typeof tempo !== 'number') return
    const tempoArredondado = Math.floor(tempo)

    if (tempoArredondado - ultimoTempoEnviado.current < 5) return
    ultimoTempoEnviado.current = tempoArredondado

    localStorage.setItem(`episodio_${episodioId}_tempo`, tempoArredondado.toString())

    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${backendUrl}/progress/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        episode_id: episodioAtualId,
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
          temporada: proximo.season_number || state.temporada || 1
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
        src={`${backendUrl}/static/videos_series/${serieId}/${seasonNumber}/${episodio.id}.mp4`}
        tempoSalvo={tempoSalvo}
        onTimeUpdate={handleSalvarTempo}
        title={episodio.title}
        videoId={episodioId}
        onNextEpisode={proximo ? handleProximo : undefined}
        proximoTitulo={proximo?.title || ''}
        proximoThumbnail={`${backendUrl}/static/posters/ep${proximo?.id || 'x'}.jpg`}
        resumoTemporada={episodio.description}
      />
    </div>
  )
}
