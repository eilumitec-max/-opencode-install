import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(req.url)
  const size = parseInt(searchParams.get('size') || '192', 10)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: tenant } = await supabase
    .from('tenants').select('name, primary_color').eq('slug', params.slug).single()

  const color = tenant?.primary_color || '#7c3aed'
  const letter = (tenant?.name || params.slug).charAt(0).toUpperCase()
  const r = Math.round(size * 0.195)
  const fontSize = Math.round(size * 0.5)

  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" rx="${r}" fill="${color}"/>
      <text x="${size / 2}" y="${size * 0.66}" font-size="${fontSize}"
            text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-weight="bold">${letter}</text>
    </svg>`,
    { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' } }
  )
}
