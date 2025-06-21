import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditarEpisodio() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [seasonNumber, setSeasonNumber] = useState('')
  const [episodeNumber, setEpisodeNumber] = useState('')
  const [duration, setDuration] = useState('')
  const [seriesId, setSeriesId] = useState('')

  // ✅ Proteção contra ausência de token ou id
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Sessão expirada. Faça login novamente.')
      navigate('/login')
      return
    }

    if (!id) {
      alert('ID do episódio não encontrado.')
      navigate('/episodios')
      return
    }

    const carregarDados = async () => {
      try {
        const res = await fetch(`http://localhost:8000/episodes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error('Erro ao buscar episódio')
        const data = await res.json()

        setTitle(data.title)
        setDescription(data.description || '')
        setSeasonNumber(data.season_number?.toString() || '')
        setEpisodeNumber(data.episode_number?.toString() || '')
        setDuration(data.duration?.toString() || '')
        setSeriesId(data.series_id?.toString() || '')
      } catch (err) {
        console.error('❌ Erro ao carregar dados do episódio:', err)
        alert('Erro ao carregar dados do episódio.')
      }
    }

    carregarDados()
  }, [id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Sessão expirada. Faça login novamente.')
      navigate('/login')
      return
    }

    const payload = {
      title,
      description,
      season_number: Number(seasonNumber),
      episode_number: Number(episodeNumber),
      duration: Number(duration),
      series_id: Number(seriesId)
    }

    try {
      const res = await fetch(`http://localhost:8000/episodes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert('✅ Episódio atualizado com sucesso!')
        navigate('/app/episodios/listar') // ✅ Rota corrigida
      } else {
        const err = await res.json()
        alert(`❌ Erro ao atualizar episódio: ${err.detail || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('❌ Erro ao enviar atualização:', error)
      alert('Erro ao enviar atualização.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">✏️ Editar Episódio</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          placeholder="Título do episódio"
          required
        />

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          placeholder="Descrição do episódio"
        />

        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Temporada"
            className="w-1/3 p-2 rounded bg-white text-black"
            value={seasonNumber}
            onChange={e => setSeasonNumber(e.target.value)}
          />
          <input
            type="number"
            placeholder="Episódio"
            className="w-1/3 p-2 rounded bg-white text-black"
            value={episodeNumber}
            onChange={e => setEpisodeNumber(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duração (min)"
            className="w-1/3 p-2 rounded bg-white text-black"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </div>

        <input
          type="number"
          placeholder="ID da Série"
          className="w-full p-2 rounded bg-white text-black"
          value={seriesId}
          onChange={e => setSeriesId(e.target.value)}
          required
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Atualizar Episódio
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/episodios/listar')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
