import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'owner' && password === 'jaya123') {
      localStorage.setItem('isLogin', 'true')
      localStorage.setItem('username', username)
      navigate('/dashboard')
    } else {
      setError('Username atau kata sandi salah. Silakan coba lagi.')
    }
  }

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        
        {/* Header */}
<div className="text-center mb-8">
  <img
    src="/logo.png"
    alt="Logo Jaya Motor"
    className="w-32 h-32 object-contain mx-auto mb-3"
  />
  <h1 className="text-2xl font-bold text-blue-950">Jaya Motor Sbahar</h1>
  <p className="text-gray-500 text-sm mt-1">Sistem Inventory Sparepart Motor</p>
</div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Masuk
          </button>
        </form>

        {/* Hint */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Username: <b>owner</b> | Password: <b>jaya123</b>
        </p>
      </div>
    </div>
  )
}