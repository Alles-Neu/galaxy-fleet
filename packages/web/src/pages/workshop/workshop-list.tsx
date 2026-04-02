import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { mockWorkshopOrders, type WorkshopOrder } from '@/lib/mock-data'

const filters: FilterField[] = [
  {
    key: 'station',
    label: 'Station',
    type: 'select',
    options: [
      { value: 'DHH1-Hamburg', label: 'DHH1-Hamburg' },
      { value: 'DHB1-Bremen', label: 'DHB1-Bremen' },
      { value: 'MUC1-Garching', label: 'MUC1-Garching' },
    ],
  },
  {
    key: 'status',
    label: 'Bearbeitungsstatus',
    type: 'select',
    options: [
      { value: 'Neu', label: 'Neu' },
      { value: 'Geprüft', label: 'Geprüft' },
      { value: 'Abgeschlossen', label: 'Abgeschlossen' },
    ],
  },
  { key: 'kennzeichen', label: 'Kennzeichen', type: 'text', placeholder: 'Kennzeichen...' },
  { key: 'eingebracht', label: 'Eingebracht', type: 'date-range' },
]

const columns: Column<Record<string, unknown>>[] = [
  { header: '#', accessor: 'id', render: (r) => <span className="text-gray-400 text-xs">{r['id'] as number}</span> },
  {
    header: 'Kennzeichen',
    accessor: 'kennzeichen',
    render: (r) => <span className="font-mono font-semibold text-blue-600">{r['kennzeichen'] as string}</span>,
  },
  { header: 'Station', accessor: 'station', render: (r) => <span className="text-xs text-gray-600">{r['station'] as string}</span> },
  {
    header: 'Eingebracht',
    accessor: 'eingebracht',
    sortable: true,
    render: (r) => <>{formatDate(r['eingebracht'] as string)}</>,
  },
  {
    header: 'Abgeholt',
    accessor: 'abgeholt',
    render: (r) => <>{r['abgeholt'] ? formatDate(r['abgeholt'] as string) : <span className="text-gray-400">Noch nicht</span>}</>,
  },
  { header: 'Verweildauer', accessor: 'verweildauer' },
  {
    header: 'Bemerkung / Schäden',
    accessor: 'bemerkung',
    className: 'max-w-xs',
    render: (r) => (
      <span className="text-sm text-gray-600 line-clamp-2">
        {r['bemerkung'] as string}{r['schaeden'] ? ` · ${r['schaeden'] as string}` : ''}
      </span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (r) => <StatusBadge status={r['status'] as string} />,
  },
  { header: 'Erstellt von', accessor: 'erstelltVon' },
]

export default function WorkshopListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})

  const filtered = mockWorkshopOrders.filter((w: WorkshopOrder) => {
    for (const [key, val] of Object.entries(filterValues)) {
      if (!val) continue
      const wKey = key as keyof WorkshopOrder
      const cellVal = String(w[wKey] ?? '').toLowerCase()
      if (!cellVal.includes(String(val).toLowerCase())) return false
    }
    return true
  })

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Werkstatt</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} Aufträge</p>
        </div>
        <Button size="sm">
          <Plus size={14} />
          Neuer Auftrag
        </Button>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilterValues} />

      <DataTable
        columns={columns}
        data={paginated as unknown as Record<string, unknown>[]}
        pagination={{ page, pageSize, total: filtered.length }}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
      />
    </div>
  )
}
