import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, storeName, plan } = await request.json()
    if (!email || !password || !storeName) {
      return NextResponse.json({ error: 'Email, password and store name required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, serviceKey)

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
    })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

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

    return NextResponse.json({ tenantId, slug })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
