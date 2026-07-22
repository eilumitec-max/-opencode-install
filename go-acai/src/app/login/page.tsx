'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingBag, LogIn, Eye, EyeOff, Mail, UserPlus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError('Preencha email e senha'); return }
    setLoading(true); setError('')
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError('Email ou senha inválidos.'); setLoading(false); return }
    const { data: link } = await supabase.from('tenant_users').select('tenant_id').eq('user_id', data.user.id).single()
    if (link) {
      localStorage.setItem('goacai_tenant', JSON.stringify({ id: link.tenant_id }))
      router.push('/admin')
    } else {
      setError('Conta não vinculada a nenhuma loja')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-dark-900 border border-dark-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-8 text-center border-b border-dark-800">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-8 h-8 text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">GO AÇAÍ</h1>
            <p className="text-dark-400 text-sm mt-1">Área do Cliente</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
              <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
              <p className="text-xs text-primary-300">Use seu email e senha cadastrados</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 transition-all placeholder:text-dark-500" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Senha</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-primary-500 transition-all placeholder:text-dark-500" placeholder="Sua senha" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm text-center">{error}</motion.p>}

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" /> {loading ? 'Entrando...' : 'Entrar no Painel'}
            </motion.button>

            <p className="text-center text-sm text-dark-500">Não tem conta? <Link href="/signup" className="text-primary-400 hover:underline flex items-center justify-center gap-1"><UserPlus className="w-4 h-4" /> Criar nova loja</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
