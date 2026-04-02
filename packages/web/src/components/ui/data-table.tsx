import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { type ReactNode } from 'react'

export interface Column<T> {
  header: string
  accessor: keyof T | string
  render?: (row: T, index: number) => ReactNode
  sortable?: boolean
  className?: string
  headerClassName?: string
}

interface Pagination {
  page: number
  pageSize: number
  total: number
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  pagination?: Pagination
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  onSort?: (field: string, dir: 'asc' | 'desc') => void
  sortField?: string
  sortDir?: 'asc' | 'desc'
  loading?: boolean
  onRowClick?: (row: T) => void
  rowClassName?: (row: T) => string
  emptyMessage?: string
}

const PAGE_SIZES = [10, 25, 50, 100]

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  pagination,
  onPageChange,
  onPageSizeChange,
  onSort,
  sortField,
  sortDir,
  loading,
  onRowClick,
  rowClassName,
  emptyMessage = 'Keine Daten vorhanden',
}: DataTableProps<T>) {
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1

  function handleSort(col: Column<T>) {
    if (!col.sortable || !onSort) return
    const field = col.accessor as string
    const newDir = sortField === field && sortDir === 'asc' ? 'desc' : 'asc'
    onSort(field, newDir)
  }

  function getCellValue(row: T, col: Column<T>): ReactNode {
    if (col.render) {
      return col.render(row, 0)
    }
    const val = row[col.accessor as keyof T]
    if (val === null || val === undefined) return '—'
    return String(val)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => handleSort(col)}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap',
                    col.sortable && 'cursor-pointer hover:bg-gray-100 select-none',
                    col.headerClassName,
                  )}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="text-gray-400">
                        {sortField === col.accessor ? (
                          sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                          <ChevronsUpDown size={14} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Lädt...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-gray-100 last:border-0',
                    'hover:bg-gray-50 transition-colors',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row),
                  )}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={cn('px-4 py-3 text-gray-700 whitespace-nowrap', col.className)}
                    >
                      {getCellValue(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Zeilen pro Seite:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-3">
              {(pagination.page - 1) * pagination.pageSize + 1}–
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} von {pagination.total}
            </span>
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (pagination.page <= 4) {
                pageNum = i + 1
              } else if (pagination.page >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = pagination.page - 3 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  className={cn(
                    'w-8 h-8 rounded text-sm',
                    pagination.page === pageNum
                      ? 'bg-amber-500 text-white font-medium'
                      : 'hover:bg-gray-100',
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
