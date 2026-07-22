'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Share2, Plus, RefreshCw } from 'lucide-react'
import { getDeferredPrompt, clearDeferredPrompt } from '@/lib/install-store'

export default function InstallPrompt() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [appName, setAppName] = useState('')
  const [needsReinstall, setNeedsReinstall] = useState(false)

  useEffect(() => {
    setShow(false)
    setNeedsReinstall(false)
    const match = pathname.match(/^\/app\/([^/]+)/)
    if (!match) return
    const slug = match[1]
    fetch(`/app/${slug}/manifest`).then(r => r.json()).then(m => {
      setAppName(m.name || slug)
    }).catch(() => {
      setAppName(slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
    })
  }, [pathname])

  useEffect(() => {
    const match = pathname.match(/^\/app\/([^/]+)/)
    if (!match) return

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    if (localStorage.getItem('goacai_install_dismissed')) {
      setIsDismissed(true)
      return
    }

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIos(ios)

    if (getDeferredPrompt()) {
      setTimeout(() => setShow(true), 2000)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      if (!show) {
        setTimeout(() => setShow(true), 2000)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)

    const timeout = setTimeout(() => {
      setShow(true)
    }, 5000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timeout)
    }
  }, [pathname])

  const handleInstall = async () => {
    const prompt = getDeferredPrompt()
    if (prompt) {
      prompt.prompt()
      const result = await prompt.userChoice
      if (result.outcome === 'accepted') {
        setShow(false)
        setIsInstalled(true)
      }
      clearDeferredPrompt()
    } else {
      setNeedsReinstall(true)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('goacai_install_dismissed', '1')
    setIsDismissed(true)
  }

  return (
    <AnimatePresence>
      {show && !isInstalled && !isDismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={needsReinstall ? undefined : handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto shadow-lg">
              {needsReinstall ? <RefreshCw className="w-10 h-10 text-white" /> : <Download className="w-10 h-10 text-white" />}
            </div>
            <div>
              {needsReinstall ? (
                <>
                  <h2 className="text-xl font-bold font-display text-dark-900">App já instalado</h2>
                  <p className="text-dark-500 text-sm mt-1">
                    O {appName} já foi instalado, mas precisa ser reinstalado para funcionar corretamente.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold font-display text-dark-900">Instalar {appName}</h2>
                  <p className="text-dark-500 text-sm mt-1">
                    {isIos
                      ? `Instale o app ${appName} na tela de início do seu iPhone para receber notificações e pedir mais rápido!`
                      : `Instale o app ${appName} no seu celular para receber notificações em tempo real e acessar com 1 clique!`}
                  </p>
                </>
              )}
            </div>
            {needsReinstall ? (
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-50">
                  <div className="w-8 h-8 rounded-lg bg-dark-200 flex items-center justify-center text-sm font-bold text-dark-600">1</div>
                  <p className="text-sm text-dark-700">Vá em <strong>Configurações &gt; Aplicativos &gt; {appName}</strong></p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-50">
                  <div className="w-8 h-8 rounded-lg bg-dark-200 flex items-center justify-center text-sm font-bold text-dark-600">2</div>
                  <p className="text-sm text-dark-700">Toque em <strong>Desinstalar</strong></p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-50">
                  <div className="w-8 h-8 rounded-lg bg-dark-200 flex items-center justify-center text-sm font-bold text-dark-600">3</div>
                  <p className="text-sm text-dark-700">Volte e toque em <strong>Instalar Agora</strong> novamente</p>
                </div>
              </div>
            ) : isIos ? (
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-50">
                  <div className="w-8 h-8 rounded-lg bg-dark-200 flex items-center justify-center text-sm font-bold text-dark-600">1</div>
                  <p className="text-sm text-dark-700">Toque em <Share2 className="w-4 h-4 inline text-primary-500" /> Compartilhar</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-50">
                  <div className="w-8 h-8 rounded-lg bg-dark-200 flex items-center justify-center text-sm font-bold text-dark-600">2</div>
                  <p className="text-sm text-dark-700">Role e toque em <Plus className="w-4 h-4 inline text-primary-500" /> Adicionar à Tela de Início</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="w-full py-3.5 rounded-2xl text-white font-bold transition-all bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 shadow-lg"
              >
                <Download className="w-5 h-5 inline mr-2" />Instalar Agora
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="w-full py-3 rounded-xl border-2 border-dark-200 text-dark-600 font-semibold hover:bg-dark-50 transition-all text-sm"
            >
              {needsReinstall ? 'Entendi' : 'Agora não'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
