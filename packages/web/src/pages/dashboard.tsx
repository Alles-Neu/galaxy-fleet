import { Car, AlertTriangle, ArrowLeftRight, FileWarning, Truck, Wrench, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { KpiCard } from '@/components/ui/kpi-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { formatDate } from '@/lib/utils'
import { fleetStatusSummary, mockVehicles, mockTours, tourStatsByMonth } from '@/lib/mock-data'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'

const fleetChartData = [
  { name: 'Im Einsatz', value: fleetStatusSummary.imEinsatz, color: '#22c55e' },
  { name: 'Puffer', value: fleetStatusSummary.puffer, color: '#3b82f6' },
  { name: 'Werkstatt', value: fleetStatusSummary.werkstatt, color: '#f59e0b' },
  { name: 'Abgemeldet', value: fleetStatusSummary.abgemeldet, color: '#9ca3af' },
]

const workshopVehicles = mockVehicles.filter((v) => v.status === 'Werkstatt')
const todayTours = mockTours.filter((t) => t.datum === '2024-12-04')

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Fahrzeugliste', icon: <Car size={20} />, to: '/vehicles', color: 'bg-blue-500' },
          { label: 'Neue Übergabe', icon: <ArrowLeftRight size={20} />, to: '/handovers', color: 'bg-green-500' },
          { label: 'Neuer Unfall', icon: <AlertTriangle size={20} />, to: '/accidents', color: 'bg-red-500' },
          { label: 'Neuer Verstoß', icon: <FileWarning size={20} />, to: '/offenses', color: 'bg-purple-500' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            className="flex flex-col items-center justify-center gap-2 p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className={`p-3 rounded-xl ${item.color} text-white group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
          </button>
        ))}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          icon={<AlertTriangle size={20} />}
          label="Meldungen"
          value={3}
          color="red"
          trend={{ value: -15, label: 'zum Vormonat' }}
        />
        <KpiCard
          icon={<ArrowLeftRight size={20} />}
          label="Übergaben (Monat)"
          value={47}
          color="blue"
          trend={{ value: 8, label: 'zum Vormonat' }}
        />
        <KpiCard
          icon={<AlertTriangle size={20} />}
          label="Unfälle (Monat)"
          value={2}
          color="amber"
          trend={{ value: -33, label: 'zum Vormonat' }}
        />
        <KpiCard
          icon={<Truck size={20} />}
          label="Touren (Monat)"
          value={1420}
          color="green"
          trend={{ value: 5, label: 'zum Vormonat' }}
        />
      </div>

      {/* Fleet Status + Today's Tours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Flottenübersicht</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={fleetChartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {fleetChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {fleetChartData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-gray-600 truncate">{d.name}: <strong>{d.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Tours at DHH1 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Heutige Touren – DHH1-Hamburg</h2>
            <button
              onClick={() => navigate('/milkyway/DHH1/daily')}
              className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Plus size={12} /> Alle ansehen
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Tour Nr.</th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Fahrer</th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Kennzeichen</th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Typ</th>
                  <th className="pb-2 text-right text-xs font-semibold text-gray-500">Retouren</th>
                </tr>
              </thead>
              <tbody>
                {todayTours.map((tour) => (
                  <tr key={tour.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 font-mono font-medium text-gray-900">{tour.tourNr}</td>
                    <td className="py-2 text-gray-700">{tour.fahrer}</td>
                    <td className="py-2">
                      <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{tour.kennzeichen}</span>
                    </td>
                    <td className="py-2"><StatusBadge status={tour.tourType} size="sm" /></td>
                    <td className="py-2 text-right text-gray-700">{tour.retouren}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tour Statistics by Month */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Touren nach Station & Monat</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={tourStatsByMonth} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="monat" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="dhh1" name="DHH1" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="dhb1" name="DHB1" fill="#10b981" radius={[2, 2, 0, 0]} />
            <Bar dataKey="dbw8" name="DBW8" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            <Bar dataKey="muc1" name="MUC1" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="gls" name="GLS" fill="#ec4899" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Workshop Vehicles */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Wrench size={16} className="text-amber-500" />
            Fahrzeuge in Werkstatt
          </h2>
          <button onClick={() => navigate('/workshop')} className="text-xs text-amber-600 hover:text-amber-700">
            Alle ansehen
          </button>
        </div>
        {workshopVehicles.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">Keine Fahrzeuge in der Werkstatt</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Kennzeichen</th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Marke/Modell</th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Station</th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Letzte Übergabe</th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {workshopVehicles.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => navigate(`/vehicles/${v.id}`)}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-2.5 font-mono font-medium text-blue-600">{v.kennzeichen}</td>
                    <td className="py-2.5 text-gray-700">{v.marke} {v.modell}</td>
                    <td className="py-2.5 text-gray-600">{v.standort}</td>
                    <td className="py-2.5 text-gray-600">{formatDate(v.letzteUebergabe)}</td>
                    <td className="py-2.5"><StatusBadge status={v.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
