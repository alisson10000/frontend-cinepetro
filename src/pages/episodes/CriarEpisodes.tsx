import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type Serie = {
  id: number
  title: string
}

export default function CriarEpisodios() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [seasonNumber, setSeasonNumber] = useState('')
  const [episodeNumber, setEpisodeNumber] = useState('')
  const [duration, setDuration] = useState('')
  const [seriesId, setSeriesId] = useState<number | null>(null)

  const [seriesList, setSeriesList] = useState<Serie[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:8000/series/', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('🎬 Séries carregadas:', data)
        setSeriesList(data)
      })
      .catch(err => console.error('❌ Erro ao buscar séries:', err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      title,
      description,
      season_number: Number(seasonNumber),
      episode_number: Number(episodeNumber),
      duration: Number(duration),
      series_id: seriesId,
    }

    const token = localStorage.getItem('token')

    try {
      const res = await fetch('http://localhost:8000/episodes/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert('✅ Episódio cadastrado com sucesso!')
        navigate('/app/episodios/listar')
      } else {
        const error = await res.json()
        console.error('❌ Erro ao cadastrar episódio:', error)
        alert(`Erro: ${error.detail || 'Erro desconhecido'}`)
      }
    } catch (err) {
      console.error('🔥 Erro na requisição:', err)
      alert('Erro ao conectar com o servidor.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">🎬 Cadastrar Novo Episódio</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🎞️ Série associada */}
        <div>
          <label className="block font-semibold mb-1">📺 Selecione a Série</label>
          <select
            value={seriesId ?? ''}
            onChange={e => setSeriesId(Number(e.target.value))}
            className="w-full p-2 rounded bg-white text-black border border-gray-600"
            required
          >
            <option value="">Selecione...</option>
            {seriesList.map(s => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* 📝 Título */}
        <input
          type="text"
          placeholder="Título do Episódio"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-white text-black border border-gray-600"
          required
        />

        {/* ✍️ Descrição */}
        <textarea
          placeholder="Descrição do Episódio"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-white text-black border border-gray-600"
        />

        {/* 📺 Temporada e Episódio */}
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Temporada"
            value={seasonNumber}
            onChange={(e) => setSeasonNumber(e.target.value)}
            className="w-1/2 p-2 rounded bg-white text-black border border-gray-600"
          />
          <input
            type="number"
            placeholder="Episódio"
            value={episodeNumber}
            onChange={(e) => setEpisodeNumber(e.target.value)}
            className="w-1/2 p-2 rounded bg-white text-black border border-gray-600"
          />
        </div>

        {/* ⏱️ Duração */}
        <input
          type="number"
          placeholder="Duração (minutos)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 rounded bg-white text-black border border-gray-600"
        />

        {/* ✅ Botão */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Cadastrar Episódio
        </button>
      </form>
    </div>
  )
}
