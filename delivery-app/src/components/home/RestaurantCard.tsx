'use client'

import { cn } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ShoppingCart, Star, Truck, Clock, Heart, MapPin, Flame } from 'lucide-react'
import type { Restaurant } from '@/types/restaurant'

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick?: () => void
  onAddToCart?: (item: any) => void
  isOpen?: boolean
}

export function RestaurantCard({ restaurant, onClick, isOpen = true }: RestaurantCardProps) {
  const deliveryTime = `${restaurant.deliveryTime.min}-${restaurant.deliveryTime.max} min`
  const deliveryFee = restaurant.deliveryFee === 0 ? 'Grátis' : `R$ ${restaurant.deliveryFee.toFixed(2)}`

  return (
    <Card
      variant="outlined"
      padding="none"
      hover
      onClick={onClick}
      className="group cursor-pointer relative overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {!isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="danger" size="lg" className="px-4 py-2">
              Fechado
            </Badge>
          </div>
        )}
        {restaurant.isPromoted && (
          <Badge variant="accent" className="absolute top-3 left-3" dot>
            Promoção
          </Badge>
        )}
        {restaurant.isPromoted && restaurant.promoText && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
            {restaurant.promoText}
          </div>
        )}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-105"
          aria-label="Favoritar"
        >
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{restaurant.name}</h3>
            <p className="text-sm text-gray-500 truncate mt-0.5">{restaurant.cuisine}</p>
          </div>
          <div className="flex items-center gap-1 text-gray-700 flex-shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
            <span className="text-gray-400">({restaurant.reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4 flex-shrink-0" />
            <span>{deliveryFee}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{deliveryTime}</span>
          </div>
          <Badge variant="outline" size="sm" className="ml-auto">
            <MapPin className="w-3 h-3 mr-1" />
            {restaurant.distance.toFixed(1)} km
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {restaurant.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
          ))}
          {restaurant.tags.length > 3 && (
            <Badge variant="outline" size="sm">+{restaurant.tags.length - 3}</Badge>
          )}
        </div>
      </div>
    </Card>
  )
}