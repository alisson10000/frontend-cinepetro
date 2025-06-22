import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideoJspPlayer from '@/components/VideoJspPlayer/VideoJspPlayer'

export default function AssistirFilme() {
  const { id } = useParams()
  const [filme, setFilme] = useState<any>(null)
  const [tempoSalvo, setTempoSalvo] = useState(0)
  const [carregando, setCarregando] = useState(true)

  // 🔄 Buscar dados do filme + progresso
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !id) return

    const carregarDados = async () => {
      try {
        // 🎬 Buscar dados do filme
        const resFilme = await fetch(`http://localhost:8000/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!resFilme.ok) throw new Error('Erro ao buscar filme')
        const data = await resFilme.json()
        setFilme(data)

        // 🕒 Tentar buscar progresso do backend
        let tempo = 0
        try {
          const resProgress = await fetch(`http://localhost:8000/progress/get?movie_id=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })

          if (resProgress.ok) {
            const progressData = await resProgress.json()
            tempo = progressData?.time_seconds || 0
          }
        } catch (err) {
          console.warn('⚠️ Erro ao buscar progresso do backend:', err)
        }

        // 💾 Fallback para localStorage se necessário
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

  // 💾 Salvar progresso no localStorage e backend
  const handleSalvarTempo = (tempo: number) => {
    if (!id || typeof tempo !== 'number') return

    // Local
    localStorage.setItem(`filme_${id}_tempo`, tempo.toString())

    // Backend
    const token = localStorage.getItem('token')
    if (!token) return

    fetch('http://localhost:8000/progress/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        movie_id: parseInt(id),
        time_seconds: Math.floor(tempo)
      })
    }).catch(err => {
      console.warn('⚠️ Erro ao salvar progresso no backend:', err)
    })
  }

  // ⏳ Carregando
  if (carregando) {
    return (
      <div className="text-white text-center mt-24">
        🎬 Carregando filme...
      </div>
    )
  }

  // ❌ Filme não encontrado
  if (!filme) {
    return (
      <div className="text-white text-center mt-24">
        ❌ Filme não encontrado.
      </div>
    )
  }

  // ✅ Render
  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center pt-20 px-4">
      <h1 className="text-2xl font-bold mb-2">🎞️ {filme.title}</h1>

      {tempoSalvo > 0 && (
        <p className="text-sm text-gray-400 mb-4">
          ⏱️ Retomando de <strong>{Math.floor(tempoSalvo / 60)}min</strong> ({Math.floor(tempoSalvo)}s)
        </p>
      )}

      <VideoJspPlayer
        src={`http://localhost:8000/static/videos/${id}.mp4`}
        tempoSalvo={tempoSalvo}
        onTimeUpdate={handleSalvarTempo}
        title={filme.title}
      />
    </div>
  )
}
