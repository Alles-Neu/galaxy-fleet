import { cn } from '@/lib/utils'
import {
  Car,
  ClipboardList,
  ArrowLeftRight,
  Wrench,
  AlertTriangle,
  FileWarning,
  Search,
  Settings,
  History,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Star,
  MapPin,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

interface NavItem {
  label: string
  to?: string
  icon?: React.ReactNode
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    label: 'Venus – Flottenmanagement',
    children: [
      { label: 'Fahrzeugliste', to: '/vehicles', icon: <Car size={16} /> },
      { label: 'Inventur', to: '/inventory', icon: <ClipboardList size={16} /> },
      { label: 'Übergabe', to: '/handovers', icon: <ArrowLeftRight size={16} /> },
      { label: 'Service/Werkstatt', to: '/workshop', icon: <Wrench size={16} /> },
      { label: 'Unfälle', to: '/accidents', icon: <AlertTriangle size={16} /> },
      { label: 'Verkehrsverstöße', to: '/offenses', icon: <FileWarning size={16} /> },
    ],
  },
  {
    label: 'MilkyWay',
    children: [
      {
        label: 'EuRide',
        children: [
          {
            label: 'AMZL',
            children: [
              {
                label: 'DBW8-Messkirchen',
                children: [
                  { label: 'Daily', to: '/milkyway/DBW8/daily', icon: <MapPin size={14} /> },
                  { label: 'WOW', to: '/milkyway/DBW8/wow', icon: <Star size={14} /> },
                  { label: 'Ageing Tours', to: '/milkyway/DBW8/ageing', icon: <History size={14} /> },
                ],
              },
              {
                label: 'DHB1-Bremen',
                children: [
                  { label: 'Daily', to: '/milkyway/DHB1/daily', icon: <MapPin size={14} /> },
                  { label: 'WOW', to: '/milkyway/DHB1/wow', icon: <Star size={14} /> },
                  { label: 'Ageing Tours', to: '/milkyway/DHB1/ageing', icon: <History size={14} /> },
                ],
              },
              {
                label: 'DHH1-Hamburg',
                children: [
                  { label: 'Daily', to: '/milkyway/DHH1/daily', icon: <MapPin size={14} /> },
                  { label: 'WOW', to: '/milkyway/DHH1/wow', icon: <Star size={14} /> },
                  { label: 'Ageing Tours', to: '/milkyway/DHH1/ageing', icon: <History size={14} /> },
                ],
              },
              {
                label: 'DSH4-Borgstedt',
                children: [
                  { label: 'Daily', to: '/milkyway/DSH4/daily', icon: <MapPin size={14} /> },
                  { label: 'WOW', to: '/milkyway/DSH4/wow', icon: <Star size={14} /> },
                  { label: 'Ageing Tours', to: '/milkyway/DSH4/ageing', icon: <History size={14} /> },
                ],
              },
              {
                label: 'MUC1-Garching',
                children: [
                  { label: 'Daily', to: '/milkyway/MUC1/daily', icon: <MapPin size={14} /> },
                  { label: 'WOW', to: '/milkyway/MUC1/wow', icon: <Star size={14} /> },
                  { label: 'Ageing Tours', to: '/milkyway/MUC1/ageing', icon: <History size={14} /> },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'GLS',
        children: [
          {
            label: 'GLS25-Hamburg',
            children: [
              { label: 'Daily', to: '/milkyway/GLS25/daily', icon: <MapPin size={14} /> },
              { label: 'WOW', to: '/milkyway/GLS25/wow', icon: <Star size={14} /> },
              { label: 'Ageing Tours', to: '/milkyway/GLS25/ageing', icon: <History size={14} /> },
            ],
          },
        ],
      },
      {
        label: 'DPD',
        children: [
          {
            label: 'DPDHamburg',
            children: [
              { label: 'Daily', to: '/milkyway/DPD/daily', icon: <MapPin size={14} /> },
              { label: 'WOW', to: '/milkyway/DPD/wow', icon: <Star size={14} /> },
              { label: 'Ageing Tours', to: '/milkyway/DPD/ageing', icon: <History size={14} /> },
            ],
          },
        ],
      },
      { label: 'MilkyWay Suche', to: '/milkyway/search', icon: <Search size={16} /> },
    ],
  },
  {
    label: 'Admin',
    children: [
      { label: 'Einstellungen', to: '/admin/settings', icon: <Settings size={16} /> },
      { label: 'Änderungslogs', to: '/admin/logs', icon: <History size={16} /> },
    ],
  },
]

interface NavItemProps {
  item: NavItem
  depth?: number
  collapsed?: boolean
}

function NavItemComponent({ item, depth = 0, collapsed }: NavItemProps) {
  const location = useLocation()
  const [open, setOpen] = useState(() => {
    if (!item.children) return false
    function hasActive(items: NavItem[]): boolean {
      return items.some((i) => {
        if (i.to && location.pathname.startsWith(i.to)) return true
        if (i.children) return hasActive(i.children)
        return false
      })
    }
    return hasActive(item.children)
  })

  if (item.to) {
    return (
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors group',
            depth === 0 ? 'ml-0' : `ml-${Math.min(depth * 3, 9)}`,
            isActive
              ? 'bg-amber-500/20 text-amber-400 font-medium'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5',
            collapsed && depth === 0 && 'justify-center px-2',
          )
        }
        title={collapsed ? item.label : undefined}
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        {(!collapsed || depth > 0) && <span className="truncate">{item.label}</span>}
      </NavLink>
    )
  }

  if (item.children) {
    if (collapsed && depth === 0) {
      return (
        <div className="px-1">
          <div className="text-xs text-gray-600 px-2 py-1 mt-2 mb-1 font-semibold uppercase tracking-wider truncate">
            —
          </div>
          {item.children.map((child, i) => (
            <NavItemComponent key={i} item={child} depth={depth + 1} collapsed={collapsed} />
          ))}
        </div>
      )
    }

    return (
      <div>
        {depth === 0 ? (
          <div className="px-3 py-1 mt-3 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{item.label}</span>
          </div>
        ) : (
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              `ml-${Math.min((depth - 1) * 3, 9)}`,
              'text-gray-400 hover:text-gray-200 hover:bg-white/5',
            )}
          >
            <span className="flex-1 text-left truncate">{item.label}</span>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        {(depth === 0 || open) && (
          <div className={depth > 0 ? 'ml-2' : ''}>
            {item.children.map((child, i) => (
              <NavItemComponent key={i} item={child} depth={depth + 1} collapsed={collapsed} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-[#1a1c23] border-r border-[#2a2d3a] transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2d3a]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">
              G
            </div>
            <span className="text-white font-bold text-lg leading-none">Galaxy Fleet</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm mx-auto">
            G
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn('text-gray-400 hover:text-gray-200 p-1 rounded', collapsed && 'mx-auto')}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700">
        {navigation.map((item, i) => (
          <NavItemComponent key={i} item={item} depth={0} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-[#2a2d3a] text-xs text-gray-600">
          Galaxy Fleet v1.0
        </div>
      )}
    </aside>
  )
}
