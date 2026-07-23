'use client'

import { useState } from 'react'
import { 
  Plus, Search, Edit, Trash2, Tag, 
  Utensils, Pizza, Hamburger, Sushi, Salad, Coffee, IceCream, Drumstick, X
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

const categories = [
  { id: '1', name: 'Hambúrgueres', icon: 'hamburger', count: 12, color: 'primary', isActive: true },
  { id: '2', name: 'Pizzas', icon: 'pizza', count: 8, color: 'accent', isActive: true },
  { id: '3', name: 'Japonesa', icon: 'sushi', count: 6, color: 'success', isActive: true },
  { id: '4', name: 'Saudável', icon: 'salad', count: 10, color: 'primary', isActive: true },
  { id: '5', name: 'Sobremesas', icon: 'ice-cream', count: 5, color: 'accent', isActive: false },
  { id: '6', name: 'Cafés', icon: 'coffee', count: 4, color: 'neutral', isActive: true },
  { id: '7', name: 'Brasileira', icon: 'drumstick', count: 7, color: 'success', isActive: true },
]

const iconMap: Record<string, React.ReactNode> = {
  hamburger: <Hamburger className="w-5 h-5" />,
  pizza: <Pizza className="w-5 h-5" />,
  sushi: <Sushi className="w-5 h-5" />,
  salad: <Salad className="w-5 h-5" />,
  'ice-cream': <IceCream className="w-5 h-5" />,
  coffee: <Coffee className="w-5 h-5" />,
  drumstick: <Drumstick className="w-5 h-5" />,
}

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<typeof categories[0] | null>(null)

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Categorias</h1>
          <p className="text-neutral-500 mt-1">Organize os tipos de culinária e produtos</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setShowModal(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            placeholder="Buscar categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="p-4 hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${category.color}-100 text-${category.color}-600`}>
                  {iconMap[category.icon] || <Utensils className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{category.name}</h3>
                  <p className="text-sm text-neutral-500">{category.count} produtos</p>
                </div>
              </div>
              <Badge variant={category.isActive ? 'success' : 'neutral'} size="sm">
                {category.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => { setEditingCategory(category); setShowModal(true); }}
                className="flex-1 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                <Edit className="w-4 h-4 mr-1 inline" />
                Editar
              </button>
              <button
                onClick={() => { if (confirm('Excluir esta categoria?')) console.log('Delete:', category.id) }}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1 inline" />
                Excluir
              </button>
            </div>
          </Card>
        ))}

        {/* Add new category card */}
        <Card className="p-4 border-2 border-dashed border-neutral-300 hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer"
          onClick={() => { setEditingCategory(null); setShowModal(true); }}
        >
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="font-medium text-neutral-700">Nova categoria</p>
            <p className="text-sm text-neutral-500">Adicionar tipo de culinária</p>
          </div>
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
              <Input label="Nome da categoria" placeholder="Ex: Hambúrgueres" defaultValue={editingCategory?.name || ''} required />
              
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-sm font-medium text-neutral-700 mb-1">Ícone</span>
                  <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue={editingCategory?.icon || 'utensils'}>
                    <option value="utensils">Utensílios</option>
                    <option value="hamburger">Hambúrguer</option>
                    <option value="pizza">Pizza</option>
                    <option value="sushi">Sushi</option>
                    <option value="salad">Salada</option>
                    <option value="ice-cream">Sorvete</option>
                    <option value="coffee">Café</option>
                    <option value="drumstick">Frango</option>
                  </select>
                </label>
                
                <label className="block">
                  <span className="block text-sm font-medium text-neutral-700 mb-1">Cor</span>
                  <select className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue={editingCategory?.color || 'primary'}>
                    <option value="primary">Laranja</option>
                    <option value="accent">Amarelo</option>
                    <option value="success">Verde</option>
                    <option value="neutral">Cinza</option>
                  </select>
                </label>
              </div>
              
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" defaultChecked={editingCategory?.isActive ?? true} />
                <span className="text-sm text-neutral-700">Categoria ativa</span>
              </label>
              
              <div className="border-t border-neutral-200 pt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit">{editingCategory ? 'Salvar alterações' : 'Criar categoria'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}