import { useEffect, useState } from 'react'
import { FiEdit, FiTrash } from 'react-icons/fi'

type Serie = {
  id: number
  title: string
  description?: string
  start_year?: number
  end_year?: number
  poster?: string
}

export default function ListarSeries() {
  const [series, setSeries] = useState<Serie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:8000/series/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
        setSeries(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erro ao buscar séries:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6">
      <h1 className="text-3xl font-bold text-white mb-6">📺 Séries Cadastradas</h1>

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : series.length === 0 ? (
        <p className="text-gray-400">Nenhuma série cadastrada ainda.</p>
      ) : (
        <ul className="space-y-4">
          {series.map(serie => (
            <li key={serie.id} className="bg-gray-800 p-4 rounded-lg shadow flex gap-4">
              {serie.poster && (
                <img
                  src={`http://localhost:8000/static/${serie.poster}`}
                  alt={serie.title}
                  className="w-24 h-36 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-yellow-400">{serie.title}</h2>
                <p className="text-gray-300 text-sm">{serie.description || 'Sem descrição.'}</p>
                <p className="text-gray-500 text-xs">
                  {serie.start_year || 'Ano ?'} - {serie.end_year || 'Atual'}
                </p>
              </div>
              <div className="flex flex-col justify-around items-center gap-3">
                <button className="text-blue-400 hover:text-blue-500">
                  <FiEdit size={18} />
                </button>
                <button className="text-red-500 hover:text-red-600">
                  <FiTrash size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
