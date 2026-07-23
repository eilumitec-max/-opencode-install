'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings, LogOut, Plus, Search,
  Edit3, Trash2, ChevronDown, MoreVertical, TrendingUp, DollarSign, Clock,
  Image as ImageIcon, ExternalLink, Ruler, Palmtree, Wallet, Printer, MapPin
} from 'lucide-react'
import { tenants, getTenantById, type Tenant, type TenantProduct, type TenantOrder } from '@/lib/tenants'
import { playNewOrder, playStatusChange } from '@/lib/sound'
import { supabase } from '@/lib/supabase'
import {
  fetchTenantById, upsertProduct, deleteProductById, upsertCategory, deleteCategoryById,
  updateOrderStatus, fetchOrdersByTenant, deleteOrderById,
  fetchTenantSizes, upsertSize, deleteSizeById,
  fetchTenantTypes, upsertType, deleteTypeById,
  fetchTenantPaymentMethods, upsertPaymentMethod, deletePaymentMethodById,
  updateTenant,
  fetchDeliveryZones, upsertDeliveryZone, deleteDeliveryZoneById,
} from '@/lib/supabase-queries'

type Tab = 'dashboard' | 'products' | 'categories' | 'orders' | 'analytics' | 'settings' | 'sizes' | 'types' | 'payments' | 'delivery'

