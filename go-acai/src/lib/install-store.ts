let deferredPrompt: any = null

export function setDeferredPrompt(e: any) {
  deferredPrompt = e
}

export function getDeferredPrompt() {
  return deferredPrompt
}

export function clearDeferredPrompt() {
  deferredPrompt = null
}
