import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import '@videojs/themes/dist/city/index.css'

interface VideoJspPlayerProps {
  src: string
  poster?: string
  title?: string
  tempoSalvo?: number
  onTimeUpdate?: (current: number) => void
}

export default function VideoJspPlayer({
  src,
  poster,
  title,
  tempoSalvo = 0,
  onTimeUpdate
}: VideoJspPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null!)

  useEffect(() => {
    // ⚠️ Adiar para garantir que o elemento esteja no DOM
    const timeout = setTimeout(() => {
      if (!videoRef.current) return

      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        fluid: true,
        sources: [{ src, type: 'video/mp4' }],
        poster
      })

      // ▶️ Retomar tempo salvo
      player.ready(() => {
        if (typeof tempoSalvo === 'number' && tempoSalvo > 0) {
          player.currentTime(tempoSalvo)
        }
      })

      // ⏱️ Atualizar tempo assistido
      const handleTimeUpdate = () => {
        const current = player.currentTime()
        if (typeof current === 'number') {
          onTimeUpdate?.(current)
        }
      }

      player.on('timeupdate', handleTimeUpdate)

      // 🧹 Cleanup
      return () => {
        player.off('timeupdate', handleTimeUpdate)
        player.dispose()
      }
    }, 0)

    // Limpar timeout se desmontar antes
    return () => clearTimeout(timeout)
  }, [src, poster, tempoSalvo, onTimeUpdate])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-theme-city rounded-xl shadow-lg"
        />
      </div>

      {title && (
        <h2 className="mt-4 text-center text-white text-xl font-bold">{title}</h2>
      )}
    </div>
  )
}
