import { useState } from 'react'
import { FiMenu, FiX, FiSearch } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import logo from '@/assets/cinepetro-icon.png'

export default function Menu() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const isAdmin = localStorage.getItem('is_admin') === 'true'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('is_admin')
    localStorage.removeItem('user_id')
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-90 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Nome */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="CinePetro" className="h-10 w-10 object-contain" />
            <span className="text-white text-xl font-extrabold">CINEPETRO</span>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex gap-6 ml-6">
            <Link to="/app/" className="text-white hover:text-yellow-400 transition">Home</Link>
            {isAdmin && (
              <>
                <Link to="/app/filmes" className="text-white hover:text-yellow-400 transition">Gerenciar Filmes</Link>
                <Link to="/app/series" className="text-white hover:text-yellow-400 transition">Gerenciar Séries</Link>
                <Link to="/app/episodios" className="text-white hover:text-yellow-400 transition">Gerenciar Episódios</Link>
              </>
            )}
          </nav>

          {/* Ações Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <FiSearch className="text-white text-xl cursor-pointer" />
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition"
            >
              Sair
            </button>
          </div>

          {/* Botão Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-black bg-opacity-95 px-4 pt-2 pb-4 space-y-2">
          <Link to="/app/" className="block text-white hover:text-yellow-400" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          {isAdmin && (
            <>
              <Link to="/app/filmes" className="block text-white hover:text-yellow-400" onClick={() => setIsOpen(false)}>
                Gerenciar Filmes
              </Link>
              <Link to="/app/series" className="block text-white hover:text-yellow-400" onClick={() => setIsOpen(false)}>
                Gerenciar Séries
              </Link>
              <Link to="/app/episodios" className="block text-white hover:text-yellow-400" onClick={() => setIsOpen(false)}>
                Gerenciar Episódios
              </Link>
            </>
          )}

          {/* Ações Mobile */}
          <div className="flex justify-between items-center pt-4">
            <FiSearch className="text-white text-xl" />
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
