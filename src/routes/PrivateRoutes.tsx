import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// 🧩 Layout principal e páginas protegidas
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import FilmesIndex from '@/pages/Filmes/FilmesIndex'
import ListarFilmes from '@/pages/Filmes/ListarFilmes'
import CriarFilmes from '@/pages/Filmes/CriarFilmes'
import SelecionarFilmeEditar from '@/pages/Filmes/SelecionarFilmeEditar'
import EditarFilme from '@/pages/Filmes/EditarFilme'
import ExcluirFilme from '@/pages/Filmes/ExcluirFilme' // ✅ Importação da nova página
import SelecionarFilmeExcluir from '@/pages/Filmes/SelecionarFilmeExcluir'
export default function PrivateRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // 🔐 Verifica autenticação ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  // ⏳ Exibe carregando temporário enquanto checa token
  if (isAuthenticated === null) {
    return (
      <div className="text-white text-center mt-24 text-lg font-semibold">
        ⏳ Carregando...
      </div>
    )
  }

  // 🔐 Redireciona para login se não autenticado
  if (!isAuthenticated) return <Navigate to="/login" />

  // ✅ Rotas protegidas para usuários autenticados
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 🏠 Página inicial */}
        <Route path="/" element={<Home />} />

        {/* 🎬 Filmes */}
        <Route path="/filmes" element={<FilmesIndex />} />
        <Route path="/filmes/listar" element={<ListarFilmes />} />
        <Route path="/filmes/criar" element={<CriarFilmes />} />
        <Route path="/filmes/selecionar-editar" element={<SelecionarFilmeEditar />} />
        <Route path="/filmes/editar/:id" element={<EditarFilme />} />
        <Route path="/filmes/selecionar-excluir" element={<SelecionarFilmeExcluir />} />
        <Route path="/filmes/excluir/:id" element={<ExcluirFilme />} /> {/* ✅ Nova rota */}

        {/* 🔁 Qualquer rota desconhecida volta para home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}
