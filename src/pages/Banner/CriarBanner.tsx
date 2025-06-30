import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

type Conteudo = {
  id: number
  title: string
  poster: string
}

export default function CriarBanner() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [poster, setPoster] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string>('')
  const [ordem, setOrdem] = useState<number>(0)

  const [tipo, setTipo] = useState<'movie' | 'series'>('movie')
  const [conteudos, setConteudos] = useState<Conteudo[]>([])
  const [conteudoId, setConteudoId] = useState<number | null>(null)

  const [mensagem, setMensagem] = useState('')

  // Buscar conteúdos com base no tipo
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const rota = tipo === 'movie' ? 'movies' : 'series'

    fetch(`${backendUrl}/${rota}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: Conteudo[]) => {
        setConteudos(data)
        setPosterPreview('')
        setConteudoId(null)
        console.log('🎞️ Conteúdos carregados:', data)
      })
      .catch(err => {
        console.error('Erro ao buscar conteúdos:', err)
        setMensagem('Erro ao carregar conteúdos disponíveis.')
      })
  }, [tipo])

  // Atualizar preview ao mudar seleção
  useEffect(() => {
    const selecionado = conteudos.find(c => c.id === conteudoId)
    if (selecionado?.poster) {
      const caminho = `${backendUrl}/static/${selecionado.poster}`
      setPosterPreview(caminho)
      console.log('🖼️ Preview do pôster carregado (conteúdo existente):', caminho)
    } else {
      setPosterPreview('')
    }
  }, [conteudoId, conteudos])

  const handlePosterChange = (file: File | null) => {
    setPoster(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPosterPreview(reader.result as string)
        console.log('🖼️ Preview do pôster carregado (upload novo):', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token || !conteudoId) return

    const formData = new FormData()
    formData.append('title', title)
    formData.append('type', tipo)
    formData.append('ordem', ordem.toString())
    formData.append(tipo === 'movie' ? 'movie_id' : 'series_id', String(conteudoId))
    if (poster) {
      formData.append('poster', poster)
      console.log('📤 Poster incluído no FormData:', poster.name)
    } else {
      console.warn('⚠️ Nenhum poster incluído no FormData')
    }

    try {
      const response = await fetch(`${backendUrl}/banners/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        setMensagem('🎉 Banner criado com sucesso!')
        console.log('✅ Banner criado com sucesso')
        setTimeout(() => navigate('/app/banners'), 1500)
      } else {
        const err = await response.json()
        console.error('❌ Erro ao criar banner:', err)
        setMensagem(`❌ Erro: ${err.detail || 'Erro ao criar banner.'}`)
      }
    } catch (error) {
      console.error('Erro de conexão:', error)
      setMensagem('Erro de conexão com o servidor.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">🖼️ Cadastrar Novo Banner</h1>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Título do Banner"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-white text-black border border-gray-600"
          required
        />

        <div>
          <label className="block font-semibold mb-1">📌 Ordem de Exibição</label>
          <select
            value={ordem}
            onChange={(e) => setOrdem(Number(e.target.value))}
            className="w-full p-2 rounded bg-white text-black border border-gray-600"
            required
          >
            <option value="">Selecione a ordem</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>


        <div>
          <label className="block font-semibold mb-1">🎞️ Tipo de Conteúdo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'movie' | 'series')}
            className="w-full p-2 rounded bg-white text-black border border-gray-600"
          >
            <option value="movie">Filme</option>
            <option value="series">Série</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">🎬 Selecione o {tipo === 'movie' ? 'Filme' : 'Série'}</label>
          <select
            value={conteudoId ?? ''}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              setConteudoId(isNaN(val) ? null : val)
            }}
            className="w-full p-2 rounded bg-white text-black border border-gray-600"
            required
          >
            <option value="">Selecione...</option>
            {conteudos.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {posterPreview && (
          <div className="mt-4">
            <p className="font-semibold mb-1">🖼️ Pré-visualização</p>
            <img
              src={posterPreview}
              alt="Preview do pôster"
              className="w-full max-h-80 object-contain border rounded"
            />
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1">📷 Enviar Imagem (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePosterChange(e.target.files?.[0] || null)}
            className="w-full p-2 rounded bg-white text-black border border-gray-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Cadastrar Banner
        </button>

        {mensagem && (
          <p className="text-sm mt-2 text-yellow-400 font-semibold text-center">{mensagem}</p>
        )}
      </form>
    </div>
  )
}
