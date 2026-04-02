import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { mockTours } from '@/lib/mock-data'

const TOUR_TYPES = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Extra', label: 'Extra' },
  { value: 'Rescue', label: 'Rescue' },
  { value: 'SUB Rescue', label: 'SUB Rescue' },
  { value: 'Abwesend', label: 'Abwesend' },
]

const ABSENCE_TYPES = [
  { value: '', label: '— Kein —' },
  { value: 'Krank', label: 'Krank' },
  { value: 'Urlaub', label: 'Urlaub' },
  { value: 'Unfall', label: 'Unfall' },
  { value: 'Sonstiges', label: 'Sonstiges' },
]

const columns: Column<Record<string, unknown>>[] = [
  {
    header: 'TourId',
    accessor: 'tourId',
    render: (r) => <span className="font-mono text-xs text-gray-500">{r['tourId'] as string}</span>,
  },
  { header: 'Tour Nr.', accessor: 'tourNr', render: (r) => <span className="font-mono font-bold">{r['tourNr'] as string}</span> },
  { header: 'Standort', accessor: 'standort', render: (r) => <span className="text-xs text-gray-600">{r['standort'] as string}</span> },
  { header: 'PID', accessor: 'pid', render: (r) => <span className="font-mono text-xs">{r['pid'] as string}</span> },
  { header: 'Fahrer', accessor: 'fahrer' },
  {
    header: 'Kennzeichen',
    accessor: 'kennzeichen',
    render: (r) => <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{r['kennzeichen'] as string}</span>,
  },
  { header: 'Retouren', accessor: 'retouren', render: (r) => <span className={(r['retouren'] as number) > 5 ? 'text-red-600 font-medium' : 'text-gray-700'}>{r['retouren'] as number}</span> },
  {
    header: 'Infos Rücksendungen',
    accessor: 'infos',
    render: (r) => <span className="text-xs text-gray-600">{(r['infos'] as string) || '—'}</span>,
  },
  { header: 'Typ', accessor: 'tourType', render: (r) => <StatusBadge status={r['tourType'] as string} size="sm" /> },
]

export default function DailyPage() {
  const { station } = useParams<{ station: string }>()
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    tourNr: '',
    pid: '',
    fahrer: '',
    kennzeichen: '',
    retouren: '0',
    infos: '',
    tourType: 'Normal',
    absenceType: '',
  })

  const today = '2024-12-04'
  const stationLabel = station ?? 'DHH1'
  const tours = mockTours.filter(
    (t) => t.standort.startsWith(stationLabel) && t.datum === today,
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setModalOpen(false)
    alert(`Tour ${formData.tourNr} wurde erfolgreich hinzugefügt.`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily – {stationLabel}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{formatDate(today)} · {tours.length} Touren</p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={14} />
          Tour hinzufügen
        </Button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Gesamt Touren', value: tours.length },
          { label: 'Normal', value: tours.filter((t) => t.tourType === 'Normal').length },
          { label: 'Extra', value: tours.filter((t) => t.tourType === 'Extra').length },
          { label: 'Rescue', value: tours.filter((t) => t.tourType === 'Rescue' || t.tourType === 'SUB Rescue').length },
          { label: 'Gesamt Retouren', value: tours.reduce((s, t) => s + t.retouren, 0) },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={tours as unknown as Record<string, unknown>[]}
        emptyMessage={`Keine Touren für ${stationLabel} heute`}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Neue Tour – ${stationLabel}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Station"
              value={stationLabel}
              disabled
            />
            <Input
              label="Tour Nr."
              value={formData.tourNr}
              onChange={(e) => setFormData({ ...formData, tourNr: e.target.value })}
              placeholder="1, 2, E1..."
              required
            />
            <Input
              label="PID"
              value={formData.pid}
              onChange={(e) => setFormData({ ...formData, pid: e.target.value })}
              placeholder="P-10045"
            />
            <Input
              label="Fahrer"
              value={formData.fahrer}
              onChange={(e) => setFormData({ ...formData, fahrer: e.target.value })}
              placeholder="Name..."
            />
            <Input
              label="Kennzeichen"
              value={formData.kennzeichen}
              onChange={(e) => setFormData({ ...formData, kennzeichen: e.target.value })}
              placeholder="B-ER 5720"
            />
            <Input
              label="Retouren"
              type="number"
              value={formData.retouren}
              onChange={(e) => setFormData({ ...formData, retouren: e.target.value })}
              min="0"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">Tour Typ</label>
            <div className="flex flex-wrap gap-2">
              {TOUR_TYPES.map((tt) => (
                <label key={tt.value} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="tourType"
                    value={tt.value}
                    checked={formData.tourType === tt.value}
                    onChange={() => setFormData({ ...formData, tourType: tt.value })}
                    className="text-amber-500"
                  />
                  <span className="text-sm text-gray-700">{tt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {formData.tourType === 'Abwesend' && (
            <Select
              label="Abwesenheitsgrund"
              options={ABSENCE_TYPES}
              value={formData.absenceType}
              onChange={(e) => setFormData({ ...formData, absenceType: e.target.value })}
            />
          )}

          <Input
            label="Infos / Rücksendungen"
            value={formData.infos}
            onChange={(e) => setFormData({ ...formData, infos: e.target.value })}
            placeholder="Bemerkungen..."
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Abbrechen</Button>
            <Button type="submit">Tour hinzufügen</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
