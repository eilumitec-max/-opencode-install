'use client'

import { useEffect } from 'react'

let deferredPrompt: any = null
let listeners: ((e: any) => void)[] = []

export function getDeferredPrompt() {
  return deferredPrompt
}

export function clearDeferredPrompt() {
  deferredPrompt = null
}

export function onDeferredPrompt(cb: (e: any) => void) {
  listeners.push(cb)
  return () => {
    listeners = listeners.filter(l => l !== cb)
  }
}

export default function InstallCapture() {
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e
      listeners.forEach(cb => cb(e))
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  return null
}
