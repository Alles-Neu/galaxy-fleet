import { cn } from '@/lib/utils'
import { useState } from 'react'

export interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'date-range' | 'checkbox'
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface FilterBarProps {
  filters: FilterField[]
  onFilterChange: (values: Record<string, string | boolean>) => void
  className?: string
  collapsible?: boolean
}

export function FilterBar({ filters, onFilterChange, className, collapsible = true }: FilterBarProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>({})
  const [collapsed, setCollapsed] = useState(false)

  function handleChange(key: string, value: string | boolean) {
    const next = { ...values, [key]: value }
    setValues(next)
    onFilterChange(next)
  }

  function handleReset() {
    setValues({})
    onFilterChange({})
  }

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200', className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">Filter</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
          >
            Zurücksetzen
          </button>
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-amber-600 hover:text-amber-700 px-2 py-1 rounded hover:bg-amber-50"
            >
              {collapsed ? 'Ausklappen' : 'Einklappen'}
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filters.map((filter) => {
            if (filter.type === 'select') {
              return (
                <div key={filter.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">{filter.label}</label>
                  <select
                    value={(values[filter.key] as string) ?? ''}
                    onChange={(e) => handleChange(filter.key, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Alle</option>
                    {filter.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }

            if (filter.type === 'date-range') {
              return (
                <div key={filter.key} className="flex flex-col gap-1 col-span-2">
                  <label className="text-xs font-medium text-gray-600">{filter.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={(values[`${filter.key}_von`] as string) ?? ''}
                      onChange={(e) => handleChange(`${filter.key}_von`, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <span className="text-gray-400 text-sm">bis</span>
                    <input
                      type="date"
                      value={(values[`${filter.key}_bis`] as string) ?? ''}
                      onChange={(e) => handleChange(`${filter.key}_bis`, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              )
            }

            if (filter.type === 'checkbox') {
              return (
                <div key={filter.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">{filter.label}</label>
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={(values[filter.key] as boolean) ?? false}
                      onChange={(e) => handleChange(filter.key, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-sm text-gray-700">Ja</span>
                  </label>
                </div>
              )
            }

            return (
              <div key={filter.key} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">{filter.label}</label>
                <input
                  type="text"
                  placeholder={filter.placeholder ?? `${filter.label} suchen...`}
                  value={(values[filter.key] as string) ?? ''}
                  onChange={(e) => handleChange(filter.key, e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
