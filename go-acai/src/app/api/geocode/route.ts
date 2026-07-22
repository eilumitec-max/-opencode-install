import { NextResponse } from 'next/server'

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function nominatim(query: string) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=pt`, {
    headers: { 'User-Agent': 'GoAcai/1.0' },
  })
  const data = await res.json()
  if (!data || data.length === 0) return null
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
}

export async function POST(req: Request) {
  try {
    const { storeAddress, zoneName, city, state: uf } = await req.json()
    if (!storeAddress || !zoneName) {
      return NextResponse.json({ error: 'storeAddress e zoneName são obrigatórios' }, { status: 400 })
    }

    const fullQuery = `${zoneName}, ${city || ''}, ${uf || ''}`
    const [storeCoord, zoneCoord] = await Promise.all([
      nominatim(storeAddress),
      nominatim(fullQuery),
    ])

    if (!storeCoord) return NextResponse.json({ error: 'Não foi possível localizar o endereço da loja' }, { status: 400 })
    if (!zoneCoord) return NextResponse.json({ error: `Não foi possível localizar o bairro: ${fullQuery}` }, { status: 400 })

    const km = Math.round(haversineKm(storeCoord.lat, storeCoord.lon, zoneCoord.lat, zoneCoord.lon) * 10) / 10

    return NextResponse.json({ distanceKm: km, storeLat: storeCoord.lat, storeLon: storeCoord.lon })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
