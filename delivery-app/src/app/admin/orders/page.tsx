'use client'

import { useState } from 'react'
import { 
  Search, Filter, Eye, Truck, Clock, CheckCircle, 
  XCircle, RefreshCw, DollarSign, MapPin, User, MoreVertical
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { mockOrders, formatCurrency, getOrderStatusLabel, getOrderStatusColor } from '@/lib/mock-data.tsx'

const statusOptions = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.street.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => getOrderStatusColor(status as any)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pedidos</h1>
          <p className="text-neutral-500 mt-1">Gerencie e acompanhe todos os pedidos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button>
            <DollarSign className="w-4 h-4 mr-2" />
            Relatório financeiro
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {filteredOrders.filter(o => ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)).length}
              </p>
              <p className="text-sm text-neutral-500">Em andamento</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {filteredOrders.filter(o => o.status === 'delivered').length}
              </p>
              <p className="text-sm text-neutral-500">Entregues hoje</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {formatCurrency(filteredOrders.reduce((sum, o) => sum + o.total, 0))}
              </p>
              <p className="text-sm text-neutral-500">Receita total</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {filteredOrders.filter(o => o.status === 'cancelled').length}
              </p>
              <p className="text-sm text-neutral-500">Cancelados</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {filteredOrders.filter(o => o.status === 'out_for_delivery').length}
              </p>
              <p className="text-sm text-neutral-500">Em entrega</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="search"
              placeholder="Buscar pedido, restaurante, cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[160px]"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmado</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Pronto</option>
              <option value="out_for_delivery">Saiu para entrega</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[140px]"
            >
              <option value="today">Hoje</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mês</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-neutral-500 border-b border-neutral-100">
                <th className="pb-3 font-medium">Pedido</th>
                <th className="pb-3 font-medium hidden md:table-cell">Cliente</th>
                <th className="pb-3 font-medium">Restaurante</th>
                <th className="pb-3 font-medium hidden lg:table-cell">Itens</th>
                <th className="pb-3 font-medium text-center">Valor</th>
                <th className="pb-3 font-medium text-center">Status</th>
                <th className="pb-3 font-medium text-center">Entrega</th>
                <th className="pb-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="font-semibold text-neutral-900">#{order.id}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleString('pt-BR', { 
                          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <div>
                      <p className="text-sm text-neutral-700">{order.address.street.split(',')[0]}</p>
                      <p className="text-xs text-neutral-500">{order.address.neighborhood}, {order.address.city}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <img src={order.restaurant.image} alt={order.restaurant.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="font-medium text-neutral-900">{order.restaurant.name}</span>
                    </div>
                  </td>
                  <td className="py-4 hidden lg:table-cell">
                    <span className="text-sm text-neutral-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                  </td>
                  <td className="py-4 text-center font-semibold text-neutral-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-4 text-center">
                    <Badge variant={getStatusColor(order.status) as any} size="sm">
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-neutral-600">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{new Date(order.estimatedDelivery).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowDetail(true); }}
                        className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                        aria-label="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { /* change status */ }}
                        className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                        aria-label="Alterar status"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
              <p className="text-neutral-500">Nenhum pedido encontrado</p>
            </div>
          )}
        </div>
      </Card>

      {/* Order Detail Modal */}
      {showDetail && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => { setShowDetail(false); setSelectedOrder(null); }}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-neutral-900">Pedido #{selectedOrder.id}</h2>
                <Badge variant={getStatusColor(selectedOrder.status) as any}>
                  {getOrderStatusLabel(selectedOrder.status)}
                </Badge>
              </div>
              <button onClick={() => { setShowDetail(false); setSelectedOrder(null); }} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Timeline */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-4">Rastreamento</h3>
                <div className="space-y-4">
                  {selectedOrder.tracking.map((track, index) => (
                    <div key={track.timestamp.getTime()} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          index === 0 ? 'bg-success-500 border-success-500 text-white' : 'bg-white border-neutral-200 text-neutral-300'
                        }`}>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        {index < selectedOrder.tracking.length - 1 && (
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
                  
                  {/* Future statuses */}
                  {['out_for_delivery', 'delivered'].filter(s => 
                    !selectedOrder.tracking.some(t => t.status === s)
                  ).map((status) => (
                    <div key={status} className="flex gap-3 opacity-50">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center">
                          <Truck className="w-4 h-4 text-neutral-300" />
                        </div>
                        <div className="w-0.5 h-full border-l border-dashed border-neutral-200 mt-1" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-neutral-500">{getOrderStatusLabel(status as any)}</p>
                        <p className="text-sm text-neutral-400">Aguardando...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Restaurant */}
                <Card>
                  <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary-500" />
                    Restaurante
                  </h4>
                  <div className="flex items-center gap-3">
                    <img src={selectedOrder.restaurant.image} alt={selectedOrder.restaurant.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-medium text-neutral-900">{selectedOrder.restaurant.name}</p>
                      <p className="text-sm text-neutral-500">{selectedOrder.restaurant.cuisine}</p>
                    </div>
                  </div>
                </Card>

                {/* Customer */}
                <Card>
                  <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    Entrega
                  </h4>
                  <div className="space-y-2">
                    <p className="font-medium text-neutral-900">{selectedOrder.address.label}</p>
                    <p className="text-sm text-neutral-600">
                      {selectedOrder.address.street}, {selectedOrder.address.number}
                      {selectedOrder.address.complement && `, ${selectedOrder.address.complement}`}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {selectedOrder.address.neighborhood}, {selectedOrder.address.city} - {selectedOrder.address.state}
                    </p>
                    <p className="text-sm text-neutral-500">CEP: {selectedOrder.address.zipCode}</p>
                  </div>
                </Card>

                {/* Payment */}
                <Card>
                  <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary-500" />
                    Pagamento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.total - selectedOrder.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Taxa de entrega</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.deliveryFee)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-success-600">
                        <span>Desconto</span>
                        <span className="font-medium">-{formatCurrency(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-neutral-900 border-t border-neutral-100 pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-500">
                      <span>Método</span>
                      <span className="font-medium capitalize">{selectedOrder.paymentMethod.replace('_', ' ')}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Items */}
              <Card>
                <h4 className="font-semibold text-neutral-900 mb-4">Itens do pedido</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-neutral-50 rounded-xl">
                      <img src={item.menuItem.image} alt={item.menuItem.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900">{item.menuItem.name}</p>
                        {Object.keys(item.customizations).length > 0 && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {Object.entries(item.customizations).flatMap(([key, vals]) => vals).join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-primary-600 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                            {item.notes}
                          </p>
                        )}
                        <p className="text-sm text-neutral-500 mt-1">Qtd: {item.quantity} × {formatCurrency(item.menuItem.price)}</p>
                      </div>
                      <p className="font-semibold text-neutral-900 self-center">{formatCurrency(item.menuItem.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-200">
                <Button variant="outline" onClick={() => { /* contact customer */ }}>
                  <User className="w-4 h-4 mr-2" />
                  Contatar cliente
                </Button>
                <Button variant="outline" onClick={() => { /* contact restaurant */ }}>
                  <Truck className="w-4 h-4 mr-2" />
                  Contatar restaurante
                </Button>
                {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(selectedOrder.status) && (
                  <>
                    <Button variant="outline" onClick={() => { /* cancel */ }}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar pedido
                    </Button>
                    <Button onClick={() => { /* next status */ }}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Avançar status
                    </Button>
                  </>
                )}
                {selectedOrder.status === 'delivered' && (
                  <Button variant="ghost">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reordenar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}