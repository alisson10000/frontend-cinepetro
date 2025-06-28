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
  videoId?: string
}

export default function VideoJspPlayer({
  src,
  poster,
  title,
  tempoSalvo = 0,
  onTimeUpdate,
  videoId
}: VideoJspPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null!)
  const ultimoTempoSalvo = useRef<number>(0)
  const skipNextUpdate = useRef<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoRef.current) return

      let player = videojs.getPlayer(videoRef.current)

      if (!player) {
        player = videojs(videoRef.current, {
          controls: true,
          autoplay: true,
          preload: 'auto',
          fluid: true,
          sources: [{ src, type: 'video/mp4' }],
          poster
        })
      }

      // ⏮️ Retomar tempo salvo
      player.on('loadedmetadata', () => {
        if (typeof tempoSalvo === 'number' && tempoSalvo > 0) {
          player.currentTime(tempoSalvo)
          skipNextUpdate.current = true
          console.log(`⏮️ Restaurando tempo para ${tempoSalvo}s`)
        }
      })

      const handleTimeUpdate = () => {
        if (skipNextUpdate.current) {
          skipNextUpdate.current = false
          return
        }

        const currentTime = player.currentTime()
        if (typeof currentTime === 'number') {
          const current = Math.floor(currentTime)
          if (current - ultimoTempoSalvo.current >= 5) {
            ultimoTempoSalvo.current = current
            onTimeUpdate?.(current)
          }
        }
      }

      player.on('timeupdate', handleTimeUpdate)

      return () => {
        player.off('timeupdate', handleTimeUpdate)
        player.dispose()
      }
    }, 0)

    return () => clearTimeout(timeout)
  }, [src, poster, tempoSalvo, onTimeUpdate, videoId])

  const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-theme-city rounded-xl shadow-lg"
          controls
          crossOrigin="anonymous"
        >
          {videoId && (
            <track
              kind="subtitles"
              label="Português"
              srcLang="pt"
              src={`${backendUrl}/static/subtitles/${videoId}.vtt`}
              default
            />
          )}
        </video>
      </div>

      {title && (
        <h2 className="mt-4 text-center text-white text-xl font-bold">{title}</h2>
      )}
    </div>
  )
}
