import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useApi, apiPost } from '@/hooks/useApi'

interface ApiOffense {
  id: number
  offense_date?: string
  personnel_number?: string
  driver_name?: string
  fine_amount?: number
  reference_number?: string
  confirmed?: boolean
  vehicle?: { id: number; license_plate: string }
  offense_type?: { id: number; name: string }
  authority?: { id: number; name: string }
}

interface ApiVehicle { id: number; license_plate: string }
interface MasterItem { id: number; name: string }

const filters: FilterField[] = [
  {
    key: 'confirmed',
    label: 'Bestätigt',
    type: 'select',
    options: [
      { value: 'true', label: 'Bestätigt' },
      { value: 'false', label: 'Nicht bestätigt' },
    ],
  },
  { key: 'driver_name', label: 'Fahrer', type: 'text', placeholder: 'Name...' },
  { key: 'datum', label: 'Datum', type: 'date-range' },
]

const columns: Column<Record<string, unknown>>[] = [
  {
    header: '#',
    accessor: 'id',
    render: (r) => <span className="text-gray-400 text-xs">{r['id'] as number}</span>,
  },
  {
    header: 'Datum',
    accessor: 'offense_date',
    sortable: true,
    render: (r) => <>{formatDate(r['offense_date'] as string)}</>,
  },
  {
    header: 'Kennzeichen',
    accessor: 'vehicle',
    render: (r) => {
      const v = r['vehicle'] as ApiOffense['vehicle']
      return <span className="font-mono font-semibold text-blue-600">{v?.license_plate || '—'}</span>
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
    header: 'Verstoß',
    accessor: 'offense_type',
    className: 'max-w-xs',
    render: (r) => {
      const ot = r['offense_type'] as ApiOffense['offense_type']
      return <span className="text-sm text-gray-700 line-clamp-2">{ot?.name || '—'}</span>
    },
  },
  {
    header: 'Bußgeld',
    accessor: 'fine_amount',
    sortable: true,
    render: (r) => {
      const amt = r['fine_amount'] as number | undefined
      return <span className="font-medium text-red-600">{amt != null ? formatCurrency(amt) : '—'}</span>
    },
  },
  {
    header: 'Aktenzeichen',
    accessor: 'reference_number',
    render: (r) => (
      <span className="font-mono text-xs text-gray-500">{(r['reference_number'] as string) || '—'}</span>
    ),
  },
  {
    header: 'Behörde',
    accessor: 'authority',
    render: (r) => {
      const a = r['authority'] as ApiOffense['authority']
      return <span className="text-xs text-gray-600">{a?.name || '—'}</span>
    },
  },
  {
    header: 'Bestätigt',
    accessor: 'confirmed',
    render: (r) => (
      <span className={r['confirmed'] ? 'text-green-600 font-medium text-sm' : 'text-amber-600 text-sm'}>
        {r['confirmed'] ? '✓ Ja' : '⏳ Ausstehend'}
      </span>
    ),
  },
]

interface CreateOffenseForm {
  offense_date: string
  vehicle_id: string
  personnel_number: string
  driver_name: string
  offense_type_id: string
  fine_amount: string
  reference_number: string
}

export default function OffenseListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState<CreateOffenseForm>({
    offense_date: '',
    vehicle_id: '',
    personnel_number: '',
    driver_name: '',
    offense_type_id: '',
    fine_amount: '',
    reference_number: '',
  })

  const params = new URLSearchParams({ page: String(page), limit: String(pageSize) })
  if (filterValues['confirmed']) params.set('confirmed', String(filterValues['confirmed']))
  if (filterValues['driver_name']) params.set('driver_name', String(filterValues['driver_name']))

  const { data, loading, error, refetch } = useApi<{ data: ApiOffense[]; total: number }>(
    `/traffic-offenses?${params.toString()}`,
    [page, pageSize, JSON.stringify(filterValues)],
  )

  const { data: vehiclesData } = useApi<{ data: ApiVehicle[]; total: number }>('/vehicles?page=1&limit=500')
  const { data: offenseTypes } = useApi<MasterItem[]>('/admin/master-data/offense-types')

  const offenses = data?.data ?? []
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
      if (form.offense_date) payload.offense_date = form.offense_date
      if (form.personnel_number) payload.personnel_number = form.personnel_number
      if (form.driver_name) payload.driver_name = form.driver_name
      if (form.offense_type_id) payload.offense_type_id = Number(form.offense_type_id)
      if (form.fine_amount) payload.fine_amount = Number(form.fine_amount)
      if (form.reference_number) payload.reference_number = form.reference_number
      await apiPost('/traffic-offenses', payload)
      setShowModal(false)
      setForm({
        offense_date: '', vehicle_id: '', personnel_number: '', driver_name: '',
        offense_type_id: '', fine_amount: '', reference_number: '',
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
          <h1 className="text-2xl font-bold text-gray-900">Verkehrsverstöße</h1>
          <p className="text-sm text-gray-500 mt-0.5">{loading ? '...' : `${total} Einträge`}</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus size={14} />
          Neuer Verstoß
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
        data={offenses as unknown as Record<string, unknown>[]}
        pagination={{ page, pageSize, total }}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
        loading={loading}
      />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neuer Verkehrsverstoß" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>
          )}
          <Input
            label="Datum des Verstoßes"
            type="date"
            value={form.offense_date}
            onChange={(e) => setForm((f) => ({ ...f, offense_date: e.target.value }))}
          />
          <Select
            label="Fahrzeug *"
            value={form.vehicle_id}
            onChange={(e) => setForm((f) => ({ ...f, vehicle_id: e.target.value }))}
            options={vehicles.map((v) => ({ value: String(v.id), label: v.license_plate }))}
            placeholder="Fahrzeug wählen..."
          />
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <Select
            label="Art des Verstoßes"
            value={form.offense_type_id}
            onChange={(e) => setForm((f) => ({ ...f, offense_type_id: e.target.value }))}
            options={(offenseTypes ?? []).map((o) => ({ value: String(o.id), label: o.name }))}
            placeholder="Verstoßart wählen..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Bußgeld (€)"
              type="number"
              value={form.fine_amount}
              onChange={(e) => setForm((f) => ({ ...f, fine_amount: e.target.value }))}
              placeholder="0.00"
            />
            <Input
              label="Aktenzeichen"
              value={form.reference_number}
              onChange={(e) => setForm((f) => ({ ...f, reference_number: e.target.value }))}
              placeholder="AZ-12345"
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
