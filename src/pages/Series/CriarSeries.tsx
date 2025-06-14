import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Genero = {
  id: number
  name: string
}

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
    fetch('http://localhost:8000/genres/')
      .then(res => res.json())
      .then(data => setGeneros(data))
      .catch(err => console.error('Erro ao buscar gêneros:', err))
  }, [])

  const handleGeneroChange = (id: number) => {
    if (generosSelecionados.includes(id)) {
      setGenerosSelecionados(generosSelecionados.filter(g => g !== id))
    } else {
      setGenerosSelecionados([...generosSelecionados, id])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('start_year', startYear)
    formData.append('end_year', endYear)
    if (poster) formData.append('poster', poster)
    generosSelecionados.forEach(id => formData.append('genre_ids', id.toString()))

    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:8000/series/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token || ''}`
      },
      body: formData
    })

    if (res.ok) {
      alert('Série cadastrada com sucesso!')
      navigate('/app/series/listar')
    } else {
      alert('Erro ao cadastrar série.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-24 px-6 text-white">
      <h1 className="text-3xl font-bold mb-6">➕ Cadastrar Nova Série</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Ano de Início"
            className="w-1/2 p-2 rounded bg-gray-700 text-white"
            value={startYear}
            onChange={e => setStartYear(e.target.value)}
          />
          <input
            type="number"
            placeholder="Ano de Fim"
            className="w-1/2 p-2 rounded bg-gray-700 text-white"
            value={endYear}
            onChange={e => setEndYear(e.target.value)}
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={e => setPoster(e.target.files?.[0] || null)}
          className="text-sm"
        />

        <div className="mt-4">
          <p className="text-yellow-300 font-semibold">Gêneros:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {generos.map(genero => (
              <label key={genero.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={generosSelecionados.includes(genero.id)}
                  onChange={() => handleGeneroChange(genero.id)}
                />
                {genero.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
        >
          Salvar Série
        </button>
      </form>
    </div>
  )
}
