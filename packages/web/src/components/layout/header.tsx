import { cn } from '@/lib/utils'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title?: string
  breadcrumbs?: { label: string; to?: string }[]
  className?: string
}

export function Header({ title, breadcrumbs, className }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const username = localStorage.getItem('username') ?? 'Admin'

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <header className={cn('bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300">/</span>}
                {crumb.to ? (
                  <button
                    onClick={() => navigate(crumb.to!)}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-gray-700 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
        >
          <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{username}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={15} />
                Einstellungen
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={15} />
                Abmelden
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
