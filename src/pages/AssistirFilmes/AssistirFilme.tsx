import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideoJspPlayer from '@/components/VideoJspPlayer/VideoJspPlayer'

export default function AssistirFilme() {
  const { id } = useParams()
  const [filme, setFilme] = useState<any>(null)
  const [tempoSalvo, setTempoSalvo] = useState(0)
  const [carregando, setCarregando] = useState(true)

  // Buscar dados do filme e tempo salvo
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !id) return

    const buscarFilme = async () => {
      try {
        const res = await fetch(`http://localhost:8000/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error('Erro ao buscar filme')

        const data = await res.json()
        setFilme(data)

        const tempoAnterior = localStorage.getItem(`filme_${id}_tempo`)
        const tempo = tempoAnterior ? parseFloat(tempoAnterior) : 0
        setTempoSalvo(isNaN(tempo) ? 0 : tempo)
      } catch (err) {
        console.error('❌ Erro ao carregar filme:', err)
      } finally {
        setCarregando(false)
      }
    }

    buscarFilme()
  }, [id])

  // Salvar progresso de tempo
  const handleSalvarTempo = (tempo: number) => {
    if (id && typeof tempo === 'number') {
      localStorage.setItem(`filme_${id}_tempo`, tempo.toString())
    }
  }

  // Carregando
  if (carregando) {
    return (
      <div className="text-white text-center mt-24">
        🎬 Carregando filme...
      </div>
    )
  }

  // Filme não encontrado
  if (!filme) {
    return (
      <div className="text-white text-center mt-24">
        ❌ Filme não encontrado.
      </div>
    )
  }

  // Renderização principal
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
