import { Sidebar } from './sidebar'
import { Header } from './header'
import { useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface AppLayoutProps {
  children: ReactNode
}

// Derive title from current path
function getPageInfo(pathname: string): { title: string; breadcrumbs: { label: string; to?: string }[] } {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: { label: string; to?: string }[] = [{ label: 'Galaxy Fleet', to: '/' }]

  const labels: Record<string, string> = {
    vehicles: 'Fahrzeugliste',
    inventory: 'Inventur',
    handovers: 'Übergaben',
    workshop: 'Werkstatt',
    accidents: 'Unfälle',
    offenses: 'Verkehrsverstöße',
    milkyway: 'MilkyWay',
    admin: 'Admin',
    settings: 'Einstellungen',
    logs: 'Änderungslogs',
    search: 'Suche',
    daily: 'Daily',
    wow: 'WOW',
    ageing: 'Ageing Tours',
    dashboard: 'Dashboard',
  }

  let path = ''
  for (const seg of segments) {
    path += `/${seg}`
    const label = labels[seg] ?? seg.toUpperCase()
    breadcrumbs.push({ label, to: path })
  }

  const title = breadcrumbs[breadcrumbs.length - 1]?.label ?? 'Galaxy Fleet'
  return { title, breadcrumbs: breadcrumbs.slice(1) }
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const { breadcrumbs } = getPageInfo(location.pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
