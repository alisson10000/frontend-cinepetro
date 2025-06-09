import { useState } from 'react'
import backgroundImage from '@/assets/bg-cinepetro.png'
import logo from '@/assets/cinepetro-icon.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, senha })
  }

  return (
    <div
      className="min-h-screen w-screen bg-black bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay vermelho escuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00000080] to-[#E5091460] z-0" />

      {/* Caixa de login */}
      <div className="relative z-10 w-full max-w-sm bg-[#111111cc] backdrop-blur-sm p-8 rounded-2xl shadow-2xl space-y-6">
        {/* Logo CinePetro com alinhamento perfeito */}
        <div className="flex items-center justify-center gap-2">
          <img
            src={logo}
            alt="Logo CinePetro"
            className="h-[64px] w-[64px] object-contain" // mesmo tamanho da fonte
          />
          <h1 className="text-[32px] font-extrabold text-white leading-[1]">
            CINEPETRO
          </h1>
        </div>

        <h2 className="text-xl font-bold text-center text-white">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 rounded bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
            required
          />
          <button
            type="submit"
            className="w-full p-3 rounded bg-[#E50914] hover:bg-red-700 font-semibold transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Novo por aqui?{' '}
          <a href="#" className="text-white underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  )
}
