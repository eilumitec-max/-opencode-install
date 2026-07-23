'use client'

import { useState } from 'react'
import { ArrowLeft, MapPin, Home, Briefcase, Plus, Edit, Trash2, Check, Radio, Location } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { useUserStore } from '@/store'
import { mockAddresses, mockUser, formatCurrency } from '@/lib/mock-data.tsx'
import { useRouter } from 'next/navigation'

export default function AddressesPage() {
  const router = useRouter()
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useUserStore()
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<typeof mockAddresses[0] | null>(null)
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAddress) {
      updateAddress(editingAddress.id, formData)
    } else {
      addAddress({ ...formData, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 } as any)
    }
    closeModal()
  }

  const openModal = (address?: typeof mockAddresses[0]) => {
    if (address) {
      setEditingAddress(address)
      setFormData(address)
    } else {
      setEditingAddress(null)
      setFormData({ label: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingAddress(null)
    setFormData({ label: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      removeAddress(id)
    }
  }

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'casa': return Home
      case 'trabalho': return Briefcase
      default: return MapPin
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-neutral-200 z-30">
        <div className="container-app px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-neutral-900">Meus endereços</h1>
          </div>
        </div>
      </header>

      <main className="container-app pb-24">
        {addresses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <Location className="w-10 h-10 text-neutral-400" />
            </div>
            <h2 className="text-lg font-medium text-neutral-900 mb-2">Nenhum endereço cadastrado</h2>
            <p className="text-neutral-500 mb-6 max-w-xs mx-auto">
              Adicione um endereço para agilizar seus pedidos e entregas
            </p>
            <Button onClick={() => openModal()} className="max-w-xs">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar endereço
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => openModal(address)}
                onDelete={() => handleDelete(address.id)}
                onSetDefault={() => setDefaultAddress(address.id)}
              />
            ))}
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 pb-safe lg:static lg:bg-transparent lg:border-0 lg:p-0">
          <Button onClick={() => openModal()} className="w-full lg:max-w-xs lg:mx-auto" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar novo endereço
          </Button>
        </div>
      </main>

      {/* Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 pb-safe max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingAddress ? 'Editar endereço' : 'Novo endereço'}</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-neutral-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Rótulo" placeholder="Ex: Casa, Trabalho, Apartamento" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="CEP" placeholder="00000-000" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} required />
                <Input label="Número" placeholder="123" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} required />
              </div>
              <Input label="Rua" placeholder="Rua das Flores" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} required />
              <Input label="Complemento (opcional)" placeholder="Apto 45, Bloco B" value={formData.complement} onChange={e => setFormData({...formData, complement: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Bairro" placeholder="Centro" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} required />
                <Input label="Cidade" placeholder="São Paulo" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              </div>
              <Input label="Estado" placeholder="SP" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
              <Button type="submit" className="w-full" size="lg">
                {editingAddress ? 'Salvar alterações' : 'Adicionar endereço'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function AddressCard({ address, onEdit, onDelete, onSetDefault }: { 
  address: typeof mockAddresses[0]; 
  onEdit: () => void; 
  onDelete: () => void; 
  onSetDefault: () => void 
}) {
  const LabelIcon = address.label.toLowerCase() === 'casa' ? Home : address.label.toLowerCase() === 'trabalho' ? Briefcase : MapPin
  
  return (
    <Card variant="outlined" className={address.isDefault ? 'border-primary-300 bg-primary-50/50' : ''}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <LabelIcon className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-900">{address.label}</span>
            {address.isDefault && <Badge variant="primary" size="sm">Principal</Badge>}
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            {address.street}, {address.number}
            {address.complement && `, ${address.complement}`}
          </p>
          <p className="text-sm text-neutral-500">
            {address.neighborhood}, {address.city} - {address.state} · CEP: {address.zipCode}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {!address.isDefault && (
            <Button variant="ghost" size="sm" onClick={onSetDefault} className="text-sm">
              <Check className="w-3.5 h-3.5 mr-1" />
              Definir principal
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onEdit} className="text-neutral-600 hover:text-neutral-900">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}