import { useState, type ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SettingItem {
  id: number
  label: string
  extra?: string
}

interface SettingsSectionProps {
  title: string
  items: SettingItem[]
  addForm?: ReactNode
  onDelete?: (id: number) => void
}

function SettingsSection({ title, items, addForm, onDelete }: SettingsSectionProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">{title} <span className="text-gray-400 font-normal">({items.length})</span></h3>
        <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
          <Plus size={14} />
          Hinzufügen
        </Button>
      </div>
      {open && addForm && (
        <div className="px-5 py-4 border-b border-gray-100 bg-amber-50/50">
          {addForm}
        </div>
      )}
      <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50">
            <div>
              <span className="text-sm text-gray-700">{item.label}</span>
              {item.extra && <span className="ml-2 text-xs text-gray-400">{item.extra}</span>}
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                className="p-1 text-gray-300 hover:text-red-500 rounded transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SimpleAddForm({ label, onAdd }: { label: string; onAdd: (val: string) => void }) {
  const [val, setVal] = useState('')
  return (
    <div className="flex gap-2">
      <Input placeholder={label} value={val} onChange={(e) => setVal(e.target.value)} className="flex-1" />
      <Button size="sm" onClick={() => { onAdd(val); setVal('') }}>Speichern</Button>
    </div>
  )
}

export default function AdminSettingsPage() {
  const [marken, setMarken] = useState<SettingItem[]>([
    { id: 1, label: 'Volkswagen', extra: 'VW' },
    { id: 2, label: 'Mercedes-Benz', extra: 'MB' },
    { id: 3, label: 'Ford', extra: 'Ford' },
    { id: 4, label: 'Renault', extra: 'Renault' },
    { id: 5, label: 'Opel', extra: 'Opel' },
  ])

  const [firmen, setFirmen] = useState<SettingItem[]>([
    { id: 1, label: 'EuRide' },
    { id: 2, label: 'GLS' },
    { id: 3, label: 'DPD' },
    { id: 4, label: 'AMZL' },
  ])

  const [statuses] = useState<SettingItem[]>([
    { id: 1, label: 'im Einsatz' },
    { id: 2, label: 'Puffer' },
    { id: 3, label: 'Werkstatt' },
    { id: 4, label: 'abgemeldet' },
    { id: 5, label: 'zurückgegeben' },
    { id: 6, label: 'verkauft' },
    { id: 7, label: 'in Bestellung' },
    { id: 8, label: 'Reserviert' },
    { id: 9, label: 'Gesperrt' },
    { id: 10, label: 'Unfall-Totalschaden' },
    { id: 11, label: 'Reparatur ausstehend' },
    { id: 12, label: 'TÜV fällig' },
    { id: 13, label: 'HU fällig' },
    { id: 14, label: 'Umrüstung' },
    { id: 15, label: 'Neuzulassung' },
    { id: 16, label: 'Stillgelegt' },
    { id: 17, label: 'Transportbereit' },
    { id: 18, label: 'Außer Dienst' },
  ])

  const [beschaffungsarten] = useState<SettingItem[]>([
    { id: 1, label: 'Leasing' },
    { id: 2, label: 'Kauf' },
    { id: 3, label: 'Miete' },
    { id: 4, label: 'Finanzierung' },
  ])

  const [reifentypen] = useState<SettingItem[]>([
    { id: 1, label: 'Sommerreifen' },
    { id: 2, label: 'Winterreifen' },
    { id: 3, label: 'Ganzjahresreifen' },
  ])

  const [reifenstatus] = useState<SettingItem[]>([
    { id: 1, label: 'Neu' },
    { id: 2, label: 'Gut' },
    { id: 3, label: 'Verschlissen' },
    { id: 4, label: 'Wechsel fällig' },
  ])

  const [dokumententypen] = useState<SettingItem[]>([
    { id: 1, label: 'Fahrzeugbrief' }, { id: 2, label: 'Fahrzeugschein' },
    { id: 3, label: 'Leasingvertrag' }, { id: 4, label: 'Kaufvertrag' },
    { id: 5, label: 'Versicherungspolice' }, { id: 6, label: 'HU-Protokoll' },
    { id: 7, label: 'AU-Protokoll' }, { id: 8, label: 'Unfallbericht' },
    { id: 9, label: 'Reparaturrechnung' }, { id: 10, label: 'Übergabeprotokoll' },
    { id: 11, label: 'Bußgeldbescheid' }, { id: 12, label: 'Schadensbericht' },
    { id: 13, label: 'TÜV-Bericht' }, { id: 14, label: 'Kraftfahrzeugsteuer' },
    { id: 15, label: 'Reifenzertifikat' }, { id: 16, label: 'Prüfbericht' },
    { id: 17, label: 'Werkstattrechnung' }, { id: 18, label: 'Mietvertrag' },
    { id: 19, label: 'Tankbelege' }, { id: 20, label: 'Sonstiges' },
  ])

  const [versicherungen] = useState<SettingItem[]>([
    { id: 1, label: 'Allianz' }, { id: 2, label: 'AXA' },
    { id: 3, label: 'HUK-COBURG' }, { id: 4, label: 'DEVK' },
    { id: 5, label: 'ERGO' }, { id: 6, label: 'Zurich' },
    { id: 7, label: 'Generali' }, { id: 8, label: 'Signal Iduna' },
  ])

  const [behoerden] = useState<SettingItem[]>([
    { id: 1, label: 'Bußgeldbehörde Hamburg', extra: 'bussgeldbescheid@hamburg.de' },
    { id: 2, label: 'Bußgeldbehörde München', extra: 'bussgeldbescheid@muenchen.de' },
    { id: 3, label: 'Ordnungsamt Berlin', extra: 'ordnungsamt@berlin.de' },
    { id: 4, label: 'Ordnungsamt Tauberbischofsheim', extra: 'ordnungsamt@tbb.de' },
    { id: 5, label: 'Kraftfahrtbundesamt', extra: 'kba@kba.de' },
  ])

  function addMarke(val: string) {
    if (!val) return
    setMarken([...marken, { id: Date.now(), label: val }])
  }

  function addFirma(val: string) {
    if (!val) return
    setFirmen([...firmen, { id: Date.now(), label: val }])
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <p className="text-sm text-gray-500 mt-0.5">Stammdaten und Konfiguration verwalten</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SettingsSection
          title="Fahrzeug Marken"
          items={marken}
          addForm={<SimpleAddForm label="Neue Marke" onAdd={addMarke} />}
          onDelete={(id) => setMarken(marken.filter((m) => m.id !== id))}
        />

        <SettingsSection
          title="Firmen"
          items={firmen}
          addForm={<SimpleAddForm label="Neue Firma" onAdd={addFirma} />}
          onDelete={(id) => setFirmen(firmen.filter((f) => f.id !== id))}
        />

        <SettingsSection title="Fahrzeug-Status (18)" items={statuses} />

        <SettingsSection title="Beschaffungsarten" items={beschaffungsarten} />

        <SettingsSection title="Reifentypen" items={reifentypen} />

        <SettingsSection title="Reifenstatus" items={reifenstatus} />

        <SettingsSection title="Dokumententypen" items={dokumententypen} />

        <SettingsSection title="Versicherungsgesellschaften" items={versicherungen} />

        <SettingsSection
          title="Bußgeldbehörden"
          items={behoerden}
        />
      </div>
    </div>
  )
}
