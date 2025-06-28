import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// 🎭 Tipo para os gêneros
type Genero = {
  id: number
  name: string
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

export default function EditarSeries() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
  const [poster, setPoster] = useState<File | null>(null)
  const [posterAtual, setPosterAtual] = useState<string | null>(null)

  const [generos, setGeneros] = useState<Genero[]>([])
  const [generosSelecionados, setGenerosSelecionados] = useState<number[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !id) return

    const carregarDados = async () => {
      try {
        console.log('🔄 Buscando dados da série e gêneros...')
        const [resSerie, resGeneros] = await Promise.all([
          fetch(`${backendUrl}/series/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${backendUrl}/genres/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        if (!resSerie.ok || !resGeneros.ok) throw new Error('Erro nas requisições')

        const dataSerie = await resSerie.json()
        const dataGeneros = await resGeneros.json()

        console.log('🎬 Dados da série:', dataSerie)
        console.log('🎭 Gêneros disponíveis:', dataGeneros)

        setTitle(dataSerie.title)
        setDescription(dataSerie.description || '')
        setStartYear(dataSerie.start_year?.toString() || '')
        setEndYear(dataSerie.end_year?.toString() || '')
        setPosterAtual(dataSerie.poster || null)
        setGeneros(dataGeneros)

        const generosSerie = dataSerie.genres || []
        const ids = generosSerie.map((g: any) => g.id)
        console.log('✅ IDs de gêneros da série:', ids)
        setGenerosSelecionados(ids)
      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err)
      }
    }

    carregarDados()
  }, [id])

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
    formData.append('genre_ids', JSON.stringify(generosSelecionados))
    if (poster) formData.append('poster', poster)

    const token = localStorage.getItem('token')
    console.log('📤 Enviando dados da série para atualização...')
    const res = await fetch(`${backendUrl}/series/upload/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token || ''}` },
      body: formData
    })

    if (res.ok) {
      alert('✅ Série atualizada com sucesso!')
      navigate('/app/series/listar')
    } else {
      const err = await res.json()
      alert(`❌ Erro ao atualizar série: ${err.detail || 'erro desconhecido'}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">✏️ Editar Série</h1>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          placeholder="Título da série"
          required
        />

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          placeholder="Descrição da série"
          required
        />

        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Ano de Início"
            className="w-1/2 p-2 rounded bg-white text-black"
            value={startYear}
            onChange={e => setStartYear(e.target.value)}
          />
          <input
            type="number"
            placeholder="Ano de Fim"
            className="w-1/2 p-2 rounded bg-white text-black"
            value={endYear}
            onChange={e => setEndYear(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">📷 Novo Pôster (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setPoster(file)
              if (file) setPosterAtual(URL.createObjectURL(file))
            }}
            className="w-full p-2 rounded bg-white text-black"
          />

          {posterAtual && (
            <div className="mt-2">
              <p className="text-sm text-gray-300">🖼️ Pôster atual:</p>
              <img src={`${backendUrl}/static/${posterAtual}`} alt="Pôster" className="mt-1 rounded shadow w-32 border border-gray-600" />
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 font-semibold">🎭 Gêneros</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {generos.map((genero) => (
              <label key={genero.id} className="flex items-center gap-2">
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

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Atualizar Série
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/series/listar')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
