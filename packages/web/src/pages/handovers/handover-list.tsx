import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { useApi, apiPost } from '@/hooks/useApi'

interface ApiHandover {
  id: number
  handover_date?: string
  km_reading?: number
  confirmed?: boolean
  vehicle?: { id: number; license_plate: string }
  from_employee?: { id: number; name?: string; personnel_number?: string }
  to_employee?: { id: number; name?: string; personnel_number?: string }
  from_station?: { id: number; code: string; full_name?: string }
  to_station?: { id: number; code: string; full_name?: string }
  created_by?: { username: string }
}

interface ApiVehicle { id: number; license_plate: string }
interface Station { id: number; code: string; full_name: string }

const filters: FilterField[] = [
  {
    key: 'from_station',
    label: 'Station',
    type: 'select',
    options: [
      { value: 'DHH1', label: 'DHH1-Hamburg' },
      { value: 'DHB1', label: 'DHB1-Bremen' },
      { value: 'MUC1', label: 'MUC1-Garching' },
    ],
  },
  { key: 'license_plate', label: 'Kennzeichen', type: 'text', placeholder: 'B-ER...' },
  { key: 'datum', label: 'Datum', type: 'date-range' },
]

const columns: Column<Record<string, unknown>>[] = [
  {
    header: 'Kennzeichen',
    accessor: 'vehicle',
    sortable: false,
    render: (r) => {
      const v = r['vehicle'] as ApiHandover['vehicle']
      return <span className="font-mono font-semibold text-blue-600">{v?.license_plate || '—'}</span>
    },
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
    header: 'Übergeben von',
    accessor: 'from_employee',
    render: (r) => {
      const emp = r['from_employee'] as ApiHandover['from_employee']
      return <span>{emp?.name || emp?.personnel_number || '—'}</span>
    },
  },
  {
    header: 'Übergeben zu',
    accessor: 'to_employee',
    render: (r) => {
      const emp = r['to_employee'] as ApiHandover['to_employee']
      return <span>{emp?.name || emp?.personnel_number || '—'}</span>
    },
  },
  {
    header: 'Von Station',
    accessor: 'from_station',
    render: (r) => {
      const s = r['from_station'] as ApiHandover['from_station']
      return <span className="text-xs text-gray-600">{s?.code || '—'}</span>
    },
  },
  {
    header: 'An Station',
    accessor: 'to_station',
    render: (r) => {
      const s = r['to_station'] as ApiHandover['to_station']
      return <span className="text-xs text-gray-600">{s?.code || '—'}</span>
    },
  },
  {
    header: 'Datum',
    accessor: 'handover_date',
    sortable: true,
    render: (r) => <>{formatDate(r['handover_date'] as string)}</>,
  },
  {
    header: 'Erstellt von',
    accessor: 'created_by',
    render: (r) => {
      const cb = r['created_by'] as ApiHandover['created_by']
      return <span className="text-gray-600">{cb?.username || '—'}</span>
    },
  },
  {
    header: 'Bestätigt',
    accessor: 'confirmed',
    render: (r) => (
      <span className={r['confirmed'] ? 'text-green-600 font-medium' : 'text-gray-400'}>
        {r['confirmed'] ? '✓ Ja' : '— Nein'}
      </span>
    ),
  },
]

interface CreateHandoverForm {
  vehicle_id: string
  km_reading: string
  from_employee_id: string
  to_employee_id: string
  from_station_id: string
  to_station_id: string
  handover_date: string
}

export default function HandoverListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState<CreateHandoverForm>({
    vehicle_id: '',
    km_reading: '',
    from_employee_id: '',
    to_employee_id: '',
    from_station_id: '',
    to_station_id: '',
    handover_date: '',
  })

  const params = new URLSearchParams({ page: String(page), limit: String(pageSize) })
  if (filterValues['from_station']) params.set('from_station', String(filterValues['from_station']))
  if (filterValues['license_plate']) params.set('license_plate', String(filterValues['license_plate']))

  const { data, loading, error, refetch } = useApi<{ data: ApiHandover[]; total: number }>(
    `/handovers?${params.toString()}`,
    [page, pageSize, JSON.stringify(filterValues)],
  )

  const { data: vehiclesData } = useApi<{ data: ApiVehicle[]; total: number }>('/vehicles?page=1&limit=500')
  const { data: stations } = useApi<Station[]>('/admin/master-data/stations')

  const handovers = data?.data ?? []
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
      if (form.from_employee_id) payload.from_employee_id = Number(form.from_employee_id)
      if (form.to_employee_id) payload.to_employee_id = Number(form.to_employee_id)
      if (form.from_station_id) payload.from_station_id = Number(form.from_station_id)
      if (form.to_station_id) payload.to_station_id = Number(form.to_station_id)
      if (form.handover_date) payload.handover_date = form.handover_date
      await apiPost('/handovers', payload)
      setShowModal(false)
      setForm({
        vehicle_id: '', km_reading: '', from_employee_id: '', to_employee_id: '',
        from_station_id: '', to_station_id: '', handover_date: '',
      })
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
          <h1 className="text-2xl font-bold text-gray-900">Übergaben</h1>
          <p className="text-sm text-gray-500 mt-0.5">{loading ? '...' : `${total} Einträge`}</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus size={14} />
          Neue Übergabe
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
        data={handovers as unknown as Record<string, unknown>[]}
        pagination={{ page, pageSize, total }}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
        loading={loading}
      />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neue Übergabe" size="lg">
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
            <Input
              label="Von Mitarbeiter (ID)"
              type="number"
              value={form.from_employee_id}
              onChange={(e) => setForm((f) => ({ ...f, from_employee_id: e.target.value }))}
              placeholder="Mitarbeiter-ID"
            />
            <Input
              label="An Mitarbeiter (ID)"
              type="number"
              value={form.to_employee_id}
              onChange={(e) => setForm((f) => ({ ...f, to_employee_id: e.target.value }))}
              placeholder="Mitarbeiter-ID"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Von Station"
              value={form.from_station_id}
              onChange={(e) => setForm((f) => ({ ...f, from_station_id: e.target.value }))}
              options={(stations ?? []).map((s) => ({ value: String(s.id), label: s.full_name || s.code }))}
              placeholder="Station wählen..."
            />
            <Select
              label="An Station"
              value={form.to_station_id}
              onChange={(e) => setForm((f) => ({ ...f, to_station_id: e.target.value }))}
              options={(stations ?? []).map((s) => ({ value: String(s.id), label: s.full_name || s.code }))}
              placeholder="Station wählen..."
            />
          </div>
          <Input
            label="Übergabedatum"
            type="datetime-local"
            value={form.handover_date}
            onChange={(e) => setForm((f) => ({ ...f, handover_date: e.target.value }))}
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
