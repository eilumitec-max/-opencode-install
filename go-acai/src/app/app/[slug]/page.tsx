'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Check, ArrowRight, ShoppingBag, MapPin, Package, Clock, Plus, Minus } from 'lucide-react'
import { getTenantBySlug, type Tenant, type TenantProduct } from '@/lib/tenants'
import { supabase } from '@/lib/supabase'
import { insertOrder, upsertCustomer, fetchCustomerByPhone } from '@/lib/supabase-queries'

type Step = 'name' | 'type' | 'size' | 'base' | 'toppings' | 'fruits' | 'extras' | 'cart' | 'checkout' | 'tracking'

interface OrderState {
  type: string; size: string; base: string; toppings: string[]; fruits: string[]; extras: string[]
}

const sizeOptions = ['300 ml', '500 ml', '700 ml', '1 Litro']
const sizePrices: Record<string, string> = { '300 ml': 'R$ 15,00', '500 ml': 'R$ 19,90', '700 ml': 'R$ 24,90', '1 Litro': 'R$ 32,90' }
const typeOptions = ['Açaí Tradicional', 'Açaí Zero Açúcar', 'Creme de Cupuaçu', 'Sorvete de Creme', 'Sorvete de Chocolate', 'Sorvete de Morango']
const typeEmojis: Record<string, string> = { 'Açaí Tradicional': '🍇', 'Açaí Zero Açúcar': '🍇', 'Creme de Cupuaçu': '🍈', 'Sorvete de Creme': '🍦', 'Sorvete de Chocolate': '🍫', 'Sorvete de Morango': '🍓' }
const toppingsList = ['Leite Condensado', 'Nutella', 'Chocolate', 'Caramelo', 'Morango', 'Doce de Leite', 'Leite Ninho', 'Creme de Avelã']
const fruitsList = ['Banana', 'Morango', 'Kiwi', 'Uva', 'Manga', 'Abacaxi', 'Maçã', 'Pera', 'Maracujá', 'Coco']
const extrasList = ['Granola', 'Paçoca', 'Leite em Pó', 'Castanha', 'Confete', 'Ovomaltine', 'Amendoim', 'Coco Ralado', 'Chia', "MM's"]

