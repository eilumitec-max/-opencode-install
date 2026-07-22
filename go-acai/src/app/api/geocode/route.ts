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

async function viacep(cep: string) {
  const cleaned = cep.replace(/\D/g, '')
  if (cleaned.length !== 8) return null
  const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`)
  if (!res.ok) return null
  const data = await res.json()
  if (data.erro) return null
  return { logradouro: data.logradouro, bairro: data.bairro, cidade: data.localidade, uf: data.uf, cep: data.cep }
}

export async function POST(req: Request) {
  try {
    const { storeAddress, zoneName, city, state: uf, storeCep, zoneCep } = await req.json()
    if (!storeAddress && !storeCep) {
      return NextResponse.json({ error: 'storeAddress ou storeCep é obrigatório' }, { status: 400 })
    }

    let storeQuery = storeAddress
    if (storeCep) {
      const endereco = await viacep(storeCep)
      if (endereco) {
        storeQuery = `${endereco.logradouro}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`
      } else {
        storeQuery = `${storeCep}, Brasil`
      }
    }

    let zoneQuery = zoneName ? `${zoneName}, ${city || ''}, ${uf || ''}` : ''
    if (zoneCep) {
      const endereco = await viacep(zoneCep)
      if (endereco) {
        zoneQuery = `${endereco.logradouro}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`
      }
    }

    const [storeCoord, zoneCoord] = await Promise.all([
      nominatim(storeQuery),
      zoneQuery ? nominatim(zoneQuery) : Promise.resolve(null),
    ])

    if (!storeCoord) return NextResponse.json({ error: 'Não foi possível localizar o endereço da loja' }, { status: 400 })

    if (zoneCoord) {
      const km = Math.round(haversineKm(storeCoord.lat, storeCoord.lon, zoneCoord.lat, zoneCoord.lon) * 10) / 10
      return NextResponse.json({ distanceKm: km, storeLat: storeCoord.lat, storeLon: storeCoord.lon, zoneLat: zoneCoord.lat, zoneLon: zoneCoord.lon })
    }

    return NextResponse.json({ storeLat: storeCoord.lat, storeLon: storeCoord.lon })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
