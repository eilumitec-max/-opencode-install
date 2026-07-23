import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const tenantId = formData.get('tenantId') as string | null
  if (!file || !tenantId) return NextResponse.json({ error: 'Missing file or tenantId' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })

  const ext = file.name.split('.').pop() || 'png'
  const path = `${tenantId}/logo.${ext}`

  const { error: uploadError } = await supabaseAdmin.storage.from('logos').upload(path, file, {
    upsert: true, contentType: file.type,
  })
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: urlData } = supabaseAdmin.storage.from('logos').getPublicUrl(path)
  const logoUrl = urlData?.publicUrl || ''

  const { error: updateError } = await supabaseAdmin.from('tenants').update({ logo: logoUrl }).eq('id', tenantId)
  if (updateError) console.error('Failed to update tenant logo:', updateError)

  return NextResponse.json({ url: logoUrl })
}
