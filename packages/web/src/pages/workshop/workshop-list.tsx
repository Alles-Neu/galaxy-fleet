import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { useApi, apiPost } from '@/hooks/useApi'

interface ApiWorkshopOrder {
  id: number
  handover_date?: string
  return_date?: string
  km_reading?: number
  notes?: string
  status?: string
  vehicle?: { id: number; license_plate: string }
  from_station?: { id: number; code: string; full_name?: string }
  to_station?: { id: number; code: string; full_name?: string }
  created_by?: { username: string }
}

interface ApiVehicle { id: number; license_plate: string }
interface Station { id: number; code: string; full_name: string }

const filters: FilterField[] = [
  {
    key: 'status',
    label: 'Bearbeitungsstatus',
    type: 'select',
    options: [
      { value: 'neu', label: 'Neu' },
      { value: 'geprueft', label: 'Geprüft' },
      { value: 'abgeschlossen', label: 'Abgeschlossen' },
    ],
  },
  { key: 'license_plate', label: 'Kennzeichen', type: 'text', placeholder: 'Kennzeichen...' },
]

const columns: Column<Record<string, unknown>>[] = [
  {
    header: '#',
    accessor: 'id',
    render: (r) => <span className="text-gray-400 text-xs">{r['id'] as number}</span>,
  },
  {
    header: 'Kennzeichen',
    accessor: 'vehicle',
    render: (r) => {
      const v = r['vehicle'] as ApiWorkshopOrder['vehicle']
      return <span className="font-mono font-semibold text-blue-600">{v?.license_plate || '—'}</span>
    },
  },
  {
    header: 'Von Station',
    accessor: 'from_station',
    render: (r) => {
      const s = r['from_station'] as ApiWorkshopOrder['from_station']
      return <span className="text-xs text-gray-600">{s?.code || '—'}</span>
    },
  },
  {
    header: 'An Station (Werkstatt)',
    accessor: 'to_station',
    render: (r) => {
      const s = r['to_station'] as ApiWorkshopOrder['to_station']
      return <span className="text-xs text-gray-600">{s?.code || '—'}</span>
    },
  },
  {
    header: 'Eingebracht',
    accessor: 'handover_date',
    sortable: true,
    render: (r) => <>{formatDate(r['handover_date'] as string)}</>,
  },
  {
    header: 'Abgeholt',
    accessor: 'return_date',
    render: (r) => (
      <>
        {r['return_date']
          ? formatDate(r['return_date'] as string)
          : <span className="text-gray-400">Noch nicht</span>}
      </>
    ),
  },
  {
    header: 'Km-Stand',
    accessor: 'km_reading',
    render: (r) => {
      const km = r['km_reading'] as number | undefined
      return <span className="font-mono text-sm">{km != null ? km.toLocaleString('de-DE') + ' km' : '—'}</span>
    },
  },
  {
    header: 'Bemerkung',
    accessor: 'notes',
    className: 'max-w-xs',
    render: (r) => (
      <span className="text-sm text-gray-600 line-clamp-2">{(r['notes'] as string) || '—'}</span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (r) => <StatusBadge status={(r['status'] as string) || ''} />,
  },
  {
    header: 'Erstellt von',
    accessor: 'created_by',
    render: (r) => {
      const cb = r['created_by'] as ApiWorkshopOrder['created_by']
      return <span className="text-gray-600">{cb?.username || '—'}</span>
    },
  },
]

interface CreateWorkshopForm {
  vehicle_id: string
  km_reading: string
  from_station_id: string
  to_station_id: string
  handover_date: string
  notes: string
}

export default function WorkshopListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState<CreateWorkshopForm>({
    vehicle_id: '',
    km_reading: '',
    from_station_id: '',
    to_station_id: '',
    handover_date: '',
    notes: '',
  })

  const params = new URLSearchParams({ page: String(page), limit: String(pageSize) })
  if (filterValues['status']) params.set('status', String(filterValues['status']))
  if (filterValues['license_plate']) params.set('license_plate', String(filterValues['license_plate']))

  const { data, loading, error, refetch } = useApi<{ data: ApiWorkshopOrder[]; total: number }>(
    `/workshop-orders?${params.toString()}`,
    [page, pageSize, JSON.stringify(filterValues)],
  )

  const { data: vehiclesData } = useApi<{ data: ApiVehicle[]; total: number }>('/vehicles?page=1&limit=500')
  const { data: stations } = useApi<Station[]>('/admin/master-data/stations')

  const orders = data?.data ?? []
  const total = data?.total ?? 0
  const vehicles = vehiclesData?.data ?? []

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!form.vehicle_id) {
      setFormError('Fahrzeug ist erforderlich.')
      return
    }
    setSubmitting(true)
    try {
      const payload: Record<string, unknown> = {
        vehicle_id: Number(form.vehicle_id),
      }
      if (form.km_reading) payload.km_reading = Number(form.km_reading)
      if (form.from_station_id) payload.from_station_id = Number(form.from_station_id)
      if (form.to_station_id) payload.to_station_id = Number(form.to_station_id)
      if (form.handover_date) payload.handover_date = form.handover_date
      if (form.notes) payload.notes = form.notes
      await apiPost('/workshop-orders', payload)
      setShowModal(false)
      setForm({ vehicle_id: '', km_reading: '', from_station_id: '', to_station_id: '', handover_date: '', notes: '' })
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
          <h1 className="text-2xl font-bold text-gray-900">Werkstatt</h1>
          <p className="text-sm text-gray-500 mt-0.5">{loading ? '...' : `${total} Aufträge`}</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus size={14} />
          Neuer Auftrag
        </Button>
      </div>

      <FilterBar filters={filters} onFilterChange={(vals) => { setFilterValues(vals); setPage(1) }} />

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          Fehler beim Laden: {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={orders as unknown as Record<string, unknown>[]}
        pagination={{ page, pageSize, total }}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
        loading={loading}
      />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neuer Werkstattauftrag" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>
          )}
          <Select
            label="Fahrzeug *"
            value={form.vehicle_id}
            onChange={(e) => setForm((f) => ({ ...f, vehicle_id: e.target.value }))}
            options={vehicles.map((v) => ({ value: String(v.id), label: v.license_plate }))}
            placeholder="Fahrzeug wählen..."
          />
          <Input
            label="Km-Stand"
            type="number"
            value={form.km_reading}
            onChange={(e) => setForm((f) => ({ ...f, km_reading: e.target.value }))}
            placeholder="z.B. 45000"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Von Station"
              value={form.from_station_id}
              onChange={(e) => setForm((f) => ({ ...f, from_station_id: e.target.value }))}
              options={(stations ?? []).map((s) => ({ value: String(s.id), label: s.full_name || s.code }))}
              placeholder="Station wählen..."
            />
            <Select
              label="An Station (Werkstatt)"
              value={form.to_station_id}
              onChange={(e) => setForm((f) => ({ ...f, to_station_id: e.target.value }))}
              options={(stations ?? []).map((s) => ({ value: String(s.id), label: s.full_name || s.code }))}
              placeholder="Station wählen..."
            />
          </div>
          <Input
            label="Einbringdatum"
            type="datetime-local"
            value={form.handover_date}
            onChange={(e) => setForm((f) => ({ ...f, handover_date: e.target.value }))}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Bemerkung / Schäden</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Schadensbeschreibung, Reparaturauftrag..."
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none"
            />
          </div>
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
