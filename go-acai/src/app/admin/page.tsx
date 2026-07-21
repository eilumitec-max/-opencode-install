'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings, LogOut, Plus, Search,
  Edit3, Trash2, ChevronDown, MoreVertical, TrendingUp, DollarSign, Clock,
  Image as ImageIcon, ExternalLink
} from 'lucide-react'
import { tenants, getTenantById, type Tenant, type TenantProduct, type TenantOrder } from '@/lib/tenants'
import { playNewOrder, playStatusChange } from '@/lib/sound'
import { supabase } from '@/lib/supabase'
import { fetchTenantById, upsertProduct, deleteProductById, upsertCategory, deleteCategoryById, updateOrderStatus, fetchOrdersByTenant, deleteOrderById } from '@/lib/supabase-queries'

type Tab = 'dashboard' | 'products' | 'categories' | 'orders' | 'analytics' | 'settings'

export default function AdminPage() {
  const router = useRouter()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('goacai_tenant')
    if (stored) {
      const { id } = JSON.parse(stored)
      const t = getTenantById(id)
      if (t) {
        setTenant(t)
        fetchTenantById(id).then(sb => { if (sb) setTenant(sb) })
        return
      }
    }
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const { data: link } = await supabase.from('tenant_users').select('tenant_id').eq('user_id', session.user.id).single()
      if (link) {
        localStorage.setItem('goacai_tenant', JSON.stringify({ id: link.tenant_id }))
        const t = getTenantById(link.tenant_id)
        if (t) setTenant(t)
        fetchTenantById(link.tenant_id).then(sb => { if (sb) setTenant(sb) })
      } else router.push('/login')
    })
  }, [router])

  if (!tenant) return null

  const navItems: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'products', label: 'Produtos', icon: Package },
    { key: 'categories', label: 'Categorias', icon: ShoppingBag },
    { key: 'orders', label: 'Pedidos', icon: Users },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'settings', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark-900 border-r border-dark-800 transition-all duration-300 flex flex-col fixed h-full z-30`}>
        <div className="p-4 border-b border-dark-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center flex-shrink-0 text-xl">{tenant.logo}</div>
          {sidebarOpen && <div><h1 className="font-bold text-white text-sm">{tenant.name}</h1><p className="text-xs text-dark-400">Admin</p></div>}
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${tab === item.key ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-dark-400 hover:text-white hover:bg-dark-800 border border-transparent'}`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-dark-800 space-y-1">
          <Link href={`/app/${tenant.slug}`} target="_blank" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-400 hover:text-accent-400 hover:bg-dark-800 transition-all">
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Ver App</span>}
          </Link>
          <button onClick={() => { localStorage.removeItem('goacai_tenant'); router.push('/login') }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-400 hover:text-red-400 hover:bg-dark-800 transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-20 w-6 h-6 bg-dark-800 border border-dark-700 rounded-full flex items-center justify-center hover:bg-dark-700 transition-colors">
          <ChevronDown className={`w-3 h-3 text-dark-400 transition-transform ${sidebarOpen ? '' : 'rotate-90'}`} />
        </button>
      </aside>

      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 min-h-screen`}>
        <div className="sticky top-0 z-20 bg-dark-950/80 backdrop-blur-md border-b border-dark-800">
          <div className="px-6 lg:px-8 py-3 flex items-center justify-between">
            <div><h2 className="text-lg font-bold text-white font-display capitalize">{tab}</h2></div>
            <div className="flex items-center gap-3">
              <Link href={`/app/${tenant.slug}`} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500/10 text-accent-400 text-sm font-medium hover:bg-accent-500/20 transition-all border border-accent-500/20">
                <ExternalLink className="w-4 h-4" /> Ver Meu App
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 text-xs text-dark-400">
                <span className="text-lg">{tenant.logo}</span>
                <span>{tenant.name}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 lg:p-8 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {tab === 'dashboard' && <DashboardTab tenant={tenant} />}
              {tab === 'products' && <ProductsTab tenant={tenant} />}
              {tab === 'categories' && <CategoriesTab tenant={tenant} />}
              {tab === 'orders' && <OrdersTab tenant={tenant} />}
              {tab === 'analytics' && <AnalyticsTab tenant={tenant} />}
              {tab === 'settings' && <SettingsTab tenant={tenant} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function DashboardTab({ tenant }: { tenant: Tenant }) {
  const [alertOrder, setAlertOrder] = useState<string | null>(null)
  const [orders, setOrders] = useState<TenantOrder[]>([])
  const [prevActiveCount, setPrevActiveCount] = useState(0)

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await fetchOrdersByTenant(tenant.id)
      const mapped = data.map((r: any) => ({
        id: r.id, customer: r.customer, phone: r.phone, items: r.items, total: r.total,
        status: r.status, payment: r.payment, method: r.method, date: r.date, address: r.address,
      }))
      const activeCount = mapped.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length
      if (activeCount > prevActiveCount) {
        playNewOrder()
        setAlertOrder(mapped[0].id)
        setTimeout(() => setAlertOrder(null), 5000)
      }
      setOrders(mapped)
      setPrevActiveCount(activeCount)
    }
    fetchOrders()

    const channel = supabase.channel('orders_realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tenant.id}` },
        () => { fetchOrders() }
      )
      .subscribe()

    const interval = setInterval(fetchOrders, 30000)
    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [tenant.id])

  const handleStatus = async (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as any } : o))
    const order = orders.find(o => o.id === id)
    await updateOrderStatus(id, status, tenant.id)
    playStatusChange(status)
    localStorage.setItem('goacai_tracking', JSON.stringify({
      orderId: id, status, customer: order?.customer || '',
      updatedAt: Date.now()
    }))
    if (order?.phone) {
      fetch('/api/push/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: order.phone,
          title: 'Pedido Atualizado!',
          body: `${order.customer}, seu pedido ${id} agora está: ${status === 'preparing' ? 'Preparando' : status === 'shipped' ? 'Saiu pra entrega' : status === 'delivered' ? 'Entregue!' : status === 'cancelled' ? 'Cancelado' : 'Pendente'}`,
          url: `/app/${tenant.slug}`,
        }),
      })
    }
  }

  const totalSales = orders.filter(o => o.status === 'delivered').length
  const revenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  const pending = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length
  const avgTicket = totalSales > 0 ? revenue / totalSales : 0

  const metrics = [
    { label: 'Faturamento Hoje', value: `R$ ${revenue.toFixed(2).replace('.', ',')}`, change: '', icon: DollarSign, color: 'bg-green-500/10 text-green-400' },
    { label: 'Pedidos Hoje', value: String(orders.length), change: '', icon: ShoppingBag, color: 'bg-primary-500/10 text-primary-400' },
    { label: 'Ticket Médio', value: `R$ ${avgTicket.toFixed(2).replace('.', ',')}`, change: '', icon: TrendingUp, color: 'bg-secondary-500/10 text-secondary-400' },
    { label: 'Pendentes', value: String(pending), change: '', icon: Clock, color: 'bg-amber-500/10 text-amber-400' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <motion.div key={m.label} whileHover={{ y: -2 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${m.color} flex items-center justify-center`}><m.icon className="w-5 h-5" /></div>
              {m.change && <span className="text-xs text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded-full">{m.change}</span>}
            </div>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <p className="text-sm text-dark-400 mt-1">{m.label}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {alertOrder && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="bg-gradient-to-r from-accent-500/20 to-primary-500/20 border border-accent-500/30 rounded-2xl p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center text-lg">🛎️</span>
            <div><p className="font-semibold text-white">Novo Pedido Recebido!</p><p className="text-xs text-accent-400">{orders.find(o => o.id === alertOrder)?.customer} - R$ {orders.find(o => o.id === alertOrder)?.total.toFixed(2).replace('.', ',')}</p></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Pedidos Recentes</h3>
            <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">Ver todos</button>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-400' : order.status === 'preparing' ? 'bg-amber-400' : order.status === 'shipped' ? 'bg-primary-400' : order.status === 'cancelled' ? 'bg-red-400' : 'bg-dark-400'}`} />
                    <div><p className="font-medium text-white text-sm">{order.id}</p><p className="text-xs text-dark-400">{order.items[0]}{order.items.length > 1 ? ` +${order.items.length - 1}` : ''}</p></div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                    <p className={`text-xs ${order.status === 'delivered' ? 'text-green-400' : order.status === 'cancelled' ? 'text-red-400' : 'text-amber-400'}`}>
                      {order.status === 'delivered' ? 'Entregue' : order.status === 'preparing' ? 'Preparando' : order.status === 'shipped' ? 'Saiu' : order.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                    </p>
                    {order.phone && <p className="text-xs text-dark-500 mt-0.5">{order.phone}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  {order.status === 'pending' && <button onClick={() => handleStatus(order.id, 'preparing')} className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all">Preparar</button>}
                  {order.status === 'preparing' && <button onClick={() => handleStatus(order.id, 'shipped')} className="px-3 py-1 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-all">Saiu</button>}
                  {order.status === 'shipped' && <button onClick={() => handleStatus(order.id, 'delivered')} className="px-3 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all">Entregar</button>}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-dark-400 py-8 text-sm">Nenhum pedido ainda. Os pedidos dos clientes aparecerão aqui.</p>
            )}
          </div>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-6">Produtos em Destaque</h3>
          <div className="space-y-4">
            {tenant.products.filter(p => p.featured).slice(0, 4).map(product => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-lg">{tenant.logo}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.name}</p>
                  <p className="text-xs text-dark-400">{product.sales} vendas este mês</p>
                </div>
                <span className="text-sm font-medium text-green-400">+{Math.round(product.sales / 3)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductsTab({ tenant }: { tenant: Tenant }) {
  const [products, setProducts] = useState(tenant.products)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', oldPrice: '', stock: '' })
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', category: '', price: '', oldPrice: '', stock: '' })

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return
    const product = {
      id: String(Date.now()), name: newProduct.name, category: newProduct.category || tenant.categories[0]?.name || 'Geral',
      price: parseFloat(newProduct.price), oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : null,
      stock: parseInt(newProduct.stock) || 0, image: '', active: true, featured: false, sales: 0,
      tenant_id: tenant.id,
    }
    setProducts(prev => [...prev, product])
    upsertProduct(product)
    setNewProduct({ name: '', category: '', price: '', oldPrice: '', stock: '' })
    setShowAdd(false)
  }

  const startEdit = (product: TenantProduct) => {
    setEditingProduct(product.id)
    setEditForm({ name: product.name, category: product.category, price: String(product.price), oldPrice: product.oldPrice ? String(product.oldPrice) : '', stock: String(product.stock) })
  }

  const saveEdit = (id: string) => {
    if (!editForm.name || !editForm.price) return
    setProducts(prev => prev.map(p => p.id === id ? { ...p, name: editForm.name, category: editForm.category, price: parseFloat(editForm.price), oldPrice: editForm.oldPrice ? parseFloat(editForm.oldPrice) : null, stock: parseInt(editForm.stock) || 0 } : p))
    upsertProduct({ id, tenant_id: tenant.id, name: editForm.name, category: editForm.category, price: parseFloat(editForm.price), oldPrice: editForm.oldPrice ? parseFloat(editForm.oldPrice) : null, stock: parseInt(editForm.stock) || 0, image: '', active: true, featured: false, sales: 0 })
    setEditingProduct(null)
  }

  const toggleActive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
    const p = products.find(p => p.id === id)
    if (p) upsertProduct({ ...p, active: !p.active, tenant_id: tenant.id })
  }
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    deleteProductById(id, tenant.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white font-display">Produtos</h2><p className="text-dark-400 text-sm mt-1">{products.length} produtos cadastrados</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Novo Produto</button>
      </div>
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-primary-500/50 placeholder:text-dark-500" placeholder="Buscar produtos..." />
        </div>
      </div>
      <AnimatePresence>{showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 overflow-hidden">
          <h3 className="font-semibold text-white mb-4">Novo Produto</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label className="text-xs text-dark-400 block mb-1">Nome</label><input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="input-dark" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Categoria</label><select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="input-dark">{tenant.categories.filter(c => c.active).map(c => <option key={c.id}>{c.name}</option>)}</select></div>
            <div><label className="text-xs text-dark-400 block mb-1">Preço</label><input type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="input-dark" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Estoque</label><input type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className="input-dark" /></div>
          </div>
          <div className="flex gap-3 mt-4"><button onClick={addProduct} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Adicionar</button><button onClick={() => setShowAdd(false)} className="btn-outline text-sm">Cancelar</button></div>
        </motion.div>
      )}</AnimatePresence>
      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-800 text-dark-400 text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-medium">Produto</th>
                <th className="text-left p-4 font-medium">Categoria</th>
                <th className="text-left p-4 font-medium">Preço</th>
                <th className="text-left p-4 font-medium">Estoque</th>
                <th className="text-left p-4 font-medium">Vendas</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                editingProduct === product.id ? (
                  <motion.tr key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                    <td colSpan={7} className="p-4">
                      <div className="bg-dark-800 rounded-xl p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div><label className="text-xs text-dark-400 block mb-1">Nome</label><input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-dark w-full" /></div>
                          <div><label className="text-xs text-dark-400 block mb-1">Categoria</label><select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="input-dark w-full">{tenant.categories.filter(c => c.active).map(c => <option key={c.id}>{c.name}</option>)}</select></div>
                          <div><label className="text-xs text-dark-400 block mb-1">Preço</label><input type="number" step="0.01" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="input-dark w-full" /></div>
                          <div><label className="text-xs text-dark-400 block mb-1">Estoque</label><input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} className="input-dark w-full" /></div>
                        </div>
                        <div className="flex gap-2"><button onClick={() => saveEdit(product.id)} className="btn-primary text-sm">Salvar</button><button onClick={() => setEditingProduct(null)} className="btn-outline text-sm">Cancelar</button></div>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  <motion.tr key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-lg">{tenant.logo}</div>
                        <div><p className="font-medium text-white">{product.name}</p></div>
                      </div>
                    </td>
                    <td className="p-4"><span className="text-dark-300">{product.category}</span></td>
                    <td className="p-4">
                      <span className="text-white font-medium">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                      {product.oldPrice && <span className="text-dark-500 line-through text-xs ml-2">R$ {product.oldPrice.toFixed(2).replace('.', ',')}</span>}
                    </td>
                    <td className="p-4">
                      <span className={`${product.stock < 10 ? 'text-red-400' : product.stock < 30 ? 'text-amber-400' : 'text-green-400'}`}>{product.stock} un.</span>
                    </td>
                    <td className="p-4"><span className="text-dark-300">{product.sales}</span></td>
                    <td className="p-4">
                      <button onClick={() => toggleActive(product.id)} className={`px-3 py-1 rounded-full text-xs font-medium ${product.active ? 'bg-green-500/10 text-green-400' : 'bg-dark-700 text-dark-400'}`}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(product)} className="p-2 rounded-lg hover:bg-dark-700 transition-colors text-dark-400 hover:text-primary-400"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => deleteProduct(product.id)} className="p-2 rounded-lg hover:bg-dark-700 transition-colors text-dark-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CategoriesTab({ tenant }: { tenant: Tenant }) {
  const [categories, setCategories] = useState(tenant.categories)
  const [editingCat, setEditingCat] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('📦')
  const toggleActive = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))
    const c = categories.find(c => c.id === id)
    if (c) upsertCategory({ ...c, active: !c.active, tenant_id: tenant.id })
  }

  const emojis = ['🍇', '🥤', '🍦', '🍫', '🍓', '🥜', '🧃', '🍰', '🥣', '🍪', '🧁', '🍩', '🥛', '🧊', '🍉', '🍌', '🍊', '🍋', '🍈', '🍐']

  const addCategory = () => {
    if (!newName.trim()) return
    const cat = { id: `c${Date.now()}`, name: newName.trim(), icon: newIcon, active: true, order: categories.length + 1, tenant_id: tenant.id }
    setCategories(prev => [...prev, cat])
    upsertCategory(cat)
    setNewName(''); setNewIcon('📦'); setShowAdd(false)
  }

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
    deleteCategoryById(id, tenant.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white font-display">Categorias</h2><p className="text-dark-400 text-sm mt-1">{categories.length} categorias</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Nova Categoria</button>
      </div>

      <AnimatePresence>{showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 overflow-hidden">
          <h3 className="font-semibold text-white mb-4">Nova Categoria</h3>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-xs text-dark-400 block mb-1">Nome</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} className="input-dark w-full" placeholder="Ex: Açaís" onKeyDown={e => e.key === 'Enter' && addCategory()} />
            </div>
            <div>
              <label className="text-xs text-dark-400 block mb-1">Ícone</label>
              <div className="flex gap-1">
                {emojis.slice(0, 8).map(emoji => (
                  <button key={emoji} onClick={() => setNewIcon(emoji)} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${newIcon === emoji ? 'bg-primary-500/20 border border-primary-500/50' : 'bg-dark-800 hover:bg-dark-700 border border-dark-700'}`}>{emoji}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button onClick={addCategory} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Adicionar</button>
              <button onClick={() => setShowAdd(false)} className="btn-outline text-sm">Cancelar</button>
            </div>
          </div>
        </motion.div>
      )}</AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <motion.div key={cat.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                {editingCat === cat.id ? (
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="bg-dark-800 border border-dark-700 rounded-lg px-2 py-1 text-sm text-white w-32" autoFocus
                    onBlur={() => { setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name: editName } : c)); setEditingCat(null) }}
                    onKeyDown={e => { if (e.key === 'Enter') { setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name: editName } : c)); setEditingCat(null) } }} />
                ) : <span className="font-medium text-white">{cat.name}</span>}
              </div>
              <button onClick={() => toggleActive(cat.id)} className={`w-10 h-6 rounded-full transition-all ${cat.active ? 'bg-primary-500' : 'bg-dark-700'} relative`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${cat.active ? 'left-5' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-dark-400">
              <span>Ordem: {cat.order}</span>
              <div className="flex gap-2">
                <button onClick={() => { setEditingCat(cat.id); setEditName(cat.name) }} className="text-primary-400 hover:text-primary-300">Editar</button>
                <button onClick={() => deleteCategory(cat.id)} className="text-red-400 hover:text-red-300">Remover</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function OrdersTab({ tenant }: { tenant: Tenant }) {
  const [orders, setOrders] = useState<TenantOrder[]>([])
  const [filter, setFilter] = useState<'all' | TenantOrder['status']>('all')

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await fetchOrdersByTenant(tenant.id)
      setOrders(data.map((r: any) => ({
        id: r.id, customer: r.customer, phone: r.phone, items: r.items, total: r.total,
        status: r.status, payment: r.payment, method: r.method, date: r.date, address: r.address,
      })))
    }
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [tenant.id])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const statusLabels: Record<string, string> = { pending: 'Pendente', preparing: 'Preparando', shipped: 'Saiu', delivered: 'Entregue', cancelled: 'Cancelado' }
  const statusStyles: Record<string, string> = { pending: 'bg-dark-700 text-dark-300', preparing: 'bg-amber-500/10 text-amber-400', shipped: 'bg-primary-500/10 text-primary-400', delivered: 'bg-green-500/10 text-green-400', cancelled: 'bg-red-500/10 text-red-400' }

  const nextStatus: Record<string, { label: string; next: TenantOrder['status']; color: string } | null> = {
    pending: { label: 'Iniciar Preparo', next: 'preparing', color: 'bg-amber-500 hover:bg-amber-600' },
    preparing: { label: 'Saiu p/ Entrega', next: 'shipped', color: 'bg-primary-500 hover:bg-primary-600' },
    shipped: { label: 'Confirmar Entrega', next: 'delivered', color: 'bg-green-500 hover:bg-green-600' },
    delivered: null,
    cancelled: null,
  }

  const updateStatus = async (id: string, newStatus: TenantOrder['status']) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, status: newStatus } : o)
      const order = updated.find(o => o.id === id)
      if (order) {
        localStorage.setItem('goacai_tracking', JSON.stringify({
          orderId: order.id, status: newStatus, customer: order.customer,
          updatedAt: Date.now()
        }))
      }
      return updated
    })
    await updateOrderStatus(id, newStatus, tenant.id)
    playStatusChange(newStatus)
    const order = orders.find(o => o.id === id)
    if (order?.phone) {
      fetch('/api/push/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: order.phone,
          title: 'Pedido Atualizado!',
          body: `${order.customer}, seu pedido agora está: ${newStatus === 'preparing' ? 'Preparando' : newStatus === 'shipped' ? 'Saiu pra entrega' : newStatus === 'delivered' ? 'Entregue!' : newStatus === 'cancelled' ? 'Cancelado' : 'Pendente'}`,
          url: `/app/${tenant.slug}`,
        }),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white font-display">Pedidos</h2><p className="text-dark-400 text-sm mt-1">{orders.length} pedidos</p></div>
        <div className="flex gap-2">
          {['all', 'pending', 'preparing', 'shipped', 'delivered', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-400 hover:text-white'}`}>
              {f === 'all' ? 'Todos' : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-dark-400 py-12 text-sm">Nenhum pedido encontrado. Os pedidos feitos pelos clientes no app aparecerão aqui.</p>
        )}
        {filtered.map(order => {
          const next = nextStatus[order.status]
          return (
            <motion.div key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>{statusLabels[order.status]}</span>
                </div>
                <span className="text-sm text-dark-400">{order.date}</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                <div><span className="text-dark-400 block text-xs">Cliente</span><span className="text-white">{order.customer}</span>{order.phone && <span className="text-xs text-dark-400 block">{order.phone}</span>}</div>
                <div><span className="text-dark-400 block text-xs">Itens</span><span className="text-dark-300">{order.items.join(', ')}</span></div>
                <div><span className="text-dark-400 block text-xs">Pagamento</span><span className="text-white">{order.payment} - {order.method}</span></div>
                <div><span className="text-dark-400 block text-xs">Total</span><span className="font-bold text-white">R$ {order.total.toFixed(2).replace('.', ',')}</span></div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-dark-800">
                {next && (
                  <button onClick={() => updateStatus(order.id, next.next)} className={`px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-all ${next.color}`}>
                    {next.label}
                  </button>
                )}
                {(order.status === 'pending' || order.status === 'preparing') && (
                  <button onClick={() => updateStatus(order.id, 'cancelled')} className="px-4 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                    Cancelar
                  </button>
                )}
                {(order.status === 'delivered' || order.status === 'cancelled') && (
                  <button onClick={async () => { await deleteOrderById(order.id, tenant.id); setOrders(prev => prev.filter(o => o.id !== order.id)) }} className="px-4 py-1.5 rounded-lg text-xs font-medium bg-dark-700 text-dark-400 hover:bg-red-500/20 hover:text-red-400 transition-all">
                    Apagar
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function AnalyticsTab({ tenant }: { tenant: Tenant }) {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-white font-display">Analytics</h2><p className="text-dark-400 text-sm mt-1">Métricas de {tenant.name}</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Vendas por Horário</h3>
          <div className="flex items-end gap-2 h-40">
            {['09', '11', '13', '15', '17', '19', '21'].map(h => (
              <div key={h} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg" style={{ height: `${20 + Math.random() * 80}%` }} />
                <span className="text-xs text-dark-500">{h}h</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Produtos Mais Vendidos</h3>
          <div className="space-y-3">
            {tenant.products.sort((a, b) => b.sales - a.sales).slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-dark-400 w-6 text-right">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white">{p.name}</span>
                    <span className="text-sm text-dark-400">{p.sales} vendas</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" style={{ width: `${(p.sales / tenant.products[0]?.sales) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Faturamento Semanal', value: 'R$ 8.429,00', change: '+15,3%' },
          { label: 'Faturamento Mensal', value: 'R$ 34.156,00', change: '+8,7%' },
          { label: 'Faturamento Anual', value: 'R$ 386.520,00', change: '+42,1%' },
        ].map(item => (
          <div key={item.label} className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
            <p className="text-sm text-dark-400 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <span className="text-xs font-medium text-green-400">{item.change}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab({ tenant }: { tenant: Tenant }) {
  const [banner, setBanner] = useState(tenant.banner || '')
  const [bannerMsg, setBannerMsg] = useState('')
  const [workingDays, setWorkingDays] = useState([
    { day: 'Segunda-feira', open: true, start: '09:00', end: '22:00' },
    { day: 'Terça-feira', open: true, start: '09:00', end: '22:00' },
    { day: 'Quarta-feira', open: true, start: '09:00', end: '22:00' },
    { day: 'Quinta-feira', open: true, start: '09:00', end: '22:00' },
    { day: 'Sexta-feira', open: true, start: '09:00', end: '23:00' },
    { day: 'Sábado', open: true, start: '10:00', end: '23:00' },
    { day: 'Domingo', open: false, start: '10:00', end: '21:00' },
  ])
  const [dbStatus, setDbStatus] = useState<'checking' | 'ok' | 'error'>('checking')
  const [dbCount, setDbCount] = useState(0)
  const [lastOrders, setLastOrders] = useState<any[]>([])
  const [testResult, setTestResult] = useState('')

  useEffect(() => {
    fetch(`/api/banner?tenantId=${tenant.id}`).then(r => r.json()).then(d => {
      if (d.banner) setBanner(d.banner)
    }).catch(() => {})
  }, [tenant.id])

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('orders').select('id').limit(1)
        if (error) { setDbStatus('error'); return }
        setDbStatus('ok')
      } catch { setDbStatus('error') }
    })()
  }, [])

  const testConnection = async () => {
    setTestResult('Testando...')
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(5)
      if (error) { setTestResult(`Erro: ${error.message}`); return }
      setDbCount(data?.length || 0)
      setLastOrders(data || [])
      setTestResult(`OK — ${data?.length || 0} pedidos encontrados para este tenant`)
    } catch (e: any) {
      setTestResult(`Erro: ${e.message}`)
    }
  }

  const toggleDay = (index: number) =>
    setWorkingDays(prev => prev.map((d, i) => i === index ? { ...d, open: !d.open } : d))

  const updateTime = (index: number, field: 'start' | 'end', value: string) =>
    setWorkingDays(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d))

  return (
    <div className="space-y-6 max-w-2xl">
      <div><h2 className="text-2xl font-bold text-white font-display">Configurações</h2><p className="text-dark-400 text-sm mt-1">Gerencie sua loja</p></div>

      {dbStatus === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div><h3 className="font-semibold text-white">Banco de dados não configurado</h3><p className="text-sm text-dark-400">As tabelas do Supabase ainda não foram criadas. Os pedidos não aparecerão até configurar.</p></div>
          </div>
          <a href="https://supabase.com/dashboard/project/ycotetlwwqgxdzvnoojs/sql/new" target="_blank"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all text-sm">
            Abrir SQL Editor no Supabase
          </a>
          <p className="text-xs text-dark-500">No SQL Editor, copie e cole o conteúdo do arquivo <code className="text-primary-400">scripts/setup.sql</code> e execute.</p>
        </div>
      )}

      {dbStatus === 'ok' && (
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <h3 className="font-semibold text-white">Conexão com Supabase</h3>
            </div>
            <button onClick={testConnection} className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Testar Consulta</button>
          </div>
          {testResult && (
            <div className="text-sm">
              <p className="text-dark-300">{testResult}</p>
              {lastOrders.length > 0 && (
                <div className="mt-2 space-y-1">
                  {lastOrders.map(o => (
                    <p key={o.id} className="text-xs text-dark-400">ID: {o.id} — Cliente: {o.customer} — Status: {o.status}</p>
                  ))}
                </div>
              )}
              {lastOrders.length === 0 && testResult.includes('OK') && (
                <p className="text-xs text-dark-500 mt-1">Nenhum pedido encontrado. Faça um pedido no app e clique em "Testar Consulta" novamente.</p>
              )}
            </div>
          )}
          {!testResult && <p className="text-xs text-dark-500">Clique em "Testar Consulta" para verificar os pedidos no banco.</p>}
        </div>
      )}

      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-white mb-4">Informações da Loja</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs text-dark-400 block mb-1">Nome</label><input className="input-dark" defaultValue={tenant.name} /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Taxa de Entrega (R$)</label><input className="input-dark" defaultValue={tenant.deliveryFee.toFixed(2).replace('.', ',')} placeholder="0,00" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">WhatsApp</label><input className="input-dark" defaultValue={tenant.whatsapp} /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Mínimo p/ Pedido (R$)</label><input className="input-dark" defaultValue={tenant.minOrder.toFixed(2).replace('.', ',')} /></div>
            <div className="sm:col-span-2"><label className="text-xs text-dark-400 block mb-1">Endereço</label><input className="input-dark w-full" defaultValue={tenant.address} /></div>
            <div className="sm:col-span-2">
              <label className="text-xs text-dark-400 block mb-1">Mensagem / Banner do App</label>
              <div className="flex gap-2">
                <input className="input-dark flex-1" value={banner} onChange={e => setBanner(e.target.value)} placeholder="Ex: 🎉 Cliente novo? Cupom BEMVINDO e ganhe 10% off!" />
                <button onClick={async () => {
                  setBannerMsg('Salvando...')
                  const r = await fetch('/api/banner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenantId: tenant.id, banner }) })
                  if (r.ok) setBannerMsg('✅ Salvo!')
                  else { const d = await r.json(); setBannerMsg(`Erro: ${d.error}`) }
                  setTimeout(() => setBannerMsg(''), 3000)
                }} className="px-4 py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors text-sm shrink-0">Salvar</button>
              </div>
              {bannerMsg && <p className="text-xs text-dark-400 mt-1">{bannerMsg}</p>}
              <p className="text-xs text-dark-500 mt-1">Essa mensagem aparece no topo do app do cliente.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-800 pt-6">
          <h3 className="font-semibold text-white mb-4">Dias e Horários de Funcionamento</h3>
          <div className="space-y-2">
            {workingDays.map((d, i) => (
              <div key={d.day} className="flex items-center gap-3 p-2 rounded-xl hover:bg-dark-800/50 transition-colors">
                <button onClick={() => toggleDay(i)} className={`w-10 h-6 rounded-full transition-all flex-shrink-0 ${d.open ? 'bg-primary-500' : 'bg-dark-700'} relative`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${d.open ? 'left-5' : 'left-1'}`} />
                </button>
                <span className={`text-sm w-28 ${d.open ? 'text-white' : 'text-dark-500'}`}>{d.day}</span>
                {d.open ? (
                  <div className="flex items-center gap-2">
                    <input type="time" value={d.start} onChange={e => updateTime(i, 'start', e.target.value)} className="bg-dark-800 border border-dark-700 rounded-lg px-2 py-1.5 text-sm text-white w-24 outline-none focus:border-primary-500/50" />
                    <span className="text-dark-500">às</span>
                    <input type="time" value={d.end} onChange={e => updateTime(i, 'end', e.target.value)} className="bg-dark-800 border border-dark-700 rounded-lg px-2 py-1.5 text-sm text-white w-24 outline-none focus:border-primary-500/50" />
                  </div>
                ) : <span className="text-sm text-red-400">Fechado</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-dark-800 pt-6">
          <h3 className="font-semibold text-white mb-4">Seu App</h3>
          <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <p className="text-sm text-white mb-2">Link do seu aplicativo:</p>
            <a href={`/app/${tenant.slug}`} target="_blank" className="text-primary-400 hover:text-primary-300 underline text-sm break-all">
              {typeof window !== 'undefined' ? window.location.origin : ''}/app/{tenant.slug}
            </a>
            <p className="text-xs text-dark-400 mt-2">Compartilhe este link com seus clientes para eles fazerem pedidos.</p>
          </div>
        </div>

        <div className="border-t border-dark-800 pt-6">
          <button className="btn-primary">Salvar Configurações</button>
        </div>
      </div>
    </div>
  )
}

