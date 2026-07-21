'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIos(ios && isSafari)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    if (ios && isSafari) {
      const visited = localStorage.getItem('goacai_install_prompt_ios')
      if (!visited) {
        setTimeout(() => setShow(true), 3000)
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      setShow(false)
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('goacai_install_prompt_ios', '1')
  }

  return (
    <AnimatePresence>
      {show && !isInstalled && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-dark-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-2xl flex-shrink-0">🍇</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-dark-900 text-sm">Instalar GO AÇAÍ</p>
                  <button onClick={handleDismiss} className="p-1 -mr-1 rounded-lg hover:bg-dark-100 transition-colors">
                    <X className="w-4 h-4 text-dark-400" />
                  </button>
                </div>
                <p className="text-xs text-dark-500 mt-0.5">
                  {isIos
                    ? 'Toque em Compartilhar e depois "Adicionar à Tela de Início"'
                    : 'Instale para receber notificações e acessar mais rápido'}
                </p>
              </div>
            </div>
            {!isIos && (
              <button
                onClick={handleInstall}
                className="w-full mt-3 py-2.5 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all"
              >
                Instalar App
              </button>
            )}
            {isIos && (
              <div className="mt-3 p-3 rounded-xl bg-dark-50 space-y-2">
                <div className="flex items-center gap-2 text-xs text-dark-600">
                  <span className="w-6 h-6 rounded-full bg-dark-200 flex items-center justify-center text-xs font-bold">1</span>
                  Toque em <span className="w-5 h-5 rounded bg-dark-200 flex items-center justify-center text-xs">📤</span> Compartilhar
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-600">
                  <span className="w-6 h-6 rounded-full bg-dark-200 flex items-center justify-center text-xs font-bold">2</span>
                  Role e toque em "Adicionar à Tela de Início"
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
