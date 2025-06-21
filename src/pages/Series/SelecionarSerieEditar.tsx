import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Serie = {
  id: number
  title: string
  poster?: string
}

export default function SelecionarSerieEditar() {
  const navigate = useNavigate()
  const [series, setSeries] = useState<Serie[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:8000/series/', {
      headers: {
        Authorization: `Bearer ${token || ''}`
      }
    })
      .then(res => res.json())
      .then(data => setSeries(data))
      .catch(err => console.error('❌ Erro ao buscar séries:', err))
  }, [])

  const handleEditar = (id: number) => {
    navigate(`/app/series/editar/${id}`)
  }

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">🎬 Selecionar Série para Editar</h1>

      <div className="space-y-4">
        {series.map(serie => (
          <div
            key={serie.id}
            className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md"
          >
            {serie.poster ? (
              <img
                src={`http://localhost:8000/static/${serie.poster}`}
                alt={serie.title}
                className="w-24 h-36 object-cover rounded"
              />
            ) : (
              <div className="w-24 h-36 bg-gray-600 flex items-center justify-center text-sm text-gray-300 rounded">
                Sem imagem
              </div>
            )}

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{serie.title}</h2>
              <button
                onClick={() => handleEditar(serie.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
