import { useParams } from 'react-router-dom'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { formatDate } from '@/lib/utils'
import { mockAgeingtours } from '@/lib/mock-data'

const columns: Column<Record<string, unknown>>[] = [
  { header: 'Tag', accessor: 'datum', sortable: true, render: (r) => <>{formatDate(r['datum'] as string)}</> },
  { header: 'Tour Nr.', accessor: 'tourNr', render: (r) => <span className="font-mono font-bold">{r['tourNr'] as string}</span> },
  { header: 'Standort', accessor: 'standort', render: (r) => <span className="text-xs text-gray-600">{r['standort'] as string}</span> },
  { header: 'PID', accessor: 'pid', render: (r) => <span className="font-mono text-xs">{r['pid'] as string}</span> },
  { header: 'Fahrer', accessor: 'fahrer' },
  {
    header: 'Kennzeichen',
    accessor: 'kennzeichen',
    render: (r) => <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{r['kennzeichen'] as string}</span>,
  },
  {
    header: 'Retouren',
    accessor: 'retouren',
    render: (r) => (
      <span className={`font-medium ${(r['retouren'] as number) > 10 ? 'text-red-600' : (r['retouren'] as number) > 5 ? 'text-amber-600' : 'text-gray-700'}`}>
        {r['retouren'] as number}
      </span>
    ),
  },
  {
    header: 'Infos Rücksendungen',
    accessor: 'infos',
    render: (r) => (
      <span className={`text-xs ${r['infos'] ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
        {(r['infos'] as string) || '—'}
      </span>
    ),
  },
  { header: 'Typ', accessor: 'tourType', render: (r) => <StatusBadge status={r['tourType'] as string} size="sm" /> },
]

export default function AgeingPage() {
  const { station } = useParams<{ station: string }>()
  const stationLabel = station ?? 'DHH1'

  const tours = mockAgeingtours.filter((t) => t.standort.startsWith(stationLabel))
  const totalRetouren = tours.reduce((s, t) => s + t.retouren, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ageing Tours – {stationLabel}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tours.length} Einträge · {totalRetouren} Retouren gesamt</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Ageing Touren', value: tours.length },
          { label: 'Kritische Retouren (>10)', value: tours.filter((t) => t.retouren > 10).length },
          { label: 'Gesamt Retouren', value: totalRetouren },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={tours as unknown as Record<string, unknown>[]}
        emptyMessage={`Keine Ageing Tours für ${stationLabel}`}
      />
    </div>
  )
}
