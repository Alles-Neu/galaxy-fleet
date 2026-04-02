import { useState } from 'react'
import { Search } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { mockTours, type Tour } from '@/lib/mock-data'

const columns: Column<Record<string, unknown>>[] = [
  { header: 'MilkyWay', accessor: 'milkyway', render: () => <span className="text-xs font-medium text-amber-600">EuRide</span> },
  { header: 'Standort', accessor: 'standort', render: (r) => <span className="text-xs text-gray-600">{r['standort'] as string}</span> },
  { header: 'Datum', accessor: 'datum', sortable: true, render: (r) => <>{formatDate(r['datum'] as string)}</> },
  { header: 'Tour Nr.', accessor: 'tourNr', render: (r) => <span className="font-mono font-bold">{r['tourNr'] as string}</span> },
  { header: 'PersNr', accessor: 'pid', render: (r) => <span className="font-mono text-xs">{r['pid'] as string}</span> },
  { header: 'Fahrer', accessor: 'fahrer' },
  {
    header: 'Kennzeichen',
    accessor: 'kennzeichen',
    render: (r) => <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{r['kennzeichen'] as string}</span>,
  },
  { header: 'TourId', accessor: 'tourId', render: (r) => <span className="font-mono text-xs text-gray-500">{r['tourId'] as string}</span> },
  { header: 'Typ', accessor: 'tourType', render: (r) => <StatusBadge status={r['tourType'] as string} size="sm" /> },
]

export default function MilkywaySearchPage() {
  const [search, setSearch] = useState({
    kennzeichen: '',
    personalnummer: '',
    name: '',
    station: '',
    milkyway: '',
    datumVon: '',
    datumBis: '',
  })
  const [results, setResults] = useState<Tour[]>([])
  const [searched, setSearched] = useState(false)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const filtered = mockTours.filter((t) => {
      if (search.kennzeichen && !t.kennzeichen.toLowerCase().includes(search.kennzeichen.toLowerCase())) return false
      if (search.personalnummer && !t.pid.toLowerCase().includes(search.personalnummer.toLowerCase())) return false
      if (search.name && !t.fahrer.toLowerCase().includes(search.name.toLowerCase())) return false
      if (search.station && !t.standort.toLowerCase().includes(search.station.toLowerCase())) return false
      if (search.datumVon && t.datum < search.datumVon) return false
      if (search.datumBis && t.datum > search.datumBis) return false
      return true
    })
    setResults(filtered)
    setSearched(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">MilkyWay Suche</h1>
        <p className="text-sm text-gray-500 mt-0.5">Touren und Fahrerdaten durchsuchen</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Input
              label="Kennzeichen"
              placeholder="B-ER..."
              value={search.kennzeichen}
              onChange={(e) => setSearch({ ...search, kennzeichen: e.target.value })}
            />
            <Input
              label="Personalnummer"
              placeholder="P-10045"
              value={search.personalnummer}
              onChange={(e) => setSearch({ ...search, personalnummer: e.target.value })}
            />
            <Input
              label="Name"
              placeholder="Fahrername..."
              value={search.name}
              onChange={(e) => setSearch({ ...search, name: e.target.value })}
            />
            <Input
              label="Station"
              placeholder="DHH1..."
              value={search.station}
              onChange={(e) => setSearch({ ...search, station: e.target.value })}
            />
            <Select
              label="MilkyWay"
              options={[
                { value: '', label: 'Alle' },
                { value: 'EuRide', label: 'EuRide' },
                { value: 'GLS', label: 'GLS' },
                { value: 'DPD', label: 'DPD' },
              ]}
              value={search.milkyway}
              onChange={(e) => setSearch({ ...search, milkyway: e.target.value })}
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Datum von</label>
              <input
                type="date"
                value={search.datumVon}
                onChange={(e) => setSearch({ ...search, datumVon: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Datum bis</label>
              <input
                type="date"
                value={search.datumBis}
                onChange={(e) => setSearch({ ...search, datumBis: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit">
              <Search size={14} />
              Suchen
            </Button>
          </div>
        </form>
      </div>

      {searched && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">{results.length} Ergebnisse gefunden</p>
          <DataTable
            columns={columns}
            data={results as unknown as Record<string, unknown>[]}
            emptyMessage="Keine Ergebnisse für diese Suchanfrage"
          />
        </div>
      )}
    </div>
  )
}
