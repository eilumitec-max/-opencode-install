import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

async function getUserFromSession(req: Request) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) return null
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const client = createClient(supabaseUrl, anonKey)
  const { data } = await client.auth.getUser(token)
  return data.user
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tenantId = searchParams.get('tenantId')
  if (!tenantId) return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })

  const { data, error } = await supabaseAdmin.storage.from('push-subs').download(`config-${tenantId}.json`)
  if (error || !data) return NextResponse.json({ banner: '', stepMessages: {}, itemIcons: {}, itemPrices: { toppingPrice: 1.5, fruitPrice: 0, extraPrice: 2.0 } })
  const config = JSON.parse(await data.text())
  return NextResponse.json({ banner: config.banner || '', stepMessages: config.stepMessages || {}, itemIcons: config.itemIcons || {}, itemPrices: config.itemPrices || { toppingPrice: 1.5, fruitPrice: 0, extraPrice: 2.0 } })
}

export async function POST(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) return NextResponse.json({ error: 'Não autorizado. Faça login primeiro.' }, { status: 401 })

  const { tenantId, banner, stepMessages, itemIcons, itemPrices } = await req.json()
  if (!tenantId) return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })

  const { data: link } = await supabaseAdmin.from('tenant_users').select('user_id').eq('tenant_id', tenantId).eq('user_id', user.id).single()
  if (!link) return NextResponse.json({ error: 'Acesso negado a esta loja.' }, { status: 403 })

  const { data: existing } = await supabaseAdmin.storage.from('push-subs').download(`config-${tenantId}.json`)
  const config = existing ? JSON.parse(await existing.text()) : {}
  if (banner !== undefined) config.banner = banner
  if (stepMessages !== undefined) config.stepMessages = stepMessages
  if (itemIcons !== undefined) config.itemIcons = itemIcons
  if (itemPrices !== undefined) config.itemPrices = itemPrices

  const { error } = await supabaseAdmin.storage.from('push-subs').upload(
    `config-${tenantId}.json`,
    JSON.stringify(config),
    { contentType: 'application/json', upsert: true }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
