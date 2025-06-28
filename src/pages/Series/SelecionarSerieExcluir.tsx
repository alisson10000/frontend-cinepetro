import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Serie {
  id: number
  title: string
  start_year: number
  end_year?: number
}

// 🔗 Backend configurado via .env.local
const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

export default function SelecionarSerieExcluir() {
  const [series, setSeries] = useState<Serie[]>([])
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

    const fetchSeries = async () => {
      try {
        const res = await fetch(`${backendUrl}/series/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setSeries(data)
      } catch {
        setMensagem('❌ Erro ao carregar lista de séries.')
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-2xl font-bold mb-1">🗑️ Selecione uma Série para Excluir</h1>

      {(mensagem || (!loading && series.length === 0)) && (
        <p className={`mb-6 ${mensagem ? 'text-red-400' : 'text-gray-400'}`}>
          {mensagem || '📭 Nenhuma série disponível para exclusão.'}
        </p>
      )}

      <ul className="space-y-2">
        {series.map(serie => (
          <li key={serie.id} className="flex justify-between items-center bg-gray-800 p-3 rounded shadow">
            <span>
              {serie.title} ({serie.start_year}{serie.end_year ? ` - ${serie.end_year}` : ''})
            </span>
            <button
              onClick={() => navigate(`/app/series/excluir/${serie.id}`)}
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
