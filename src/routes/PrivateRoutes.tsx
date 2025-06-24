import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// 🧩 Layout principal e página inicial
import Layout from '@/components/Layout'
import Home from '@/pages/Home'

// 🎬 Filmes
import FilmesIndex from '@/pages/Filmes/FilmesIndex'
import ListarFilmes from '@/pages/Filmes/ListarFilmes'
import CriarFilmes from '@/pages/Filmes/CriarFilmes'
import SelecionarFilmeEditar from '@/pages/Filmes/SelecionarFilmeEditar'
import EditarFilme from '@/pages/Filmes/EditarFilme'
import SelecionarFilmeExcluir from '@/pages/Filmes/SelecionarFilmeExcluir'
import ExcluirFilme from '@/pages/Filmes/ExcluirFilme'

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

// Assistir Filmes

import AssistirFilme from '@/pages/AssistirFilmes/AssistirFilme'


//Assistir series
import SelecionarEpisodio from '@/pages/AssistirSerie/SelecionarEpisodio'
import AssistirEpisodio from '@/pages/AssistirSerie/AssistirEpisodio'

export default function PrivateRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // 🔐 Verifica se o token existe
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="text-white text-center mt-24 text-lg font-semibold">
        ⏳ Verificando autenticação...
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" />

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 🏠 Página Inicial */}
        <Route path="/" element={<Home />} />

        {/* 🎬 Rotas de Filmes */}
        <Route path="/filmes" element={<FilmesIndex />} />
        <Route path="/filmes/listar" element={<ListarFilmes />} />
        <Route path="/filmes/criar" element={<CriarFilmes />} />
        <Route path="/filmes/selecionar-editar" element={<SelecionarFilmeEditar />} />
        <Route path="/filmes/editar/:id" element={<EditarFilme />} />
        <Route path="/filmes/selecionar-excluir" element={<SelecionarFilmeExcluir />} />
        <Route path="/filmes/excluir/:id" element={<ExcluirFilme />} />

        {/* 📺 Rotas de Séries */}
        <Route path="/series" element={<SeriesIndex />} />
        <Route path="/series/listar" element={<ListarSeries />} />
        <Route path="/series/criar" element={<CriarSeries />} />
        <Route path="/series/selecionar-editar" element={<SelecionarSerieEditar />} />
        <Route path="/series/editar/:id" element={<EditarSeries />} />
        <Route path="/series/selecionar-excluir" element={<SelecionarSerieExcluir />} />
        <Route path="/series/excluir/:id" element={<ExcluirSerie />} />

        {/* 🎞️ Rotas de Episódios */}
        <Route path="/episodios" element={<EpisodesIndex />} />
        <Route path="/episodios/listar" element={<ListarEpisodios />} />
        <Route path="/episodios/criar" element={<CriarEpisodios />} />
        <Route path="/episodios/selecionar-editar" element={<SelecionarEpisodioEditar />} />
        <Route path="/episodios/editar/:id" element={<EditarEpisodio />} />
        <Route path='/episodios/selecionar-excluir' element={<SelecionarEpisodioExcluir />} />
        <Route path='/episodios/excluir/:id' element={<ExcluirEpisodio />} />
        {/* 🚫 Fallback para rota não encontrada */}
        <Route path="*" element={<Navigate to="/" />} />


        {/* Assistir filmes */}
        <Route path="assistir/filme/:id" element={<AssistirFilme />} />

        {/*Assistir serie*/}
        <Route path="assistir/serie/:serieId" element={<SelecionarEpisodio />} />
        <Route path="/assistir/:serieId/:episodioId" element={<AssistirEpisodio />} />

      </Route>
    </Routes>
  )
}
