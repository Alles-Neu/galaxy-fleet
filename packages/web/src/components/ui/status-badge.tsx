import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  'im Einsatz': 'bg-green-100 text-green-700 border-green-200',
  Puffer: 'bg-blue-100 text-blue-700 border-blue-200',
  Werkstatt: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  abgemeldet: 'bg-gray-100 text-gray-600 border-gray-200',
  zurückgegeben: 'bg-gray-100 text-gray-600 border-gray-200',
  verkauft: 'bg-gray-100 text-gray-600 border-gray-200',
  Neu: 'bg-blue-100 text-blue-700 border-blue-200',
  Geprüft: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Abgeschlossen: 'bg-green-100 text-green-700 border-green-200',
  'nicht abgearbeitet': 'bg-red-100 text-red-700 border-red-200',
  'In Bearbeitung': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Abgearbeitet: 'bg-green-100 text-green-700 border-green-200',
  Normal: 'bg-gray-100 text-gray-700 border-gray-200',
  Extra: 'bg-purple-100 text-purple-700 border-purple-200',
  Rescue: 'bg-orange-100 text-orange-700 border-orange-200',
  'SUB Rescue': 'bg-orange-100 text-orange-700 border-orange-200',
  Abwesend: 'bg-gray-100 text-gray-500 border-gray-200',
}

interface StatusBadgeProps {
  status: string
  className?: string
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const colors = statusColors[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        colors,
        className,
      )}
    >
      {status}
    </span>
  )
}
