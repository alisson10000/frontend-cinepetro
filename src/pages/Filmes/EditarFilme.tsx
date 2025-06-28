import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface Genre {
  id: number
  name: string
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

export default function EditarFilme() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [year, setYear] = useState('')
  const [duration, setDuration] = useState('')
  const [poster, setPoster] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)

  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !id) {
      setMensagem('❌ Usuário não autenticado ou ID ausente.')
      return
    }

    const carregarDados = async () => {
      try {
        const [resFilme, resGenres] = await Promise.all([
          fetch(`${backendUrl}/movies/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${backendUrl}/genres/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ])

        if (!resFilme.ok || !resGenres.ok) throw new Error()

        const dataFilme = await resFilme.json()
        const genresData = await resGenres.json()

        setTitle(dataFilme.title)
        setDescription(dataFilme.description || '')
        setYear(dataFilme.year ? `${dataFilme.year}-01-01` : '')
        setDuration(dataFilme.duration?.toString() || '')
        setSelectedGenres(dataFilme.genres?.map((g: any) => g.id) || [])
        setGenres(genresData)

        if (dataFilme.poster) {
          const url = `${backendUrl}/static/${dataFilme.poster}`
          setPosterPreview(url)
        }

        setLoading(false)
      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err)
        setMensagem('Erro ao carregar dados do filme.')
        setLoading(false)
      }
    }

    carregarDados()
  }, [id])

  const handleCheckboxChange = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      setMensagem('❌ Usuário não autenticado.')
      return
    }

    const ano = parseInt(year.slice(0, 4))
    const currentYear = new Date().getFullYear()
    if (ano < 1888 || ano > currentYear) {
      setMensagem('❌ Ano inválido.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('year', ano.toString())
    formData.append('duration', duration)
    formData.append('genre_ids', JSON.stringify(selectedGenres))
    if (poster) formData.append('poster', poster)

    try {
      const response = await fetch(`${backendUrl}/movies/upload/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        setMensagem('✅ Filme atualizado com sucesso!')
        setTimeout(() => navigate('/app/filmes/listar'), 1500)
      } else {
        const err = await response.json()
        setMensagem(`❌ Erro: ${err.detail || 'ao atualizar filme.'}`)
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com o servidor:', error)
      setMensagem('Erro ao conectar com o servidor.')
    }
  }

  if (loading) {
    return <div className="text-center mt-24 text-white">⏳ Carregando dados do filme...</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">✏️ Editar Filme</h1>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          placeholder="Título do filme"
          required
        />

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          placeholder="Descrição do filme"
          required
        />

        <input
          type="date"
          value={year}
          onChange={e => setYear(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          required
        />

        <input
          type="number"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          placeholder="Duração (minutos)"
          required
        />

        <div>
          <label className="block font-semibold mb-1">📷 Novo Pôster (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setPoster(file)
              if (file) setPosterPreview(URL.createObjectURL(file))
            }}
            className="w-full p-2 rounded bg-white text-black"
          />

          {posterPreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-300">🖼️ Pôster atual:</p>
              <img src={posterPreview} alt="Pôster" className="mt-1 rounded shadow w-32 border border-gray-600" />
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 font-semibold">🎭 Gêneros</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {genres.map((genre) => (
              <label key={genre.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleCheckboxChange(genre.id)}
                />
                {genre.name}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Atualizar Filme
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/filmes/listar')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>

        {mensagem && <p className="text-yellow-300 text-center mt-2">{mensagem}</p>}
      </form>
    </div>
  )
}
