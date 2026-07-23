'use client'

import { 
  ShoppingBag, DollarSign, Store, Users, TrendingUp, Clock,
  ArrowUpRight, ArrowDownRight, Minus, Package, Star, MapPin
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { mockOrders, mockUser, restaurants, formatCurrency } from '@/lib/mock-data.tsx'
import Link from 'next/link'

const stats = [
  {
    name: 'Pedidos Hoje',
    value: '24',
    change: '+12%',
    icon: ShoppingBag,
    color: 'primary',
    trend: 'up',
  },
  {
    name: 'Receita Total',
    value: formatCurrency(3450.50),
    change: '+8.5%',
    icon: DollarSign,
    color: 'success',
    trend: 'up',
  },
  {
    name: 'Restaurantes Ativos',
    value: '6',
    change: '0%',
    icon: Store,
    color: 'accent',
    trend: 'neutral',
  },
  {
    name: 'Clientes Ativos',
    value: '142',
    change: '+23%',
    icon: Users,
    color: 'primary',
    trend: 'up',
  },
]

const recentOrders = mockOrders.slice(0, 5)

const topProducts = [
  { name: 'X-Bacon Especial', restaurant: 'Burger House', orders: 45, revenue: formatCurrency(1480.50) },
  { name: 'Pizza Margherita', restaurant: 'Pizza Bella Napoli', orders: 38, revenue: formatCurrency(1630.20) },
  { name: 'Combo Sashimi 15 pçs', restaurant: 'Sushi Zen', orders: 22, revenue: formatCurrency(1515.80) },
  { name: 'Buddha Bowl', restaurant: 'Green Bowl', orders: 31, revenue: formatCurrency(1205.90) },
  { name: 'Hot Roll Salmão', restaurant: 'Sushi Zen', orders: 28, revenue: formatCurrency(977.20) },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500 mt-1">Visão geral do seu negócio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:flex">
            <span className="mr-2">📊</span>
            Exportar relatório
          </Button>
          <Button>
            <span className="mr-2">➕</span>
            Novo restaurante
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className={cn(
                    'text-sm font-medium',
                    stat.trend === 'up' ? 'text-success-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-neutral-500'
                  )}>
                    {stat.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
                    {stat.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stat.trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
                    {stat.change}
                  </span>
                  <span className="text-xs text-neutral-400">vs mês passado</span>
                </div>
              </div>
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                `bg-${stat.color}-100 text-${stat.color}-600`
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
              <stat.icon className="w-full h-full text-neutral-900" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts & Tables Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Pedidos Recentes</h2>
            <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todos
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-neutral-500 border-b border-neutral-100">
                  <th className="pb-3 font-medium">Pedido</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Cliente</th>
                  <th className="pb-3 font-medium">Restaurante</th>
                  <th className="pb-3 font-medium text-right">Valor</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Status</th>
                  <th className="pb-3 font-medium">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 font-medium text-neutral-900">#{order.id}</td>
                    <td className="py-3 hidden md:table-cell text-neutral-600">{order.address.street.split(',')[0]}</td>
                    <td className="py-3 text-neutral-700">{order.restaurant.name}</td>
                    <td className="py-3 text-right font-semibold text-neutral-900">{formatCurrency(order.total)}</td>
                    <td className="py-3 hidden lg:table-cell">
                      <Badge variant={getStatusColor(order.status) as any} size="sm">
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Produtos Mais Vendidos</h2>
            <Link href="/admin/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0',
                  index === 0 ? 'bg-accent-500' : index === 1 ? 'bg-neutral-400' : index === 2 ? 'bg-accent-600' : 'bg-primary-500'
                )}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{product.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{product.restaurant}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">{product.orders} pedidos</p>
                  <p className="text-xs text-success-600">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/restaurants/new" className="p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-3 group-hover:bg-primary-500 group-hover:text-white transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <p className="font-medium text-neutral-900">Novo Restaurante</p>
            <p className="text-xs text-neutral-500 mt-1">Cadastrar estabelecimento</p>
          </Link>
          
          <Link href="/admin/products/new" className="p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-success-100 text-success-600 flex items-center justify-center mb-3 group-hover:bg-success-500 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <p className="font-medium text-neutral-900">Novo Produto</p>
            <p className="text-xs text-neutral-500 mt-1">Adicionar ao cardápio</p>
          </Link>
          
          <Link href="/admin/orders" className="p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center mb-3 group-hover:bg-accent-500 group-hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="font-medium text-neutral-900">Gerenciar Pedidos</p>
            <p className="text-xs text-neutral-500 mt-1">Acompanhar e atualizar</p>
          </Link>
          
          <Link href="/admin/settings" className="p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center mb-3 group-hover:bg-neutral-500 group-hover:text-white transition-colors">
              <Star className="w-5 h-5" />
            </div>
            <p className="font-medium text-neutral-900">Configurações</p>
            <p className="text-xs text-neutral-500 mt-1">Ajustar preferências</p>
          </Link>
        </div>
      </Card>

      {/* Restaurant Performance */}
      <Card>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Desempenho dos Restaurantes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-neutral-500 border-b border-neutral-100">
                <th className="pb-3 font-medium">Restaurante</th>
                <th className="pb-3 font-medium text-center">Avaliação</th>
                <th className="pb-3 font-medium text-center">Pedidos (mês)</th>
                <th className="pb-3 font-medium text-right">Receita</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-neutral-50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={restaurant.image} alt={restaurant.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-neutral-900">{restaurant.name}</p>
                        <p className="text-xs text-neutral-500">{restaurant.cuisine}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <span className="flex items-center justify-center gap-1 text-sm font-medium text-neutral-700">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {restaurant.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 text-center font-medium text-neutral-900">
                    {Math.floor(Math.random() * 100 + 50)}
                  </td>
                  <td className="py-3 text-right font-semibold text-neutral-900">
                    {formatCurrency(Math.random() * 5000 + 1000)}
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant={restaurant.isOpen ? 'success' : 'neutral'} size="sm">
                      {restaurant.isOpen ? 'Aberto' : 'Fechado'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'warning',
    confirmed: 'info',
    preparing: 'warning',
    ready: 'info',
    out_for_delivery: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  }
  return colors[status] || 'neutral'
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Pronto',
    out_for_delivery: 'Saiu para entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  }
  return labels[status] || status
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}