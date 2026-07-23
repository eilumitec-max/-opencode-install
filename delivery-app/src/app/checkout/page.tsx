'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, CreditCard, Truck, CheckCircle, Clock, AlertCircle, Home, Briefcase, Plus, Edit, Trash2, Radio, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useCartStore, useUIStore, useUserStore } from '@/store'
import { mockAddresses, mockUser, formatCurrency, getPaymentMethodLabel } from '@/lib/mock-data.tsx'
import type { Address, PaymentMethod } from '@/types/restaurant'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 'address', label: 'Endereço', icon: MapPin },
  { id: 'payment', label: 'Pagamento', icon: CreditCard },
  { id: 'review', label: 'Revisão', icon: Truck },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { closeCart } = useUIStore()
  const { user, addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useUserStore()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    label: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const subtotal = getTotal()
  const deliveryFee = 5.90
  const total = subtotal + deliveryFee

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0]
      setSelectedAddressId(defaultAddr.id)
    }
  }, [addresses, selectedAddressId])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-8 text-center">
          <Truck className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Carrinho vazio</h1>
          <p className="text-neutral-500 mb-6">Adicione itens ao carrinho para finalizar o pedido</p>
          <Button onClick={() => router.push('/')} className="w-full">Continuar comprando</Button>
        </Card>
      </div>
    )
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId)

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAddress) {
      updateAddress(editingAddress.id, newAddress as Address)
    } else {
      addAddress({ ...newAddress, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 } as Address)
    }
    setShowAddressModal(false)
    setEditingAddress(null)
    setNewAddress({ label: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' })
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return
    setIsPlacingOrder(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    clearCart()
    setIsPlacingOrder(false)
    router.push('/tracking/order-new')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!selectedAddressId
      case 1: return !!paymentMethod
      case 2: return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-neutral-200 z-30">
        <div className="container-app px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center justify-center gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      index < currentStep
                        ? 'bg-primary-500 text-white'
                        : index === currentStep
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}>
                      {index < currentStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className={`text-sm font-medium hidden sm:block ${
                      index <= currentStep ? 'text-neutral-900' : 'text-neutral-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 w-12 mx-2 rounded transition-colors ${
                      index < currentStep ? 'bg-primary-500' : 'bg-neutral-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container-app pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Address */}
          {currentStep === 0 && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Endereço de entrega</h1>
                <p className="text-neutral-500 mt-1">Selecione ou adicione um endereço para entrega</p>
              </div>

              <div className="space-y-3 mb-6">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isSelected={selectedAddressId === address.id}
                    onSelect={() => setSelectedAddressId(address.id)}
                    onEdit={() => { setEditingAddress(address); setShowAddressModal(true); }}
                    onDelete={() => removeAddress(address.id)}
                  />
                ))}
              </div>

              <Button variant="outline" onClick={() => { setEditingAddress(null); setShowAddressModal(true); }} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar novo endereço
              </Button>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Forma de pagamento</h1>
                <p className="text-neutral-500 mt-1">Escolha como deseja pagar</p>
              </div>

              <div className="space-y-3">
                {([
                  { id: 'pix', label: 'PIX', desc: 'Pagamento instantâneo', icon: '📱' },
                  { id: 'credit_card', label: 'Cartão de crédito', desc: 'Visa, Mastercard, Elo...', icon: '💳' },
                  { id: 'debit_card', label: 'Cartão de débito', desc: 'Pagamento à vista', icon: '💳' },
                  { id: 'cash', label: 'Dinheiro', desc: 'Pague na entrega', icon: '💵' },
                ]).map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    isSelected={paymentMethod === method.id}
                    onSelect={() => setPaymentMethod(method.id as PaymentMethod)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Revisar pedido</h1>
                <p className="text-neutral-500 mt-1">Confira os detalhes antes de confirmar</p>
              </div>

              <Card className="mb-6">
                <div className="flex items-start gap-3 mb-4 p-3 bg-neutral-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-neutral-900">{selectedAddress?.label}</p>
                    <p className="text-sm text-neutral-600">
                      {selectedAddress?.street}, {selectedAddress?.number}
                      {selectedAddress?.complement && `, ${selectedAddress.complement}`}
                      <br />
                      {selectedAddress?.neighborhood}, {selectedAddress?.city} - {selectedAddress?.state}
                      <br />
                      CEP: {selectedAddress?.zipCode}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(0)} className="ml-auto">
                    Alterar
                  </Button>
                </div>
              </Card>

              <Card className="mb-6">
                <div className="flex items-center gap-3 mb-4 p-3 bg-neutral-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-neutral-900">{getPaymentMethodLabel(paymentMethod)}</p>
                    <p className="text-sm text-neutral-500">Método de pagamento selecionado</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="ml-auto">
                    Alterar
                  </Button>
                </div>
              </Card>

              <Card className="mb-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Itens do pedido</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.menuItem.image} alt={item.menuItem.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{item.menuItem.name}</p>
                        <p className="text-sm text-neutral-500">Qtd: {item.quantity}</p>
                        {Object.keys(item.customizations).length > 0 && (
                          <p className="text-xs text-neutral-400 mt-1">
                            {Object.entries(item.customizations).flatMap(([key, vals]) => vals).join(', ')}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-neutral-900 self-center">
                        {formatCurrency(item.menuItem.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} itens)</span>
                    <span className="font-medium text-neutral-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Taxa de entrega</span>
                    <span className="font-medium text-neutral-900">{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-neutral-900 border-t border-neutral-200 pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </Card>

              <Button 
                onClick={handlePlaceOrder} 
                disabled={isPlacingOrder}
                className="w-full py-4 text-lg"
                size="lg"
              >
                {isPlacingOrder ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Confirmando pedido...
                  </>
                ) : (
                  `Confirmar pedido - ${formatCurrency(total)}`
                )}
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1">
                Voltar
              </Button>
            )}
            <Button 
              onClick={() => {
                if (currentStep === 2) {
                  handlePlaceOrder()
                } else {
                  setCurrentStep(currentStep + 1)
                }
              }} 
              disabled={!canProceed() || isPlacingOrder}
              className={`flex-1 ${currentStep === 0 ? '' : ''}`}
            >
              {currentStep === 2 ? 'Confirmar pedido' : 'Próximo'}
              <ArrowLeft className="w-4 h-4" style={{ transform: 'rotate(180deg)' }} />
            </Button>
          </div>
        </div>
      </main>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowAddressModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 pb-safe max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingAddress ? 'Editar endereço' : 'Novo endereço'}</h2>
              <button onClick={() => setShowAddressModal(false)} className="p-2 rounded-xl hover:bg-neutral-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitAddress} className="space-y-4">
              <Input label="Rótulo" placeholder="Ex: Casa, Trabalho" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="CEP" placeholder="00000-000" value={newAddress.zipCode} onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})} required />
                <Input label="Número" placeholder="123" value={newAddress.number} onChange={e => setNewAddress({...newAddress, number: e.target.value})} required />
              </div>
              <Input label="Rua" placeholder="Rua das Flores" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
              <Input label="Complemento (opcional)" placeholder="Apto 45" value={newAddress.complement} onChange={e => setNewAddress({...newAddress, complement: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Bairro" placeholder="Centro" value={newAddress.neighborhood} onChange={e => setNewAddress({...newAddress, neighborhood: e.target.value})} required />
                <Input label="Cidade" placeholder="São Paulo" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required />
              </div>
              <Input label="Estado" placeholder="SP" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} required />
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

function AddressCard({ address, isSelected, onSelect, onEdit, onDelete }: { 
  address: Address; 
  isSelected: boolean; 
  onSelect: () => void; 
  onEdit: () => void; 
  onDelete: () => void 
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        isSelected 
          ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10' 
          : 'border-neutral-200 hover:border-primary-300 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
          isSelected ? 'border-primary-500 bg-primary-500' : 'border-neutral-300'
        }`}>
          {isSelected && <Check className="w-3 h-3 text-white" />}
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
            {address.neighborhood}, {address.city} - {address.state} • CEP: {address.zipCode}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={e => { e.stopPropagation(); onEdit(); }} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors" aria-label="Editar">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" aria-label="Excluir">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </button>
  )
}

function PaymentMethodCard({ method, isSelected, onSelect }: { 
  method: { id: string; label: string; desc: string; icon: string }; 
  isSelected: boolean; 
  onSelect: () => void 
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        isSelected 
          ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10' 
          : 'border-neutral-200 hover:border-primary-300 bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          isSelected ? 'border-primary-500 bg-primary-500' : 'border-neutral-300'
        }`}>
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>
        <span className="text-2xl">{method.icon}</span>
        <div className="flex-1">
          <p className="font-medium text-neutral-900">{method.label}</p>
          <p className="text-sm text-neutral-500">{method.desc}</p>
        </div>
      </div>
    </button>
  )
}