'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type HTMLAttributes } from 'react'
import type { Category } from '@/types/restaurant'

interface CategoryChipProps extends HTMLAttributes<HTMLButtonElement> {
  category: Category
  isActive?: boolean
  onClick?: () => void
}

export const CategoryChip = forwardRef<HTMLButtonElement, CategoryChipProps>(
  ({ category, isActive = false, onClick, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          'flex flex-col items-center gap-2 px-4 py-4 rounded-2xl transition-all duration-300',
          'border-2 min-w-[85px]',
          isActive
            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
            : 'bg-white text-gray-600 border-gray-100 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50',
          className
        )}
        {...props}
      >
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
          isActive
            ? 'bg-white/20 text-white shadow-lg'
            : 'bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-500'
        )}>
          {category.icon}
        </div>
        <span className="text-sm font-semibold text-center leading-tight">
          {children || category.name}
        </span>
      </button>
    )
  }
)

CategoryChip.displayName = 'CategoryChip'