'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Search, X, Filter, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSearch?: (query: string) => void
  filters?: FilterOption[]
  activeFilter?: string
  onFilterChange?: (filterId: string) => void
  showLocation?: boolean
  location?: string
  onLocationClick?: () => void
}

interface FilterOption {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
}

export function SearchBar({ 
  placeholder = 'Buscar restaurantes, pratos, culinárias...', 
  value, 
  onChange, 
  onSearch,
  filters = [],
  activeFilter,
  onFilterChange,
  showLocation = true,
  location = 'São Paulo, SP',
  onLocationClick
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={cn(
        'relative flex items-center gap-2 bg-white rounded-2xl border transition-all duration-200 shadow-sm',
        isFocused 
          ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      )}>
        {showLocation && (
          <button
            type="button"
            onClick={onLocationClick}
            className="flex items-center gap-1.5 px-4 py-3 text-gray-600 hover:text-orange-600 transition-colors border-r border-gray-100"
            aria-label="Alterar localização"
          >
            <MapPin className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium truncate max-w-[120px]">{location}</span>
          </button>
        )}
        
        <div className="relative flex-1 min-w-0">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'w-full pl-10 pr-4 py-3.5 bg-transparent text-gray-900 placeholder:text-gray-400',
              'focus:outline-none text-base',
              showLocation ? '' : 'pl-4'
            )}
            autoComplete="off"
            aria-label="Buscar restaurantes e pratos"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-colors flex-shrink-0 shadow-lg shadow-orange-500/30 hover:shadow-xl"
          aria-label="Buscar"
          disabled={!value.trim()}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {filters.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Filtros rápidos</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs"
            >
              <Filter className="w-3.5 h-3.5 mr-1" />
              {showFilters ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>

          <div 
            className={cn(
              'overflow-x-auto pb-2 -mx-4 px-4 transition-all duration-300 ease-in-out',
              showFilters ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            )}
          >
            <div className="flex gap-2 min-w-max">
              <button
                type="button"
                onClick={() => onFilterChange?.('all')}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200',
                  activeFilter === 'all' || !activeFilter
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                )}
                aria-pressed={activeFilter === 'all' || !activeFilter}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-100 text-orange-600">
                  <Search className="w-4 h-4" />
                </span>
                <span>Todos</span>
              </button>
              
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onFilterChange?.(filter.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200',
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  )}
                  aria-pressed={activeFilter === filter.id}
                >
                  {filter.icon && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-100 text-orange-600">
                      {filter.icon}
                    </span>
                  )}
                  <span>{filter.label}</span>
                  {filter.count !== undefined && (
                    <Badge variant="neutral" size="sm">{filter.count}</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  )
}