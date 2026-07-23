'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Truck, Clock, CheckCircle, Circle, Phone, MessageSquare, Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { mockOrders, mockAddresses, formatCurrency, getOrderStatusLabel, getOrderStatusColor } from '@/lib/mock-data.tsx'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const orderStatuses = [
  { id: 'confirmed', label: 'Confirmado', icon: CheckCircle },
  { id: 'preparing', label: 'Preparando', icon: Circle },
  { id: 'ready', label: 'Pronto', icon: CheckCircle },
  { id: 'out_for_delivery', label: 'Saiu para entrega', icon: Truck },
  { id: 'delivered', label: 'Entregue', icon: CheckCircle },
] as const

type OrderStatus = typeof orderStatuses[number]['id']

interface TrackingOrder {
  id: string
  restaurant: { name: string; image: string; phone: string }
  items: { name: string; quantity: number; price: number }[]
  status: OrderStatus
  total: number
  deliveryFee: number
  address: { street: string; number: string; complement?: string; neighborhood: string; city: string; state: string }
  createdAt: Date
  estimatedDelivery: Date
  tracking: { status: OrderStatus; timestamp: Date; message: string }[]
  deliveryPerson?: { name: string; phone: string; avatar: string; location?: { lat: number; lng: number } }
}

const mockTrackingOrder: TrackingOrder = {
  id: 'ORD-2024-003',
  restaurant: { 
    name: 'Burger House', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    phone: '(11) 99999-9999'
  },
  items: [
    { name: 'X-Bacon Especial', quantity: 2, price: 32.90 },
    { name: 'Batata Rústica', quantity: 1, price: 18.90 },
    { name: 'Milkshake de Ovomaltine', quantity: 1, price: 19.90 },
  ],
  status: 'out_for_delivery',
  total: 104.60,
  deliveryFee: 5.90,
  address: { 
    street: 'Rua das Flores', 
    number: '123', 
    complement: 'Apto 45',
    neighborhood: 'Jardim Primavera', 
    city: 'São Paulo', 
    state: 'SP' 
  },
  createdAt: new Date(Date.now() - 30 * 60 * 1000),
  estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000),
  tracking: [
    { status: 'confirmed', timestamp: new Date(Date.now() - 30 * 60 * 1000), message: 'Pedido confirmado' },
    { status: 'preparing', timestamp: new Date(Date.now() - 25 * 60 * 1000), message: 'Restaurante preparando seu pedido' },
    { status: 'ready', timestamp: new Date(Date.now() - 10 * 60 * 1000), message: 'Pedido pronto para retirada' },
    { status: 'out_for_delivery', timestamp: new Date(Date.now() - 5 * 60 * 1000), message: 'Entregador a caminho' },
  ],
  deliveryPerson: {
    name: 'Carlos Silva',
    phone: '(11) 98888-8888',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    location: { lat: -23.555, lng: -46.640 }
  }
}