export default function TenantAppPage() {
  const params = useParams()
  const slug = params.slug as string
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [step, setStep] = useState<Step>('name')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [order, setOrder] = useState<OrderState>({ type: '', size: '', base: '', toppings: [], fruits: [], extras: [] })
  const [history, setHistory] = useState<Step[]>([])

  useEffect(() => { const t = getTenantBySlug(slug); if (t) setTenant(t) }, [slug])

  const goTo = (next: Step) => { setHistory(prev => [...prev, step]); setStep(next) }
  const goBack = () => {
    if (history.length > 0) { const prev = history[history.length - 1]; setHistory(h => h.slice(0, -1)); setStep(prev) }
  }
  const toggleItem = (arr: string[], item: string) => arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
  const getPrice = () => {
    const base = order.size ? parseFloat(sizePrices[order.size]?.replace('R$ ', '').replace(',', '.')) || 19.90 : 19.90
    return base + order.extras.length * 2 + order.toppings.length * 1.5
  }
  const orderTotal = getPrice()
  const deliveryFee = tenant?.deliveryFee || 0

  if (!tenant) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="text-center text-dark-400"><p className="text-4xl mb-4">🔍</p><p className="font-bold text-white">Loja não encontrada</p><p className="text-sm mt-1">Verifique o link e tente novamente</p></div>
    </div>
  )

  if (step === 'name') return <NameScreen tenant={tenant} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} goTo={goTo} />
  if (step === 'tracking') return <TrackingScreen tenant={tenant} goBack={goBack} />
  if (step === 'checkout') return (
    <CheckoutScreen tenant={tenant} total={orderTotal + deliveryFee} goBack={goBack} goTo={goTo}
      customerName={customerName} customerPhone={customerPhone} order={order} />
  )

  const progressSteps: Step[] = ['type', 'size', 'toppings', 'fruits', 'extras', 'cart']
  const currentIdx = progressSteps.indexOf(step)
  const progress = currentIdx >= 0 ? ((currentIdx + 1) / progressSteps.length) * 100 : 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: `${tenant.primaryColor}08` }}>
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="sticky top-0 z-10 bg-white border-b border-primary-100">
          <div className="px-4 py-3">
            {step === 'type' || step === 'cart' ? (
              <div className="flex items-center gap-3">
                <button onClick={goBack} className="p-2 -ml-2 rounded-lg hover:bg-dark-50 transition-colors"><ChevronLeft className="w-5 h-5 text-dark-600" /></button>
                <div className="flex items-center gap-2" style={{ color: tenant.primaryColor }}>
                  <span className="text-lg">{tenant.logo}</span>
                  <span className="font-bold text-dark-900 text-lg">{tenant.name}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={goBack} className="p-2 -ml-2 rounded-lg hover:bg-dark-50 transition-colors"><ChevronLeft className="w-5 h-5 text-dark-600" /></button>
                <div className="flex-1">
                  <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: tenant.primaryColor }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          {step === 'type' && deliveryFee === 0 && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary-50 text-secondary-700 text-xs"><Package className="w-4 h-4" /><span>Entrega grátis • Pedido mínimo R$ {tenant.minOrder.toFixed(2).replace('.', ',')}</span></div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 overflow-y-auto p-4 sm:p-6">
            {step === 'type' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display text-dark-900">Escolha a base</h2>
                <div className="space-y-2">
                  {typeOptions.map(opt => (
                    <motion.button key={opt} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                      onClick={() => { const baseMap: Record<string, string> = { 'Açaí Tradicional': 'Açaí', 'Açaí Zero Açúcar': 'Açaí', 'Creme de Cupuaçu': 'Creme', 'Sorvete de Creme': 'Sorvete', 'Sorvete de Chocolate': 'Sorvete', 'Sorvete de Morango': 'Sorvete' }; setOrder({ ...order, type: opt, base: baseMap[opt] || 'Açaí' }); goTo('size') }}
                      className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 transition-all ${order.type === opt ? 'border-primary-500 bg-primary-50' : 'border-dark-200 hover:border-primary-200'}`}>
                      <span className="text-2xl">{typeEmojis[opt]}</span>
                      <span className="font-medium text-dark-900 flex-1 text-left">{opt}</span>
                      {order.type === opt && <Check className="w-5 h-5 text-primary-500" />}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            {step === 'size' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display text-dark-900">Qual o tamanho?</h2>
                <div className="grid grid-cols-2 gap-3">
                  {sizeOptions.map((opt, i) => (
                    <motion.button key={opt} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => { setOrder({ ...order, size: opt }); goTo('toppings') }}
                      className={`p-5 rounded-2xl border-2 transition-all text-center ${order.size === opt ? 'border-primary-500 bg-primary-50' : 'border-dark-200 hover:border-primary-200'}`}>
                      <div className="flex items-center justify-center mb-2">
                        <div style={{ width: `${40 + i * 15}px`, height: `${40 + i * 15}px` }} className="rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <span className="font-bold" style={{ color: tenant.primaryColor }}>{opt}</span>
                        </div>
                      </div>
                      <p className="text-lg font-bold" style={{ color: tenant.primaryColor }}>{sizePrices[opt]}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            {step === 'toppings' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display text-dark-900">Coberturas <span className="text-sm font-normal text-dark-500">(R$ 1,50 cada)</span></h2>
                <div className="flex flex-wrap gap-2">
                  {toppingsList.map(item => (
                    <motion.button key={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setOrder({ ...order, toppings: toggleItem(order.toppings, item) })}
                      className={`px-4 py-2 rounded-full border-2 transition-all ${order.toppings.includes(item) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-dark-200 hover:border-primary-200 text-dark-700'}`}>{item}</motion.button>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => goTo('fruits')} className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2" style={{ backgroundColor: tenant.primaryColor }}>Continuar <ArrowRight className="w-4 h-4" /></motion.button>
              </div>
            )}
            {step === 'fruits' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display text-dark-900">Frutas <span className="text-sm font-normal text-dark-500">(Grátis)</span></h2>
                <div className="grid grid-cols-2 gap-2">
                  {fruitsList.map(item => (
                    <motion.button key={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setOrder({ ...order, fruits: toggleItem(order.fruits, item) })}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${order.fruits.includes(item) ? 'border-primary-500 bg-primary-50' : 'border-dark-200 hover:border-primary-200'}`}>
                      <span className="font-medium text-dark-900">{item}</span>
                    </motion.button>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => goTo('extras')} className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2" style={{ backgroundColor: tenant.primaryColor }}>Continuar <ArrowRight className="w-4 h-4" /></motion.button>
              </div>
            )}
            {step === 'extras' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display text-dark-900">Complementos <span className="text-sm font-normal text-dark-500">(R$ 2,00 cada)</span></h2>
                <div className="space-y-2">
                  {extrasList.map(item => (
                    <motion.button key={item} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setOrder({ ...order, extras: toggleItem(order.extras, item) })}
                      className={`flex items-center gap-3 w-full p-3 rounded-xl border-2 transition-all ${order.extras.includes(item) ? 'border-primary-500 bg-primary-50' : 'border-dark-200 hover:border-primary-200'}`}>
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${order.extras.includes(item) ? 'border-primary-500 bg-primary-500' : 'border-dark-300'}`}>
                        {order.extras.includes(item) && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="font-medium text-dark-900 flex-1 text-left">{item}</span>
                      <span className="text-sm text-dark-500">+R$ 2,00</span>
                    </motion.button>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => goTo('cart')} className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2" style={{ backgroundColor: tenant.primaryColor }}>Ver Carrinho <ArrowRight className="w-4 h-4" /></motion.button>
              </div>
            )}
            {step === 'cart' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-display text-dark-900">Resumo do Pedido</h2>
                <div className="space-y-3 rounded-2xl p-4" style={{ backgroundColor: `${tenant.primaryColor}08` }}>
                  <div className="flex justify-between items-center"><span className="font-semibold text-dark-900">{order.size} - {order.base}</span><span className="font-bold" style={{ color: tenant.primaryColor }}>{sizePrices[order.size] || 'R$ 19,90'}</span></div>
                  {order.toppings.length > 0 && <div className="flex justify-between text-sm"><span className="text-dark-500">Coberturas ({order.toppings.length}x)</span><span className="text-dark-500">+R$ {(order.toppings.length * 1.5).toFixed(2).replace('.', ',')}</span></div>}
                  {order.fruits.length > 0 && <div className="flex justify-between text-sm"><span className="text-dark-500">Frutas ({order.fruits.length}x)</span><span className="text-dark-500">Grátis</span></div>}
                  {order.extras.length > 0 && <div className="flex justify-between text-sm"><span className="text-dark-500">Complementos ({order.extras.length}x)</span><span className="text-dark-500">+R$ {(order.extras.length * 2).toFixed(2).replace('.', ',')}</span></div>}
                  {deliveryFee > 0 && <div className="flex justify-between text-sm"><span className="text-dark-500">Entrega</span><span className="text-dark-500">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span></div>}
                  <div className="border-t pt-3 flex justify-between text-lg" style={{ borderColor: `${tenant.primaryColor}20` }}><span className="font-bold text-dark-900">Total</span><span className="font-bold" style={{ color: tenant.primaryColor }}>R$ {(orderTotal + deliveryFee).toFixed(2).replace('.', ',')}</span></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent-50 text-sm">
                  <MapPin className="w-5 h-5 text-accent-500" />
                  <span className="text-dark-700">{tenant.address}</span>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => goTo('checkout')} className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2" style={{ backgroundColor: tenant.primaryColor }}>Ir para Pagamento <ArrowRight className="w-4 h-4" /></motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step !== 'type' && step !== 'cart' && (
          <div className="sticky bottom-0 p-4 bg-white border-t border-dark-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-dark-500">Total parcial</span>
              <span className="text-sm font-bold" style={{ color: tenant.primaryColor }}>R$ {orderTotal.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function NameScreen({ tenant, customerName, setCustomerName, customerPhone, setCustomerPhone, goTo }: {
  tenant: Tenant; customerName: string; setCustomerName: (v: string) => void
  customerPhone: string; setCustomerPhone: (v: string) => void; goTo: (s: Step) => void
}) {
  const [phase, setPhase] = useState<'phone' | 'register'>('phone')
  const [looking, setLooking] = useState(false)

  const lookupCustomer = async (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) return
    setLooking(true)
    setCustomerPhone(digits)
    const data = await fetchCustomerByPhone(digits)
    if (data) {
      setCustomerName(data.name)
      setLooking(false)
      goTo('type')
      return
    }
    setLooking(false)
    setPhase('register')
  }

  const handleRegister = async () => {
    if (!customerName.trim()) return
    await upsertCustomer({ phone: customerPhone, name: customerName.trim(), tenant_id: tenant.id })
    goTo('type')
  }

  if (phase === 'register') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: `${tenant.primaryColor}08` }}>
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl flex flex-col items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-4xl" style={{ backgroundColor: `${tenant.primaryColor}15` }}>{tenant.logo}</div>
            <div>
              <h1 className="text-2xl font-bold font-display text-dark-900">Primeira vez aqui?</h1>
              <p className="text-dark-500 text-sm mt-1">Qual seu nome?</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-dark-400">Telefone: {customerPhone}</p>
              <input value={customerName} onChange={e => setCustomerName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                className="w-full bg-dark-50 border-2 border-dark-200 rounded-xl px-5 py-4 text-center text-lg text-dark-900 outline-none focus:border-primary-500 transition-all placeholder:text-dark-400"
                placeholder="Seu nome completo" autoFocus />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all disabled:opacity-40"
              style={{ backgroundColor: tenant.primaryColor }} disabled={!customerName.trim()}>
              Começar <ArrowRight className="w-5 h-5 inline" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: `${tenant.primaryColor}08` }}>
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl flex flex-col items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-4xl" style={{ backgroundColor: `${tenant.primaryColor}15` }}>{tenant.logo}</div>
          <div>
            <h1 className="text-2xl font-bold font-display text-dark-900">{tenant.name}</h1>
            <p className="text-dark-500 text-sm mt-1">Informe seu telefone para começar</p>
          </div>
          <div className="space-y-3">
            <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
              onBlur={e => lookupCustomer(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') lookupCustomer((e.target as HTMLInputElement).value) }}
              className="w-full bg-dark-50 border-2 border-dark-200 rounded-xl px-5 py-4 text-center text-lg text-dark-900 outline-none focus:border-primary-500 transition-all placeholder:text-dark-400"
              placeholder="(11) 99999-8888" autoFocus />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => lookupCustomer(customerPhone)}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all disabled:opacity-40"
              style={{ backgroundColor: tenant.primaryColor }} disabled={customerPhone.replace(/\D/g, '').length < 10}>
              Prosseguir <ArrowRight className="w-5 h-5 inline" />
            </motion.button>
            {looking && (
              <div className="flex items-center justify-center gap-2 text-sm text-primary-500">
                <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                Buscando...
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-xs text-dark-400"><MapPin className="w-3 h-3" /> {tenant.address}</div>
            {tenant.deliveryFee > 0 ? (
              <p className="text-xs text-dark-400">Taxa de entrega: R$ {tenant.deliveryFee.toFixed(2).replace('.', ',')} • Mín: R$ {tenant.minOrder.toFixed(2).replace('.', ',')}</p>
            ) : (
              <p className="text-xs text-secondary-600 font-medium">Entrega grátis • Mín: R$ {tenant.minOrder.toFixed(2).replace('.', ',')}</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function CheckoutScreen({ tenant, total, goBack, goTo, customerName, customerPhone, order }: {
  tenant: Tenant; total: number; goBack: () => void; goTo: (s: Step) => void
  customerName: string; customerPhone: string; order: OrderState
}) {
  const [deliveryMethod, setDeliveryMethod] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [address, setAddress] = useState(tenant.address)
  const [confirmed, setConfirmed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [cep, setCep] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [loadingCep, setLoadingCep] = useState(false)
  const [hasSavedAddress, setHasSavedAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState(false)

  useEffect(() => {
    if (!customerPhone) return
    fetchCustomerByPhone(customerPhone).then(data => {
      if (data?.cep) {
        setCep(data.cep)
        setStreet(data.address || '')
        setNumber(data.number || '')
        setComplement(data.complement || '')
        setNeighborhood(data.neighborhood || '')
        setCity(data.city || '')
        setState(data.state || '')
        if (data.address && data.number && data.city) setHasSavedAddress(true)
      }
    })
  }, [customerPhone])

  const fetchCep = async (value: string) => {
    const c = value.replace(/\D/g, '')
    if (c.length !== 8) return
    setLoadingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${c}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setStreet(data.logradouro || '')
        setNeighborhood(data.bairro || '')
        setCity(data.localidade || '')
        setState(data.uf || '')
      }
    } catch { }
    setLoadingCep(false)
  }

  const handleConfirm = async () => {
    setSaving(true)
    setSaveError('')
    const orderId = `GO-${Date.now()}`
    const deliveryAddress = deliveryMethod === 'Retirada' ? '-' : `${street}, ${number}${complement ? ` - ${complement}` : ''}, ${neighborhood}, ${city}-${state}`
    const items = [`${order.size} ${order.type}`]

    const err1 = await upsertCustomer({
      phone: customerPhone, name: customerName, tenant_id: tenant.id,
      cep, address: street, number, complement, neighborhood, city, state,
    })
    if (err1) { setSaveError(`Erro ao salvar cliente: ${err1.message}`); setSaving(false); return }

    const err2 = await insertOrder({
      id: orderId, tenant_id: tenant.id, customer: customerName, phone: customerPhone, items,
      total, status: 'pending', payment: paymentMethod,
      method: deliveryMethod, date: new Date().toLocaleString('pt-BR'), address: deliveryAddress,
    })
    if (err2) { setSaveError(`Erro ao salvar pedido: ${err2.message}`); setSaving(false); return }

    setConfirmed(true)
    localStorage.setItem('goacai_tracking', JSON.stringify({
      orderId, status: 'pending', customer: customerName, phone: customerPhone, updatedAt: Date.now()
    }))
    setTimeout(() => goTo('tracking'), 1500)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: `${tenant.primaryColor}08` }}>
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl p-4 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 rounded-lg hover:bg-dark-50"><ChevronLeft className="w-5 h-5 text-dark-600" /></button>
          <p className="font-semibold text-dark-900">Finalizar Pedido</p>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-50">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: `${tenant.primaryColor}15` }}>{tenant.logo}</div>
          <div><p className="font-medium text-dark-900 text-sm">{customerName}</p><p className="text-xs text-dark-500">{order.size} - {order.type}</p></div>
        </div>
        <div>
          <p className="font-semibold text-dark-700 mb-2">Entrega ou Retirada?</p>
          <div className="grid grid-cols-2 gap-2">
            {['Entrega', 'Retirada'].map(opt => (
              <button key={opt} onClick={() => setDeliveryMethod(opt)} className={`p-3 rounded-xl border-2 text-center transition-all ${deliveryMethod === opt ? 'border-primary-500 bg-primary-50' : 'border-dark-200'}`}>
                {opt === 'Entrega' ? '🚚 Entrega' : '🏪 Retirada'}
              </button>
            ))}
          </div>
        </div>
        {deliveryMethod === 'Entrega' && (
          <div className="space-y-3">
            <p className="font-semibold text-dark-700">Endereço de Entrega</p>
            {hasSavedAddress && !editingAddress ? (
              <div className="p-4 rounded-xl bg-dark-50 border border-dark-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-dark-900">{street}, {number}{complement ? ` - ${complement}` : ''}</p>
                    <p className="text-xs text-dark-500">{neighborhood}, {city} - {state}</p>
                    <p className="text-xs text-dark-400 mt-0.5">CEP: {cep}</p>
                  </div>
                  <button onClick={() => setEditingAddress(true)} className="text-xs text-primary-500 font-medium flex-shrink-0">Alterar</button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs text-dark-400 block mb-1">CEP</label>
                  <div className="relative">
                    <input value={cep} onChange={e => setCep(e.target.value)}
                      onBlur={e => fetchCep(e.target.value)}
                      className="w-full bg-dark-50 border border-dark-200 rounded-xl px-4 py-3 text-sm text-dark-900 outline-none focus:border-primary-500 transition-all"
                      placeholder="00000-000" />
                    {loadingCep && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-xs text-dark-400 block mb-1">Rua</label>
                    <input value={street} onChange={e => setStreet(e.target.value)} className="w-full bg-dark-50 border border-dark-200 rounded-xl px-4 py-3 text-sm text-dark-900 outline-none focus:border-primary-500 transition-all" placeholder="Rua" />
                  </div>
                  <div>
                    <label className="text-xs text-dark-400 block mb-1">Número</label>
                    <input value={number} onChange={e => setNumber(e.target.value)} className="w-full bg-dark-50 border border-dark-200 rounded-xl px-4 py-3 text-sm text-dark-900 outline-none focus:border-primary-500 transition-all" placeholder="Nº" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-dark-400 block mb-1">Complemento</label>
                  <input value={complement} onChange={e => setComplement(e.target.value)} className="w-full bg-dark-50 border border-dark-200 rounded-xl px-4 py-3 text-sm text-dark-900 outline-none focus:border-primary-500 transition-all" placeholder="Apto, Bloco, etc" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-dark-400 block mb-1">Bairro</label>
                    <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="w-full bg-dark-50 border border-dark-200 rounded-xl px-4 py-3 text-sm text-dark-900 outline-none focus:border-primary-500 transition-all" placeholder="Bairro" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-dark-400 block mb-1">Cidade</label>
                      <input value={city} onChange={e => setCity(e.target.value)} className="w-full bg-dark-50 border border-dark-200 rounded-xl px-4 py-3 text-sm text-dark-900 outline-none focus:border-primary-500 transition-all" placeholder="Cidade" />
                    </div>
                    <div>
                      <label className="text-xs text-dark-400 block mb-1">UF</label>
                      <input value={state} onChange={e => setState(e.target.value)} maxLength={2} className="w-full bg-dark-50 border border-dark-200 rounded-xl px-4 py-3 text-sm text-dark-900 outline-none focus:border-primary-500 transition-all" placeholder="SP" />
                    </div>
                  </div>
                </div>
                {hasSavedAddress && editingAddress && (
                  <button onClick={() => setEditingAddress(false)} className="text-xs text-dark-500">Cancelar alteração</button>
                )}
              </>
            )}
          </div>
        )}
        <div>
          <p className="font-semibold text-dark-700 mb-2">Forma de Pagamento</p>
          <div className="grid grid-cols-3 gap-2">
            {[{ icon: '💵', label: 'Dinheiro' }, { icon: '💳', label: 'Cartão' }, { icon: '📱', label: 'PIX' }].map(opt => (
              <button key={opt.label} onClick={() => setPaymentMethod(opt.label)} className={`p-3 rounded-xl border-2 text-center transition-all ${paymentMethod === opt.label ? 'border-primary-500 bg-primary-50' : 'border-dark-200'}`}>
                <p className="text-xl">{opt.icon}</p><p className="text-xs font-medium text-dark-700">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-dark-200 pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>R$ {(total - tenant.deliveryFee).toFixed(2).replace('.', ',')}</span></div>
          <div className="flex justify-between"><span>Entrega</span><span>{tenant.deliveryFee === 0 ? 'Grátis' : `R$ ${tenant.deliveryFee.toFixed(2).replace('.', ',')}`}</span></div>
          <div className="flex justify-between text-lg font-bold border-t border-dark-200 pt-2"><span>Total</span><span style={{ color: tenant.primaryColor }}>R$ {total.toFixed(2).replace('.', ',')}</span></div>
        </div>
        {saveError && <p className="text-sm text-red-500 text-center">{saveError}</p>}
        {confirmed ? (
          <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: `${tenant.primaryColor}10` }}>
            <Check className="w-12 h-12 mx-auto mb-2" style={{ color: tenant.primaryColor }} />
            <p className="font-bold text-dark-900">Pedido Confirmado!</p>
            <p className="text-sm text-dark-500">Redirecionando...</p>
          </div>
        ) : (
          <button onClick={handleConfirm} disabled={saving || !deliveryMethod || !paymentMethod || (deliveryMethod === 'Entrega' && (!street || !number))}
            className="w-full py-3.5 rounded-xl text-white font-semibold transition-all disabled:opacity-40"
            style={{ backgroundColor: tenant.primaryColor }}>
            {saving ? 'Salvando...' : `Confirmar Pedido - R$ ${total.toFixed(2).replace('.', ',')}`}
          </button>
        )}
      </div>
    </div>
  )
}

function TrackingScreen({ tenant, goBack }: { tenant: Tenant; goBack: () => void }) {
  const [trackLevel, setTrackLevel] = useState(0)
  const [trackLabel, setTrackLabel] = useState('Aguardando confirmação')
  const [orderId, setOrderId] = useState('')
  const [customerData, setCustomerData] = useState<any>(null)
  const [editingAddress, setEditingAddress] = useState(false)
  const [editCep, setEditCep] = useState('')
  const [editStreet, setEditStreet] = useState('')
  const [editNumber, setEditNumber] = useState('')
  const [editComplement, setEditComplement] = useState('')
  const [editNeighborhood, setEditNeighborhood] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editState, setEditState] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  const statusToLevel: Record<string, number> = { pending: 0, preparing: 1, shipped: 2, delivered: 3 }
  const statusLabels: Record<string, string> = { pending: 'Aguardando confirmação', preparing: 'Preparando seu pedido...', shipped: 'Saiu para entrega!', delivered: 'Pedido entregue!' }

  const updateFromStatus = (status: string) => {
    if (status && statusToLevel[status] !== undefined) {
      setTrackLevel(statusToLevel[status])
      setTrackLabel(statusLabels[status] || '')
    }
  }

  useEffect(() => {
    const raw = localStorage.getItem('goacai_tracking')
    if (raw) {
      const data = JSON.parse(raw)
      if (data.orderId) setOrderId(data.orderId)
      if (data.status) updateFromStatus(data.status)
      if (data.phone) {
        fetchCustomerByPhone(data.phone).then(c => {
          if (c) setCustomerData(c)
        })
      }
    }
    const interval = setInterval(async () => {
      try {
        const raw = localStorage.getItem('goacai_tracking')
        if (raw) {
          const data = JSON.parse(raw)
          if (data.status) updateFromStatus(data.status)
        }
        const id = orderId || (raw ? JSON.parse(raw).orderId : null)
        if (id) {
          const { data: order } = await supabase.from('orders').select('status').match({ id, tenant_id: tenant.id }).single()
          if (order?.status) updateFromStatus(order.status)
        }
      } catch { }
    }, 2000)
    return () => clearInterval(interval)
  }, [tenant.id])

  const handleBuyAgain = () => {
    localStorage.removeItem('goacai_tracking')
    window.location.reload()
  }

  const startEditAddress = () => {
    if (!customerData) return
    setEditCep(customerData.cep || '')
    setEditStreet(customerData.address || '')
    setEditNumber(customerData.number || '')
    setEditComplement(customerData.complement || '')
    setEditNeighborhood(customerData.neighborhood || '')
    setEditCity(customerData.city || '')
    setEditState(customerData.state || '')
    setEditingAddress(true)
    setSaveMsg('')
  }

  const saveAddress = async () => {
    const err = await upsertCustomer({
      phone: customerData.phone, name: customerData.name, tenant_id: customerData.tenant_id,
      cep: editCep, address: editStreet, number: editNumber, complement: editComplement,
      neighborhood: editNeighborhood, city: editCity, state: editState,
    })
    if (err) { setSaveMsg(`Erro: ${err.message}`); return }
    setCustomerData({ ...customerData, cep: editCep, address: editStreet, number: editNumber, complement: editComplement, neighborhood: editNeighborhood, city: editCity, state: editState })
    setEditingAddress(false)
    setSaveMsg('Endereço atualizado!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const steps = [
    { icon: '📋', label: 'Pedido recebido' },
    { icon: '👨‍🍳', label: 'Em preparo' },
    { icon: '📍', label: 'Saiu para entrega' },
    { icon: '✅', label: 'Entregue' },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: `${tenant.primaryColor}08` }}>
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl p-6 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl" style={{ backgroundColor: `${tenant.primaryColor}15` }}>{tenant.logo}</div>
          {trackLevel >= 3 ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold font-display text-dark-900">Pedido Entregue!</h2>
              <p className="text-dark-500 text-sm">Obrigado por comprar conosco 🎉</p>
            </motion.div>
          ) : (
            <>
              <h2 className="text-2xl font-bold font-display text-dark-900">Pedido Recebido!</h2>
              <p className="text-dark-500 text-sm">{tenant.name}</p>
            </>
          )}
        </div>

        {customerData && customerData.address && !editingAddress && (
          <div className="rounded-2xl p-4" style={{ backgroundColor: `${tenant.primaryColor}08` }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Endereço de Entrega</p>
              <button onClick={startEditAddress} className="text-xs text-primary-500 hover:text-primary-400 font-medium">Editar</button>
            </div>
            <p className="text-sm text-dark-900">{customerData.address}, {customerData.number}{customerData.complement ? ` - ${customerData.complement}` : ''}</p>
            <p className="text-xs text-dark-500">{customerData.neighborhood}, {customerData.city} - {customerData.state}</p>
            <p className="text-xs text-dark-400 mt-1">CEP: {customerData.cep}</p>
          </div>
        )}

        {editingAddress && (
          <div className="rounded-2xl p-4 border border-dark-200 space-y-3">
            <p className="text-sm font-semibold text-dark-900">Editar Endereço</p>
            <div>
              <label className="text-xs text-dark-400 block mb-1">CEP</label>
              <input value={editCep} onChange={e => setEditCep(e.target.value)} className="input-dark w-full text-sm" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-xs text-dark-400 block mb-1">Rua</label>
                <input value={editStreet} onChange={e => setEditStreet(e.target.value)} className="input-dark w-full text-sm" />
              </div>
              <div>
                <label className="text-xs text-dark-400 block mb-1">Número</label>
                <input value={editNumber} onChange={e => setEditNumber(e.target.value)} className="input-dark w-full text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-dark-400 block mb-1">Complemento</label>
              <input value={editComplement} onChange={e => setEditComplement(e.target.value)} className="input-dark w-full text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-dark-400 block mb-1">Bairro</label>
                <input value={editNeighborhood} onChange={e => setEditNeighborhood(e.target.value)} className="input-dark w-full text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-dark-400 block mb-1">Cidade</label>
                  <input value={editCity} onChange={e => setEditCity(e.target.value)} className="input-dark w-full text-sm" />
                </div>
                <div>
                  <label className="text-xs text-dark-400 block mb-1">UF</label>
                  <input value={editState} onChange={e => setEditState(e.target.value)} maxLength={2} className="input-dark w-full text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveAddress} className="flex-1 py-2 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor: tenant.primaryColor }}>Salvar</button>
              <button onClick={() => setEditingAddress(false)} className="px-4 py-2 rounded-xl border border-dark-200 text-sm text-dark-600">Cancelar</button>
            </div>
            {saveMsg && <p className="text-xs text-center text-green-600">{saveMsg}</p>}
          </div>
        )}

        <div className="space-y-6">
          {steps.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${i < trackLevel ? 'bg-green-100' : i === trackLevel ? 'bg-primary-100' : 'bg-dark-100'}`}>{s.icon}</div>
              <div className="flex-1">
                <p className={`font-semibold ${i <= trackLevel ? 'text-dark-900' : 'text-dark-400'}`}>{s.label}</p>
                <p className={`text-sm ${i === trackLevel ? 'text-primary-600' : 'text-dark-400'}`}>{i === trackLevel ? trackLabel : i < trackLevel ? '✓ Concluído' : ''}</p>
              </div>
              {i < trackLevel && <Check className="w-5 h-5 text-green-500" />}
              {i === trackLevel && trackLevel < 3 && <div className="w-5 h-5 rounded-full border-2 border-accent-500 border-t-transparent animate-spin" />}
              {i === trackLevel && trackLevel === 3 && <Check className="w-5 h-5 text-green-500" />}
            </motion.div>
          ))}
        </div>
        {trackLevel >= 3 ? (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            onClick={handleBuyAgain}
            className="w-full py-4 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: tenant.primaryColor }}>
            Comprar Novamente <ArrowRight className="w-5 h-5" />
          </motion.button>
        ) : (
          <>
            <p className="text-center text-sm text-dark-500">🔄 Acompanhe em tempo real</p>
            <button onClick={goBack} className="w-full py-3 rounded-xl border-2 border-dark-200 font-semibold text-dark-700">Novo Pedido</button>
          </>
        )}
      </div>
    </div>
  )
}