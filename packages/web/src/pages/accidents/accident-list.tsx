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

interface ApiAccident {
  id: number
  accident_date?: string
  personnel_number?: string
  driver_name?: string
  status?: string
  vehicle?: { id: number; license_plate: string }
  station?: { id: number; code: string }
  fault_type?: { id: number; name: string }
}

interface ApiVehicle { id: number; license_plate: string }
interface Station { id: number; code: string; full_name: string }
interface MasterItem { id: number; name: string }

const filters: FilterField[] = [
  {
    key: 'status',
    label: 'Bearbeitungsstatus',
    type: 'select',
    options: [
      { value: 'nicht_abgearbeitet', label: 'Nicht abgearbeitet' },
      { value: 'in_bearbeitung', label: 'In Bearbeitung' },
      { value: 'abgearbeitet', label: 'Abgearbeitet' },
    ],
  },
  {
    key: 'station',
    label: 'Station',
    type: 'select',
    options: [
      { value: 'DHH1', label: 'DHH1-Hamburg' },
      { value: 'DHB1', label: 'DHB1-Bremen' },
      { value: 'MUC1', label: 'MUC1-Garching' },
    ],
  },
  { key: 'personnel_number', label: 'Personalnummer', type: 'text', placeholder: 'P-...' },
  { key: 'driver_name', label: 'Fahrer', type: 'text', placeholder: 'Fahrername...' },
  { key: 'datum', label: 'Datum', type: 'date-range' },
]

const columns: Column<Record<string, unknown>>[] = [
  {
    header: 'Unfall ID',
    accessor: 'id',
    render: (r) => (
      <span className="font-mono text-xs text-gray-500">
        UNF-{String(r['id'] as number).padStart(4, '0')}
      </span>
    ),
  },
  {
    header: 'Datum',
    accessor: 'accident_date',
    sortable: true,
    render: (r) => <>{formatDate(r['accident_date'] as string)}</>,
  },
  {
    header: 'Kennzeichen',
    accessor: 'vehicle',
    render: (r) => {
      const v = r['vehicle'] as ApiAccident['vehicle']
      return <span className="font-mono font-semibold text-blue-600">{v?.license_plate || '—'}</span>
    },
  },
  {
    header: 'Station',
    accessor: 'station',
    render: (r) => {
      const s = r['station'] as ApiAccident['station']
      return <span className="text-xs text-gray-600">{s?.code || '—'}</span>
    },
  },
  {
    header: 'Personalnr.',
    accessor: 'personnel_number',
    render: (r) => <span className="font-mono text-xs">{(r['personnel_number'] as string) || '—'}</span>,
  },
  {
    header: 'Fahrer',
    accessor: 'driver_name',
    render: (r) => <span>{(r['driver_name'] as string) || '—'}</span>,
  },
  {
    header: 'Schuldart',
    accessor: 'fault_type',
    render: (r) => {
      const ft = r['fault_type'] as ApiAccident['fault_type']
      return <span className="text-gray-600">{ft?.name || '—'}</span>
    },
  },
  {
    header: 'Bearbeitungsstatus',
    accessor: 'status',
    render: (r) => <StatusBadge status={(r['status'] as string) || ''} />,
  },
]

interface CreateAccidentForm {
  accident_date: string
  vehicle_id: string
  station_id: string
  personnel_number: string
  driver_name: string
}

export default function AccidentListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState<CreateAccidentForm>({
    accident_date: '',
    vehicle_id: '',
    station_id: '',
    personnel_number: '',
    driver_name: '',
  })

  const params = new URLSearchParams({ page: String(page), limit: String(pageSize) })
  if (filterValues['status']) params.set('status', String(filterValues['status']))
  if (filterValues['station']) params.set('station', String(filterValues['station']))
  if (filterValues['personnel_number']) params.set('personnel_number', String(filterValues['personnel_number']))
  if (filterValues['driver_name']) params.set('driver_name', String(filterValues['driver_name']))

  const { data, loading, error, refetch } = useApi<{ data: ApiAccident[]; total: number }>(
    `/accidents?${params.toString()}`,
    [page, pageSize, JSON.stringify(filterValues)],
  )

  const { data: vehiclesData } = useApi<{ data: ApiVehicle[]; total: number }>('/vehicles?page=1&limit=500')
  const { data: stations } = useApi<Station[]>('/admin/master-data/stations')
  const { data: faultTypes } = useApi<MasterItem[]>('/admin/master-data/fault-types')

  const accidents = data?.data ?? []
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
      if (form.accident_date) payload.accident_date = form.accident_date
      if (form.station_id) payload.station_id = Number(form.station_id)
      if (form.personnel_number) payload.personnel_number = form.personnel_number
      if (form.driver_name) payload.driver_name = form.driver_name
      await apiPost('/accidents', payload)
      setShowModal(false)
      setForm({ accident_date: '', vehicle_id: '', station_id: '', personnel_number: '', driver_name: '' })
      refetch()
    } catch (err) {
      setFormError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  // suppress unused warning for faultTypes
  void faultTypes

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unfälle</h1>
          <p className="text-sm text-gray-500 mt-0.5">{loading ? '...' : `${total} Einträge`}</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus size={14} />
          Neuer Unfall
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
        data={accidents as unknown as Record<string, unknown>[]}
        pagination={{ page, pageSize, total }}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
        loading={loading}
      />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neuer Unfall" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>
          )}
          <Input
            label="Unfalldatum"
            type="date"
            value={form.accident_date}
            onChange={(e) => setForm((f) => ({ ...f, accident_date: e.target.value }))}
          />
          <Select
            label="Fahrzeug *"
            value={form.vehicle_id}
            onChange={(e) => setForm((f) => ({ ...f, vehicle_id: e.target.value }))}
            options={vehicles.map((v) => ({ value: String(v.id), label: v.license_plate }))}
            placeholder="Fahrzeug wählen..."
          />
          <Select
            label="Station"
            value={form.station_id}
            onChange={(e) => setForm((f) => ({ ...f, station_id: e.target.value }))}
            options={(stations ?? []).map((s) => ({ value: String(s.id), label: s.full_name || s.code }))}
            placeholder="Station wählen..."
          />
          <Input
            label="Personalnummer"
            value={form.personnel_number}
            onChange={(e) => setForm((f) => ({ ...f, personnel_number: e.target.value }))}
            placeholder="P-12345"
          />
          <Input
            label="Fahrername"
            value={form.driver_name}
            onChange={(e) => setForm((f) => ({ ...f, driver_name: e.target.value }))}
            placeholder="Max Mustermann"
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
