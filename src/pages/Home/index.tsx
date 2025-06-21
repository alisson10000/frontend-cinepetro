import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Carrossel from '@/components/Carrocel/index'

import bannerAquaman from '@/assets/banner-aquaman.jpg'
import bannerSpiderman from '@/assets/spiderman.jpg'
import bannerDeadpoll from '@/assets/deadpool.jpg'

export default function Home() {
  const [usuario, setUsuario] = useState<{ nome: string; email: string } | null>(null)
  const [filmes, setFilmes] = useState<any[]>([])
  const [series, setSeries] = useState<any[]>([])
  const [progresso, setProgresso] = useState<any | null>(null)

  const navigate = useNavigate()

  const banners = [
    { titulo: 'Aquaman', imagem: bannerAquaman },
    { titulo: 'Spider-Man', imagem: bannerSpiderman },
    { titulo: 'Deadpool', imagem: bannerDeadpoll }
  ]

  useEffect(() => {
    const userString = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (userString) {
      try {
        const user = JSON.parse(userString)
        setUsuario(user)
      } catch (err) {
        console.error('❌ Erro ao ler usuário do localStorage', err)
      }
    }

    if (!token) return

    const buscarFilmes = async () => {
      try {
        const res = await fetch('http://localhost:8000/movies/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setFilmes(data)
        }
      } catch (err) {
        console.error('❌ Erro ao carregar filmes', err)
      }
    }

    const buscarSeries = async () => {
      try {
        const res = await fetch('http://localhost:8000/series/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setSeries(data)
        }
      } catch (err) {
        console.error('❌ Erro ao carregar séries', err)
      }
    }

    const buscarProgresso = async () => {
      try {
        const res = await fetch('http://localhost:8000/progress/get', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setProgresso(data)
        }
      } catch (err) {
        console.error('❌ Erro ao buscar progresso', err)
      }
    }

    buscarFilmes()
    buscarSeries()
    buscarProgresso()
  }, [])

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
        <Carrossel itens={banners} tempo={5000} />
      </section>

      {/* ▶️ Continuar assistindo */}
      {progresso && (
        <section className="px-6 pt-6">
          <h2 className="text-xl font-bold mb-4">▶️ Continuar assistindo</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            <div
              className="min-w-[150px] max-w-[150px] cursor-pointer"
              onClick={() =>
                progresso.movie_id
                  ? navigate(`/app/assistir/filme/${progresso.movie_id}`)
                  : navigate(`/app/assistir/episodio/${progresso.episode_id}`)
              }
            >
              <div className="w-[150px] h-[225px] overflow-hidden rounded-md bg-gray-700">
                <img
                  src={`http://localhost:8000/static/${progresso.movie?.poster || progresso.episode?.poster}`}
                  alt={progresso.movie?.title || progresso.episode?.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <p className="mt-2 text-sm text-center">
                {progresso.movie?.title || progresso.episode?.title} <br />
                <span className="text-gray-400 text-xs">
                  {Math.floor(progresso.time_seconds / 60)} min assistidos
                </span>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 🎬 Filmes em Alta */}
      <section className="px-6 py-6">
        <h2 className="text-xl font-bold mb-4">🎬 Filmes em Alta</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {filmes.map((filme) => (
            <div
              key={filme.id}
              className="min-w-[150px] max-w-[150px] cursor-pointer"
              onClick={() => navigate(`/app/assistir/filme/${filme.id}`)}
            >
              <div className="w-[150px] h-[225px] overflow-hidden rounded-md">
                <img
                  src={`http://localhost:8000/static/${filme.poster}`}
                  alt={filme.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <p className="mt-2 text-sm text-center">{filme.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📺 Séries em Destaque */}
      <section className="px-6 pb-10">
        <h2 className="text-xl font-bold mb-4">📺 Séries em Destaque</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {series.map((serie) => (
            <div
              key={serie.id}
              className="min-w-[150px] max-w-[150px] cursor-pointer"
              onClick={() => navigate(`/app/assistir/serie/${serie.id}`)}
            >
              <div className="w-[150px] h-[225px] overflow-hidden rounded-md bg-gray-700">
                {serie.poster ? (
                  <img
                    src={`http://localhost:8000/static/${serie.poster}`}
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
