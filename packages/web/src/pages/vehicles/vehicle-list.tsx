import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Download } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { mockVehicles, type Vehicle } from '@/lib/mock-data'

const filters: FilterField[] = [
  {
    key: 'firma',
    label: 'Firma',
    type: 'select',
    options: [
      { value: 'EuRide', label: 'EuRide' },
      { value: 'GLS', label: 'GLS' },
      { value: 'DPD', label: 'DPD' },
      { value: 'AMZL', label: 'AMZL' },
    ],
  },
  {
    key: 'standort',
    label: 'Station',
    type: 'select',
    options: [
      { value: 'DBW8-Messkirchen', label: 'DBW8-Messkirchen' },
      { value: 'DHB1-Bremen', label: 'DHB1-Bremen' },
      { value: 'DHH1-Hamburg', label: 'DHH1-Hamburg' },
      { value: 'DSH4-Borgstedt', label: 'DSH4-Borgstedt' },
      { value: 'MUC1-Garching', label: 'MUC1-Garching' },
      { value: 'GLS25-Hamburg', label: 'GLS25-Hamburg' },
      { value: 'DPDHamburg', label: 'DPDHamburg' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'im Einsatz', label: 'Im Einsatz' },
      { value: 'Puffer', label: 'Puffer' },
      { value: 'Werkstatt', label: 'Werkstatt' },
      { value: 'abgemeldet', label: 'Abgemeldet' },
      { value: 'zurückgegeben', label: 'Zurückgegeben' },
      { value: 'verkauft', label: 'Verkauft' },
    ],
  },
  { key: 'marke', label: 'Marke', type: 'select', options: [
    { value: 'Volkswagen', label: 'Volkswagen' },
    { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
    { value: 'Ford', label: 'Ford' },
  ]},
  { key: 'modell', label: 'Modell', type: 'text', placeholder: 'Modell...' },
  { key: 'versicherung', label: 'Versicherung', type: 'select', options: [
    { value: 'Allianz', label: 'Allianz' },
    { value: 'AXA', label: 'AXA' },
    { value: 'HUK-COBURG', label: 'HUK-COBURG' },
    { value: 'DEVK', label: 'DEVK' },
  ]},
  { key: 'beschaffungsart', label: 'Beschaffungsart', type: 'select', options: [
    { value: 'Leasing', label: 'Leasing' },
    { value: 'Kauf', label: 'Kauf' },
  ]},
  { key: 'beklebt', label: 'Beklebt', type: 'checkbox' },
  { key: 'servicefahrzeug', label: 'Servicefahrzeug', type: 'checkbox' },
  { key: 'inventartyp', label: 'Inventartyp', type: 'select', options: [
    { value: 'Zustellfahrzeug', label: 'Zustellfahrzeug' },
    { value: 'Servicefahrzeug', label: 'Servicefahrzeug' },
  ]},
  { key: 'kennzeichen', label: 'Kennzeichen', type: 'text', placeholder: 'B-ER...' },
  { key: 'qrCode', label: 'QR-Code', type: 'text', placeholder: 'GF-...' },
  { key: 'versicherungsnr', label: 'Versicherungsnr.', type: 'text', placeholder: 'Nummer...' },
]

const columns: Column<Vehicle>[] = [
  { header: '#', accessor: 'id', render: (r) => <span className="text-gray-400 text-xs">{r.id}</span> },
  { header: 'QR-Code', accessor: 'qrCode', render: (r) => <span className="font-mono text-xs text-gray-600">{r.qrCode}</span> },
  {
    header: 'Kennzeichen',
    accessor: 'kennzeichen',
    sortable: true,
    render: (r) => (
      <span className="font-mono font-semibold text-blue-600">{r.kennzeichen}</span>
    ),
  },
  { header: 'FIN', accessor: 'fin', render: (r) => <span className="font-mono text-xs text-gray-500">{r.fin}</span> },
  {
    header: 'Letztes Übergabedatum',
    accessor: 'letzteUebergabe',
    sortable: true,
    render: (r) => <span className="text-gray-600">{formatDate(r.letzteUebergabe)}</span>,
  },
  {
    header: 'Zugewiesen an',
    accessor: 'zugewiesenAn',
    render: (r) => <span className="text-gray-700">{r.zugewiesenAn || '—'}</span>,
  },
  {
    header: 'Standort',
    accessor: 'standort',
    sortable: true,
    render: (r) => <span className="text-gray-600 text-xs">{r.standort}</span>,
  },
  {
    header: 'Erstzulassung',
    accessor: 'erstzulassung',
    sortable: true,
    render: (r) => <span className="text-gray-600">{formatDate(r.erstzulassung)}</span>,
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (r) => <StatusBadge status={r.status} />,
  },
]

export default function VehicleListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})
  const [sortField, setSortField] = useState<string>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // Filter data
  const filtered = mockVehicles.filter((v) => {
    for (const [key, val] of Object.entries(filterValues)) {
      if (!val && val !== false) continue
      const vKey = key as keyof Vehicle
      if (typeof val === 'boolean') {
        if (v[vKey] !== val) return false
      } else if (typeof val === 'string' && val !== '') {
        const cellVal = String(v[vKey] ?? '').toLowerCase()
        if (!cellVal.includes(val.toLowerCase())) return false
      }
    }
    return true
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0
    const aVal = String(a[sortField as keyof Vehicle] ?? '')
    const bVal = String(b[sortField as keyof Vehicle] ?? '')
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fahrzeugliste</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} Fahrzeuge</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => alert('Excel Export wird vorbereitet...')}>
            <Download size={14} />
            Excel Export
          </Button>
          <Button size="sm" onClick={() => navigate('/vehicles/new')}>
            <Plus size={14} />
            Neues Fahrzeug
          </Button>
        </div>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilterValues} />

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={paginated as unknown as Record<string, unknown>[]}
        pagination={{ page, pageSize, total: filtered.length }}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
        onSort={(field, dir) => { setSortField(field); setSortDir(dir) }}
        sortField={sortField}
        sortDir={sortDir}
        onRowClick={(row) => navigate(`/vehicles/${(row as unknown as Vehicle).id}`)}
      />
    </div>
  )
}
