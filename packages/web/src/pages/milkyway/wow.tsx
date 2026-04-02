import { useParams } from 'react-router-dom'
import { mockTours } from '@/lib/mock-data'

interface WowRow {
  kategorie: string
  gesamt: number
  sub: number
  euride: number
}

export default function WowPage() {
  const { station } = useParams<{ station: string }>()
  const stationLabel = station ?? 'DHH1'

  const tours = mockTours.filter((t) => t.standort.startsWith(stationLabel))
  const normalTours = tours.filter((t) => t.tourType === 'Normal')
  const extraTours = tours.filter((t) => t.tourType === 'Extra')
  const rescueTours = tours.filter((t) => t.tourType === 'Rescue')
  const subRescueTours = tours.filter((t) => t.tourType === 'SUB Rescue')
  const totalRetouren = tours.reduce((s, t) => s + t.retouren, 0)

  const wowData: WowRow[] = [
    { kategorie: 'Touren', gesamt: normalTours.length, sub: Math.floor(normalTours.length * 0.3), euride: Math.ceil(normalTours.length * 0.7) },
    { kategorie: 'Extra Touren', gesamt: extraTours.length, sub: 0, euride: extraTours.length },
    { kategorie: 'Krank', gesamt: 1, sub: 0, euride: 1 },
    { kategorie: 'Rescue', gesamt: rescueTours.length + subRescueTours.length, sub: subRescueTours.length, euride: rescueTours.length },
    { kategorie: 'Retouren', gesamt: totalRetouren, sub: Math.floor(totalRetouren * 0.3), euride: Math.ceil(totalRetouren * 0.7) },
  ]

  // Unique drivers
  const drivers = [...new Set(tours.map((t) => t.fahrer))].map((fahrer) => {
    const driverTours = tours.filter((t) => t.fahrer === fahrer)
    return {
      fahrer,
      pid: driverTours[0]?.pid ?? '—',
      touren: driverTours.filter((t) => t.tourType === 'Normal').length,
      extra: driverTours.filter((t) => t.tourType === 'Extra').length,
      rescue: driverTours.filter((t) => t.tourType === 'Rescue' || t.tourType === 'SUB Rescue').length,
      retouren: driverTours.reduce((s, t) => s + t.retouren, 0),
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WOW – {stationLabel}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Wochenübersicht</p>
      </div>

      {/* WOW Summary Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">WOW Übersicht</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kategorie</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Gesamt</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-blue-600 uppercase">SUB</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-amber-600 uppercase">EuRide</th>
              </tr>
            </thead>
            <tbody>
              {wowData.map((row) => (
                <tr key={row.kategorie} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{row.kategorie}</td>
                  <td className="px-4 py-3 text-center font-bold text-gray-900">{row.gesamt}</td>
                  <td className="px-4 py-3 text-center text-blue-600 font-medium">{row.sub}</td>
                  <td className="px-4 py-3 text-center text-amber-600 font-medium">{row.euride}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Detail Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Fahrer-Übersicht</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">PID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fahrer</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Touren</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Extra</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Rescue</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Retouren</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.fahrer} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{d.pid}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">{d.fahrer}</td>
                  <td className="px-4 py-3 text-center text-gray-900">{d.touren}</td>
                  <td className="px-4 py-3 text-center text-purple-600">{d.extra || '—'}</td>
                  <td className="px-4 py-3 text-center text-orange-600">{d.rescue || '—'}</td>
                  <td className="px-4 py-3 text-center font-medium text-gray-900">{d.retouren}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
