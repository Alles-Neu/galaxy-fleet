import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { mockHandovers, type Handover } from '@/lib/mock-data'

const filters: FilterField[] = [
  {
    key: 'vonStation',
    label: 'Station',
    type: 'select',
    options: [
      { value: 'DHH1-Hamburg', label: 'DHH1-Hamburg' },
      { value: 'DHB1-Bremen', label: 'DHB1-Bremen' },
      { value: 'MUC1-Garching', label: 'MUC1-Garching' },
      { value: 'DPDHamburg', label: 'DPDHamburg' },
    ],
  },
  { key: 'uebergebenVon', label: 'Mitarbeiter', type: 'text', placeholder: 'Name...' },
  { key: 'kennzeichen', label: 'Kennzeichen', type: 'text', placeholder: 'B-ER...' },
  { key: 'datum', label: 'Datum', type: 'date-range' },
]

const columns: Column<Record<string, unknown>>[] = [
  {
    header: 'Kennzeichen',
    accessor: 'kennzeichen',
    sortable: true,
    render: (r) => <span className="font-mono font-semibold text-blue-600">{r['kennzeichen'] as string}</span>,
  },
  {
    header: 'Km-Stand',
    accessor: 'kmStand',
    render: (r) => <span className="font-mono text-sm">{(r['kmStand'] as number).toLocaleString('de-DE')} km</span>,
  },
  { header: 'Übergeben von', accessor: 'uebergebenVon' },
  { header: 'Übergeben zu', accessor: 'uebergebenZu' },
  { header: 'Von Station', accessor: 'vonStation', render: (r) => <span className="text-xs text-gray-600">{r['vonStation'] as string}</span> },
  { header: 'An Station', accessor: 'anStation', render: (r) => <span className="text-xs text-gray-600">{r['anStation'] as string}</span> },
  { header: 'Datum', accessor: 'datum', sortable: true, render: (r) => <>{formatDate(r['datum'] as string)}</> },
  { header: 'Erstellt von', accessor: 'erstelltVon' },
  {
    header: 'Bestätigt',
    accessor: 'bestaetigt',
    render: (r) => (
      <span className={r['bestaetigt'] ? 'text-green-600 font-medium' : 'text-gray-400'}>
        {r['bestaetigt'] ? '✓ Ja' : '— Nein'}
      </span>
    ),
  },
]

export default function HandoverListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})

  const filtered = mockHandovers.filter((h: Handover) => {
    for (const [key, val] of Object.entries(filterValues)) {
      if (!val) continue
      const hKey = key as keyof Handover
      const cellVal = String(h[hKey] ?? '').toLowerCase()
      if (!cellVal.includes(String(val).toLowerCase())) return false
    }
    return true
  })

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Übergaben</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} Einträge</p>
        </div>
        <Button size="sm">
          <Plus size={14} />
          Neue Übergabe
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
