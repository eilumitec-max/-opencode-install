'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingBag, LogIn, Eye, EyeOff, Shield, Mail, UserPlus } from 'lucide-react'
import { tenants } from '@/lib/tenants'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'demo' | 'email'>('demo')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDemoLogin = () => {
    if (!selectedTenant) { setError('Selecione sua loja'); return }
    if (password !== '123456') { setError('Senha incorreta. Use: 123456'); return }
    const tenant = tenants.find(t => t.id === selectedTenant)
    if (tenant) {
      localStorage.setItem('goacai_tenant', JSON.stringify({ id: tenant.id, slug: tenant.slug, name: tenant.name }))
      router.push('/admin')
    }
  }

  const handleEmailLogin = async () => {
    if (!email || !password) { setError('Preencha email e senha'); return }
    setLoading(true); setError('')
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }
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
            <div className="flex rounded-xl bg-dark-800 p-1">
              <button onClick={() => setMode('demo')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'demo' ? 'bg-dark-700 text-white' : 'text-dark-400'}`}>Demo</button>
              <button onClick={() => setMode('email')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'email' ? 'bg-dark-700 text-white' : 'text-dark-400'}`}>Email</button>
            </div>

            {mode === 'demo' ? (
              <>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-300">Demo: selecione a loja e senha <strong>123456</strong></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Sua Loja</label>
                  <div className="space-y-2">
                    {tenants.map(tenant => (
                      <motion.button key={tenant.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={() => { setSelectedTenant(tenant.id); setError('') }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${selectedTenant === tenant.id ? 'border-primary-500 bg-primary-500/10' : 'border-dark-700 hover:border-primary-500/50'}`}>
                        <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-2xl">{tenant.logo}</div>
                        <div className="flex-1"><p className="font-semibold text-white">{tenant.name}</p><p className="text-sm text-dark-400">{tenant.address}</p></div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTenant === tenant.id ? 'border-primary-500 bg-primary-500' : 'border-dark-500'}`}>
                          {selectedTenant === tenant.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Senha</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleDemoLogin()}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-primary-500 transition-all placeholder:text-dark-500" placeholder="123456" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleEmailLogin()}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 transition-all placeholder:text-dark-500" placeholder="seu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Senha</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleEmailLogin()}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-primary-500 transition-all placeholder:text-dark-500" placeholder="Sua senha" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <p className="text-center text-sm text-dark-500"><Link href="/signup" className="text-primary-400 hover:underline flex items-center justify-center gap-1"><UserPlus className="w-4 h-4" /> Criar nova loja</Link></p>
              </>
            )}

            {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm text-center">{error}</motion.p>}

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={mode === 'demo' ? handleDemoLogin : handleEmailLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" /> {loading ? 'Entrando...' : 'Entrar no Painel'}
            </motion.button>

            {mode === 'demo' && <p className="text-center text-xs text-dark-500">É lojista? <Link href="/signup" className="text-primary-400 hover:underline">Criar conta</Link></p>}
          </div>
        </div>
      </motion.div>
    </div>
  )
}