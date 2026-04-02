import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'
import { mockOffenses, type Offense } from '@/lib/mock-data'

const filters: FilterField[] = [
  {
    key: 'bestaetigt',
    label: 'Bestätigt',
    type: 'select',
    options: [
      { value: 'true', label: 'Bestätigt' },
      { value: 'false', label: 'Nicht bestätigt' },
    ],
  },
  { key: 'verstoss', label: 'Verstoß', type: 'text', placeholder: 'Art des Verstoßes...' },
  {
    key: 'behoerde',
    label: 'Behörde',
    type: 'select',
    options: [
      { value: 'Bußgeldbehörde Hamburg', label: 'Hamburg' },
      { value: 'Bußgeldbehörde München', label: 'München' },
      { value: 'Ordnungsamt Tauberbischofsheim', label: 'Tauberbischofsheim' },
    ],
  },
  { key: 'datum', label: 'Datum', type: 'date-range' },
]

const columns: Column<Record<string, unknown>>[] = [
  { header: '#', accessor: 'id', render: (r) => <span className="text-gray-400 text-xs">{r['id'] as number}</span> },
  { header: 'Datum', accessor: 'datum', sortable: true, render: (r) => <>{formatDate(r['datum'] as string)}</> },
  {
    header: 'Kennzeichen',
    accessor: 'kennzeichen',
    render: (r) => <span className="font-mono font-semibold text-blue-600">{r['kennzeichen'] as string}</span>,
  },
  { header: 'Personalnr.', accessor: 'personalnummer', render: (r) => <span className="font-mono text-xs">{r['personalnummer'] as string}</span> },
  { header: 'Fahrer', accessor: 'fahrer' },
  {
    header: 'Verstoß',
    accessor: 'verstoss',
    className: 'max-w-xs',
    render: (r) => <span className="text-sm text-gray-700 line-clamp-2">{r['verstoss'] as string}</span>,
  },
  {
    header: 'Bußgeld',
    accessor: 'bussgeld',
    sortable: true,
    render: (r) => <span className="font-medium text-red-600">{formatCurrency(r['bussgeld'] as number)}</span>,
  },
  { header: 'Aktenzeichen', accessor: 'aktenzeichen', render: (r) => <span className="font-mono text-xs text-gray-500">{r['aktenzeichen'] as string}</span> },
  {
    header: 'Bestätigt',
    accessor: 'bestaetigt',
    render: (r) => (
      <span className={r['bestaetigt'] ? 'text-green-600 font-medium text-sm' : 'text-amber-600 text-sm'}>
        {r['bestaetigt'] ? '✓ Ja' : '⏳ Ausstehend'}
      </span>
    ),
  },
]

export default function OffenseListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})

  const filtered = mockOffenses.filter((o: Offense) => {
    for (const [key, val] of Object.entries(filterValues)) {
      if (!val) continue
      const oKey = key as keyof Offense
      const cellVal = String(o[oKey] ?? '').toLowerCase()
      if (!cellVal.includes(String(val).toLowerCase())) return false
    }
    return true
  })

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verkehrsverstöße</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} Einträge</p>
        </div>
        <Button size="sm">
          <Plus size={14} />
          Neuer Verstoß
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
