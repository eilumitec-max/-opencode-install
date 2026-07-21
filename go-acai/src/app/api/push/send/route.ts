import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { phone, title, body, url } = await req.json()
  if (!phone || !title) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const { data: subs } = await supabase.from('push_subscriptions').select('subscription').eq('phone', phone)
  if (!subs || subs.length === 0) return NextResponse.json({ error: 'No subscription' }, { status: 404 })

  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!vapidPrivateKey || !vapidPublicKey) return NextResponse.json({ error: 'VAPID not configured' }, { status: 500 })

  const webpush = require('web-push')
  webpush.setVapidDetails('mailto:contato@goacai.com.br', vapidPublicKey, vapidPrivateKey)

  const results = await Promise.allSettled(
    subs.map((s: any) =>
      webpush.sendNotification(s.subscription, JSON.stringify({ title, body, url, icon: '/icons/icon-192.svg' }))
    )
  )
  const sent = results.filter(r => r.status === 'fulfilled').length
  return NextResponse.json({ sent, total: subs.length })
}
