import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Genre {
  id: number
  name: string
}

export default function CriarFilme() {
  const navigate = useNavigate()

  // 🎬 Estados dos campos do formulário
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [year, setYear] = useState('') // será apenas o ano (ex: "2024")
  const [duration, setDuration] = useState('')
  const [poster, setPoster] = useState<File | null>(null)

  // 🎭 Gêneros disponíveis e selecionados
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])

  // 📣 Feedback ao usuário
  const [mensagem, setMensagem] = useState('')

  // 🔄 Busca inicial dos gêneros
  useEffect(() => {
    fetch('http://localhost:8000/genres/')
      .then(res => res.json())
      .then(data => {
        setGenres(data)
        console.log('🎭 Gêneros carregados:', data)
      })
      .catch(err => {
        console.error('❌ Erro ao buscar gêneros:', err)
        setMensagem('Erro ao carregar gêneros.')
      })
  }, [])

  // 🔘 Controle da seleção de gêneros
  const handleCheckboxChange = (id: number) => {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  // 📤 Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const formData = new FormData()

    formData.append('title', title)
    formData.append('description', description)
    formData.append('year', year) // já convertido para ano puro
    formData.append('duration', duration)
    formData.append('genre_ids', JSON.stringify(selectedGenres))

    if (poster) {
      formData.append('poster', poster)
    }

    console.log('📦 Enviando filme:', {
      title, description, year, duration, genres: selectedGenres, poster
    })

    try {
      const response = await fetch('http://localhost:8000/movies/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (response.ok) {
        setMensagem('🎉 Filme cadastrado com sucesso!')
        setTimeout(() => navigate('/app/filmes/listar'), 1500)
      } else {
        const err = await response.json()
        console.error('🚨 Erro no envio:', err)
        setMensagem(`❌ Erro: ${err.detail || 'Erro ao cadastrar filme.'}`)
      }
    } catch (error) {
      console.error('❌ Erro de conexão:', error)
      setMensagem('Erro de conexão com o servidor.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">📽️ Cadastrar Novo Filme</h1>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        {/* 🎬 Título */}
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-white text-black border border-gray-600"
          required
        />

        {/* 📝 Descrição */}
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-white text-black border border-gray-600"
          required
        />

        {/* 📅 Ano (extraído de uma data completa) */}
        <input
          type="date"
          placeholder="Ano de lançamento"
          onChange={(e) => {
            const selectedDate = e.target.value // Ex: "2023-12-01"
            const onlyYear = new Date(selectedDate).getFullYear().toString()
            setYear(onlyYear)
          }}
          className="w-full p-2 rounded bg-white text-black border border-gray-600"
          required
        />

        {/* ⏱️ Duração */}
        <input
          type="number"
          placeholder="Duração (minutos)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 rounded bg-white text-black border border-gray-600"
          required
        />

        {/* 🖼️ Upload do pôster */}
        <div>
          <label className="block font-semibold mb-1">📷 Pôster</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPoster(e.target.files?.[0] || null)}
            className="w-full p-2 rounded bg-white text-black border border-gray-600"
          />
        </div>

        {/* 🎭 Gêneros */}
        <div className="mt-6">
          <p className="mb-2 font-semibold border-b border-gray-700 pb-1">🎭 Gêneros</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
            {genres.map((genre) => (
              <label key={genre.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={genre.id}
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleCheckboxChange(genre.id)}
                  className="accent-yellow-500"
                />
                {genre.name}
              </label>
            ))}
          </div>
        </div>

        {/* ✅ Botão de envio */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Cadastrar Filme
        </button>

        {/* 📣 Mensagem ao usuário */}
        {mensagem && (
          <p className="text-sm mt-2 text-yellow-400 font-semibold text-center">
            {mensagem}
          </p>
        )}
      </form>
    </div>
  )
}
