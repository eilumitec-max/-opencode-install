import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'

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

export async function POST(req: Request) {
  const user = await getUserFromSession(req)
  if (!user) return NextResponse.json({ error: 'Não autorizado. Faça login primeiro.' }, { status: 401 })

  const { phone, title, body, url } = await req.json()
  if (!phone || !title) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const { data: blob, error: dlError } = await supabase.storage
    .from('push-subs')
    .download(`${phone}.json`)

  if (dlError || !blob) return NextResponse.json({ error: 'No subscription' }, { status: 404 })

  const subscription = JSON.parse(await blob.text())
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  if (!vapidPrivateKey || !vapidPublicKey) {
    return NextResponse.json({ error: 'VAPID not configured' }, { status: 500 })
  }

  const webpush = require('web-push')
  webpush.setVapidDetails('mailto:contato@goacai.com.br', vapidPublicKey, vapidPrivateKey)

  try {
    await webpush.sendNotification(subscription, JSON.stringify({
      title, body, url: url || '/', icon: '/icons/icon-192.svg',
    }))
    return NextResponse.json({ sent: 1 })
  } catch (err: any) {
    if (err.statusCode === 410) {
      await supabase.storage.from('push-subs').remove([`${phone}.json`])
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
