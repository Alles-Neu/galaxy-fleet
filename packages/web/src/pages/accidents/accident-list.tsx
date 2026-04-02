import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { mockAccidents, type Accident } from '@/lib/mock-data'

const filters: FilterField[] = [
  {
    key: 'bearbeitungsstatus',
    label: 'Bearbeitungsstatus',
    type: 'select',
    options: [
      { value: 'nicht abgearbeitet', label: 'Nicht abgearbeitet' },
      { value: 'In Bearbeitung', label: 'In Bearbeitung' },
      { value: 'Abgearbeitet', label: 'Abgearbeitet' },
    ],
  },
  {
    key: 'schuldart',
    label: 'Schuldart',
    type: 'select',
    options: [
      { value: 'Fremdverschulden', label: 'Fremdverschulden' },
      { value: 'Eigenverschulden', label: 'Eigenverschulden' },
      { value: 'Ungeklärt', label: 'Ungeklärt' },
    ],
  },
  {
    key: 'station',
    label: 'Station',
    type: 'select',
    options: [
      { value: 'DHH1-Hamburg', label: 'DHH1-Hamburg' },
      { value: 'DHB1-Bremen', label: 'DHB1-Bremen' },
      { value: 'MUC1-Garching', label: 'MUC1-Garching' },
      { value: 'GLS25-Hamburg', label: 'GLS25-Hamburg' },
      { value: 'DBW8-Messkirchen', label: 'DBW8-Messkirchen' },
    ],
  },
  { key: 'firma', label: 'Firma', type: 'select', options: [
    { value: 'EuRide', label: 'EuRide' },
    { value: 'GLS', label: 'GLS' },
    { value: 'DPD', label: 'DPD' },
  ]},
  { key: 'personalnummer', label: 'Personalnummer', type: 'text', placeholder: 'P-...' },
  { key: 'fahrer', label: 'Name', type: 'text', placeholder: 'Fahrername...' },
  { key: 'datum', label: 'Datum', type: 'date-range' },
]

const columns: Column<Record<string, unknown>>[] = [
  { header: 'Unfall ID', accessor: 'id', render: (r) => <span className="font-mono text-xs text-gray-500">UNF-{String(r['id'] as number).padStart(4, '0')}</span> },
  { header: 'Datum', accessor: 'datum', sortable: true, render: (r) => <>{formatDate(r['datum'] as string)}</> },
  {
    header: 'Kennzeichen',
    accessor: 'kennzeichen',
    render: (r) => <span className="font-mono font-semibold text-blue-600">{r['kennzeichen'] as string}</span>,
  },
  { header: 'Station', accessor: 'station', render: (r) => <span className="text-xs text-gray-600">{r['station'] as string}</span> },
  { header: 'Personalnr.', accessor: 'personalnummer', render: (r) => <span className="font-mono text-xs">{r['personalnummer'] as string}</span> },
  { header: 'Fahrer', accessor: 'fahrer' },
  {
    header: 'Abgearbeitet',
    accessor: 'abgearbeitet',
    render: (r) => (
      <span className={r['abgearbeitet'] ? 'text-green-600 font-medium text-sm' : 'text-red-500 text-sm'}>
        {r['abgearbeitet'] ? '✓ Ja' : '✗ Nein'}
      </span>
    ),
  },
  {
    header: 'Bearbeitungsstatus',
    accessor: 'bearbeitungsstatus',
    render: (r) => <StatusBadge status={r['bearbeitungsstatus'] as string} />,
  },
  { header: 'Sachbearbeiter', accessor: 'sachbearbeiter', render: (r) => <span className="text-gray-600">{(r['sachbearbeiter'] as string) || '—'}</span> },
]

export default function AccidentListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})

  const filtered = mockAccidents.filter((a: Accident) => {
    for (const [key, val] of Object.entries(filterValues)) {
      if (!val) continue
      const aKey = key as keyof Accident
      const cellVal = String(a[aKey] ?? '').toLowerCase()
      if (!cellVal.includes(String(val).toLowerCase())) return false
    }
    return true
  })

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unfälle</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} Einträge</p>
        </div>
        <Button size="sm">
          <Plus size={14} />
          Neuer Unfall
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
