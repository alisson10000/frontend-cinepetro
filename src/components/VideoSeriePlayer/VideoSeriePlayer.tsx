import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'


interface Props {
  src: string
  tempoSalvo?: number
  onTimeUpdate?: (tempo: number) => void
  title?: string
  videoId?: string | number
  onNextEpisode?: () => void
  subtitleSrc?: string
  posterSrc?: string
  resumoTemporada?: string
  proximoTitulo?: string
  proximoThumbnail?: string
}

export default function VideoSeriePlayer({
  src,
  tempoSalvo = 0,
  onTimeUpdate,
  title,
  videoId,
  onNextEpisode,
  subtitleSrc,
  posterSrc,
  resumoTemporada,
  proximoTitulo,
  proximoThumbnail
}: Props) {
  const playerRef = useRef<ReactPlayer | null>(null)
  const [currentTime, setCurrentTime] = useState(tempoSalvo)
  const [isEnded, setIsEnded] = useState(false)

  const handleProgress = (progress: { playedSeconds: number }) => {
    const tempo = Math.floor(progress.playedSeconds)
    setCurrentTime(tempo)
    if (onTimeUpdate) onTimeUpdate(tempo)
  }

  const handleEnded = () => {
    setIsEnded(true)
    if (onNextEpisode) onNextEpisode()
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="relative">
        <ReactPlayer
          ref={playerRef}
          url={src}
          playing
          controls
          width="100%"
          height="auto"
          config={{
            file: {
              attributes: {
                crossOrigin: 'anonymous',
              },
              tracks: subtitleSrc
                ? [
                    {
                      kind: 'subtitles',
                      src: subtitleSrc,
                      srcLang: 'pt',
                      label: 'Português',
                      default: true,
                    },
                  ]
                : [],
            },
          }}
          onProgress={handleProgress}
          onEnded={handleEnded}
        />

        {posterSrc && (
          <img
            src={posterSrc}
            alt="Poster da série"
            className="absolute top-0 left-0 w-full h-full object-cover opacity-10"
          />
        )}
      </div>

      {resumoTemporada && (
        <div className="mt-4 p-2 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-1">Resumo da Temporada</h2>
          <p className="text-sm text-gray-300">{resumoTemporada}</p>
        </div>
      )}

      {isEnded && onNextEpisode && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-bold mb-2">🎬 Próximo Episódio:</h3>
          {proximoThumbnail && (
            <img
              src={proximoThumbnail}
              alt="Próximo episódio"
              className="w-40 h-auto mx-auto rounded shadow"
            />
          )}
          <p className="text-lg mt-2">{proximoTitulo || 'Episódio seguinte'}</p>
          <button
            onClick={onNextEpisode}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Assistir agora ▶️
          </button>
        </div>
      )}
    </div>
  )
}
