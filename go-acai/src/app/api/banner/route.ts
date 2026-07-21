import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tenantId = searchParams.get('tenantId')
  if (!tenantId) return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })

  const { data, error } = await supabaseAdmin.storage.from('push-subs').download(`banner-${tenantId}.json`)
  if (error || !data) return NextResponse.json({ banner: '' })
  const { banner } = JSON.parse(await data.text())
  return NextResponse.json({ banner: banner || '' })
}

export async function POST(req: Request) {
  const { tenantId, banner } = await req.json()
  if (!tenantId) return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })

  const { error } = await supabaseAdmin.storage.from('push-subs').upload(
    `banner-${tenantId}.json`,
    JSON.stringify({ banner: banner || '' }),
    { contentType: 'application/json', upsert: true }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
