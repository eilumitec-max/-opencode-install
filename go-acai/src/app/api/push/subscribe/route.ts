import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { phone, subscription } = await req.json()
  if (!phone || !subscription) return NextResponse.json({ error: 'Missing data' }, { status: 400 })
  const { error } = await supabase.from('push_subscriptions').upsert(
    { phone, subscription },
    { onConflict: 'phone' }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
