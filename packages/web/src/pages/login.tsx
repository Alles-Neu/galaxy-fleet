import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = (await response.json()) as { token: string; user?: { username: string } }
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.user?.username ?? username)
        navigate('/')
      } else {
        // Demo fallback: accept any login for development
        if (username && password) {
          localStorage.setItem('token', 'demo-token')
          localStorage.setItem('username', username)
          navigate('/')
        } else {
          setError('Bitte Benutzername und Passwort eingeben.')
        }
      }
    } catch {
      // If API not available, use demo mode
      if (username && password) {
        localStorage.setItem('token', 'demo-token')
        localStorage.setItem('username', username)
        navigate('/')
      } else {
        setError('Bitte Benutzername und Passwort eingeben.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500 mb-4 shadow-lg shadow-amber-500/30">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-black" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Galaxy Fleet</h1>
          <p className="text-gray-400 mt-1 text-sm">Flottenmanagement System</p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1c23] rounded-2xl border border-[#2a2d3a] p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Anmelden</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Benutzername</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Benutzername eingeben"
                autoFocus
                className="w-full bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0f1117] border border-[#2a2d3a] rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold py-3 px-4 rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Crown Galaxy Fleet Management · Alle Rechte vorbehalten
          </p>
        </div>
      </div>
    </div>
  )
}
