import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'

function translateError(msg: string) {
  const map: Record<string, string> = {
    'A user with this email address has already been registered': 'Este email já está cadastrado. Faça login ou use outro email.',
    'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
    'Unable to validate email address: invalid format': 'Email inválido. Digite um email válido.',
  }
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

    sendWelcomeEmail(email, storeName, slug)

    return NextResponse.json({ tenantId, slug })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
