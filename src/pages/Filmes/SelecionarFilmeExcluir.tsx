import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Filme {
  id: number
  title: string
  year: number
}

export default function SelecionarFilmeExcluir() {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMensagem('❌ Usuário não autenticado.')
      setLoading(false)
      return
    }

    const fetchFilmes = async () => {
      try {
        const res = await fetch('http://localhost:8000/movies/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setFilmes(data)
      } catch {
        setMensagem('❌ Erro ao carregar lista de filmes.')
      } finally {
        setLoading(false)
      }
    }

    fetchFilmes()
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-1">🗑️ Selecione um Filme para Excluir</h1>

      {(mensagem || (!loading && filmes.length === 0)) && (
        <p className={`mb-6 ${mensagem ? 'text-red-400' : 'text-gray-400'}`}>
          {mensagem || '📭 Nenhum filme disponível para exclusão.'}
        </p>
      )}

      <ul className="space-y-2">
        {filmes.map(filme => (
          <li key={filme.id} className="flex justify-between items-center bg-gray-800 p-3 rounded shadow">
            <span>{filme.title} ({filme.year})</span>
            <button
              onClick={() => navigate(`/app/filmes/excluir/${filme.id}`)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