export default function AdminPage() {
  const router = useRouter()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
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
    { key: 'sizes', label: 'Tamanhos', icon: Ruler },
    { key: 'types', label: 'Sabores', icon: Palmtree },
    { key: 'payments', label: 'Pagamentos', icon: Wallet },
    { key: 'delivery', label: 'Entrega', icon: MapPin },
    { key: 'orders', label: 'Pedidos', icon: Users },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'settings', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark-900 border-r border-dark-800 transition-all duration-300 flex flex-col fixed h-full z-30`}>
        <div className="p-4 border-b border-dark-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center flex-shrink-0 overflow-hidden">{tenant.logo.startsWith('http') ? <img src={tenant.logo} alt="" className="w-full h-full object-cover" /> : <span className="text-xl">{tenant.logo}</span>}</div>
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
                {tenant.logo.startsWith('http') ? <img src={tenant.logo} alt="" className="w-6 h-6 object-cover rounded" /> : <span className="text-lg">{tenant.logo}</span>}
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
              {tab === 'sizes' && <SizesTab tenant={tenant} />}
              {tab === 'types' && <TypesTab tenant={tenant} />}
              {tab === 'payments' && <PaymentsTab tenant={tenant} />}
              {tab === 'delivery' && <DeliveryTab tenant={tenant} />}
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
      supabase.auth.getSession().then(({ data: { session } }) => {
        const token = session?.access_token || ''
        fetch('/api/push/send', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            phone: order.phone,
            title: 'Pedido Atualizado!',
            body: `${order.customer}, seu pedido ${id} agora está: ${status === 'preparing' ? 'Preparando' : status === 'shipped' ? 'Saiu pra entrega' : status === 'delivered' ? 'Entregue!' : status === 'cancelled' ? 'Cancelado' : 'Pendente'}`,
            url: `/app/${tenant.slug}`,
          }),
        })
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
                <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-lg shrink-0">{tenant.categories.find(c => c.name === product.category)?.icon || '📦'}</div>
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
    const existing = products.find(p => p.id === id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, name: editForm.name, category: editForm.category, price: parseFloat(editForm.price), oldPrice: editForm.oldPrice ? parseFloat(editForm.oldPrice) : null, stock: parseInt(editForm.stock) || 0 } : p))
    upsertProduct({ id, tenant_id: tenant.id, name: editForm.name, category: editForm.category, price: parseFloat(editForm.price), oldPrice: editForm.oldPrice ? parseFloat(editForm.oldPrice) : null, stock: parseInt(editForm.stock) || 0, image: '', active: existing?.active ?? true, featured: existing?.featured ?? false, sales: existing?.sales ?? 0 })
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
                        <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-base shrink-0">{tenant.categories.find(c => c.name === product.category)?.icon || '📦'}</div>
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
      supabase.auth.getSession().then(({ data: { session } }) => {
        const token = session?.access_token || ''
        fetch('/api/push/send', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            phone: order.phone,
            title: 'Pedido Atualizado!',
            body: `${order.customer}, seu pedido agora está: ${newStatus === 'preparing' ? 'Preparando' : newStatus === 'shipped' ? 'Saiu pra entrega' : newStatus === 'delivered' ? 'Entregue!' : newStatus === 'cancelled' ? 'Cancelado' : 'Pendente'}`,
            url: `/app/${tenant.slug}`,
          }),
        })
      })
    }
  }

  const printOrder = (order: TenantOrder) => {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '-9999px'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = 'none'
    document.body.appendChild(iframe)
    const doc = iframe.contentWindow!.document
    doc.write(`
      <html><head><meta charset="utf-8"><title>${order.id}</title>
      <style>
        @page { margin: 0; size: 80mm auto; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; color: #000; padding: 8px; }
        .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px; }
        .header h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
        .header p { font-size: 10px; margin-top: 2px; }
        .info { margin-bottom: 8px; }
        .info div { display: flex; justify-content: space-between; font-size: 11px; padding: 1px 0; }
        .items { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 6px 0; margin-bottom: 8px; }
        .items .item { display: flex; justify-content: space-between; font-size: 11px; padding: 1px 0; }
        .items .title { font-weight: bold; font-size: 11px; margin-bottom: 3px; }
        .total { text-align: right; font-size: 14px; font-weight: bold; margin-bottom: 8px; padding-top: 4px; border-top: 1px solid #000; }
        .footer { text-align: center; font-size: 10px; border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px; }
        @media print { body { padding: 4px; } }
      </style></head><body>
        <div class="header">
          <h2>${tenant.name}</h2>
          <p>${tenant.address}</p>
          <p>${tenant.whatsapp}</p>
        </div>
        <div class="info">
          <div><span>Pedido:</span><span>${order.id}</span></div>
          <div><span>Data:</span><span>${order.date}</span></div>
          <div><span>Cliente:</span><span>${order.customer}</span></div>
          ${order.phone ? `<div><span>Telefone:</span><span>${order.phone}</span></div>` : ''}
          <div><span>Pagamento:</span><span>${order.payment}</span></div>
          <div><span>Tipo:</span><span>${order.method}</span></div>
          ${order.address !== '-' ? `<div style="flex-direction:column;gap:1px;margin-top:4px"><span style="font-weight:bold">Endereço:</span><span>${order.address}</span></div>` : '<div><span>Retirada:</span><span>Sim</span></div>'}
        </div>
        <div class="items">
          <div class="title">ITENS</div>
          ${order.items.map((i: string) => `<div class="item"><span>${i}</span></div>`).join('')}
        </div>
        <div class="total">TOTAL: R$ ${order.total.toFixed(2).replace('.', ',')}</div>
        <div class="footer">Obrigado pela preferência!</div>
      </body></html>
    `)
    doc.close()
    iframe.contentWindow!.focus()
    iframe.contentWindow!.print()
    setTimeout(() => document.body.removeChild(iframe), 1000)
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
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-dark-400 py-8 text-sm">Nenhum pedido encontrado.</p>
        ) : (
          filtered.map(order => {
            const next = nextStatus[order.status]
            return (
              <motion.div key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
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
                  <button onClick={() => printOrder(order)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700 transition-all flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5" /> Imprimir
                  </button>
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
          })
        )}
      </div>
    </div>
  )
}

function SizesTab({ tenant }: { tenant: Tenant }) {
  const [sizes, setSizes] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', price: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [newSize, setNewSize] = useState({ name: '', price: '' })

  useEffect(() => { fetchTenantSizes(tenant.id).then(setSizes) }, [tenant.id])

  const addSize = () => {
    if (!newSize.name || !newSize.price) return
    const s = { id: `sz${Date.now()}`, tenant_id: tenant.id, name: newSize.name, price: parseFloat(newSize.price), order: sizes.length + 1, active: true }
    setSizes(prev => [...prev, s]); upsertSize(s); setNewSize({ name: '', price: '' }); setShowAdd(false)
  }
  const startEdit = (s: any) => { setEditingId(s.id); setEditForm({ name: s.name, price: String(s.price) }) }
  const saveEdit = (id: string) => {
    if (!editForm.name || !editForm.price) return
    setSizes(prev => prev.map(s => s.id === id ? { ...s, name: editForm.name, price: parseFloat(editForm.price) } : s))
    upsertSize({ id, tenant_id: tenant.id, name: editForm.name, price: parseFloat(editForm.price) }); setEditingId(null)
  }
  const toggleActive = (id: string) => {
    setSizes(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
    const s = sizes.find(x => x.id === id); if (s) upsertSize({ ...s, active: !s.active, tenant_id: tenant.id })
  }
  const deleteSize = (id: string) => { setSizes(prev => prev.filter(s => s.id !== id)); deleteSizeById(id, tenant.id) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white font-display">Tamanhos</h2><p className="text-dark-400 text-sm mt-1">{sizes.length} tamanhos configurados</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Novo Tamanho</button>
      </div>
      <AnimatePresence>{showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 overflow-hidden">
          <h3 className="font-semibold text-white mb-4">Novo Tamanho</h3>
          <div className="flex items-end gap-4">
            <div><label className="text-xs text-dark-400 block mb-1">Nome</label><input value={newSize.name} onChange={e => setNewSize({ ...newSize, name: e.target.value })} className="input-dark" placeholder="Ex: 400 ml" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Preço (R$)</label><input type="number" step="0.1" min="0" value={newSize.price} onChange={e => setNewSize({ ...newSize, price: e.target.value })} className="input-dark w-28" /></div>
            <div className="flex gap-2 pb-0.5"><button onClick={addSize} className="btn-primary text-sm">Adicionar</button><button onClick={() => setShowAdd(false)} className="btn-outline text-sm">Cancelar</button></div>
          </div>
        </motion.div>
      )}</AnimatePresence>
      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-dark-800 text-dark-400 text-xs uppercase tracking-wider">
            <th className="text-left p-4 font-medium">Nome</th><th className="text-left p-4 font-medium">Preço</th><th className="text-left p-4 font-medium">Status</th><th className="text-right p-4 font-medium">Ações</th>
          </tr></thead>
          <tbody>{sizes.map(s => editingId === s.id ? (
            <tr key={s.id} className="border-b border-dark-800/50"><td colSpan={4} className="p-4">
              <div className="flex items-center gap-3">
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-dark w-32" />
                <input type="number" step="0.1" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="input-dark w-24" />
                <button onClick={() => saveEdit(s.id)} className="btn-primary text-sm">Salvar</button>
                <button onClick={() => setEditingId(null)} className="btn-outline text-sm">Cancelar</button>
              </div>
            </td></tr>
          ) : (
            <tr key={s.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
              <td className="p-4"><span className="font-medium text-white">{s.name}</span></td>
              <td className="p-4"><span className="text-white font-medium">R$ {parseFloat(s.price).toFixed(2).replace('.', ',')}</span></td>
              <td className="p-4"><button onClick={() => toggleActive(s.id)} className={`px-3 py-1 rounded-full text-xs font-medium ${s.active ? 'bg-green-500/10 text-green-400' : 'bg-dark-700 text-dark-400'}`}>{s.active ? 'Ativo' : 'Inativo'}</button></td>
              <td className="p-4 text-right"><div className="flex items-center justify-end gap-2">
                <button onClick={() => startEdit(s)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-primary-400"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => deleteSize(s.id)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}

function TypesTab({ tenant }: { tenant: Tenant }) {
  const [types, setTypes] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', emoji: '', base: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [newType, setNewType] = useState({ name: '', emoji: '🍇', base: 'Açaí' })

  useEffect(() => { fetchTenantTypes(tenant.id).then(setTypes) }, [tenant.id])

  const bases = ['Açaí', 'Creme', 'Sorvete']
  const emojis = ['🍇', '🍈', '🍦', '🍫', '🍓', '🥤', '🧃', '🍨', '🍧', '🫐']

  const addType = () => {
    if (!newType.name) return
    const t = { id: `ty${Date.now()}`, tenant_id: tenant.id, name: newType.name, emoji: newType.emoji, base: newType.base, order: types.length + 1, active: true }
    setTypes(prev => [...prev, t]); upsertType(t); setNewType({ name: '', emoji: '🍇', base: 'Açaí' }); setShowAdd(false)
  }
  const startEdit = (t: any) => { setEditingId(t.id); setEditForm({ name: t.name, emoji: t.emoji, base: t.base }) }
  const saveEdit = (id: string) => {
    if (!editForm.name) return
    setTypes(prev => prev.map(t => t.id === id ? { ...t, name: editForm.name, emoji: editForm.emoji, base: editForm.base } : t))
    upsertType({ id, tenant_id: tenant.id, name: editForm.name, emoji: editForm.emoji, base: editForm.base }); setEditingId(null)
  }
  const toggleActive = (id: string) => {
    setTypes(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t))
    const t = types.find(x => x.id === id); if (t) upsertType({ ...t, active: !t.active, tenant_id: tenant.id })
  }
  const deleteType = (id: string) => { setTypes(prev => prev.filter(t => t.id !== id)); deleteTypeById(id, tenant.id) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white font-display">Sabores</h2><p className="text-dark-400 text-sm mt-1">{types.length} sabores disponíveis</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Novo Sabor</button>
      </div>
      <AnimatePresence>{showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 overflow-hidden">
          <h3 className="font-semibold text-white mb-4">Novo Sabor</h3>
          <div className="flex items-end gap-4">
            <div><label className="text-xs text-dark-400 block mb-1">Nome</label><input value={newType.name} onChange={e => setNewType({ ...newType, name: e.target.value })} className="input-dark" placeholder="Ex: Açaí Fit" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Base</label><select value={newType.base} onChange={e => setNewType({ ...newType, base: e.target.value })} className="input-dark">{bases.map(b => <option key={b}>{b}</option>)}</select></div>
            <div><label className="text-xs text-dark-400 block mb-1">Ícone</label><div className="flex gap-1">{emojis.map(e => (
              <button key={e} onClick={() => setNewType({ ...newType, emoji: e })} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${newType.emoji === e ? 'bg-primary-500/20 border border-primary-500/50' : 'bg-dark-800 hover:bg-dark-700 border border-dark-700'}`}>{e}</button>
            ))}</div></div>
            <div className="flex gap-2 pb-0.5"><button onClick={addType} className="btn-primary text-sm">Adicionar</button><button onClick={() => setShowAdd(false)} className="btn-outline text-sm">Cancelar</button></div>
          </div>
        </motion.div>
      )}</AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map(t => editingId === t.id ? (
          <motion.div key={t.id} layout className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-1">{emojis.map(e => (
                <button key={e} onClick={() => setEditForm({ ...editForm, emoji: e })} className={`w-8 h-8 rounded-lg text-base flex items-center justify-center ${editForm.emoji === e ? 'bg-primary-500/20 border border-primary-500/50' : 'bg-dark-800 border border-dark-700'}`}>{e}</button>
              ))}</div>
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-dark flex-1" />
              <select value={editForm.base} onChange={e => setEditForm({ ...editForm, base: e.target.value })} className="input-dark w-24">{bases.map(b => <option key={b}>{b}</option>)}</select>
            </div>
            <div className="flex gap-2"><button onClick={() => saveEdit(t.id)} className="btn-primary text-sm">Salvar</button><button onClick={() => setEditingId(null)} className="btn-outline text-sm">Cancelar</button></div>
          </motion.div>
        ) : (
          <motion.div key={t.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.emoji}</span>
                <div><p className="font-medium text-white">{t.name}</p><p className="text-xs text-dark-500">Base: {t.base}</p></div>
              </div>
              <button onClick={() => toggleActive(t.id)} className={`w-10 h-6 rounded-full transition-all ${t.active ? 'bg-primary-500' : 'bg-dark-700'} relative`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${t.active ? 'left-5' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-dark-400">
              <button onClick={() => startEdit(t)} className="text-primary-400 hover:text-primary-300">Editar</button>
              <button onClick={() => deleteType(t.id)} className="text-red-400 hover:text-red-300">Remover</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PaymentsTab({ tenant }: { tenant: Tenant }) {
  const [methods, setMethods] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', icon: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [newMethod, setNewMethod] = useState({ name: '', icon: '💵' })

  useEffect(() => { fetchTenantPaymentMethods(tenant.id).then(setMethods) }, [tenant.id])

  const icons = ['💵', '💳', '📱', '🍪', '🏦', '🪙', '🧾', '🤑']
  const addMethod = () => {
    if (!newMethod.name) return
    const m = { id: `pm${Date.now()}`, tenant_id: tenant.id, name: newMethod.name, icon: newMethod.icon, active: true }
    setMethods(prev => [...prev, m]); upsertPaymentMethod(m); setNewMethod({ name: '', icon: '💵' }); setShowAdd(false)
  }
  const startEdit = (m: any) => { setEditingId(m.id); setEditForm({ name: m.name, icon: m.icon }) }
  const saveEdit = (id: string) => {
    if (!editForm.name) return
    setMethods(prev => prev.map(m => m.id === id ? { ...m, name: editForm.name, icon: editForm.icon } : m))
    upsertPaymentMethod({ id, tenant_id: tenant.id, name: editForm.name, icon: editForm.icon }); setEditingId(null)
  }
  const toggleActive = (id: string) => {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m))
    const m = methods.find(x => x.id === id); if (m) upsertPaymentMethod({ ...m, active: !m.active, tenant_id: tenant.id })
  }
  const deleteMethod = (id: string) => { setMethods(prev => prev.filter(m => m.id !== id)); deletePaymentMethodById(id, tenant.id) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white font-display">Pagamentos</h2><p className="text-dark-400 text-sm mt-1">{methods.length} formas de pagamento</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Nova Forma</button>
      </div>
      <AnimatePresence>{showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 overflow-hidden">
          <h3 className="font-semibold text-white mb-4">Nova Forma de Pagamento</h3>
          <div className="flex items-end gap-4">
            <div><label className="text-xs text-dark-400 block mb-1">Nome</label><input value={newMethod.name} onChange={e => setNewMethod({ ...newMethod, name: e.target.value })} className="input-dark" placeholder="Ex: Crédito" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Ícone</label><div className="flex gap-1">{icons.map(i => (
              <button key={i} onClick={() => setNewMethod({ ...newMethod, icon: i })} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center ${newMethod.icon === i ? 'bg-primary-500/20 border border-primary-500/50' : 'bg-dark-800 hover:bg-dark-700 border border-dark-700'}`}>{i}</button>
            ))}</div></div>
            <div className="flex gap-2 pb-0.5"><button onClick={addMethod} className="btn-primary text-sm">Adicionar</button><button onClick={() => setShowAdd(false)} className="btn-outline text-sm">Cancelar</button></div>
          </div>
        </motion.div>
      )}</AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map(m => editingId === m.id ? (
          <motion.div key={m.id} layout className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-1">{icons.map(i => (
                <button key={i} onClick={() => setEditForm({ ...editForm, icon: i })} className={`w-8 h-8 rounded-lg text-base flex items-center justify-center ${editForm.icon === i ? 'bg-primary-500/20 border border-primary-500/50' : 'bg-dark-800 border border-dark-700'}`}>{i}</button>
              ))}</div>
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-dark flex-1" />
            </div>
            <div className="flex gap-2"><button onClick={() => saveEdit(m.id)} className="btn-primary text-sm">Salvar</button><button onClick={() => setEditingId(null)} className="btn-outline text-sm">Cancelar</button></div>
          </motion.div>
        ) : (
          <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{m.icon}</span>
                <span className="font-medium text-white">{m.name}</span>
              </div>
              <button onClick={() => toggleActive(m.id)} className={`w-10 h-6 rounded-full transition-all ${m.active ? 'bg-primary-500' : 'bg-dark-700'} relative`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${m.active ? 'left-5' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-dark-400">
              <button onClick={() => startEdit(m)} className="text-primary-400 hover:text-primary-300">Editar</button>
              <button onClick={() => deleteMethod(m.id)} className="text-red-400 hover:text-red-300">Remover</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DeliveryTab({ tenant }: { tenant: Tenant }) {
  const [zones, setZones] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', fee: '', distanceKm: '', cep: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [newZone, setNewZone] = useState({ name: '', fee: '', distanceKm: '', cep: '' })
  const [estimating, setEstimating] = useState(false)

  useEffect(() => { fetchDeliveryZones(tenant.id).then(setZones) }, [tenant.id])

  const calcFeeFromDistance = (km: number) => Math.round(km * (tenant.pricePerKm || 0) * 100) / 100

  const addZone = () => {
    if (!newZone.name || !newZone.fee) return
    const z = { id: `dz${Date.now()}`, tenant_id: tenant.id, name: newZone.name, fee: parseFloat(newZone.fee), distance_km: parseFloat(newZone.distanceKm) || 0, cep: newZone.cep.replace(/\D/g, ''), active: true }
    setZones(prev => [...prev, z]); upsertDeliveryZone(z); setNewZone({ name: '', fee: '', distanceKm: '', cep: '' }); setShowAdd(false)
  }
  const startEdit = (z: any) => { setEditingId(z.id); setEditForm({ name: z.name, fee: String(z.fee), distanceKm: String(z.distance_km || ''), cep: z.cep || '' }) }
  const saveEdit = (id: string) => {
    if (!editForm.name || !editForm.fee) return
    setZones(prev => prev.map(z => z.id === id ? { ...z, name: editForm.name, fee: parseFloat(editForm.fee), distance_km: parseFloat(editForm.distanceKm) || 0, cep: editForm.cep.replace(/\D/g, '') } : z))
    upsertDeliveryZone({ id, tenant_id: tenant.id, name: editForm.name, fee: parseFloat(editForm.fee), distance_km: parseFloat(editForm.distanceKm) || 0, cep: editForm.cep.replace(/\D/g, '') }); setEditingId(null)
  }
  const toggleActive = (id: string) => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, active: !z.active } : z))
    const z = zones.find(x => x.id === id); if (z) upsertDeliveryZone({ ...z, active: !z.active, tenant_id: tenant.id })
  }
  const deleteZone = (id: string) => { setZones(prev => prev.filter(z => z.id !== id)); deleteDeliveryZoneById(id, tenant.id) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white font-display">Taxa de Entrega por Bairro</h2><p className="text-dark-400 text-sm mt-1">{zones.length} bairros configurados</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Novo Bairro</button>
      </div>
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5 space-y-3">
        <p className="text-sm text-dark-400">Defina a taxa de entrega para cada bairro. O cliente verá um dropdown no checkout para selecionar o bairro dele. Se nenhum bairro for configurado, a taxa fixa em Configurações será usada.</p>
      </div>
      <AnimatePresence>{showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 overflow-hidden">
          <h3 className="font-semibold text-white mb-4">Novo Bairro</h3>
          <div className="flex items-end gap-4 flex-wrap">
            <div><label className="text-xs text-dark-400 block mb-1">Bairro</label><input value={newZone.name} onChange={e => setNewZone({ ...newZone, name: e.target.value })} className="input-dark" placeholder="Ex: Centro" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">CEP</label><input value={newZone.cep} onChange={e => setNewZone({ ...newZone, cep: e.target.value })} className="input-dark w-28" placeholder="00000-000" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Distância (km)</label><input type="number" step="0.1" min="0" value={newZone.distanceKm} onChange={e => { const km = e.target.value; setNewZone(z => ({ ...z, distanceKm: km, fee: km ? String(calcFeeFromDistance(parseFloat(km))) : z.fee })) }} className="input-dark w-24" placeholder="0,0" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Taxa (R$)</label><input type="number" step="0.5" min="0" value={newZone.fee} onChange={e => setNewZone({ ...newZone, fee: e.target.value })} className="input-dark w-28" placeholder="5,00" /></div>
            <div className="flex gap-2 pb-0.5"><button onClick={addZone} className="btn-primary text-sm">Adicionar</button><button onClick={() => setShowAdd(false)} className="btn-outline text-sm">Cancelar</button></div>
          </div>
        </motion.div>
      )}</AnimatePresence>
      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-dark-800 text-dark-400 text-xs uppercase tracking-wider">
            <th className="text-left p-4 font-medium">Bairro</th><th className="text-left p-4 font-medium">CEP</th><th className="text-left p-4 font-medium">Distância</th><th className="text-left p-4 font-medium">Taxa</th><th className="text-left p-4 font-medium">Status</th><th className="text-right p-4 font-medium">Ações</th>
          </tr></thead>
          <tbody>{zones.length === 0 ? (
            <tr><td colSpan={6} className="p-8 text-center text-dark-500 text-sm">Nenhum bairro cadastrado. Adicione os bairros que você atende.</td></tr>
          ) : zones.map(z => editingId === z.id ? (
            <tr key={z.id} className="border-b border-dark-800/50"><td colSpan={6} className="p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-dark w-40" />
                <input value={editForm.cep} onChange={e => setEditForm({ ...editForm, cep: e.target.value })} className="input-dark w-24" placeholder="CEP" />
                <input type="number" step="0.1" value={editForm.distanceKm} onChange={e => { const km = e.target.value; setEditForm(f => ({ ...f, distanceKm: km, fee: km ? String(calcFeeFromDistance(parseFloat(km))) : f.fee })) }} className="input-dark w-20" />
                <input type="number" step="0.5" value={editForm.fee} onChange={e => setEditForm({ ...editForm, fee: e.target.value })} className="input-dark w-24" />
                <button onClick={() => saveEdit(z.id)} className="btn-primary text-sm">Salvar</button>
                <button onClick={() => setEditingId(null)} className="btn-outline text-sm">Cancelar</button>
              </div>
            </td></tr>
          ) : (
            <tr key={z.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
              <td className="p-4"><span className="font-medium text-white">{z.name}</span></td>
              <td className="p-4"><span className="text-dark-400 text-xs">{z.cep || '-'}</span></td>
              <td className="p-4"><span className="text-dark-400">{z.distance_km ? `${z.distance_km} km` : '-'}</span></td>
              <td className="p-4"><span className="text-white font-medium">R$ {parseFloat(z.fee).toFixed(2).replace('.', ',')}</span></td>
              <td className="p-4"><button onClick={() => toggleActive(z.id)} className={`px-3 py-1 rounded-full text-xs font-medium ${z.active ? 'bg-green-500/10 text-green-400' : 'bg-dark-700 text-dark-400'}`}>{z.active ? 'Ativo' : 'Inativo'}</button></td>
              <td className="p-4 text-right"><div className="flex items-center justify-end gap-2">
                <button onClick={() => startEdit(z)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-primary-400"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => deleteZone(z.id)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-3">Precificação por Distância</h3>
          <p className="text-sm text-dark-400 mb-3">Configure o <strong className="text-white">Preço por km</strong> na aba Configurações. Ao definir a distância de cada bairro, a taxa é auto-calculada (distância × preço por km). Você pode ajustar manualmente se preferir.</p>
          <button onClick={async () => {
            if (!tenant.address) { alert('Defina o endereço da loja na aba Configurações primeiro.'); return }
            setEstimating(true)
            try {
              const city = tenant.address.split(',').pop()?.trim() || ''
              const results = await Promise.all(zones.filter(z => z.active).map(async (z) => {
                const r = await fetch('/api/geocode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ storeAddress: tenant.address, zoneName: z.name, city, zoneCep: z.cep || undefined }) })
                return r.ok ? r.json() : null
              }))
              const updated = await Promise.all(zones.map(async (z) => {
                const idx = zones.findIndex(x => x.id === z.id)
                const result = idx >= 0 && results[idx]
                if (!result) return z
                const km = result.distanceKm
                const fee = calcFeeFromDistance(km)
                await upsertDeliveryZone({ ...z, distance_km: km, fee, tenant_id: tenant.id })
                return { ...z, distance_km: km, fee }
              }))
              setZones(updated)
            } catch (e: any) { alert('Erro ao estimar: ' + e.message) }
            setEstimating(false)
          }} disabled={estimating} className="btn-outline text-sm"><MapPin className="w-4 h-4" />{estimating ? 'Estimando...' : 'Estimar via OpenStreetMap'}</button>
        </div>
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-3">Como funciona</h3>
          <ol className="text-sm text-dark-400 space-y-2 list-decimal list-inside">
            <li>Cadastre os bairros que sua loja atende (com CEP opcional para melhor precisão)</li>
            <li>Defina a distância de cada bairro (ou use "Estimar via OpenStreetMap")</li>
            <li>A taxa é calculada automaticamente: distância × preço por km</li>
            <li>O cliente vê um dropdown com os bairros disponíveis no checkout</li>
            <li>A taxa de entrega muda automaticamente conforme o bairro selecionado</li>
            <li>Se nenhum bairro for cadastrado, a taxa fixa em Configurações será usada</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

function AnalyticsTab({ tenant }: { tenant: Tenant }) {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-white font-display">Analytics</h2><p className="text-dark-400 text-sm mt-1">Métricas de {tenant.name}</p></div>
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 text-center">
        <BarChart3 className="w-16 h-16 text-dark-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Em breve</h3>
        <p className="text-dark-400 text-sm">Os gráficos e relatórios detalhados estarão disponíveis em breve. Por enquanto, acompanhe seus pedidos na aba Dashboard.</p>
      </div>
    </div>
  )
}

function SettingsTab({ tenant }: { tenant: Tenant }) {
  const [banner, setBanner] = useState(tenant.banner || '')
  const [stepMessages, setStepMessages] = useState<Record<string, string>>({
    type: '', size: '', toppings: '', fruits: '', extras: '',
  })
  const [itemIcons, setItemIcons] = useState<Record<string, string>>({})
  const [itemPrices, setItemPrices] = useState({ toppingPrice: 1.5, fruitPrice: 0, extraPrice: 2.0 })
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
  const [storeName, setStoreName] = useState(tenant.name)
  const [deliveryFee, setDeliveryFee] = useState(String(tenant.deliveryFee))
  const [whatsapp, setWhatsapp] = useState(tenant.whatsapp)
  const [minOrder, setMinOrder] = useState(String(tenant.minOrder))
  const [storeAddress, setStoreAddress] = useState(tenant.address)
  const [storeCep, setStoreCep] = useState(tenant.cep || '')
  const [pricePerKm, setPricePerKm] = useState(String(tenant.pricePerKm || ''))
  const [storeLat, setStoreLat] = useState(String(tenant.latitude || ''))
  const [storeLng, setStoreLng] = useState(String(tenant.longitude || ''))
  const [geocoding, setGeocoding] = useState(false)
  const [searchingCep, setSearchingCep] = useState(false)
  const [dbStatus, setDbStatus] = useState<'checking' | 'ok' | 'error'>('checking')
  const [dbCount, setDbCount] = useState(0)
  const [lastOrders, setLastOrders] = useState<any[]>([])
  const [testResult, setTestResult] = useState('')
  const [logoUploading, setLogoUploading] = useState(false)
  const [storeLogo, setStoreLogo] = useState(tenant.logo)

  useEffect(() => {
    fetch(`/api/banner?tenantId=${tenant.id}`).then(r => r.json()).then(d => {
      if (d.banner) setBanner(d.banner)
      if (d.stepMessages) setStepMessages(prev => ({ ...prev, ...d.stepMessages }))
      if (d.itemIcons) setItemIcons(d.itemIcons)
      if (d.itemPrices) setItemPrices(d.itemPrices)
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
            <div><label className="text-xs text-dark-400 block mb-1">Nome</label><input className="input-dark" value={storeName} onChange={e => setStoreName(e.target.value)} /></div>
            <div>
              <label className="text-xs text-dark-400 block mb-1">Logo da Loja</label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-dark-800 flex items-center justify-center text-2xl overflow-hidden shrink-0">
                  {storeLogo.startsWith('http') ? (
                    <img src={storeLogo} alt="logo" className="w-full h-full object-cover" />
                  ) : (
                    <span>{storeLogo}</span>
                  )}
                </div>
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-dark-800 border border-dark-700 text-sm text-dark-300 hover:text-white hover:border-primary-500/50 transition-all">
                  {logoUploading ? 'Enviando...' : 'Trocar Logo'}
                  <input type="file" accept="image/*" className="hidden" disabled={logoUploading} onChange={async e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setLogoUploading(true)
                    try {
                      const img = await createImageBitmap(file)
                      const size = 512
                      const canvas = document.createElement('canvas')
                      canvas.width = size
                      canvas.height = size
                      const ctx = canvas.getContext('2d')!
                      ctx.fillStyle = '#ffffff'
                      ctx.fillRect(0, 0, size, size)
                      const s = Math.min(size / img.width, size / img.height)
                      const x = (size - img.width * s) / 2
                      const y = (size - img.height * s) / 2
                      ctx.drawImage(img, x, y, img.width * s, img.height * s)
                      img.close()
                      const blob = await new Promise<Blob>(resolve => canvas.toBlob(b => resolve(b!), 'image/png'))
                      canvas.remove()
                      const fd = new FormData()
                      fd.append('file', blob, 'logo.png')
                      fd.append('tenantId', tenant.id)
                      const r = await fetch('/api/upload-logo', { method: 'POST', body: fd })
                      const d = await r.json()
                      if (d.url) setStoreLogo(d.url)
                      else alert('Erro: ' + (d.error || 'unknown'))
                    } catch (err: any) { alert('Erro ao processar imagem: ' + err.message) }
                    setLogoUploading(false)
                  }} />
                </label>
              </div>
              <p className="text-xs text-dark-500 mt-1">PNG ou JPG, até 5MB. Essa imagem será usada como ícone do PWA.</p>
            </div>
            <div><label className="text-xs text-dark-400 block mb-1">Taxa de Entrega (R$)</label><input className="input-dark" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} placeholder="0,00" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">WhatsApp</label><input className="input-dark" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Mínimo p/ Pedido (R$)</label><input className="input-dark" value={minOrder} onChange={e => setMinOrder(e.target.value)} /></div>
            <div className="sm:col-span-2"><label className="text-xs text-dark-400 block mb-1">Endereço</label><input className="input-dark w-full" value={storeAddress} onChange={e => setStoreAddress(e.target.value)} /></div>
            <div><label className="text-xs text-dark-400 block mb-1">CEP</label><div className="flex gap-2"><input className="input-dark flex-1" value={storeCep} onChange={e => setStoreCep(e.target.value)} placeholder="00000-000" /><button onClick={async () => { if (!storeCep) { alert('Digite o CEP primeiro.'); return }; setSearchingCep(true); try { const r = await fetch(`https://viacep.com.br/ws/${storeCep.replace(/\D/g,'')}/json/`); const d = await r.json(); if (d.erro) { alert('CEP não encontrado'); return }; setStoreAddress(`${d.logradouro}, ${d.bairro}`) } catch (e: any) { alert('Erro: ' + e.message) }; setSearchingCep(false) }} disabled={searchingCep} className="px-3 py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors text-sm shrink-0">{searchingCep ? '...' : 'Buscar CEP'}</button></div></div>
            <div><label className="text-xs text-dark-400 block mb-1">Preço por km (R$)</label><input type="number" step="0.1" min="0" value={pricePerKm} onChange={e => setPricePerKm(e.target.value)} className="input-dark" placeholder="0,00" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Latitude</label><input className="input-dark" value={storeLat} onChange={e => setStoreLat(e.target.value)} placeholder="Preenchido via geocode" /></div>
            <div><label className="text-xs text-dark-400 block mb-1">Longitude</label><input className="input-dark" value={storeLng} onChange={e => setStoreLng(e.target.value)} placeholder="Preenchido via geocode" /></div>
            <div className="sm:col-span-2">
              <button onClick={async () => {
                if (!storeAddress && !storeCep) { alert('Digite o endereço ou CEP da loja.'); return }
                setGeocoding(true)
                try {
                  const r = await fetch('/api/geocode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ storeAddress: storeAddress || undefined, storeCep: storeCep || undefined, zoneName: 'endereço' }) })
                  if (!r.ok) { const e = await r.json(); alert(e.error); return }
                  const d = await r.json()
                  setStoreLat(String(d.storeLat))
                  setStoreLng(String(d.storeLon))
                } catch (e: any) { alert('Erro: ' + e.message) }
                setGeocoding(false)
              }} disabled={geocoding} className="btn-outline text-sm"><MapPin className="w-4 h-4" />{geocoding ? 'Geocodificando...' : 'Geocodificar Endereço'}</button>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-dark-400 block mb-1">Mensagem / Banner do App</label>
              <div className="flex gap-2">
                <input className="input-dark flex-1" value={banner} onChange={e => setBanner(e.target.value)} placeholder="Ex: 🎉 Cliente novo? Cupom BEMVINDO e ganhe 10% off!" />
                <button onClick={async () => {
                  setBannerMsg('Salvando...')
                  const { data: { session } } = await supabase.auth.getSession()
                  const token = session?.access_token || ''
                  const r = await fetch('/api/banner', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ tenantId: tenant.id, banner, stepMessages, itemIcons, itemPrices }) })
                  if (r.ok) setBannerMsg('✅ Salvo!')
                  else { const d = await r.json(); setBannerMsg(`Erro: ${d.error}`) }
                  setTimeout(() => setBannerMsg(''), 3000)
                }} className="px-4 py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors text-sm shrink-0">Salvar</button>
              </div>
              {bannerMsg && <p className="text-xs text-dark-400 mt-1">{bannerMsg}</p>}
              <p className="text-xs text-dark-500 mt-1">Essa mensagem aparece no topo do app do cliente.</p>
            </div>
            <div className="sm:col-span-2 border-t border-dark-800 pt-4 mt-2">
              <label className="text-xs text-dark-400 block mb-3 font-semibold">Mensagens de cada etapa</label>
              <div className="space-y-2">
                {[['type', '🍇 Escolha da Base'], ['size', '🥤 Tamanho'], ['toppings', '🍫 Coberturas'], ['fruits', '🍓 Frutas'], ['extras', '🥜 Complementos']].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-xs text-dark-500 block mb-1">{label}</label>
                    <input className="input-dark w-full" value={stepMessages[key] || ''} onChange={e => setStepMessages(prev => ({ ...prev, [key]: e.target.value }))} placeholder="Deixe vazio para usar mensagem padrão" />
                  </div>
                ))}
              </div>
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
          <h3 className="font-semibold text-white mb-4">Preços dos Itens</h3>
          <p className="text-xs text-dark-500 mb-3">Defina o valor adicional de cada item no app.</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-dark-400 block mb-1">Coberturas (R$)</label>
              <input type="number" step="0.5" min="0" value={itemPrices.toppingPrice} onChange={e => setItemPrices(prev => ({ ...prev, toppingPrice: parseFloat(e.target.value) || 0 }))} className="input-dark w-full" />
            </div>
            <div>
              <label className="text-xs text-dark-400 block mb-1">Frutas (R$)</label>
              <input type="number" step="0.5" min="0" value={itemPrices.fruitPrice} onChange={e => setItemPrices(prev => ({ ...prev, fruitPrice: parseFloat(e.target.value) || 0 }))} className="input-dark w-full" />
            </div>
            <div>
              <label className="text-xs text-dark-400 block mb-1">Complementos (R$)</label>
              <input type="number" step="0.5" min="0" value={itemPrices.extraPrice} onChange={e => setItemPrices(prev => ({ ...prev, extraPrice: parseFloat(e.target.value) || 0 }))} className="input-dark w-full" />
            </div>
          </div>
          <p className="text-xs text-dark-500 mt-2">Coloque 0 (zero) para itens grátis.</p>
        </div>

        <div className="border-t border-dark-800 pt-6">
          <h3 className="font-semibold text-white mb-4">Ícones dos Itens</h3>
          <p className="text-xs text-dark-500 mb-3">Emojis que aparecem ao lado de cada item no app. Pode personalizar cada um.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
            {['Leite Condensado', 'Nutella', 'Chocolate', 'Caramelo', 'Morango', 'Doce de Leite', 'Leite Ninho', 'Creme de Avelã', 'Banana', 'Kiwi', 'Uva', 'Manga', 'Abacaxi', 'Maçã', 'Pera', 'Maracujá', 'Coco', 'Granola', 'Paçoca', 'Leite em Pó', 'Castanha', 'Confete', 'Ovomaltine', 'Amendoim', 'Coco Ralado', 'Chia', "MM's"].map(name => (
              <div key={name} className="flex items-center gap-2">
                <input className="w-9 h-9 text-center rounded-lg bg-dark-800 border border-dark-700 text-white text-base outline-none focus:border-primary-500/50" value={itemIcons[name] || ''} onChange={e => setItemIcons(prev => ({ ...prev, [name]: e.target.value }))} maxLength={2} />
                <span className="text-xs text-dark-400 truncate">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-dark-800 pt-6">
          <button onClick={async () => {
            setBannerMsg('Salvando...')
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token || ''
            const r = await fetch('/api/banner', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ tenantId: tenant.id, banner, stepMessages, itemIcons, itemPrices }) })
            const openDays = workingDays.filter(d => d.open)
            const hoursStr = openDays.length > 0 ? `${openDays[0].start} - ${openDays[openDays.length - 1].end}` : 'Fechado'
            const wh = workingDays.map(d => `${d.open ? '' : '(Fechado) '}${d.day}: ${d.open ? `${d.start} às ${d.end}` : '-'}`).join('; ')
            await updateTenant(tenant.id, { name: storeName, delivery_fee: parseFloat(deliveryFee) || 0, whatsapp, min_order: parseFloat(minOrder) || 0, address: storeAddress, working_hours: wh, price_per_km: parseFloat(pricePerKm) || 0, latitude: parseFloat(storeLat) || null, longitude: parseFloat(storeLng) || null, cep: storeCep })
            if (r.ok) setBannerMsg('✅ Todas as configurações salvas!')
            else { const d = await r.json(); setBannerMsg(`Erro: ${d.error}`) }
            setTimeout(() => setBannerMsg(''), 3000)
          }} className="btn-primary">Salvar Configurações</button>
          {bannerMsg && <p className="text-xs text-dark-400 mt-2">{bannerMsg}</p>}
        </div>
      </div>
    </div>
  )
}

