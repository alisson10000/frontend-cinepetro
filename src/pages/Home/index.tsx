import { useEffect, useState } from 'react'
import bannerImage from '@/assets/banner-aquaman.jpg'

import spidermanImage from '@/assets/spiderman.jpg'
import moneyHeistImage from '@/assets/moneyheist.jpg'
import daredevilImage from '@/assets/daredevil.jpg'
import squidGameImage from '@/assets/squidgame.jpg'
import strangerThingsImage from '@/assets/strangerthings.jpg'
import deadpoolImage from '@/assets/deadpool.jpg'

const mockFilmes = [
  { title: 'Spider-Man', image: spidermanImage },
  { title: 'Money Heist', image: moneyHeistImage },
  { title: 'Daredevil', image: daredevilImage },
  { title: 'Squid Game', image: squidGameImage },
  { title: 'Stranger Things', image: strangerThingsImage },
  { title: 'Deadpool', image: deadpoolImage },
]

export default function Home() {
  const [usuario, setUsuario] = useState<{ nome: string; email: string } | null>(null)

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      try {
        const user = JSON.parse(userString)
        setUsuario(user)
      } catch (err) {
        console.error('❌ Erro ao ler usuário do localStorage', err)
      }
    }
  }, [])

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Nome do usuário logado */}
      {usuario && (
        <div className="px-6 pt-20">
          <p className="text-sm text-gray-400">
            Bem-vindo, <span className="text-yellow-400 font-semibold">{usuario.nome}</span>
          </p>
        </div>
      )}

      {/* Banner principal */}
      <section
        className="w-full h-[450px] bg-cover bg-center flex items-end px-6 pb-16 mt-4"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <h1 className="text-4xl font-extrabold drop-shadow-md">AQUAMAN</h1>
      </section>

      {/* Lista de filmes */}
      <section className="px-6 py-6">
        <h2 className="text-xl font-bold mb-4">🔥 Trending now</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {mockFilmes.map((filme, index) => (
            <div key={index} className="min-w-[150px] max-w-[150px]">
              <div className="w-[150px] h-[225px] overflow-hidden rounded-md">
                <img
                  src={filme.image}
                  alt={filme.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <p className="mt-2 text-sm text-center">{filme.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
