import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Layout e página inicial
import Layout from '@/components/Layout'
import Home from '@/pages/Home'

// 🎬 Filmes
import FilmesIndex from '@/pages/Filmes/FilmesIndex'
import ListarFilmes from '@/pages/Filmes/ListarFilmes'
import CriarFilmes from '@/pages/Filmes/CriarFilmes'
import SelecionarFilmeEditar from '@/pages/Filmes/SelecionarFilmeEditar'
import EditarFilme from '@/pages/Filmes/EditarFilme'
import SelecionarFilmeExcluir from '@/pages/Filmes/SelecionarFilmeExcluir'
import ExcluirFilme from '@/pages/Filmes/ExcluiasdfasdfrFilme'

// 📺 Séries
import SeriesIndex from '@/pages/Series/SeriesIndex'
import ListarSeries from '@/pages/Series/ListarSeries'
import CriarSeries from '@/pages/Series/CriarSeries'
import SelecionarSerieEditar from '@/pages/Series/SelecionarSerieEditar'
import EditarSeries from '@/pages/Series/EditarSerie'
import SelecionarSerieExcluir from '@/pages/Series/SelecionarSerieExcluir'
import ExcluirSerie from '@/pages/Series/ExcluirSerie'

// 🎞️ Episódios
import EpisodesIndex from '@/pages/episodes/EpisodesIndex'
import ListarEpisodios from '@/pages/episodes/ListarEpisodes'
import CriarEpisodios from '@/pages/episodes/CriarEpisodes'
import SelecionarEpisodioEditar from '@/pages/episodes/SelecionarEpisodesEditar'
import EditarEpisodio from '@/pages/episodes/EditarEpisodes'
import SelecionarEpisodioExcluir from '@/pages/episodes/SelecionarEpisodesExcluir'
import ExcluirEpisodio from '@/pages/episodes/ExcluirEpisodes'

// 🎥 Assistir conteúdo
import AssistirFilme from '@/pages/AssistirFilmes/AssistirFilme'
import SelecionarEpisodio from '@/pages/AssistirSerie/SelecionarEpisodio'
import AssistirEpisodio from '@/pages/AssistirSerie/AssistirEpisodio'

export default function PrivateRoutes() {
  const [refresh, setRefresh] = useState(0)

  const token = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('is_admin') === 'true'
  const isAuthenticated = !!token

  useEffect(() => {
    const handler = () => setRefresh((v) => v + 1)
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Página inicial - disponível para todos */}
        <Route path="/" element={<Home />} />
        {isAdmin && <Route path="admin" element={<Home />} />}

        {/* Rotas públicas de assistir - todos podem acessar */}
        <Route path="assistir/filme/:id" element={<AssistirFilme />} />
        <Route path="assistir/serie/:serieId" element={<SelecionarEpisodio />} />
        <Route path="assistir/:serieId/:episodioId" element={<AssistirEpisodio />} />

        {/* Área administrativa - somente admin */}
        {isAdmin && (
          <>
            {/* Filmes */}
            <Route path="filmes" element={<FilmesIndex />} />
            <Route path="filmes/listar" element={<ListarFilmes />} />
            <Route path="filmes/criar" element={<CriarFilmes />} />
            <Route path="filmes/selecionar-editar" element={<SelecionarFilmeEditar />} />
            <Route path="filmes/editar/:id" element={<EditarFilme />} />
            <Route path="filmes/selecionar-excluir" element={<SelecionarFilmeExcluir />} />
            <Route path="filmes/excluir/:id" element={<ExcluirFilme />} />

            {/* Séries */}
            <Route path="series" element={<SeriesIndex />} />
            <Route path="series/listar" element={<ListarSeries />} />
            <Route path="series/criar" element={<CriarSeries />} />
            <Route path="series/selecionar-editar" element={<SelecionarSerieEditar />} />
            <Route path="series/editar/:id" element={<EditarSeries />} />
            <Route path="series/selecionar-excluir" element={<SelecionarSerieExcluir />} />
            <Route path="series/excluir/:id" element={<ExcluirSerie />} />

            {/* Episódios */}
            <Route path="episodios" element={<EpisodesIndex />} />
            <Route path="episodios/listar" element={<ListarEpisodios />} />
            <Route path="episodios/criar" element={<CriarEpisodios />} />
            <Route path="episodios/selecionar-editar" element={<SelecionarEpisodioEditar />} />
            <Route path="episodios/editar/:id" element={<EditarEpisodio />} />
            <Route path="episodios/selecionar-excluir" element={<SelecionarEpisodioExcluir />} />
            <Route path="episodios/excluir/:id" element={<ExcluirEpisodio />} />
          </>
        )}

        {/* Fallback: redireciona para home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}
