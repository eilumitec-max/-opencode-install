import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tenantId = searchParams.get('tenantId')
  if (!tenantId) return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })

  const { data, error } = await supabaseAdmin.storage.from('push-subs').download(`config-${tenantId}.json`)
  if (error || !data) return NextResponse.json({ banner: '', stepMessages: {}, itemIcons: {} })
  const config = JSON.parse(await data.text())
  return NextResponse.json({ banner: config.banner || '', stepMessages: config.stepMessages || {}, itemIcons: config.itemIcons || {} })
}

export async function POST(req: Request) {
  const { tenantId, banner, stepMessages, itemIcons } = await req.json()
  if (!tenantId) return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })

  const { data: existing } = await supabaseAdmin.storage.from('push-subs').download(`config-${tenantId}.json`)
  const config = existing ? JSON.parse(await existing.text()) : {}
  if (banner !== undefined) config.banner = banner
  if (stepMessages !== undefined) config.stepMessages = stepMessages
  if (itemIcons !== undefined) config.itemIcons = itemIcons

  const { error } = await supabaseAdmin.storage.from('push-subs').upload(
    `config-${tenantId}.json`,
    JSON.stringify(config),
    { contentType: 'application/json', upsert: true }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
