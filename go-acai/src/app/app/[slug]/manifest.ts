import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: tenant } = await supabase
    .from('tenants').select('name, logo, primary_color').eq('slug', params.slug).single()

  const name = tenant?.name || params.slug
  const themeColor = tenant?.primary_color || '#7c3aed'

  return NextResponse.json({
    name,
    short_name: name.length > 12 ? name.substring(0, 12) + '…' : name,
    description: `Peça ${name} pelo app!`,
    start_url: `/app/${params.slug}`,
    scope: '/app',
    display: 'standalone',
    id: `goacai-${params.slug}`,
    orientation: 'portrait-primary',
    theme_color: themeColor,
    background_color: '#1a1a2e',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  })
}
