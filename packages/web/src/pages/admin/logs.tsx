import { useState } from 'react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { FilterBar, type FilterField } from '@/components/ui/filter-bar'
import { formatDate } from '@/lib/utils'

interface ChangeLog {
  id: number
  qrCode: string
  kennzeichen: string
  fin: string
  feld: string
  von: string
  zu: string
  nutzer: string
  datum: string
}

const mockLogs: ChangeLog[] = [
  { id: 1, qrCode: 'GF-001', kennzeichen: 'B-ER 5720', fin: 'WV2ZZZ2HZ9H045231', feld: 'Status', von: 'im Einsatz', zu: 'Werkstatt', nutzer: 'Dispatcher', datum: '2024-11-20' },
  { id: 2, qrCode: 'GF-001', kennzeichen: 'B-ER 5720', fin: 'WV2ZZZ2HZ9H045231', feld: 'Km-Stand', von: '135000', zu: '142350', nutzer: 'System', datum: '2024-11-20' },
  { id: 3, qrCode: 'GF-002', kennzeichen: 'B-ER 5721', fin: 'WV2ZZZ2HZ9H045232', feld: 'Zugewiesen an', von: 'Ahmad Faris', zu: 'Fatima Özdemir', nutzer: 'Admin', datum: '2024-11-15' },
  { id: 4, qrCode: 'GF-003', kennzeichen: 'HH-GF 1234', fin: 'WDB9066351L346921', feld: 'Standort', von: 'Depot', zu: 'DHH1-Hamburg', nutzer: 'Admin', datum: '2024-11-10' },
  { id: 5, qrCode: 'GF-005', kennzeichen: 'MUC-GF 9012', fin: 'XLR0A7100G0001234', feld: 'Beklebt', von: 'Nein', zu: 'Ja', nutzer: 'Admin', datum: '2024-11-05' },
  { id: 6, qrCode: 'GF-004', kennzeichen: 'HB-GF 5678', fin: 'WDB9066351L346922', feld: 'Status', von: 'im Einsatz', zu: 'Puffer', nutzer: 'Dispatcher', datum: '2024-10-30' },
  { id: 7, qrCode: 'GF-007', kennzeichen: 'HH-DPD 7788', fin: 'WDB9066351L346927', feld: 'Versicherung', von: 'Allianz', zu: 'HUK-COBURG', nutzer: 'Admin', datum: '2024-10-15' },
  { id: 8, qrCode: 'GF-010', kennzeichen: 'B-ER 9900', fin: 'WV2ZZZ2HZ9H045240', feld: 'Status', von: 'im Einsatz', zu: 'abgemeldet', nutzer: 'Admin', datum: '2024-07-01' },
]

const filters: FilterField[] = [
  { key: 'kennzeichen', label: 'Kennzeichen', type: 'text', placeholder: 'B-ER...' },
  { key: 'qrCode', label: 'QR-Code', type: 'text', placeholder: 'GF-...' },
  { key: 'nutzer', label: 'Geändert von', type: 'text', placeholder: 'Nutzername...' },
  { key: 'datum', label: 'Datum', type: 'date-range' },
]

const columns: Column<Record<string, unknown>>[] = [
  { header: '#', accessor: 'id', render: (r) => <span className="text-gray-400 text-xs">{r['id'] as number}</span> },
  { header: 'QR-Code', accessor: 'qrCode', render: (r) => <span className="font-mono text-xs text-gray-600">{r['qrCode'] as string}</span> },
  {
    header: 'Kennzeichen',
    accessor: 'kennzeichen',
    sortable: true,
    render: (r) => <span className="font-mono font-semibold text-blue-600">{r['kennzeichen'] as string}</span>,
  },
  { header: 'FIN', accessor: 'fin', render: (r) => <span className="font-mono text-xs text-gray-500">{r['fin'] as string}</span> },
  { header: 'Feld geändert', accessor: 'feld', render: (r) => <span className="font-medium text-gray-700">{r['feld'] as string}</span> },
  {
    header: 'Geändert von',
    accessor: 'von',
    render: (r) => <span className="text-red-500 text-sm line-through">{r['von'] as string}</span>,
  },
  {
    header: 'Geändert zu',
    accessor: 'zu',
    render: (r) => <span className="text-green-600 text-sm font-medium">{r['zu'] as string}</span>,
  },
  { header: 'Geändert bei', accessor: 'nutzer', render: (r) => <span className="text-gray-600 text-sm">{r['nutzer'] as string}</span> },
  {
    header: 'Änderungsdatum',
    accessor: 'datum',
    sortable: true,
    render: (r) => <>{formatDate(r['datum'] as string)}</>,
  },
]

export default function AdminLogsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filterValues, setFilterValues] = useState<Record<string, string | boolean>>({})

  const filtered = mockLogs.filter((log: ChangeLog) => {
    for (const [key, val] of Object.entries(filterValues)) {
      if (!val) continue
      const lKey = key as keyof ChangeLog
      const cellVal = String(log[lKey] ?? '').toLowerCase()
      if (!cellVal.includes(String(val).toLowerCase())) return false
    }
    return true
  })

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Änderungslogs</h1>
        <p className="text-sm text-gray-500 mt-0.5">{filtered.length} Einträge</p>
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
