import { useNavigate } from 'react-router-dom'
import Carrossel from '@/components/Carrocel'

const PLACEHOLDER_IMAGE = '/placeholder.jpg'

type BannerItem = {
  title: string
  imagem?: string
  poster?: string
  type: 'movie' | 'series'
  movie_id?: number
  series_id?: number
  episode_id?: number
}

type BannerSliderProps = {
  banners: BannerItem[]
  tempo?: number
}

// 👇 Tipo compatível com Carrossel (incluindo onClick)
type CarrosselItem = {
  titulo: string
  imagem: string
  onClick?: () => void
}

export default function BannerSlider({ banners, tempo = 5000 }: BannerSliderProps) {
  const navigate = useNavigate()

  const itensFormatados: CarrosselItem[] = banners.map(b => ({
    titulo: b.title,
    imagem: b.imagem ?? b.poster ?? PLACEHOLDER_IMAGE,
    onClick: () => {
      if (b.type === 'movie' && b.movie_id) {
        navigate(`/app/assistir/filme/${b.movie_id}`)
      } else if (b.type === 'series' && b.series_id) {
        const url = b.episode_id
          ? `/app/assistir/${b.series_id}/${b.episode_id}`
          : `/app/assistir/serie/${b.series_id}`
        navigate(url)
      }
    }
  }))

  return (
    <div className="px-6 pt-4">
      <Carrossel itens={itensFormatados} tempo={tempo} />
    </div>
  )
}
