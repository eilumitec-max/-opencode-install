'use client'

import { useState, useEffect } from 'react'
import { Menu, ShoppingCart, Heart, Bell, MapPin, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { mockUser } from '@/lib/mock-data'
import { useUIStore } from '@/store'

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
  onMenuClick: () => void
}

export function Header({ cartCount, onCartClick, onMenuClick }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false)
  const { isMenuOpen, toggleMenu } = useUIStore()
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfile && !(event.target as HTMLElement).closest('.profile-dropdown')) {
        setShowProfile(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfile])

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-xl">
              <MapPin className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">São Paulo, SP</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Perfil"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
            </button>
            
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Carrinho"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {showProfile && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowProfile(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 pb-safe max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Perfil</h2>
              <button onClick={() => setShowProfile(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-medium text-gray-900">{mockUser.name}</p>
              <p className="text-sm text-gray-500">{mockUser.email}</p>
            </div>
            
            <nav className="py-2">
              <a href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span>Meus Pedidos</span>
              </a>
              <a href="/addresses" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                <MapPin className="w-5 h-5" />
                <span>Endereços</span>
              </a>
              <a href="/payment" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5" />
                <span>Pagamentos</span>
              </a>
              <a href="/favorites" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Favoritos</span>
              </a>
            </nav>
            
            <div className="border-t border-gray-100 p-2">
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={() => setShowProfile(false)}>
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div 
        className={cn(
          'fixed top-16 right-4 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50 animate-scale-in',
          'profile-dropdown'
        )}
        style={{ display: showProfile ? 'block' : 'none' }}
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="font-medium text-gray-900">{mockUser.name}</p>
          <p className="text-sm text-gray-500">{mockUser.email}</p>
        </div>
        
        <nav className="py-2">
          <a href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span>Meus Pedidos</span>
          </a>
          <a href="/addresses" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
            <MapPin className="w-5 h-5" />
            <span>Endereços</span>
          </a>
          <a href="/payment" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Pagamentos</span>
          </a>
          <a href="/favorites" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5" />
            <span>Favoritos</span>
          </a>
        </nav>
        
        <div className="border-t border-gray-100 p-2">
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={() => setShowProfile(false)}>
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}