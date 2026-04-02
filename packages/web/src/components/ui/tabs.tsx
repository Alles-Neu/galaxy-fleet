import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  const active = tabs.find((t) => t.id === activeTab)

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{active?.content}</div>
    </div>
  )
}
