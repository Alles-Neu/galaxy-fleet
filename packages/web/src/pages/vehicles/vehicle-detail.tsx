import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Camera, FileText } from 'lucide-react'
import { Tabs } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { formatDate, formatNumber } from '@/lib/utils'
import { mockVehicles, mockHandovers, mockAccidents, mockTours, type Vehicle } from '@/lib/mock-data'

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 min-w-[160px] pt-0.5 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value ?? '—'}</span>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">{title}</h3>
      {children}
    </div>
  )
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('fahrzeug')

  const vehicle: Vehicle = mockVehicles.find((v) => v.id === Number(id)) ?? mockVehicles[0]
  const vehicleHandovers = mockHandovers.filter((h) => h.kennzeichen === vehicle.kennzeichen)
  const vehicleAccidents = mockAccidents.filter((a) => a.kennzeichen === vehicle.kennzeichen)
  const vehicleTours = mockTours.filter((t) => t.kennzeichen === vehicle.kennzeichen)

  const handoverCols: Column<Record<string, unknown>>[] = [
    { header: 'Datum', accessor: 'datum', render: (r) => <>{formatDate(r['datum'] as string)}</> },
    { header: 'Von', accessor: 'uebergebenVon' },
    { header: 'An', accessor: 'uebergebenZu' },
    { header: 'Km-Stand', accessor: 'kmStand', render: (r) => <>{formatNumber(r['kmStand'] as number)} km</> },
    { header: 'Station', accessor: 'anStation' },
    { header: 'Bestätigt', accessor: 'bestaetigt', render: (r) => <>{r['bestaetigt'] ? '✓' : '–'}</> },
  ]

  const accidentCols: Column<Record<string, unknown>>[] = [
    { header: 'Datum', accessor: 'datum', render: (r) => <>{formatDate(r['datum'] as string)}</> },
    { header: 'Fahrer', accessor: 'fahrer' },
    { header: 'Schuldart', accessor: 'schuldart' },
    { header: 'Status', accessor: 'bearbeitungsstatus', render: (r) => <StatusBadge status={r['bearbeitungsstatus'] as string} /> },
    { header: 'Sachbearbeiter', accessor: 'sachbearbeiter' },
  ]

  const tourCols: Column<Record<string, unknown>>[] = [
    { header: 'Datum', accessor: 'datum', render: (r) => <>{formatDate(r['datum'] as string)}</> },
    { header: 'Tour Nr.', accessor: 'tourNr' },
    { header: 'Fahrer', accessor: 'fahrer' },
    { header: 'Retouren', accessor: 'retouren' },
    { header: 'Typ', accessor: 'tourType', render: (r) => <StatusBadge status={r['tourType'] as string} size="sm" /> },
  ]

  const fuelData = [
    { datum: '2024-11-28', kmStand: 141800, liter: 65.4, kosten: 118.2, station: 'Shell Hamburg' },
    { datum: '2024-11-14', kmStand: 138200, liter: 58.1, kosten: 105.0, station: 'Aral Hamburg' },
    { datum: '2024-10-30', kmStand: 134500, liter: 71.2, kosten: 128.4, station: 'Total Hamburg' },
  ]
  const fuelCols: Column<Record<string, unknown>>[] = [
    { header: 'Datum', accessor: 'datum', render: (r) => <>{formatDate(r['datum'] as string)}</> },
    { header: 'Km-Stand', accessor: 'kmStand', render: (r) => <>{formatNumber(r['kmStand'] as number)} km</> },
    { header: 'Liter', accessor: 'liter', render: (r) => <>{(r['liter'] as number).toFixed(1)} L</> },
    { header: 'Kosten', accessor: 'kosten', render: (r) => <>{(r['kosten'] as number).toFixed(2)} €</> },
    { header: 'Tankstelle', accessor: 'station' },
  ]

  const docData = [
    { typ: 'Fahrzeugbrief', name: 'Brief_B-ER5720.pdf', datum: '2019-03-15', size: '1.2 MB' },
    { typ: 'Versicherung', name: 'Versicherung_2024.pdf', datum: '2024-01-01', size: '0.8 MB' },
    { typ: 'HU-Protokoll', name: 'HU_2023.pdf', datum: '2023-06-15', size: '2.1 MB' },
    { typ: 'Leasingvertrag', name: 'Leasing_2019.pdf', datum: '2019-03-01', size: '3.4 MB' },
  ]
  const docCols: Column<Record<string, unknown>>[] = [
    { header: 'Typ', accessor: 'typ' },
    { header: 'Dateiname', accessor: 'name', render: (r) => <span className="text-blue-600 hover:underline cursor-pointer">{r['name'] as string}</span> },
    { header: 'Datum', accessor: 'datum', render: (r) => <>{formatDate(r['datum'] as string)}</> },
    { header: 'Größe', accessor: 'size' },
  ]

  const ticketData = [
    { id: 'TK-001', betreff: 'Reifenwechsel fällig', status: 'In Bearbeitung', erstellt: '2024-11-20', prioritaet: 'Hoch' },
    { id: 'TK-002', betreff: 'Klimaanlage defekt', status: 'Abgeschlossen', erstellt: '2024-10-05', prioritaet: 'Mittel' },
  ]
  const ticketCols: Column<Record<string, unknown>>[] = [
    { header: 'ID', accessor: 'id', render: (r) => <span className="font-mono text-xs">{r['id'] as string}</span> },
    { header: 'Betreff', accessor: 'betreff' },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r['status'] as string} size="sm" /> },
    { header: 'Priorität', accessor: 'prioritaet' },
    { header: 'Erstellt', accessor: 'erstellt', render: (r) => <>{formatDate(r['erstellt'] as string)}</> },
  ]

  const changelogData = [
    { feld: 'Status', von: 'im Einsatz', zu: 'Werkstatt', datum: '2024-11-20', nutzer: 'Dispatcher' },
    { feld: 'Zugewiesen an', von: 'Ahmad Faris', zu: 'Mohamed Al-Rashidi', datum: '2024-09-01', nutzer: 'Admin' },
    { feld: 'Km-Stand', von: '135000', zu: '142350', datum: '2024-11-20', nutzer: 'System' },
  ]
  const changelogCols: Column<Record<string, unknown>>[] = [
    { header: 'Feld', accessor: 'feld' },
    { header: 'Von', accessor: 'von' },
    { header: 'Zu', accessor: 'zu' },
    { header: 'Geändert von', accessor: 'nutzer' },
    { header: 'Datum', accessor: 'datum', render: (r) => <>{formatDate(r['datum'] as string)}</> },
  ]

  const tabs = [
    {
      id: 'fahrzeug',
      label: 'Fahrzeug',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard title="Aktuelle Fahrzeugdaten">
            <FieldRow label="Kennzeichen" value={<span className="font-mono font-bold text-blue-600">{vehicle.kennzeichen}</span>} />
            <FieldRow label="FIN" value={<span className="font-mono text-xs">{vehicle.fin}</span>} />
            <FieldRow label="Marke / Modell" value={`${vehicle.marke} ${vehicle.modell}`} />
            <FieldRow label="Baujahr" value={vehicle.baujahr} />
            <FieldRow label="Farbe" value={vehicle.farbe} />
            <FieldRow label="Km-Stand" value={`${formatNumber(vehicle.kmStand)} km`} />
            <FieldRow label="Status" value={<StatusBadge status={vehicle.status} />} />
            <FieldRow label="Standort" value={vehicle.standort} />
            <FieldRow label="Firma" value={vehicle.firma} />
            <FieldRow label="Zugewiesen an" value={vehicle.zugewiesenAn || '—'} />
          </SectionCard>

          <SectionCard title="Beschaffung">
            <FieldRow label="Art" value={vehicle.beschaffungsart} />
            <FieldRow label="Erstzulassung" value={formatDate(vehicle.erstzulassung)} />
            <FieldRow label="Beklebt" value={vehicle.beklebt ? 'Ja' : 'Nein'} />
            <FieldRow label="Servicefahrzeug" value={vehicle.servicefahrzeug ? 'Ja' : 'Nein'} />
            <FieldRow label="Inventartyp" value={vehicle.inventartyp} />
            <FieldRow label="Gesamtgewicht" value={vehicle.gesamtgewicht} />
          </SectionCard>

          <SectionCard title="Versicherung">
            <FieldRow label="Versicherung" value={vehicle.versicherung} />
            <FieldRow label="Versicherungsnr." value={vehicle.versicherungsnr} />
          </SectionCard>

          <SectionCard title="Inspektion">
            <FieldRow label="Letzte HU" value="15.06.2023" />
            <FieldRow label="Nächste HU" value="15.06.2025" />
            <FieldRow label="Letzte AU" value="15.06.2023" />
            <FieldRow label="Reifentyp" value="Winterreifen" />
            <FieldRow label="Reifenstatus" value="Gut" />
          </SectionCard>

          <SectionCard title="Herstellerdaten">
            <FieldRow label="Hersteller" value={vehicle.marke} />
            <FieldRow label="Modell" value={vehicle.modell} />
            <FieldRow label="Hubraum" value="1968 ccm" />
            <FieldRow label="Motorleistung" value="130 kW / 177 PS" />
            <FieldRow label="Kraftstoff" value="Diesel" />
            <FieldRow label="Getriebe" value="Schaltgetriebe" />
          </SectionCard>

          <SectionCard title="Sonstiges">
            <FieldRow label="QR-Code" value={<span className="font-mono">{vehicle.qrCode}</span>} />
            <FieldRow label="Letztes Übergabedatum" value={formatDate(vehicle.letzteUebergabe)} />
            <FieldRow label="Notizen" value="—" />
          </SectionCard>
        </div>
      ),
    },
    {
      id: 'milkyway',
      label: 'MilkyWay',
      content: (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Tourhistorie</h3>
          <DataTable
            columns={tourCols}
            data={vehicleTours as unknown as Record<string, unknown>[]}
            emptyMessage="Keine Touren für dieses Fahrzeug"
          />
        </div>
      ),
    },
    {
      id: 'fleetmanagement',
      label: 'Fleetmanagement',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SectionCard title="Einsatzzeit">
              <FieldRow label="Aktive Tage (Monat)" value="18" />
              <FieldRow label="Ausfallzeit (Monat)" value="5 Tage (Werkstatt)" />
              <FieldRow label="Ø Km/Tag" value="285 km" />
            </SectionCard>
            <SectionCard title="Kosten (MTD)">
              <FieldRow label="Kraftstoff" value="341,60 €" />
              <FieldRow label="Werkstatt" value="580,00 €" />
              <FieldRow label="Gesamt" value="921,60 €" />
            </SectionCard>
            <SectionCard title="Zustand">
              <FieldRow label="Schäden offen" value="1" />
              <FieldRow label="Tickets offen" value="1" />
              <FieldRow label="Letzte Inspektion" value="15.06.2023" />
            </SectionCard>
          </div>
        </div>
      ),
    },
    {
      id: 'tanken',
      label: 'Tanken',
      content: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm">Neuer Tankeintrag</Button>
          </div>
          <DataTable columns={fuelCols} data={fuelData as Record<string, unknown>[]} emptyMessage="Keine Tankeinträge" />
        </div>
      ),
    },
    {
      id: 'uebergabe',
      label: 'Übergabe',
      content: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm">Neue Übergabe</Button>
          </div>
          <DataTable columns={handoverCols} data={vehicleHandovers as unknown as Record<string, unknown>[]} emptyMessage="Keine Übergaben für dieses Fahrzeug" />
        </div>
      ),
    },
    {
      id: 'unfaelle',
      label: 'Unfälle',
      content: (
        <DataTable columns={accidentCols} data={vehicleAccidents as unknown as Record<string, unknown>[]} emptyMessage="Keine Unfälle für dieses Fahrzeug" />
      ),
    },
    {
      id: 'bilder',
      label: 'Bilder',
      content: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" variant="outline"><Camera size={14} /> Bild hochladen</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                <Camera size={24} />
              </div>
            ))}
            <div className="aspect-video border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-amber-300 hover:bg-amber-50/50 transition-colors">
              <Camera size={20} />
              <span className="text-xs mt-1">Hochladen</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dokumente',
      label: 'Dokumente',
      content: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" variant="outline"><FileText size={14} /> Dokument hochladen</Button>
          </div>
          <DataTable columns={docCols} data={docData as Record<string, unknown>[]} emptyMessage="Keine Dokumente" />
        </div>
      ),
    },
    {
      id: 'rechnungen',
      label: 'Rechnungen',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Keine Rechnungen vorhanden.</p>
        </div>
      ),
    },
    {
      id: 'tickets',
      label: 'Tickets',
      content: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm">Neues Ticket</Button>
          </div>
          <DataTable columns={ticketCols} data={ticketData as Record<string, unknown>[]} emptyMessage="Keine Tickets" />
        </div>
      ),
    },
    {
      id: 'aenderungslog',
      label: 'Änderungslog',
      content: (
        <DataTable columns={changelogCols} data={changelogData as Record<string, unknown>[]} emptyMessage="Keine Änderungen" />
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/vehicles')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 font-mono">{vehicle.kennzeichen}</h1>
              <StatusBadge status={vehicle.status} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {vehicle.marke} {vehicle.modell} · {vehicle.standort} · {vehicle.qrCode}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Edit size={14} />
          Bearbeiten
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}
