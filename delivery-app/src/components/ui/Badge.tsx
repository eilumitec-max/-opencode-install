'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'primary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-orange-100 text-orange-700',
      primary: 'bg-blue-100 text-blue-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-amber-100 text-amber-700',
      danger: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
      accent: 'bg-amber-100 text-amber-700',
      outline: 'border border-gray-300 text-gray-600 bg-transparent',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
      lg: 'px-3 py-1.5 text-base gap-2',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className={cn('w-1.5 h-1.5 rounded-full', {
            'bg-orange-500': variant === 'default' || variant === 'primary',
            'bg-green-500': variant === 'success',
            'bg-amber-500': variant === 'warning' || variant === 'accent',
            'bg-red-500': variant === 'danger',
            'bg-blue-500': variant === 'info',
            'bg-gray-400': variant === 'outline',
          })} />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'