'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Filter, ShoppingCart, Heart, Bell, Menu, MapPin, X, ChevronDown, Star, Truck, Clock, CheckCircle, Plus, Minus, Trash2, ArrowLeft, RefreshCw, DollarSign, MapPin as MapPinIcon, CreditCard, User, X as XIcon, Loader2 } from 'lucide-react'
import { RestaurantCard } from '@/components/home/RestaurantCard'
import { CategoryChip } from '@/components/home/CategoryChip'
import { PromoCarousel } from '@/components/home/PromoBanner'
import { SearchBar } from '@/components/home/SearchBar'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Header } from '@/components/layout/Header'
import { restaurants, categories, promotions, categoryIcons, menuItems, mockUser } from '@/lib/mock-data'
import { useCartStore, useUIStore } from '@/store'
import { formatCurrency } from '@/lib/mock-data'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof restaurants[0] | null>(null)
  const [showRestaurantDetail, setShowRestaurantDetail] = useState(false)
  const { isCartOpen, openCart, closeCart } = useUIStore()
  const { items, getItemCount } = useCartStore()

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesCategory = activeCategory === 'all' || restaurant.tags.some(tag => 
      tag.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory === 'all'
    )
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch && restaurant.isOpen
  })

  const handleRestaurantClick = (restaurant: typeof restaurants[0]) => {
    setSelectedRestaurant(restaurant)
    setShowRestaurantDetail(true)
  }

  const categoryFilters = [
    { id: 'all', label: 'Todos', icon: categoryIcons.utensils },
    { id: 'burgers', label: 'Hambúrgueres', icon: categoryIcons.hamburger },
    { id: 'pizza', label: 'Pizzas', icon: categoryIcons.pizza },
    { id: 'japanese', label: 'Japonesa', icon: categoryIcons.sushi },
    { id: 'healthy', label: 'Saudável', icon: categoryIcons.salad },
    { id: 'desserts', label: 'Sobremesas', icon: categoryIcons['ice-cream'] },
    { id: 'coffee', label: 'Cafés', icon: categoryIcons.coffee },
    { id: 'brazilian', label: 'Brasileira', icon: categoryIcons.drumstick },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartCount={getItemCount()} 
        onCartClick={openCart}
        onMenuClick={() => {}}
      />
      
      <main className="pb-24">
        <div className="container-app">
          <SearchBar
            placeholder="Buscar restaurantes, pratos, culinárias..."
            value={searchQuery}
            onChange={setSearchQuery}
            filters={categoryFilters}
            activeFilter={activeCategory}
            onFilterChange={setActiveCategory}
          />
          
          <PromoCarousel promotions={promotions} />
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Restaurantes próximos</h2>
            <span className="text-sm text-gray-500">
              {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurante' : 'restaurantes'} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum restaurante encontrado</h3>
              <p className="text-gray-500">Tente ajustar sua busca ou filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRestaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {isCartOpen && (
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={closeCart}
        />
      )}

      {showRestaurantDetail && selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => setShowRestaurantDetail(false)}
        />
      )}
    </div>
  )
}

