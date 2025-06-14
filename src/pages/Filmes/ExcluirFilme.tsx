import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function DeletarFilme() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(true)
  const [filme, setFilme] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !id) {
      setMensagem('❌ Usuário não autenticado ou ID ausente.')
      return
    }

    const buscarFilme = async () => {
      try {
        const res = await fetch(`http://localhost:8000/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error()
        const data = await res.json()
        setFilme(data)
      } catch (err) {
        setMensagem('❌ Filme não encontrado.')
      } finally {
        setLoading(false)
      }
    }

    buscarFilme()
  }, [id])

  const handleSoftDelete = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMensagem('❌ Usuário não autenticado.')
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/movies/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        setMensagem('✅ Filme excluído logicamente (soft delete).')
        setTimeout(() => navigate('/app/filmes/listar'), 1500)
      } else {
        const error = await response.json()
        setMensagem(`❌ Erro: ${error.detail || 'ao excluir filme.'}`)
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      setMensagem('❌ Erro ao conectar com o servidor.')
    }
  }

  const handleHardDelete = async () => {
    const confirmar = confirm("⚠️ Esta ação excluirá o filme definitivamente. Deseja continuar?")
    if (!confirmar) return

    const token = localStorage.getItem('token')
    if (!token) {
      setMensagem('❌ Usuário não autenticado.')
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/movies/${id}/hard`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        setMensagem('🧨 Filme excluído permanentemente!')
        setTimeout(() => navigate('/app/filmes/listar'), 1500)
      } else {
        const error = await response.json()
        setMensagem(`❌ Erro: ${error.detail || 'ao excluir permanentemente.'}`)
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
      <h1 className="text-2xl font-bold mb-6">🗑️ Excluir Filme</h1>

      {filme && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Tem certeza que deseja excluir o filme abaixo?
          </h2>
          <p className="text-gray-300"><strong>Título:</strong> {filme.title}</p>
          <p className="text-gray-300"><strong>Ano:</strong> {filme.year}</p>
          <p className="text-gray-300"><strong>Duração:</strong> {filme.duration} min</p>

          {/* Imagem do pôster, se existir */}
          {filme.poster && (
            <div className="mt-4">
              <p className="text-sm text-gray-400">🖼️ Pôster do filme:</p>
              <img
                src={`http://localhost:8000/static/${filme.poster}`}
                alt="Pôster"
                className="mt-2 rounded shadow w-32 border border-gray-700"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button
          onClick={handleSoftDelete}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Soft Delete (exclusão lógica)
        </button>
        <button
          onClick={handleHardDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Hard Delete (exclusão permanente)
        </button>
        <button
          onClick={() => navigate('/app/filmes/listar')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancelar
        </button>
      </div>

      {mensagem && <p className="text-yellow-300 text-center mt-4">{mensagem}</p>}
    </div>
  )
}
