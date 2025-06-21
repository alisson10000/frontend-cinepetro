import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type CarrosselItem = {
  titulo: string
  imagem: string
}

interface CarrosselProps {
  itens: CarrosselItem[]
  tempo?: number
}

export default function Carrossel({ itens, tempo = 5000 }: CarrosselProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % itens.length)
    }, tempo)
    return () => clearInterval(interval)
  }, [itens.length, tempo])

  const anterior = () => setIndex((prev) => (prev - 1 + itens.length) % itens.length)
  const proximo = () => setIndex((prev) => (prev + 1) % itens.length)

  return (
    <div className="relative w-full h-[450px] overflow-hidden bg-black">
      {/* Slides container: cada slide ocupa 100% da largura do carrossel */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${index * 100}%)`
        }}
      >
        {itens.map((item, i) => (
          <div
            key={i}
            className="w-full h-[450px] flex-shrink-0 flex items-center justify-center relative"
          >
            <img
              src={item.imagem}
              alt={item.titulo}
              className="max-h-full max-w-full object-contain mx-auto"
            />
            <div className="absolute bottom-8 left-6 bg-black/50 px-4 py-2 rounded-lg text-white">
              <h1 className="text-3xl font-bold">{item.titulo}</h1>
            </div>
          </div>
        ))}
      </div>

      {/* Botões modernos */}
      <button
        onClick={anterior}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={proximo}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition"
      >
        <ChevronRight size={28} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {itens.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
