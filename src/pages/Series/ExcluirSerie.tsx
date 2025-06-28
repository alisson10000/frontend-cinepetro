import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

export default function ExcluirSerie() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(true)
  const [serie, setSerie] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !id) {
      setMensagem('❌ Usuário não autenticado ou ID ausente.')
      return
    }

    const buscarSerie = async () => {
      try {
        const res = await fetch(`${backendUrl}/series/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error()
        const data = await res.json()
        setSerie(data)
      } catch (err) {
        setMensagem('❌ Série não encontrada.')
      } finally {
        setLoading(false)
      }
    }

    buscarSerie()
  }, [id])

  const handleDelete = async () => {
    const confirmar = confirm("⚠️ Esta ação excluirá a série permanentemente. Deseja continuar?")
    if (!confirmar) return

    const token = localStorage.getItem('token')
    if (!token) {
      setMensagem('❌ Usuário não autenticado.')
      return
    }

    try {
      const response = await fetch(`${backendUrl}/series/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        setMensagem('🧨 Série excluída permanentemente!')
        setTimeout(() => navigate('/app/series/listar'), 1500)
      } else {
        const error = await response.json()
        setMensagem(`❌ Erro: ${error.detail || 'ao excluir série.'}`)
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
      <h1 className="text-2xl font-bold mb-6">🗑️ Excluir Série</h1>

      {serie && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Tem certeza que deseja excluir a série abaixo?
          </h2>
          <p className="text-gray-300"><strong>Título:</strong> {serie.title}</p>
          <p className="text-gray-300"><strong>Início:</strong> {serie.start_year}</p>
          <p className="text-gray-300"><strong>Fim:</strong> {serie.end_year || 'em andamento'}</p>

          {serie.poster && (
            <div className="mt-4">
              <p className="text-sm text-gray-400">🖼️ Pôster da série:</p>
              <img
                src={`${backendUrl}/static/${serie.poster}`}
                alt="Pôster da série"
                className="mt-2 rounded shadow w-32 border border-gray-700"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Excluir permanentemente
        </button>
        <button
          onClick={() => navigate('/app/series/listar')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancelar
        </button>
      </div>

      {mensagem && <p className="text-yellow-300 text-center mt-4">{mensagem}</p>}
    </div>
  )
}
