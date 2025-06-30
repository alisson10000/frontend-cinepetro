import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BannerSlider from '@/components/BannerSlider'

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

export default function Home() {
  const [usuario, setUsuario] = useState<{ nome: string; email: string } | null>(null)
  const [filmes, setFilmes] = useState<any[]>([])
  const [series, setSeries] = useState<any[]>([])
  const [emProgresso, setEmProgresso] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const userString = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (userString) {
      try {
        const user = JSON.parse(userString)
        setUsuario(user)
      } catch (err) {
        console.error('Erro ao ler usuário do localStorage', err)
      }
    }

    if (!token) return

    const fetchData = async () => {
      try {
        const [filmesRes, seriesRes, progressoRes, bannersRes] = await Promise.all([
          fetch(`${backendUrl}/movies/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${backendUrl}/series/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${backendUrl}/progress/continuar`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${backendUrl}/banners/`, { headers: { Authorization: `Bearer ${token}` } }),
        ])

        if (filmesRes.ok) setFilmes(await filmesRes.json())
        if (seriesRes.ok) setSeries(await seriesRes.json())
        if (progressoRes.ok) setEmProgresso(await progressoRes.json())
        if (bannersRes.ok) setBanners(await bannersRes.json())
      } catch (err) {
        console.error('Erro ao buscar dados', err)
      }
    }

    fetchData()
  }, [])

  const progressoFilmes = emProgresso.filter(p => p.type === 'movie')
  const progressoSeries = emProgresso.filter(p => p.type === 'series')

  const handleBannerClick = (banner: any) => {
    if (banner.type === 'movie' && banner.movie_id) {
      navigate(`/app/assistir/filme/${banner.movie_id}`)
    } else if (banner.type === 'series' && banner.series_id) {
      const url = banner.episode_id
        ? `/app/assistir/${banner.series_id}/${banner.episode_id}`
        : `/app/assistir/serie/${banner.series_id}`
      navigate(url)
    }
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {usuario && (
        <div className="px-6 pt-20">
          <p className="text-sm text-gray-400">
            Bem-vindo, <span className="text-yellow-400 font-semibold">{usuario.nome}</span>
          </p>
        </div>
      )}

      <section className="mt-4">
        <BannerSlider
          banners={banners.map((b: any) => ({
            title: b.title,
            poster: b.poster ? `${backendUrl}/static/${b.poster}` : undefined,
            type: b.type,
            movie_id: b.movie_id,
            series_id: b.series_id,
            episode_id: b.episode_id,
            onClick: () => handleBannerClick(b),
          }))}
          tempo={5000}
        />
      </section>

      {progressoFilmes.length > 0 && (
        <section className="px-6 py-6">
          <h2 className="text-xl font-bold mb-4">⏳ Continuar Assistindo - Filmes</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {progressoFilmes.map(filme => (
              <div
                key={filme.movie_id}
                className="min-w-[150px] max-w-[150px] cursor-pointer"
                onClick={() => navigate(`/app/assistir/filme/${filme.movie_id}`)}
              >
                <div className="w-[150px] h-[225px] overflow-hidden rounded-md bg-gray-800">
                  {filme.poster ? (
                    <img
                      src={`${backendUrl}/static/${filme.poster}`}
                      alt={filme.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">Sem pôster</div>
                  )}
                </div>
                <p className="mt-2 text-sm text-center text-gray-300">{filme.title}</p>
                <p className="text-xs text-gray-400 text-center">
                  {Math.floor(filme.time_seconds / 60)}min de {Math.floor(filme.duration_seconds / 60)}min
                </p>
                <progress className="w-full mt-1" value={filme.time_seconds} max={filme.duration_seconds} />
              </div>
            ))}
          </div>
        </section>
      )}

      {progressoSeries.length > 0 && (
        <section className="px-6 py-6">
          <h2 className="text-xl font-bold mb-4">📺 Continuar Assistindo - Séries</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {progressoSeries.map(ep => (
              <div
                key={ep.episode_id}
                className="min-w-[150px] max-w-[150px] cursor-pointer"
                onClick={() =>
                  navigate(`/app/assistir/${ep.series_id}/${ep.episode_id}`, {
                    state: {
                      episodios: [],
                      episodioAtual: ep.episode_id,
                      temporada: ep.season_number,
                      tempoSalvo: ep.time_seconds
                    }
                  })
                }
              >
                <div className="w-[150px] h-[225px] overflow-hidden rounded-md bg-gray-800">
                  {ep.poster ? (
                    <img
                      src={`${backendUrl}/static/${ep.poster}`}
                      alt={ep.series_title || 'Série'}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">Sem pôster</div>
                  )}
                </div>
                <p className="mt-2 text-sm text-center text-gray-300">
                  {ep.series_title || 'Série'} - Temp {ep.season_number}, Ep {ep.episode_number}
                </p>
                <p className="text-xs text-gray-400 text-center">
                  {Math.floor(ep.time_seconds / 60)}min de {Math.floor(ep.duration_seconds / 60)}min
                </p>
                <progress className="w-full mt-1" value={ep.time_seconds} max={ep.duration_seconds} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 py-6">
        <h2 className="text-xl font-bold mb-4">🎬 Filmes em Alta</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {filmes.map(filme => (
            <div
              key={filme.id}
              className="min-w-[150px] max-w-[150px] cursor-pointer"
              onClick={() => navigate(`/app/assistir/filme/${filme.id}`)}
            >
              <div className="w-[150px] h-[225px] overflow-hidden rounded-md">
                <img
                  src={`${backendUrl}/static/${filme.poster}`}
                  alt={filme.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <p className="mt-2 text-sm text-center">{filme.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10">
        <h2 className="text-xl font-bold mb-4">📺 Séries em Destaque</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {series.map(serie => (
            <div
              key={serie.id}
              className="min-w-[150px] max-w-[150px] cursor-pointer"
              onClick={() => navigate(`/app/assistir/serie/${serie.id}`)}
            >
              <div className="w-[150px] h-[225px] overflow-hidden rounded-md bg-gray-700">
                {serie.poster ? (
                  <img
                    src={`${backendUrl}/static/${serie.poster}`}
                    alt={serie.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Sem pôster
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-center">{serie.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
