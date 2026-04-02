import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Download } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { useApi, apiPost } from '@/hooks/useApi'

interface ApiVehicle {
  id: number
  license_plate: string
  fin?: string
  model?: string
  station?: { id: number; code: string; full_name: string }
  status?: { id: number; name: string }
  brand?: { id: number; name: string }
  company?: { id: number; name: string }
  created_at?: string
}

interface MasterItem { id: number; name: string }
interface Station { id: number; code: string; full_name: string }

const filters: FilterField[] = [
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
  { key: 'license_plate', label: 'Kennzeichen', type: 'text', placeholder: 'B-ER...' },
  { key: 'model', label: 'Modell', type: 'text', placeholder: 'Modell...' },
]

const columns: Column<Record<string, unknown>>[] = [
  {
    header: '#',
    accessor: 'id',
    render: (r) => <span className="text-gray-400 text-xs">{r['id'] as number}</span>,
  },
  {
    header: 'Kennzeichen',
    accessor: 'license_plate',
    sortable: true,
    render: (r) => (
      <span className="font-mono font-semibold text-blue-600">{r['license_plate'] as string}</span>
    ),
  },
  {
    header: 'FIN',
    accessor: 'fin',
    render: (r) => <span className="font-mono text-xs text-gray-500">{(r['fin'] as string) || '—'}</span>,
  },
  {
    header: 'Marke',
    accessor: 'brand',
    render: (r) => {
      const brand = r['brand'] as ApiVehicle['brand']
      return <span className="text-gray-700">{brand?.name || '—'}</span>
    },
  },
  {
    header: 'Modell',
    accessor: 'model',
    render: (r) => <span className="text-gray-700">{(r['model'] as string) || '—'}</span>,
  },
  {
    header: 'Standort',
    accessor: 'station',
    sortable: false,
    render: (r) => {
      const station = r['station'] as ApiVehicle['station']
      return <span className="text-gray-600 text-xs">{station?.code || '—'}</span>
    },
  },
  {
    header: 'Firma',
    accessor: 'company',
    render: (r) => {
      const company = r['company'] as ApiVehicle['company']
      return <span className="text-gray-600 text-xs">{company?.name || '—'}</span>
    },
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (r) => {
      const status = r['status'] as ApiVehicle['status']
      return <StatusBadge status={status?.name || ''} />
    },
  },
  {
    header: 'Erstellt',
    accessor: 'created_at',
    sortable: true,
    render: (r) => <span className="text-gray-600">{formatDate(r['created_at'] as string)}</span>,
  },
]

interface CreateVehicleForm {
  license_plate: string
  fin: string
  model: string
  brand_id: string
  company_id: string
  station_id: string
  status_id: string
}

export default function VehicleListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})
  const [sortField, setSortField] = useState<string>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState<CreateVehicleForm>({
    license_plate: '',
    fin: '',
    model: '',
    brand_id: '',
    company_id: '',
    station_id: '',
    status_id: '',
  })

  // Build query params
  const params = new URLSearchParams({ page: String(page), limit: String(pageSize) })
  if (filterValues['status']) params.set('status', String(filterValues['status']))
  if (filterValues['license_plate']) params.set('license_plate', String(filterValues['license_plate']))
  if (filterValues['model']) params.set('model', String(filterValues['model']))

  const { data, loading, error, refetch } = useApi<{ data: ApiVehicle[]; total: number }>(
    `/vehicles?${params.toString()}`,
    [page, pageSize, JSON.stringify(filterValues)],
  )

  const { data: statuses } = useApi<MasterItem[]>('/admin/master-data/statuses')
  const { data: stations } = useApi<Station[]>('/admin/master-data/stations')
  const { data: brands } = useApi<MasterItem[]>('/admin/master-data/brands')

  const vehicles = data?.data ?? []
  const total = data?.total ?? 0

  // Sort client-side (server paginates, we sort the current page)
  const sorted = [...vehicles].sort((a, b) => {
    if (!sortField) return 0
    const aVal = String((a as Record<string, unknown>)[sortField] ?? '')
    const bVal = String((b as Record<string, unknown>)[sortField] ?? '')
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!form.license_plate.trim()) {
      setFormError('Kennzeichen ist erforderlich.')
      return
    }
    setSubmitting(true)
    try {
      const payload: Record<string, unknown> = { license_plate: form.license_plate }
      if (form.fin) payload.fin = form.fin
      if (form.model) payload.model = form.model
      if (form.brand_id) payload.brand_id = Number(form.brand_id)
      if (form.company_id) payload.company_id = Number(form.company_id)
      if (form.station_id) payload.station_id = Number(form.station_id)
      if (form.status_id) payload.status_id = Number(form.status_id)
      await apiPost('/vehicles', payload)
      setShowModal(false)
      setForm({ license_plate: '', fin: '', model: '', brand_id: '', company_id: '', station_id: '', status_id: '' })
      refetch()
    } catch (err) {
      setFormError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fahrzeugliste</h1>
          <p className="text-sm text-gray-500 mt-0.5">{loading ? '...' : `${total} Fahrzeuge`}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => alert('Excel Export wird vorbereitet...')}>
            <Download size={14} />
            Excel Export
          </Button>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus size={14} />
            Neues Fahrzeug
          </Button>
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
        data={sorted as unknown as Record<string, unknown>[]}
        pagination={{ page, pageSize, total }}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
        onSort={(field, dir) => { setSortField(field); setSortDir(dir) }}
        sortField={sortField}
        sortDir={sortDir}
        onRowClick={(row) => navigate(`/vehicles/${(row as unknown as ApiVehicle).id}`)}
        loading={loading}
      />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neues Fahrzeug" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>
          )}
          <Input
            label="Kennzeichen *"
            value={form.license_plate}
            onChange={(e) => setForm((f) => ({ ...f, license_plate: e.target.value }))}
            placeholder="B-ER 1234"
          />
          <Input
            label="FIN"
            value={form.fin}
            onChange={(e) => setForm((f) => ({ ...f, fin: e.target.value }))}
            placeholder="WV1ZZZ..."
          />
          <Input
            label="Modell"
            value={form.model}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
            placeholder="Crafter 35"
          />
          <Select
            label="Marke"
            value={form.brand_id}
            onChange={(e) => setForm((f) => ({ ...f, brand_id: e.target.value }))}
            options={(brands ?? []).map((b) => ({ value: String(b.id), label: b.name }))}
            placeholder="Marke wählen..."
          />
          <Select
            label="Station"
            value={form.station_id}
            onChange={(e) => setForm((f) => ({ ...f, station_id: e.target.value }))}
            options={(stations ?? []).map((s) => ({ value: String(s.id), label: s.full_name || s.code }))}
            placeholder="Station wählen..."
          />
          <Select
            label="Status"
            value={form.status_id}
            onChange={(e) => setForm((f) => ({ ...f, status_id: e.target.value }))}
            options={(statuses ?? []).map((s) => ({ value: String(s.id), label: s.name }))}
            placeholder="Status wählen..."
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Abbrechen
            </Button>
            <Button type="submit" loading={submitting}>
              Erstellen
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
