import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideoJspPlayer from '@/components/VideoJspPlayer/VideoJspPlayer'

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

export default function AssistirFilme() {
  const { id } = useParams()
  const [filme, setFilme] = useState<any>(null)
  const [tempoSalvo, setTempoSalvo] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const ultimoTempoEnviado = useRef(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !id) return

    const carregarDados = async () => {
      try {
        const resFilme = await fetch(`${backendUrl}/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!resFilme.ok) throw new Error('Erro ao buscar filme')
        const data = await resFilme.json()
        setFilme(data)

        let tempo = 0
        try {
          const resProgress = await fetch(`${backendUrl}/progress/get?movie_id=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })

          if (resProgress.ok) {
            const progressData = await resProgress.json()
            tempo = progressData?.time_seconds || 0
          }
        } catch (err) {
          console.warn('⚠️ Erro ao buscar progresso do backend:', err)
        }

        if (tempo === 0) {
          const local = localStorage.getItem(`filme_${id}_tempo`)
          const localTempo = local ? parseFloat(local) : 0
          tempo = isNaN(localTempo) ? 0 : localTempo
        }

        setTempoSalvo(tempo)
      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err)
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [id])

  const handleSalvarTempo = (tempo: number) => {
    if (!id || typeof tempo !== 'number') return

    const tempoArredondado = Math.floor(tempo)

    if (tempoArredondado - ultimoTempoEnviado.current < 5) return
    ultimoTempoEnviado.current = tempoArredondado

    localStorage.setItem(`filme_${id}_tempo`, tempoArredondado.toString())

    const token = localStorage.getItem('token')
    if (!token) return

    const payload = {
      movie_id: parseInt(id),
      time_seconds: tempoArredondado
    }

    console.log('📡 Enviando progresso ao backend:', payload)

    fetch(`${backendUrl}/progress/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const text = await res.text()
        console.log('✅ Resposta backend:', res.status, text)
        if (!res.ok) {
          console.warn('⚠️ Progresso não foi salvo com sucesso')
        }
      })
      .catch(err => {
        console.error('❌ Erro na requisição:', err)
      })
  }

  if (carregando) {
    return (
      <div className="text-white text-center mt-24">
        🎬 Carregando filme...
      </div>
    )
  }

  if (!filme) {
    return (
      <div className="text-white text-center mt-24">
        ❌ Filme não encontrado.
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center pt-20 px-4">
      <h1 className="text-2xl font-bold mb-2">🎞️ {filme.title}</h1>

      {tempoSalvo > 0 && (
        <p className="text-sm text-gray-400 mb-4">
          ⏱️ Retomando de <strong>{Math.floor(tempoSalvo / 60)}min</strong> ({Math.floor(tempoSalvo)}s)
        </p>
      )}

      <VideoJspPlayer
        src={`${backendUrl}/static/videos/${id}.mp4`}
        tempoSalvo={tempoSalvo}
        onTimeUpdate={handleSalvarTempo}
        title={filme.title}
        videoId={id}
      />
    </div>
  )
}
