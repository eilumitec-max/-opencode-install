'use client'

import { useEffect } from 'react'
import { setDeferredPrompt } from '@/lib/install-store'

export default function InstallCapture() {
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  return null
}
