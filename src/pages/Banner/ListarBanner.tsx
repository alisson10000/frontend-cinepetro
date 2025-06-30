import { useEffect, useState } from 'react'

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

type Banner = {
  id: number
  title: string
  poster?: string
  type: 'movie' | 'series'
  ordem: number
}

export default function ListarBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${backendUrl}/banners/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
        setBanners(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erro ao buscar banners:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6">
      <h1 className="text-3xl font-bold text-white mb-6">🖼️ Banners Cadastrados</h1>

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : banners.length === 0 ? (
        <p className="text-gray-400">Nenhum banner cadastrado ainda.</p>
      ) : (
        <ul className="space-y-4">
          {banners.map(banner => (
            <li key={banner.id} className="bg-gray-800 p-4 rounded-lg shadow flex gap-4">
              {/* Poster do banner */}
              {banner.poster ? (
                <img
                  src={`${backendUrl}/static/${banner.poster}`}
                  alt={banner.title}
                  className="w-24 h-36 object-cover rounded"
                />
              ) : (
                <div className="w-24 h-36 bg-gray-700 flex items-center justify-center text-xs text-white rounded">
                  Sem pôster
                </div>
              )}

              {/* Descrição do banner */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-yellow-400">{banner.title}</h2>
                <p className="text-gray-300 text-sm mt-1">Tipo: {banner.type === 'movie' ? 'Filme' : 'Série'}</p>
                <p className="text-gray-500 text-xs mt-1">Ordem de exibição: {banner.ordem}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
