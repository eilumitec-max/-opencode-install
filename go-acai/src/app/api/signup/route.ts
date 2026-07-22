import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'

function translateError(msg: string) {
  const map: Record<string, string> = {
    'A user with this email address has already been registered': 'Este email já está cadastrado. Faça login ou use outro email.',
    'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
    'Unable to validate email address: invalid format': 'Email inválido. Digite um email válido.',
  }
  if (msg.toLowerCase().includes('rate limit')) return 'Limite de tentativas excedido. Tente novamente em alguns minutos.'
  return map[msg] || msg
}

export async function POST(request: Request) {
  try {
    const { email, password, storeName, plan } = await request.json()
    if (!email || !password || !storeName) {
      return NextResponse.json({ error: 'Email, senha e nome da loja são obrigatórios.' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, serviceKey)

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
    })
    if (authError) return NextResponse.json({ error: translateError(authError.message) }, { status: 400 })

    const tenantId = `t${Date.now()}`
    const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `loja-${tenantId}`

    const { error: tenantError } = await supabase.from('tenants').insert({
      id: tenantId, slug, name: storeName, logo: '🏪', primary_color: '#7c3aed',
      whatsapp: '', address: '', delivery_fee: 0, min_order: 0,
      working_hours: '09:00 - 22:00', installments: 'Até 12x',
    })
    if (tenantError) return NextResponse.json({ error: tenantError.message }, { status: 500 })

    const { error: linkError } = await supabase.from('tenant_users').insert({
      user_id: authData.user.id, tenant_id: tenantId, email, role: 'admin',
    })
    if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 })

    const catId = (n: string) => `${tenantId}-cat-${n}`
    const defaultCategories = [
      { id: catId('Coberturas'), tenant_id: tenantId, name: 'Coberturas', icon: '🍫', active: true, order: 1 },
      { id: catId('Frutas'), tenant_id: tenantId, name: 'Frutas', icon: '🍓', active: true, order: 2 },
      { id: catId('Complementos'), tenant_id: tenantId, name: 'Complementos', icon: '🥜', active: true, order: 3 },
    ]
    await supabase.from('categories').insert(defaultCategories)

    let _pid = 0
    const prodId = () => `p${Date.now()}${++_pid}${Math.random().toString(36).slice(2, 6)}`
    const defaultProducts = [
      { id: prodId(), tenant_id: tenantId, name: 'Leite Condensado', category: 'Coberturas', price: 1.5, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Nutella', category: 'Coberturas', price: 1.5, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Chocolate', category: 'Coberturas', price: 1.5, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Caramelo', category: 'Coberturas', price: 1.5, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Morango', category: 'Coberturas', price: 1.5, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Doce de Leite', category: 'Coberturas', price: 1.5, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Leite Ninho', category: 'Coberturas', price: 1.5, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Creme de Avelã', category: 'Coberturas', price: 1.5, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Banana', category: 'Frutas', price: 0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Morango', category: 'Frutas', price: 0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Kiwi', category: 'Frutas', price: 0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Uva', category: 'Frutas', price: 0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Manga', category: 'Frutas', price: 0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Abacaxi', category: 'Frutas', price: 0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Maçã', category: 'Frutas', price: 0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Pera', category: 'Frutas', price: 0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Maracujá', category: 'Frutas', price: 0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Coco', category: 'Frutas', price: 0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Granola', category: 'Complementos', price: 2.0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Paçoca', category: 'Complementos', price: 2.0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Leite em Pó', category: 'Complementos', price: 2.0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Castanha', category: 'Complementos', price: 2.0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Confete', category: 'Complementos', price: 2.0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Ovomaltine', category: 'Complementos', price: 2.0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Amendoim', category: 'Complementos', price: 2.0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Coco Ralado', category: 'Complementos', price: 2.0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: 'Chia', category: 'Complementos', price: 2.0, active: true, sales: 0 },
      { id: prodId(), tenant_id: tenantId, name: "M&M's", category: 'Complementos', price: 2.0, active: true, sales: 0 },
    ]
    await supabase.from('products').insert(defaultProducts)

    const _sid = { n: 0 }; const sizeId = () => `s${Date.now()}${++_sid.n}${Math.random().toString(36).slice(2, 4)}`
    await supabase.from('sizes').insert([
      { id: sizeId(), tenant_id: tenantId, name: '300 ml', price: 15.0, order: 1, active: true },
      { id: sizeId(), tenant_id: tenantId, name: '500 ml', price: 19.9, order: 2, active: true },
      { id: sizeId(), tenant_id: tenantId, name: '700 ml', price: 24.9, order: 3, active: true },
      { id: sizeId(), tenant_id: tenantId, name: '1 Litro', price: 32.9, order: 4, active: true },
    ])

    const _tid = { n: 0 }; const typeId = () => `y${Date.now()}${++_tid.n}${Math.random().toString(36).slice(2, 4)}`
    await supabase.from('types').insert([
      { id: typeId(), tenant_id: tenantId, name: 'Açaí Tradicional', emoji: '🍇', base: 'Açaí', order: 1, active: true },
      { id: typeId(), tenant_id: tenantId, name: 'Açaí Zero Açúcar', emoji: '🍇', base: 'Açaí', order: 2, active: true },
      { id: typeId(), tenant_id: tenantId, name: 'Creme de Cupuaçu', emoji: '🍈', base: 'Creme', order: 3, active: true },
      { id: typeId(), tenant_id: tenantId, name: 'Sorvete de Creme', emoji: '🍦', base: 'Sorvete', order: 4, active: true },
      { id: typeId(), tenant_id: tenantId, name: 'Sorvete de Chocolate', emoji: '🍫', base: 'Sorvete', order: 5, active: true },
      { id: typeId(), tenant_id: tenantId, name: 'Sorvete de Morango', emoji: '🍓', base: 'Sorvete', order: 6, active: true },
    ])

    const _pid2 = { n: 0 }; const pmId = () => `pm${Date.now()}${++_pid2.n}${Math.random().toString(36).slice(2, 4)}`
    await supabase.from('payment_methods').insert([
      { id: pmId(), tenant_id: tenantId, name: 'Dinheiro', icon: '💵', active: true },
      { id: pmId(), tenant_id: tenantId, name: 'Cartão', icon: '💳', active: true },
      { id: pmId(), tenant_id: tenantId, name: 'PIX', icon: '📱', active: true },
    ])

    try { await sendWelcomeEmail(email, storeName, slug) } catch (e: any) { console.error('Email error:', e?.message) }

    return NextResponse.json({ tenantId, slug })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
