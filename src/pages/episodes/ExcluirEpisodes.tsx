import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface Episodio {
  id: number
  title: string
  season_number?: number
  episode_number?: number
  series_id: number
}

export default function ExcluirEpisodio() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(true)
  const [episodio, setEpisodio] = useState<Episodio | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !id) {
      setMensagem('❌ Usuário não autenticado ou ID ausente.')
      setLoading(false)
      return
    }

    const buscarEpisodio = async () => {
      try {
        const res = await fetch(`http://localhost:8000/episodes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error()
        const data = await res.json()
        setEpisodio(data)
      } catch (err) {
        setMensagem('❌ Episódio não encontrado.')
      } finally {
        setLoading(false)
      }
    }

    buscarEpisodio()
  }, [id])

  const handleDelete = async () => {
    const confirmar = confirm("⚠️ Esta ação excluirá o episódio permanentemente. Deseja continuar?")
    if (!confirmar) return

    const token = localStorage.getItem('token')
    if (!token) {
      setMensagem('❌ Usuário não autenticado.')
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/episodes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        setMensagem('🧨 Episódio excluído permanentemente!')
        setTimeout(() => navigate('/app/episodios/selecionar-excluir'), 1500)
      } else {
        const error = await response.json()
        setMensagem(`❌ Erro: ${error.detail || 'ao excluir episódio.'}`)
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      setMensagem('❌ Erro ao conectar com o servidor.')
    }
  }

  if (loading) {
    return <div className="text-center mt-24 text-white">⏳ Carregando informações...</div>
  }

  return (
    <div className="max-w-xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">🗑️ Excluir Episódio</h1>

      {episodio && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Tem certeza que deseja excluir o episódio abaixo?
          </h2>
          <p className="text-gray-300"><strong>Título:</strong> {episodio.title}</p>
          <p className="text-gray-300">
            <strong>Temporada:</strong> {episodio.season_number || '?'} | <strong>Episódio:</strong> {episodio.episode_number || '?'}
          </p>
          <p className="text-gray-300"><strong>Série ID:</strong> {episodio.series_id}</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Excluir Permanentemente
        </button>
        <button
          onClick={() => navigate('/app/episodios/selecionar-excluir')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancelar
        </button>
      </div>

      {mensagem && <p className="text-yellow-300 text-center mt-4">{mensagem}</p>}
    </div>
  )
}
