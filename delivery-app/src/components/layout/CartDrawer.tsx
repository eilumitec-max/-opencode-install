'use client'

import { useState } from 'react'
import { X, Plus, Minus, Trash2, MapPin, CreditCard, Truck, CheckCircle, Clock, AlertCircle, Home, Briefcase, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useCartStore, useUIStore } from '@/store'
import { formatCurrency, mockAddresses } from '@/lib/mock-data'
import type { CartItem } from '@/types/restaurant'

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const { closeCart } = useUIStore()
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(mockAddresses[0])
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'cash'>('pix')
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const subtotal = getTotal()
  const deliveryFee = 5.90
  const total = subtotal + deliveryFee - discount
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    setIsPlacingOrder(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    clearCart()
    setIsPlacingOrder(false)
    setShowCheckout(false)
    closeCart()
  }

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <aside className={cn(
        'fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col',
        'transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Carrinho</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Truck className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Carrinho vazio</h3>
            <p className="text-gray-500 mb-6 max-w-xs">
              Adicione itens deliciosos do seu restaurante favorito
            </p>
            <Button onClick={onClose} className="w-full max-w-xs">
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} itens)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de entrega</span>
                  <span className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto (cupom: {coupon})</span>
                    <span className="font-medium">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {!showCheckout ? (
                <Button 
                  onClick={() => setShowCheckout(true)} 
                  className="w-full py-3 text-lg"
                  size="lg"
                >
                  Finalizar pedido
                </Button>
              ) : (
                <CheckoutForm
                  selectedAddress={selectedAddress}
                  onAddressChange={setSelectedAddress}
                  paymentMethod={paymentMethod}
                  onPaymentChange={setPaymentMethod}
                  coupon={coupon}
                  onCouponChange={setCoupon}
                  onApplyCoupon={applyCoupon}
                  discount={discount}
                  total={total}
                  onPlaceOrder={handlePlaceOrder}
                  isLoading={isPlacingOrder}
                  onBack={() => setShowCheckout(false)}
                />
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function CartItemCard({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}: { 
  item: CartItem; 
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const customizationPrice = Object.values(item.customizations).flat().reduce(
    (sum, optId) => {
      const option = item.menuItem.customizations?.flatMap(c => c.options).find(o => o.id === optId)
      return sum + (option?.price || 0)
    },
    0
  )
  const unitPrice = item.menuItem.price + customizationPrice
  const totalPrice = unitPrice * item.quantity

  return (
    <Card variant="outlined" padding="sm" className="flex gap-3">
      <div className="w-20 h-20 rounded-lg bg-white overflow-hidden flex-shrink-0 relative">
        <img 
          src={item.menuItem.image} 
          alt={item.menuItem.name} 
          className="w-full h-full object-cover"
        />
        {item.menuItem.isPopular && (
          <span className="absolute top-1 right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
            Popular
          </span>
        )}
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="font-medium text-gray-900 truncate">{item.menuItem.name}</h4>
          {Object.entries(item.customizations).map(([groupId, options]) => (
            <p key={groupId} className="text-xs text-gray-500 mt-1">
              {options.join(', ')}
            </p>
          ))}
          {item.notes && (
            <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {item.notes}
            </p>
          )}
          <p className="text-sm font-semibold text-orange-600 mt-1">{formatCurrency(totalPrice)}</p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-medium w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            aria-label="Remover item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  )
}

function CheckoutForm({
  selectedAddress,
  onAddressChange,
  paymentMethod,
  onPaymentChange,
  coupon,
  onCouponChange,
  onApplyCoupon,
  discount,
  total,
  onPlaceOrder,
  isLoading,
  onBack,
}: {
  selectedAddress: typeof mockAddresses[0]
  onAddressChange: (addr: typeof mockAddresses[0]) => void
  paymentMethod: 'pix' | 'credit_card' | 'cash'
  onPaymentChange: (method: 'pix' | 'credit_card' | 'cash') => void
  coupon: string
  onCouponChange: (value: string) => void
  onApplyCoupon: () => void
  discount: number
  total: number
  onPlaceOrder: () => void
  isLoading: boolean
  onBack: () => void
}) {
  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Finalizar pedido</h3>
        <button onClick={onBack} className="text-orange-600 text-sm font-medium flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Endereço de entrega</label>
        {mockAddresses.map((address) => (
          <label 
            key={address.id} 
            className={cn(
              'relative flex items-center p-3 rounded-xl border-2 transition-all cursor-pointer',
              selectedAddress.id === address.id 
                ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/10' 
                : 'border-gray-200 hover:border-orange-300 bg-white'
            )}
          >
            <input
              type="radio"
              name="address"
              checked={selectedAddress.id === address.id}
              onChange={() => onAddressChange(address)}
              className="sr-only"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{address.label}</span>
                {address.isDefault && (
                  <Badge variant="primary" size="sm">Principal</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {address.street}, {address.number}
                {address.complement && `, ${address.complement}`}
              </p>
              <p className="text-sm text-gray-500">
                {address.neighborhood}, {address.city} - {address.state}
              </p>
            </div>
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
              selectedAddress.id === address.id 
                ? 'border-orange-500 bg-orange-500' 
                : 'border-gray-300'
            )}>
              {selectedAddress.id === address.id && (
                <Check className="w-3.5 h-3.5 text-white" />
              )}
            </div>
          </label>
        ))}
        <Button variant="outline" className="w-full mt-2" onClick={() => {}}>
          <MapPin className="w-4 h-4 mr-2" />
          Adicionar novo endereço
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Forma de pagamento</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'pix', label: 'PIX', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> },
            { id: 'credit_card', label: 'Cartão', icon: <CreditCard className="w-5 h-5" /> },
            { id: 'cash', label: 'Dinheiro', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> },
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => onPaymentChange(method.id as 'pix' | 'credit_card' | 'cash')}
              className={cn(
                'relative p-3 rounded-xl border-2 transition-all',
                paymentMethod === method.id 
                  ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/10' 
                  : 'border-gray-200 hover:border-orange-300 bg-white'
              )}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === method.id}
                onChange={() => onPaymentChange(method.id as 'pix' | 'credit_card' | 'cash')}
                className="sr-only"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="text-gray-600">{method.icon}</div>
                <span className="text-sm font-medium text-gray-900">{method.label}</span>
              </div>
              {paymentMethod === method.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Cupom de desconto"
          value={coupon}
          onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-transparent"
        />
        <Button variant="outline" onClick={onApplyCoupon} disabled={!coupon}>
          Aplicar
        </Button>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatCurrency(total + discount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxa de entrega</span>
          <span className="font-medium">{formatCurrency(5.90)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Desconto</span>
            <span className="font-medium">-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <Button 
        onClick={onPlaceOrder} 
        loading={isLoading}
        className="w-full py-3 text-lg"
        size="lg"
      >
        {isLoading ? 'Confirmando...' : `Confirmar pedido - ${formatCurrency(total)}`}
      </Button>
    </div>
  )
}

const applyCoupon = (coupon: string, setDiscount: (d: number) => void) => {
  const coupons: Record<string, number> = {
    'PRIMEIRO20': 20,
    'FAMILIA25': 25,
    'FRETEGRATIS': 5.90,
  }
  setDiscount(coupons[coupon] || 0)
}