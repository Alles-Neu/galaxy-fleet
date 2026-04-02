import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KpiCardProps {
  icon?: ReactNode
  label: string
  value: string | number
  trend?: { value: number; label?: string }
  color?: 'amber' | 'blue' | 'green' | 'red' | 'purple'
  className?: string
  onClick?: () => void
}

const colorStyles: Record<string, { icon: string; bg: string }> = {
  amber: { icon: 'text-amber-500', bg: 'bg-amber-50' },
  blue: { icon: 'text-blue-500', bg: 'bg-blue-50' },
  green: { icon: 'text-green-500', bg: 'bg-green-50' },
  red: { icon: 'text-red-500', bg: 'bg-red-50' },
  purple: { icon: 'text-purple-500', bg: 'bg-purple-50' },
}

export function KpiCard({ icon, label, value, trend, color = 'amber', className, onClick }: KpiCardProps) {
  const styles = colorStyles[color]
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className,
      )}
    >
      {icon && (
        <div className={cn('p-2.5 rounded-lg flex-shrink-0', styles.bg)}>
          <span className={styles.icon}>{icon}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {trend && (
          <div className={cn('flex items-center gap-1 mt-1 text-xs', trend.value >= 0 ? 'text-green-600' : 'text-red-600')}>
            {trend.value >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{trend.value >= 0 ? '+' : ''}{trend.value}%{trend.label ? ` ${trend.label}` : ''}</span>
          </div>
        )}
      </div>
    </div>
  )
}
