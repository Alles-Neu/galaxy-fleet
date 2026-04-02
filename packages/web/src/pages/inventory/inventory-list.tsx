import { useState } from 'react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { StatusBadge } from '@/components/ui/status-badge'
import { formatDate } from '@/lib/utils'
import { mockInventory, type InventoryItem } from '@/lib/mock-data'

const filters: FilterField[] = [
  {
    key: 'standort',
    label: 'Station',
    type: 'select',
    options: [
      { value: 'DHH1-Hamburg', label: 'DHH1-Hamburg' },
      { value: 'DHB1-Bremen', label: 'DHB1-Bremen' },
      { value: 'MUC1-Garching', label: 'MUC1-Garching' },
      { value: 'DSH4-Borgstedt', label: 'DSH4-Borgstedt' },
      { value: 'DBW8-Messkirchen', label: 'DBW8-Messkirchen' },
      { value: 'GLS25-Hamburg', label: 'GLS25-Hamburg' },
      { value: 'DPDHamburg', label: 'DPDHamburg' },
    ],
  },
  {
    key: 'inventurTyp',
    label: 'Inventurintervall',
    type: 'select',
    options: [
      { value: 'Zustellfahrzeug', label: 'Zustellfahrzeug' },
      { value: 'Servicefahrzeug', label: 'Servicefahrzeug' },
    ],
  },
  { key: 'inventurFertig', label: 'Inventur fertig', type: 'checkbox' },
]

const columns: Column<Record<string, unknown>>[] = [
  {
    header: 'Kennzeichen',
    accessor: 'kennzeichen',
    sortable: true,
    render: (r) => <span className="font-mono font-semibold text-blue-600">{r['kennzeichen'] as string}</span>,
  },
  { header: 'FIN', accessor: 'fin', render: (r) => <span className="font-mono text-xs text-gray-500">{r['fin'] as string}</span> },
  { header: 'Standort', accessor: 'standort', render: (r) => <span className="text-xs text-gray-600">{r['standort'] as string}</span> },
  { header: 'InventurTyp', accessor: 'inventurTyp' },
  {
    header: 'Status',
    accessor: 'status',
    render: (r) => <StatusBadge status={r['status'] as string} />,
  },
  {
    header: 'Inventur fertig',
    accessor: 'inventurFertig',
    render: (r) => (
      <span className={r['inventurFertig'] ? 'text-green-600 font-medium' : 'text-red-500'}>
        {r['inventurFertig'] ? '✓ Ja' : '✗ Nein'}
      </span>
    ),
  },
  {
    header: 'Letztes Inventurdatum',
    accessor: 'letztesInventurdatum',
    sortable: true,
    render: (r) => <>{formatDate(r['letztesInventurdatum'] as string)}</>,
  },
]

export default function InventoryListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})

  const filtered = mockInventory.filter((item: InventoryItem) => {
    for (const [key, val] of Object.entries(filterValues)) {
      if (val === '' || val === undefined) continue
      const iKey = key as keyof InventoryItem
      if (typeof val === 'boolean') {
        if (item[iKey] !== val) return false
      } else {
        const cellVal = String(item[iKey] ?? '').toLowerCase()
        if (!cellVal.includes(String(val).toLowerCase())) return false
      }
    }
    return true
  })

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventur</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} Fahrzeuge</p>
        </div>
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
