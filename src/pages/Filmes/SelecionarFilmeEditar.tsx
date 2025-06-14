import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Filme {
  id: number
  title: string
  year: number
}

export default function SelecionarFilmeEditar() {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:8000/movies/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFilmes(data)
        setLoading(false)
      })
      .catch(() => {
        setMensagem('❌ Erro ao carregar filmes')
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-1">✏️ Selecione um Filme para Editar</h1>

      {/* Mensagem abaixo do título, alinhada à esquerda */}
      {(mensagem || (!loading && filmes.length === 0)) && (
        <p className={`mb-6 ${mensagem ? 'text-red-400' : 'text-gray-400'}`}>
          {mensagem || '📭 Nenhum filme disponível para edição.'}
        </p>
      )}

      <ul className="space-y-3">
        {filmes.map((filme) => (
          <li key={filme.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
            <span>{filme.title} ({filme.year})</span>
            <button
              onClick={() => navigate(`/app/filmes/editar/${filme.id}`)}
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white text-sm"
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
