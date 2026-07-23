'use client'

import { useState } from 'react'
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, 
  Package, Tag, Star, DollarSign, X, ChevronDown
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { menuItems, restaurants, formatCurrency } from '@/lib/mock-data.tsx'
import Link from 'next/link'

const categoryOptions = ['all', 'Hambúrgueres', 'Acompanhamentos', 'Bebidas', 'Pizzas Tradicionais', 'Sashimi', 'Hot Rolls', 'Bowls']
const restaurantOptions = ['all', ...restaurants.map(r => r.name)]

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [restaurantFilter, setRestaurantFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<typeof menuItems[0] | null>(null)
  const [viewingProduct, setViewingProduct] = useState<typeof menuItems[0] | null>(null)

  const filteredProducts = menuItems.filter((product) => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchesRestaurant = restaurantFilter === 'all' || 
      (restaurantFilter === 'Burger House' && product.id.startsWith('1-')) ||
      (restaurantFilter === 'Pizza Bella Napoli' && product.id.startsWith('2-')) ||
      (restaurantFilter === 'Sushi Zen' && product.id.startsWith('3-')) ||
      (restaurantFilter === 'Green Bowl' && product.id.startsWith('4-'))
    return matchesSearch && matchesCategory && matchesRestaurant
  })

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      console.log('Delete product:', id)
    }
  }

  const getRestaurantName = (productId: string) => {
    if (productId.startsWith('1-')) return 'Burger House'
    if (productId.startsWith('2-')) return 'Pizza Bella Napoli'
    if (productId.startsWith('3-')) return 'Sushi Zen'
    if (productId.startsWith('4-')) return 'Green Bowl'
    return 'Outro'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Produtos</h1>
          <p className="text-neutral-500 mt-1">Gerencie os itens do cardápio</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setShowModal(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="Buscar produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[180px]"
            >
              <option value="all">Todas as categorias</option>
              {categoryOptions.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              value={restaurantFilter}
              onChange={(e) => setRestaurantFilter(e.target.value)}
              className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[180px]"
            >
              <option value="all">Todos os restaurantes</option>
              {restaurantOptions.filter(r => r !== 'all').map(rest => (
                <option key={rest} value={rest}>{rest}</option>
              ))}
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
                <th className="pb-3 font-medium">Produto</th>
                <th className="pb-3 font-medium hidden md:table-cell">Restaurante</th>
                <th className="pb-3 font-medium hidden lg:table-cell">Categoria</th>
                <th className="pb-3 font-medium text-center">Preço</th>
                <th className="pb-3 font-medium text-center">Status</th>
                <th className="pb-3 font-medium text-center">Pedidos (mês)</th>
                <th className="pb-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-medium text-neutral-900">{product.name}</p>
                        <p className="text-xs text-neutral-500 truncate max-w-xs">{product.description}</p>
                        {product.tags.map(tag => (
                          <Badge key={tag} variant="outline" size="sm" className="mt-1">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <span className="text-sm text-neutral-600">{getRestaurantName(product.id)}</span>
                  </td>
                  <td className="py-4 hidden lg:table-cell">
                    <Badge variant="primary" size="sm">{product.category}</Badge>
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {product.originalPrice && (
                        <span className="text-sm text-neutral-400 line-through">{formatCurrency(product.originalPrice)}</span>
                      )}
                      <span className="font-semibold text-neutral-900">{formatCurrency(product.price)}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <Badge variant={product.isPopular ? 'accent' : 'neutral'} size="sm">
                      {product.isPopular ? 'Popular' : 'Normal'}
                    </Badge>
                    {product.isVegetarian && <Badge variant="success" size="sm" className="ml-1">Veg</Badge>}
                    {product.isVegan && <Badge variant="success" size="sm" className="ml-1">Vegan</Badge>}
                  </td>
                  <td className="py-4 text-center font-medium text-neutral-900">
                    {Math.floor(Math.random() * 100 + 10)}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setViewingProduct(product); }}
                        className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                        aria-label="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setEditingProduct(product); setShowModal(true); }}
                        className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                        aria-label="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
              <p className="text-neutral-500">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-primary-600">{menuItems.length}</p>
          <p className="text-sm text-neutral-500 mt-1">Total de produtos</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-accent-600">{menuItems.filter(p => p.isPopular).length}</p>
          <p className="text-sm text-neutral-500 mt-1">Populares</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-success-600">{menuItems.filter(p => p.isVegetarian).length}</p>
          <p className="text-sm text-neutral-500 mt-1">Vegetarianos</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-neutral-900">{menuItems.filter(p => p.customizations && p.customizations.length > 0).length}</p>
          <p className="text-sm text-neutral-500 mt-1">Com personalização</p>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-neutral-900">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Nome do produto" placeholder="Ex: X-Bacon Especial" defaultValue={editingProduct?.name || ''} required />
                <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue={editingProduct?.category || ''}>
                  <option value="">Selecione a categoria</option>
                  <option value="Hambúrgueres">Hambúrgueres</option>
                  <option value="Acompanhamentos">Acompanhamentos</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Pizzas Tradicionais">Pizzas Tradicionais</option>
                  <option value="Sashimi">Sashimi</option>
                  <option value="Hot Rolls">Hot Rolls</option>
                  <option value="Bowls">Bowls</option>
                </select>
              </div>
              
              <Input label="Descrição" placeholder="Descreva o produto..." defaultValue={editingProduct?.description || ''} />
              
              <div className="grid md:grid-cols-3 gap-4">
                <Input label="Preço" type="number" step="0.01" placeholder="32.90" defaultValue={editingProduct?.price?.toString() || ''} required />
                <Input label="Preço original (promoção)" type="number" step="0.01" placeholder="38.90" defaultValue={editingProduct?.originalPrice?.toString() || ''} />
                <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue={editingProduct?.id.startsWith('1-') ? 'Burger House' : editingProduct?.id.startsWith('2-') ? 'Pizza Bella Napoli' : editingProduct?.id.startsWith('3-') ? 'Sushi Zen' : 'Green Bowl'}>
                  <option value="Burger House">Burger House</option>
                  <option value="Pizza Bella Napoli">Pizza Bella Napoli</option>
                  <option value="Sushi Zen">Sushi Zen</option>
                  <option value="Green Bowl">Green Bowl</option>
                </select>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked={editingProduct?.isPopular || false} />
                  <span className="text-sm text-neutral-700">Produto popular</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked={editingProduct?.isVegetarian || false} />
                  <span className="text-sm text-neutral-700">Vegetariano</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked={editingProduct?.isVegan || false} />
                  <span className="text-sm text-neutral-700">Vegano</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked={editingProduct?.isSpicy || false} />
                  <span className="text-sm text-neutral-700">Picante</span>
                </label>
              </div>
              
              <Input label="URL da imagem" placeholder="https://..." defaultValue={editingProduct?.image || ''} />
              
              {/* Customizations */}
              <div className="border-t border-neutral-200 pt-6">
                <h4 className="font-semibold text-neutral-900 mb-4">Personalizações</h4>
                <div className="space-y-4">
                  {(editingProduct?.customizations || []).map((custom, index) => (
                    <div key={index} className="p-4 bg-neutral-50 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-neutral-900">Grupo de personalização</h5>
                        <button type="button" className="p-2 text-red-500 hover:bg-red-50 rounded-xl">Remover</button>
                      </div>
                      <Input label="Nome do grupo" placeholder="Ex: Ponto da carne" defaultValue={custom.name} />
                      <div className="grid md:grid-cols-3 gap-4">
                        <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue={custom.type}>
                          <option value="single">Seleção única</option>
                          <option value="multiple">Seleção múltipla</option>
                        </select>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked={custom.required} />
                          <span className="text-sm text-neutral-700">Obrigatório</span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        {custom.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex gap-2">
                            <Input placeholder="Nome da opção" defaultValue={opt.name} className="flex-1" />
                            <Input label="Preço adicional" type="number" step="0.01" placeholder="0.00" defaultValue={opt.price?.toString() || ''} className="w-32" />
                          </div>
                        ))}
                        <Button variant="outline" type="button" size="sm">+ Adicionar opção</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" type="button">+ Adicionar grupo de personalização</Button>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 pt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit">{editingProduct ? 'Salvar alterações' : 'Criar produto'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewingProduct(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-neutral-900">Detalhes do Produto</h2>
              <button onClick={() => setViewingProduct(null)} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <img src={viewingProduct.image} alt={viewingProduct.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900">{viewingProduct.name}</h3>
                  <p className="text-neutral-500 mt-1">{viewingProduct.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="primary">{viewingProduct.category}</Badge>
                    <Badge variant={viewingProduct.isPopular ? 'accent' : 'neutral'}>{viewingProduct.isPopular ? 'Popular' : 'Normal'}</Badge>
                    {viewingProduct.isVegetarian && <Badge variant="success">Vegetariano</Badge>}
                    {viewingProduct.isVegan && <Badge variant="success">Vegano</Badge>}
                    {viewingProduct.isSpicy && <Badge variant="warning">Picante</Badge>}
                    <Badge variant="outline">{getRestaurantName(viewingProduct.id)}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{formatCurrency(viewingProduct.price)}</p>
                  <p className="text-sm text-neutral-500">Preço atual</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{viewingProduct.originalPrice ? formatCurrency(viewingProduct.originalPrice) : '—'}</p>
                  <p className="text-sm text-neutral-500">Preço original</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success-600">{viewingProduct.originalPrice ? `${Math.round((1 - viewingProduct.price / viewingProduct.originalPrice) * 100)}% OFF` : '—'}</p>
                  <p className="text-sm text-neutral-500">Desconto</p>
                </div>
              </div>
              
              {viewingProduct.customizations && viewingProduct.customizations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-3">Personalizações</h4>
                  <div className="space-y-3">
                    {viewingProduct.customizations.map((custom, index) => (
                      <div key={index} className="p-4 bg-neutral-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-neutral-900">{custom.name}</h5>
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <span>{custom.type === 'single' ? 'Única' : 'Múltipla'}</span>
                            {custom.required && <Badge variant="primary" size="sm">Obrigatório</Badge>}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {custom.options.map((opt, optIndex) => (
                            <Badge key={optIndex} variant="outline" size="sm">
                              {opt.name} {opt.price > 0 && `(+${formatCurrency(opt.price)})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-neutral-200">
                <Button variant="outline" onClick={() => { setViewingProduct(null); setEditingProduct(viewingProduct); setShowModal(true); }} className="w-full sm:w-auto">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar produto
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}