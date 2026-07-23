'use client'

import { useState } from 'react'
import { ArrowLeft, Clock, CheckCircle, Truck, XCircle, RefreshCw, Star, MessageSquare, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { mockOrders, formatCurrency, getOrderStatusLabel, getOrderStatusColor } from '@/lib/mock-data.tsx'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']

export default function OrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'past'>('all')
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return !['delivered', 'cancelled'].includes(order.status)
    if (activeTab === 'past') return ['delivered', 'cancelled'].includes(order.status)
    return true
  })

  const getStatusColor = (status: string) => getOrderStatusColor(status as any)

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-neutral-200 z-30">
        <div className="container-app px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-neutral-900">Meus pedidos</h1>
          </div>
        </div>
        
        <div className="flex gap-2 px-4 pb-3 border-b border-neutral-100">
          {(['all', 'active', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {tab === 'all' && 'Todos'}
              {tab === 'active' && 'Em andamento'}
              {tab === 'past' && 'Anteriores'}
            </button>
          ))}
        </div>
      </header>

      <main className="container-app pb-24">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-neutral-400" />
            </div>
            <h2 className="text-lg font-medium text-neutral-900 mb-2">
              {activeTab === 'active' ? 'Nenhum pedido em andamento' : 'Nenhum pedido encontrado'}
            </h2>
            <p className="text-neutral-500 mb-6">
              {activeTab === 'active' 
                ? 'Seus pedidos entregues aparecerão aqui' 
                : 'Faça seu primeiro pedido!'}
            </p>
            {activeTab !== 'active' && (
              <Button onClick={() => router.push('/')} className="max-w-xs">
                Explorar restaurantes
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => {
                  setSelectedOrder(order)
                  setShowDetail(true)
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {showDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => { setShowDetail(false); setSelectedOrder(null); }}
        />
      )}
    </div>
  )
}

function OrderCard({ order, onClick }: { order: typeof mockOrders[0]; onClick: () => void }) {
  const statusColor = getOrderStatusColor(order.status)
  const statusLabel = getOrderStatusLabel(order.status)
  
  return (
    <Card variant="outlined" className="cursor-pointer hover:shadow-card-hover transition-shadow" onClick={onClick}>
      <div className="flex gap-3">
        <img 
          src={order.restaurant.image} 
          alt={order.restaurant.name} 
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-neutral-900 truncate">{order.restaurant.name}</h3>
              <p className="text-sm text-neutral-500 truncate">{order.restaurant.cuisine}</p>
            </div>
            <Badge variant={statusColor as any} size="sm">
              {statusLabel}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500">
            <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
            <span>·</span>
            <span>{formatCurrency(order.total)}</span>
            <span>·</span>
            <span>{new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="font-semibold text-neutral-900">{formatCurrency(order.total)}</span>
          {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status) && (
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); router.push(`/tracking/${order.id}`); }}>
              Acompanhar
            </Button>
          )}
          {order.status === 'delivered' && (
            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); }}>
              <Star className="w-3.5 h-3.5 mr-1" />
              Avaliar
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

function OrderDetailModal({ order, onClose }: { order: typeof mockOrders[0]; onClose: () => void }) {
  const statusColor = getOrderStatusColor(order.status)
  const statusLabel = getOrderStatusLabel(order.status)

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center sm:justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-neutral-900">Detalhes do pedido</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status Header */}
          <div className="p-4 bg-neutral-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-neutral-900">#{order.id}</span>
              <Badge variant={statusColor as any}>{statusLabel}</Badge>
            </div>
            <p className="text-sm text-neutral-500">
              {new Date(order.createdAt).toLocaleString('pt-BR', { 
                day: '2-digit', month: '2-digit', year: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
              })}
            </p>
          </div>

          {/* Restaurant */}
          <Card>
            <div className="flex items-center gap-3">
              <img src={order.restaurant.image} alt={order.restaurant.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-neutral-900">{order.restaurant.name}</p>
                <p className="text-sm text-neutral-500">{order.restaurant.cuisine}</p>
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card>
            <h3 className="font-semibold text-neutral-900 mb-3">Itens do pedido</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <img src={item.menuItem.image} alt={item.menuItem.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900">{item.menuItem.name}</p>
                    {Object.keys(item.customizations).length > 0 && (
                      <p className="text-xs text-neutral-500">
                        {Object.entries(item.customizations).flatMap(([key, vals]) => vals).join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-neutral-500">Qtd: {item.quantity} × {formatCurrency(item.menuItem.price)}</p>
                  </div>
                  <p className="font-semibold text-neutral-900 self-center">{formatCurrency(item.menuItem.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-neutral-100 mt-3 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.total - order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Taxa de entrega</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-neutral-900">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-success-600 font-medium">
                <span>Pago com {order.paymentMethod === 'pix' ? 'PIX' : 'Cartão'}</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Address */}
          <Card>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Endereço de entrega</p>
                <p className="text-sm text-neutral-600 mt-1">
                  {order.address.street}, {order.address.number}
                  {order.address.complement && `, ${order.address.complement}`}
                  <br />
                  {order.address.neighborhood}, {order.address.city} - {order.address.state}
                </p>
              </div>
            </div>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <h3 className="font-semibold text-neutral-900 mb-3">Histórico</h3>
            <div className="space-y-4">
              {order.tracking.slice().reverse().map((track, index) => (
                <div key={track.timestamp.getTime()} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      index === 0 ? 'bg-success-500 border-success-500 text-white' : 'bg-white border-neutral-200 text-neutral-300'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    {index < order.tracking.length - 1 && (
                      <div className="w-0.5 h-full bg-neutral-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium text-neutral-900">{track.message}</p>
                    <p className="text-sm text-neutral-500">
                      {new Date(track.timestamp).toLocaleString('pt-BR', { 
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            {order.status === 'delivered' && (
              <>
                <Button variant="outline" className="w-full" onClick={onClose}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Falar com suporte
                </Button>
                <Button className="w-full" onClick={() => { onClose(); router.push(`/${order.restaurant.name.toLowerCase().replace(/\s+/g, '-')}`); }}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Pedir novamente
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => {}}>
                  <Star className="w-4 h-4 mr-2" />
                  Avaliar pedido
                </Button>
              </>
            )}
            {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status) && (
              <Button className="w-full" onClick={() => { onClose(); router.push(`/tracking/${order.id}`); }}>
                <Truck className="w-4 h-4 mr-2" />
                Acompanhar entrega
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}