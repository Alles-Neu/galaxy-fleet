import { useState } from 'react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { StatusBadge } from '@/components/ui/status-badge'
import { formatDate } from '@/lib/utils'
import { useApi } from '@/hooks/useApi'

interface ApiInventoryItem {
  id: number
  license_plate?: string
  fin?: string
  station?: { id: number; code: string; full_name?: string }
  status?: { id: number; name: string }
  inventory_type?: string
  inventory_done?: boolean
  last_inventory_date?: string
}

const filters: FilterField[] = [
  {
    key: 'station',
    label: 'Station',
    type: 'select',
    options: [
      { value: 'DHH1', label: 'DHH1-Hamburg' },
      { value: 'DHB1', label: 'DHB1-Bremen' },
      { value: 'MUC1', label: 'MUC1-Garching' },
      { value: 'DSH4', label: 'DSH4-Borgstedt' },
      { value: 'DBW8', label: 'DBW8-Messkirchen' },
    ],
  },
  {
    key: 'inventory_type',
    label: 'Inventurintervall',
    type: 'select',
    options: [
      { value: 'Zustellfahrzeug', label: 'Zustellfahrzeug' },
      { value: 'Servicefahrzeug', label: 'Servicefahrzeug' },
    ],
  },
  { key: 'inventory_done', label: 'Inventur fertig', type: 'checkbox' },
]

const columns: Column<Record<string, unknown>>[] = [
  {
    header: 'Kennzeichen',
    accessor: 'license_plate',
    sortable: true,
    render: (r) => (
      <span className="font-mono font-semibold text-blue-600">{(r['license_plate'] as string) || '—'}</span>
    ),
  },
  {
    header: 'FIN',
    accessor: 'fin',
    render: (r) => <span className="font-mono text-xs text-gray-500">{(r['fin'] as string) || '—'}</span>,
  },
  {
    header: 'Standort',
    accessor: 'station',
    render: (r) => {
      const s = r['station'] as ApiInventoryItem['station']
      return <span className="text-xs text-gray-600">{s?.code || '—'}</span>
    },
  },
  {
    header: 'InventurTyp',
    accessor: 'inventory_type',
    render: (r) => <span>{(r['inventory_type'] as string) || '—'}</span>,
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (r) => {
      const s = r['status'] as ApiInventoryItem['status']
      return <StatusBadge status={s?.name || ''} />
    },
  },
  {
    header: 'Inventur fertig',
    accessor: 'inventory_done',
    render: (r) => (
      <span className={r['inventory_done'] ? 'text-green-600 font-medium' : 'text-red-500'}>
        {r['inventory_done'] ? '✓ Ja' : '✗ Nein'}
      </span>
    ),
  },
  {
    header: 'Letztes Inventurdatum',
    accessor: 'last_inventory_date',
    sortable: true,
    render: (r) => <>{formatDate(r['last_inventory_date'] as string)}</>,
  },
]

export default function InventoryListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})

  const params = new URLSearchParams({ page: String(page), limit: String(pageSize) })
  if (filterValues['station']) params.set('station', String(filterValues['station']))
  if (filterValues['inventory_type']) params.set('inventory_type', String(filterValues['inventory_type']))
  if (filterValues['inventory_done'] !== undefined && filterValues['inventory_done'] !== '')
    params.set('inventory_done', String(filterValues['inventory_done']))

  // Inventory endpoint returns a flat array (not paginated object)
  const { data: rawData, loading, error } = useApi<ApiInventoryItem[] | { data: ApiInventoryItem[]; total: number }>(
    `/inventory?${params.toString()}`,
    [page, pageSize, JSON.stringify(filterValues)],
  )

  // Handle both array response and paginated object response
  const items: ApiInventoryItem[] = Array.isArray(rawData)
    ? rawData
    : ((rawData as { data?: ApiInventoryItem[] } | null)?.data ?? [])
  const total = Array.isArray(rawData)
    ? rawData.length
    : ((rawData as { total?: number } | null)?.total ?? 0)

  const paginated = Array.isArray(rawData)
    ? items.slice((page - 1) * pageSize, page * pageSize)
    : items

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventur</h1>
          <p className="text-sm text-gray-500 mt-0.5">{loading ? '...' : `${total} Fahrzeuge`}</p>
        </div>
      </div>

      <FilterBar filters={filters} onFilterChange={(vals) => { setFilterValues(vals); setPage(1) }} />

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          Fehler beim Laden: {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={paginated as unknown as Record<string, unknown>[]}
        pagination={{ page, pageSize, total }}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
        loading={loading}
      />
    </div>
  )
}
