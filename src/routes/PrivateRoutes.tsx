import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// 🧩 Layout principal e páginas protegidas
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
import CriarSeres from '@/pages/Series/CriarSeries'
// 📺 Séries
import SeriesIndex from '@/pages/Series/SeriesIndex'
import ListarSeries from '@/pages/Series/ListarSeries'
import CriarSeries from '@/pages/Series/CriarSeries'

export default function PrivateRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="text-white text-center mt-24 text-lg font-semibold">
        ⏳ Carregando...
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" />

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 🏠 Página inicial */}
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
        

        {/* 🔁 Fallback para rotas desconhecidas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}