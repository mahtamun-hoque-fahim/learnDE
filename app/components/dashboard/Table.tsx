'use client'

import { useState, useMemo } from 'react'

interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  width?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchKeys?: string[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  className?: string
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  searchKeys = [],
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery || searchKeys.length === 0) return data

    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key]
        return String(value).toLowerCase().includes(searchQuery.toLowerCase())
      })
    )
  }, [data, searchQuery, searchKeys])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (aValue === bValue) return 0

      const comparison = aValue < bValue ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortKey, sortDirection])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full px-3 py-2 pl-9 bg-[#0B0F0D] border border-[#2A312D] rounded-lg text-[12.5px] focus:outline-none focus:border-[#3DF49A] focus:ring-4 focus:ring-[rgba(61,244,154,0.08)] transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A938E]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A938E] hover:text-[#F3F6F4]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border border-[#1F2421] rounded-lg overflow-hidden">
        {sortedData.length === 0 ? (
          <div className="p-8 text-center text-[#8A938E] text-[12px]">
            {searchQuery ? 'No results found' : emptyMessage}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[rgba(255,255,255,0.02)] border-b border-[#1F2421]">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-3 py-2.5 text-left text-[10.5px] text-[#8A938E] uppercase tracking-[0.08em] font-semibold ${
                      column.sortable ? 'cursor-pointer hover:text-[#F3F6F4] select-none' : ''
                    } ${column.width ? column.width : ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      {column.label}
                      {column.sortable && (
                        <div className="flex flex-col gap-px">
                          <svg
                            className={`w-2.5 h-2.5 transition-colors ${
                              sortKey === column.key && sortDirection === 'asc'
                                ? 'text-[#3DF49A]'
                                : 'text-[#4A5450]'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 12 12"
                          >
                            <path d="M6 3l4 4H2z" />
                          </svg>
                          <svg
                            className={`w-2.5 h-2.5 transition-colors ${
                              sortKey === column.key && sortDirection === 'desc'
                                ? 'text-[#3DF49A]'
                                : 'text-[#4A5450]'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 12 12"
                          >
                            <path d="M6 9L2 5h8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-[#1F2421] last:border-0 ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors'
                      : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-2.5 text-[12px]">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Results Count */}
      {searchQuery && sortedData.length > 0 && (
        <div className="text-[11px] text-[#8A938E]">
          Found {sortedData.length} {sortedData.length === 1 ? 'result' : 'results'}
        </div>
      )}
    </div>
  )
}
