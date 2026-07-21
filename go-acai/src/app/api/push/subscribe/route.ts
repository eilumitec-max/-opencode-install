import { NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const { phone, subscription } = await req.json()
  if (!phone || !subscription) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const { error } = await supabase.storage
    .from('push-subs')
    .upload(`${phone}.json`, JSON.stringify(subscription), {
      contentType: 'application/json',
      upsert: true,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
