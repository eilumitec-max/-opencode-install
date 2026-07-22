'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function DynamicManifest() {
  const params = useParams()
  const slug = params?.slug as string

  useEffect(() => {
    const existing = document.querySelector('link[rel="manifest"]')
    if (existing) existing.remove()

    const link = document.createElement('link')
    link.rel = 'manifest'
    link.href = slug ? `/app/${slug}/manifest` : '/manifest.json'
    document.head.appendChild(link)
  }, [slug])

  return null
}