export default function TrackingPage() {
  const router = useRouter()
  const [order, setOrder] = useState<TrackingOrder>(mockTrackingOrder)
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)
  const [showMap, setShowMap] = useState(false)

  // Find current status index
  useEffect(() => {
    const index = orderStatuses.findIndex(s => s.id === order.status)
    setCurrentStatusIndex(index >= 0 ? index : 0)
  }, [order.status])

  // Simulate real-time updates
  useEffect(() => {
    if (order.status === 'delivered') return
    
    const interval = setInterval(() => {
      setOrder(prev => {
        if (prev.status === 'delivered') return prev
        
        const currentIndex = orderStatuses.findIndex(s => s.id === prev.status)
        if (currentIndex < orderStatuses.length - 1) {
          const nextStatus = orderStatuses[currentIndex + 1]
          return {
            ...prev,
            status: nextStatus.id,
            tracking: [
              ...prev.tracking,
              { 
                status: nextStatus.id, 
                timestamp: new Date(), 
                message: getStatusMessage(nextStatus.id) 
              }
            ]
          }
        }
        return prev
      })
    }, 30000) // Update every 30 seconds for demo

    return () => clearInterval(interval)
  }, [])

  const getStatusMessage = (status: OrderStatus): string => {
    const messages: Record<OrderStatus, string> = {
      confirmed: 'Pedido confirmado',
      preparing: 'Restaurante preparando seu pedido',
      ready: 'Pedido pronto para retirada',
      out_for_delivery: 'Entregador a caminho',
      delivered: 'Pedido entregue',
    }
    return messages[status]
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const getRemainingTime = () => {
    const now = new Date()
    const diff = order.estimatedDelivery.getTime() - now.getTime()
    if (diff <= 0) return 'Entregando...'
    const mins = Math.ceil(diff / 60000)
    return `${mins} min`
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-neutral-200 z-30">
        <div className="container-app px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold text-neutral-900">Rastrear pedido</h1>
              <p className="text-sm text-neutral-500">#{order.id}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app pb-24">
        {/* Status Header */}
        <Card className="mb-4 overflow-hidden">
          <div className="relative h-4 bg-neutral-200 mx-4 mt-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((currentStatusIndex + 1) / orderStatuses.length) * 100}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between px-4 py-4 -mt-2 relative z-10">
            {orderStatuses.map((status, index) => (
              <div key={status.id} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-3 transition-all duration-300 ${
                  index < currentStatusIndex
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : index === currentStatusIndex
                    ? 'bg-white border-primary-500 text-primary-500 ring-4 ring-primary-500/20'
                    : 'bg-white border-neutral-200 text-neutral-300'
                }`}>
                  {index < currentStatusIndex ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <status.icon className={`w-5 h-5 ${index === currentStatusIndex ? 'text-primary-500' : 'text-neutral-300'}`} />
                  )}
                </div>
                <span className={`text-xs font-medium mt-1 text-center w-24 ${index <= currentStatusIndex ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  {status.label}
                </span>
              </div>
            ))}
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-neutral-600">
                <Clock className="w-4 h-4" />
                <span>Previsão: {formatTime(order.estimatedDelivery)}</span>
              </div>
              <Badge variant={order.status === 'delivered' ? 'success' : 'primary'} size="md">
                {getOrderStatusLabel(order.status)}
              </Badge>
            </div>
            {order.status === 'out_for_delivery' && (
              <div className="mt-3 p-3 bg-primary-50 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-primary-700">Entregador a caminho</p>
                  <p className="text-sm text-primary-600">Chegada prevista em {getRemainingTime()}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Delivery Person */}
        {order.status === 'out_for_delivery' && order.deliveryPerson && (
          <Card className="mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={order.deliveryPerson.avatar} 
                alt={order.deliveryPerson.name} 
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{order.deliveryPerson.name}</p>
                <p className="text-sm text-neutral-500">Seu entregador</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors" aria-label="Ligar">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors" aria-label="Chat">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {showMap && (
              <div className="mt-4 h-48 bg-neutral-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-neutral-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p>Mapa em tempo real</p>
                  <p className="text-xs">Entregador: {order.deliveryPerson.location?.lat.toFixed(4)}, {order.deliveryPerson.location?.lng.toFixed(4)}</p>
                </div>
              </div>
            )}
            
            <Button variant="outline" onClick={() => setShowMap(!showMap)} className="w-full mt-3">
              {showMap ? 'Ocultar mapa' : 'Ver no mapa'}
            </Button>
          </Card>
        )}

        {/* Order Details */}
        <Card className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <img src={order.restaurant.image} alt={order.restaurant.name} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <p className="font-semibold text-neutral-900">{order.restaurant.name}</p>
              <p className="text-sm text-neutral-500">Restaurante</p>
            </div>
            <div className="flex-1"></div>
            <button className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500 transition-colors" aria-label="Ligar para restaurante">
              <Phone className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3 border-t border-neutral-100 pt-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <p className="font-medium text-neutral-900">{item.name}</p>
                  <p className="text-sm text-neutral-500">Qtd: {item.quantity}</p>
                </div>
                <p className="font-medium text-neutral-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
            
            <div className="border-t border-neutral-100 pt-3 space-y-2 text-sm">
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
            </div>
          </div>
        </Card>

        {/* Delivery Address */}
        <Card className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-900">Endereço de entrega</p>
              <p className="text-sm text-neutral-600">
                {order.address.street}, {order.address.number}
                {order.address.complement && `, ${order.address.complement}`}
                <br />
                {order.address.neighborhood}, {order.address.city} - {order.address.state}
              </p>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card>
          <h3 className="font-semibold text-neutral-900 mb-4">Histórico do pedido</h3>
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
                  <p className="text-sm text-neutral-500">{formatDate(track.timestamp)}</p>
                </div>
              </div>
            ))}
            
            {/* Upcoming statuses */}
            {orderStatuses.slice(currentStatusIndex + 1).map((status, index) => (
              <div key={status.id} className="flex gap-3 opacity-50">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center">
                    <status.icon className="w-4 h-4 text-neutral-300" />
                  </div>
                  {index < orderStatuses.slice(currentStatusIndex + 1).length - 1 && (
                    <div className="w-0.5 h-full border-l border-dashed border-neutral-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-neutral-500">{status.label}</p>
                  <p className="text-sm text-neutral-400">Aguardando...</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        {order.status === 'delivered' && (
          <div className="mt-6 space-y-3">
            <Button variant="outline" className="w-full" onClick={() => router.push('/orders')}>
              Ver meus pedidos
            </Button>
            <Button className="w-full" onClick={() => router.push(`/${order.restaurant.name.toLowerCase().replace(/\s+/g, '-')}`)}>
              Pedir novamente
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => {}}>
              Avaliar pedido
              <Star className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}