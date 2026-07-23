'use client'

import { useState } from 'react'
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, 
  MapPin, Star, Clock, DollarSign, X
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { restaurants, formatCurrency } from '@/lib/mock-data.tsx'
import Link from 'next/link'

const statusOptions = ['all', 'open', 'closed']
const cuisineOptions = ['all', 'Hamburgueria', 'Pizzaria', 'Japonesa', 'Saudável', 'Doces', 'Brasileira']

export default function AdminRestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cuisineFilter, setCuisineFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState<typeof restaurants[0] | null>(null)
  const [viewingRestaurant, setViewingRestaurant] = useState<typeof restaurants[0] | null>(null)

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'open' && restaurant.isOpen) || 
      (statusFilter === 'closed' && !restaurant.isOpen)
    const matchesCuisine = cuisineFilter === 'all' || 
      restaurant.cuisine.includes(cuisineFilter)
    return matchesSearch && matchesStatus && matchesCuisine
  })

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este restaurante?')) {
      console.log('Delete restaurant:', id)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Restaurantes</h1>
          <p className="text-neutral-500 mt-1">Gerencie os restaurantes parceiros</p>
        </div>
        <Button onClick={() => { setEditingRestaurant(null); setShowModal(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Restaurante
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="Buscar restaurante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos os status</option>
              <option value="open">Abertos</option>
              <option value="closed">Fechados</option>
            </select>
            
            <select
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[180px]"
            >
              <option value="all">Todas as culinárias</option>
              <option value="Hamburgueria">Hamburgueria</option>
              <option value="Pizzaria">Pizzaria</option>
              <option value="Japonesa">Japonesa</option>
              <option value="Saudável">Saudável</option>
              <option value="Doces">Doces</option>
              <option value="Brasileira">Brasileira</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-neutral-500 border-b border-neutral-100">
                <th className="pb-3 font-medium">Restaurante</th>
                <th className="pb-3 font-medium hidden md:table-cell">Culinária</th>
                <th className="pb-3 font-medium hidden lg:table-cell">Avaliação</th>
                <th className="pb-3 font-medium text-center">Taxa Entrega</th>
                <th className="pb-3 font-medium text-center">Tempo</th>
                <th className="pb-3 font-medium text-center">Pedidos (mês)</th>
                <th className="pb-3 font-medium text-center">Status</th>
                <th className="pb-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredRestaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name} 
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-medium text-neutral-900">{restaurant.name}</p>
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {restaurant.distance} km
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <span className="text-sm text-neutral-600">{restaurant.cuisine}</span>
                  </td>
                  <td className="py-4 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-sm font-medium text-neutral-700">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {restaurant.rating.toFixed(1)} ({restaurant.reviews})
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="font-medium text-neutral-900">
                      {restaurant.deliveryFee === 0 ? 'Grátis' : formatCurrency(restaurant.deliveryFee)}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-sm text-neutral-600 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {restaurant.deliveryTime}
                    </span>
                  </td>
                  <td className="py-4 text-center font-medium text-neutral-900">
                    {Math.floor(Math.random() * 200 + 50)}
                  </td>
                  <td className="py-4 text-center">
                    <Badge variant={restaurant.isOpen ? 'success' : 'neutral'} size="sm">
                      {restaurant.isOpen ? 'Aberto' : 'Fechado'}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setViewingRestaurant(restaurant); }}
                        className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                        aria-label="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setEditingRestaurant(restaurant); setShowModal(true); }}
                        className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                        aria-label="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
              <p className="text-neutral-500">Nenhum restaurante encontrado</p>
            </div>
          )}
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-primary-600">{restaurants.length}</p>
          <p className="text-sm text-neutral-500 mt-1">Total de restaurantes</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-success-600">{restaurants.filter(r => r.isOpen).length}</p>
          <p className="text-sm text-neutral-500 mt-1">Abertos agora</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-accent-600">{restaurants.filter(r => r.deliveryFee === 0).length}</p>
          <p className="text-sm text-neutral-500 mt-1">Frete grátis</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-neutral-900">{(restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length).toFixed(1)}</p>
          <p className="text-sm text-neutral-500 mt-1">Avaliação média</p>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-neutral-900">
                {editingRestaurant ? 'Editar Restaurante' : 'Novo Restaurante'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Nome do restaurante" placeholder="Ex: Burger House" defaultValue={editingRestaurant?.name || ''} required />
                <Input label="Slug (URL)" placeholder="burger-house" defaultValue={editingRestaurant?.name?.toLowerCase().replace(/\s+/g, '-') || ''} required />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Culinária" placeholder="Ex: Hamburgueria · Americana" defaultValue={editingRestaurant?.cuisine || ''} required />
                <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue={editingRestaurant?.isOpen ? 'true' : 'false'}>
                  <option value="true">Aberto</option>
                  <option value="false">Fechado</option>
                </select>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Input label="Taxa de entrega" type="number" step="0.01" placeholder="5.90" defaultValue={editingRestaurant?.deliveryFee?.toString() || ''} />
                <Input label="Tempo de entrega (min)" placeholder="25-35" defaultValue={editingRestaurant?.deliveryTime || ''} />
                <Input label="Pedido mínimo" type="number" step="0.01" placeholder="15.00" defaultValue="" />
              </div>
              
              <Input label="Endereço" placeholder="Rua, número, bairro, cidade, estado" defaultValue={editingRestaurant?.address || ''} />
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Telefone" placeholder="(11) 99999-9999" defaultValue="" />
                <Input label="Horário de funcionamento" placeholder="Seg-Sex: 11:00-23:00; Sáb-Dom: 11:00-00:00" defaultValue="" />
              </div>
              
              <div className="border-t border-neutral-200 pt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit">{editingRestaurant ? 'Salvar alterações' : 'Criar restaurante'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingRestaurant && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewingRestaurant(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-neutral-900">Detalhes do Restaurante</h2>
              <button onClick={() => setViewingRestaurant(null)} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <img src={viewingRestaurant.image} alt={viewingRestaurant.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900">{viewingRestaurant.name}</h3>
                  <p className="text-neutral-500 mt-1">{viewingRestaurant.cuisine}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="primary">Avaliação: {viewingRestaurant.rating.toFixed(1)}</Badge>
                    <Badge variant="accent">{viewingRestaurant.reviews} avaliações</Badge>
                    <Badge variant={viewingRestaurant.isOpen ? 'success' : 'neutral'}>{viewingRestaurant.isOpen ? 'Aberto' : 'Fechado'}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{viewingRestaurant.deliveryFee === 0 ? 'Grátis' : formatCurrency(viewingRestaurant.deliveryFee)}</p>
                  <p className="text-sm text-neutral-500">Taxa de entrega</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{viewingRestaurant.deliveryTime}</p>
                  <p className="text-sm text-neutral-500">Tempo estimado</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{viewingRestaurant.distance} km</p>
                  <p className="text-sm text-neutral-500">Distância</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-neutral-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingRestaurant.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-200">
                <Button variant="outline" onClick={() => { setViewingRestaurant(null); setEditingRestaurant(viewingRestaurant); setShowModal(true); }} className="w-full sm:w-auto">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar restaurante
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}