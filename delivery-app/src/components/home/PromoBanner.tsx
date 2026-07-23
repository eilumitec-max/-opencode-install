'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import type { Promotion } from '@/types/restaurant'

interface PromoBannerProps {
  promotion: Promotion
  onClick?: () => void
}

export function PromoBanner({ promotion, onClick }: PromoBannerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative group overflow-hidden rounded-2xl',
        'shadow-lg hover:shadow-xl transition-all duration-300',
        'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700',
        'text-white'
      )}
      style={{ aspectRatio: '16/9' }}
    >
      {promotion.image && (
        <Image
          src={promotion.image}
          alt={promotion.title}
          fill
          className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-l from-orange-900/80 via-orange-800/40 to-transparent" />
      
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div>
          {promotion.badge && (
            <Badge variant="primary" className="mb-3 w-fit">
              {promotion.badge}
            </Badge>
          )}
          <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
            {promotion.title}
          </h3>
          <p className="text-orange-100 text-base md:text-lg opacity-90">
            {promotion.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {promotion.discount && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl font-extrabold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl">
                  {promotion.discount}%
                </span>
                <span className="text-orange-200 text-sm">OFF</span>
              </div>
            )}
            {promotion.restaurant && (
              <p className="text-orange-100 text-sm font-medium">{promotion.restaurant}</p>
            )}
          </div>
          
          <Button
            variant="secondary"
            size="md"
            className="group-hover:scale-105 transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            Ver oferta
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </button>
  )
}

export function PromoCarousel({ promotions, onPromotionClick }: { promotions: Promotion[]; onPromotionClick?: (promo: Promotion) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Ofertas Especiais</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promo) => (
          <PromoBanner
            key={promo.id}
            promotion={promo}
            onClick={() => onPromotionClick?.(promo)}
          />
        ))}
      </div>
    </div>
  )
}