function RestaurantDetailModal({ 
  restaurant, 
  onClose 
}: { 
  restaurant: typeof restaurants[0]; 
  onClose: () => void 
}) {
  const [activeTab, setActiveTab] = useState('menu')
  const [showCustomization, setShowCustomization] = useState<typeof menuItems[0] | null>(null)
  const { addItem, items: cartItems } = useCartStore()
  const { openCart } = useUIStore()
  
  const restaurantMenuItems = menuItems.filter(item => 
    (restaurant.id === '1' && item.id.startsWith('1-')) ||
    (restaurant.id === '2' && item.id.startsWith('2-')) ||
    (restaurant.id === '3' && item.id.startsWith('3-')) ||
    (restaurant.id === '4' && item.id.startsWith('4-')) ||
    (restaurant.id === '5' && item.id.startsWith('5-')) ||
    (restaurant.id === '6' && item.id.startsWith('6-'))
  )
  
  const menuCategories = [...new Set(restaurantMenuItems.map(item => item.category))]

  // Calcular subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl h-[90vh] sm:h-[85vh] bg-white rounded-2xl flex flex-col overflow-hidden animate-scale-in shadow-2xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-48 sm:h-56 flex-shrink-0">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-105"
            aria-label="Fechar"
          >
            <XIcon className="w-5 h-5 text-gray-700" />
          </button>
          
          {/* Favorite Button */}
          <button
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-105"
            aria-label="Favoritar"
          >
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
          
          {/* Restaurant Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {restaurant.isOpen ? 'Aberto' : 'Fechado'}
              </span>
              {restaurant.isPromoted && (
                <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {restaurant.promoText}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{restaurant.name}</h2>
            <p className="text-sm opacity-90 mb-3">{restaurant.cuisine}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {restaurant.rating.toFixed(1)} ({restaurant.reviews}+)
              </span>
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Truck className="w-3.5 h-3.5" />
                {restaurant.deliveryTime}
              </span>
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <DollarSign className="w-3.5 h-3.5" />
                {restaurant.deliveryFee === 0 ? 'Frete grátis' : `R$ ${restaurant.deliveryFee.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Category Tabs */}
          <div className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
            <nav className="flex gap-1 px-4 overflow-x-auto pb-1" role="tablist">
              {menuCategories.map((category) => (
                <button
                  key={category}
                  role="tab"
                  aria-selected={activeTab === category}
                  onClick={() => setActiveTab(category)}
                  className={`py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap ${
                    activeTab === category
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {menuCategories.map((category) => {
              const items = restaurantMenuItems.filter(item => item.category === category)
              if (items.length === 0) return null
              
              return (
                <div key={category} className="mb-8 animate-slide-up">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    {category}
                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <MenuItemCard 
                        key={item.id} 
                        item={item} 
                        onAdd={() => addItem(item)}
                        inCart={cartItems.find(i => i.menuItem.id === item.id)?.quantity || 0}
                        onCustomize={() => setShowCustomization(item)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
            
            {cartItems.length > 0 && (
              <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 animate-fade-in">
                <div className="flex items-center gap-2 text-orange-700 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Seu carrinho tem {cartItems.reduce((sum, item) => sum + item.quantity, 0)} itens</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-200 p-4 bg-white/95 backdrop-blur-sm sticky bottom-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <button
              onClick={() => { onClose(); openCart(); }}
              className="w-full btn-primary py-3 text-lg"
              disabled={cartItems.length === 0}
            >
              {cartItems.length > 0 
                ? `Ver carrinho (${cartItems.reduce((sum, item) => sum + item.quantity, 0)} itens) — ${formatCurrency(subtotal)}`
                : 'Adicionar itens ao carrinho'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MenuItemCard({ 
  item, 
  onAdd, 
  inCart,
  onCustomize
}: { 
  item: typeof menuItems[0]; 
  onAdd: () => void;
  inCart: number;
  onCustomize: () => void;
}) {
  const [showCustomizations, setShowCustomizations] = useState(false)
  
  if (inCart > 0) {
    return (
      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100 animate-fade-in">
        <div className="w-16 h-16 rounded-lg bg-white object-cover flex-shrink-0 shadow-sm">
          <img src={item.image} alt={item.name} className="w-full h-full rounded-lg object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
          <p className="text-sm text-orange-600 font-medium">{formatCurrency(item.price)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onAdd()} 
            className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors active:scale-95"
            aria-label="Adicionar mais"
          >
            <Plus className="w-5 h-5" />
          </button>
          <span className="w-8 text-center font-medium text-gray-900">{inCart}</span>
          <button 
            onClick={() => {}} 
            className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors active:scale-95"
            aria-label="Remover"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="group flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="w-16 h-16 rounded-lg bg-white object-cover flex-shrink-0 relative shadow-sm">
        <img src={item.image} alt={item.name} className="w-full h-full rounded-lg object-cover" />
        {item.isPopular && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-sm">
            Popular
          </span>
        )}
        {item.originalPrice && (
          <span className="absolute -bottom-2 right-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-sm">
            {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {item.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{formatCurrency(item.originalPrice)}</span>
              )}
              <span className="font-semibold text-gray-900">{formatCurrency(item.price)}</span>
              {item.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{tag}</span>
              ))}
              {item.isVegetarian && (
                <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">🌱 Veg</span>
              )}
              {item.isVegan && (
                <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">🌱 Vegano</span>
              )}
              {item.isSpicy && (
                <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full">🌶️ Picante</span>
              )}
            </div>
          </div>
        </div>
        {item.customizations && item.customizations.length > 0 && (
          <button
            onClick={onCustomize}
            className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Personalizar
          </button>
        )}
      </div>
      <button
        onClick={onAdd}
        className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0 shadow-lg shadow-orange-500/30"
        aria-label={`Adicionar ${item.name} ao carrinho`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      </button>
    </div>
  )
}