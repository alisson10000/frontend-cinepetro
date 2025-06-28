import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Genero = {
  id: number
  name: string
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

export default function CriarSeries() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
  const [poster, setPoster] = useState<File | null>(null)

  const [generos, setGeneros] = useState<Genero[]>([])
  const [generosSelecionados, setGenerosSelecionados] = useState<number[]>([])

  useEffect(() => {
    fetch(`${backendUrl}/genres/`)
      .then(res => res.json())
      .then(data => {
        console.log('🎭 Gêneros carregados:', data)
        setGeneros(data)
      })
      .catch(err => console.error('❌ Erro ao buscar gêneros:', err))
  }, [])

  const handleGeneroChange = (id: number) => {
    setGenerosSelecionados(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('start_year', startYear)
    formData.append('end_year', endYear)

    if (poster) {
      formData.append('poster', poster)
      console.log('🖼️ Pôster anexado:', poster.name)
    }

    formData.append('genre_ids', JSON.stringify(generosSelecionados))

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${backendUrl}/series/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token || ''}` },
        body: formData
      })

      if (res.ok) {
        alert('✅ Série cadastrada com sucesso!')
        navigate('/app/series/listar')
      } else {
        const error = await res.json()
        console.error('❌ Erro ao cadastrar série:', error)
        alert(`Erro ao cadastrar série: ${error.detail || 'Erro desconhecido'}`)
      }
    } catch (err) {
      console.error('🔥 Erro na requisição:', err)
      alert('Erro ao conectar com o servidor.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">📺 Cadastrar Nova Série</h1>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        {/* 🎬 Título da série */}
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

        {/* 📆 Anos */}
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Ano de Início"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="w-1/2 p-2 rounded bg-white text-black border border-gray-600"
            required
          />
          <input
            type="number"
            placeholder="Ano de Fim"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="w-1/2 p-2 rounded bg-white text-black border border-gray-600"
          />
        </div>

        {/* 📷 Upload de pôster */}
        <div>
          <label className="block font-semibold mb-1">📷 Pôster</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setPoster(e.target.files?.[0] || null)}
            className="w-full p-2 rounded bg-white text-black border border-gray-600"
          />
        </div>

        {/* 🎭 Gêneros */}
        <div className="mt-6">
          <p className="mb-2 font-semibold border-b border-gray-700 pb-1">🎭 Gêneros</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
            {generos.map(genero => (
              <label key={genero.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={generosSelecionados.includes(genero.id)}
                  onChange={() => handleGeneroChange(genero.id)}
                  className="accent-yellow-500"
                />
                {genero.name}
              </label>
            ))}
          </div>
        </div>

        {/* ✅ Botão de envio */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Cadastrar Série
        </button>
      </form>
    </div>
  )
}
