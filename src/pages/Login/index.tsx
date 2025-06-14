import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '@/assets/bg-cinepetro.png'
import logo from '@/assets/cinepetro-icon.png'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      })

      const data = await response.json()
      console.log('🔐 Resposta do backend:', data)

      if (!response.ok || !data.access_token) {
        throw new Error(data.detail || 'Credenciais inválidas')
      }

      // Salvar token e dados do usuário
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user_id', String(data.user_id))
      localStorage.setItem('is_admin', String(data.is_admin))

      // Salvar nome e email no localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          nome: data.name || 'Usuário',
          email: data.email,
        })
      )

      navigate('/app')
    } catch (err: any) {
      console.error('❌ Erro no login:', err)
      setErro(err.message || 'Erro ao tentar logar')
    }
  }

  return (
    <div
      className="min-h-screen w-screen bg-black bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#00000080] to-[#E5091460] z-0" />

      <div className="relative z-10 w-full max-w-sm bg-[#111111cc] backdrop-blur-sm p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="flex items-center justify-center gap-2">
          <img
            src={logo}
            alt="Logo CinePetro"
            className="h-[64px] w-[64px] object-contain"
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

          {erro && (
            <div className="text-red-500 text-sm text-center">{erro}</div>
          )}

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
