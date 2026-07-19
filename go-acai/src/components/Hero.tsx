'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, Zap, Smartphone, CreditCard, Globe, Users } from 'lucide-react'

const features = [
  { icon: Smartphone, title: 'App Próprio', desc: 'Seu app nas stores' },
  { icon: CreditCard, title: 'Mercado Pago', desc: 'Pagamento integrado' },
  { icon: Globe, title: 'Link de Vendas', desc: 'Venda pelo WhatsApp' },
  { icon: Users, title: 'Sem Fidelidade', desc: 'Cancele quando quiser' },
]

const stats = [
  { value: '500+', label: 'Lojas Ativas' },
  { value: '50k+', label: 'Pedidos/Mês' },
  { value: '4.9★', label: 'Avaliação' },
  { value: '99.9%', label: 'Uptime' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 lg:pt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-primary-500 rounded-full"
              />
              <span>Novo: Integração iFood & Mercado Pago</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-dark-900 leading-tight mb-6">
              Seu <span className="text-gradient">Aplicativo Delivery</span> em{' '}
              <span className="text-primary-600">Menos de 5 Minutos</span>
            </h1>

            <p className="text-lg sm:text-xl text-dark-500 mb-8 max-w-xl leading-relaxed">
              Tenha seu próprio app de delivery para açaí, sorveterias e gelaterias.
              Sem taxa de instalação. Sem fidelidade. Teste grátis por 7 dias.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="#cadastro"
                className="btn-primary group text-lg px-8 py-4"
              >
                Começar Teste Grátis 7 Dias
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
              <Link
                href="#demo"
                className="btn-outline text-lg px-8 py-4"
              >
                Ver Demonstração
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-dark-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" aria-hidden="true" />
                <span>Sem taxa de instalação</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" aria-hidden="true" />
                <span>Cancelamento livre</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" aria-hidden="true" />
                <span>Suporte 7 dias/semana</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-primary-100">
                <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                  </div>
                  <div className="text-white font-medium text-sm">goacai.com.br/seu-nome</div>
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>

                <div className="p-6 space-y-4 max-h-[500px] overflow-hidden">
                  <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-2xl">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                      <Smartphone className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark-900">App na Play Store & App Store</p>
                      <p className="text-sm text-dark-500">Seu cliente baixa e pede direto</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-3 bg-dark-50 rounded-xl"
                      >
                        <feature.icon className="w-5 h-5 text-primary-500 mb-2" aria-hidden="true" />
                        <p className="font-medium text-sm text-dark-900">{feature.title}</p>
                        <p className="text-xs text-dark-500">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-accent-50 rounded-2xl border border-accent-100">
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6 text-accent-500" />
                      <div>
                        <p className="font-semibold text-dark-900">Pedido Realizado!</p>
                        <p className="text-sm text-dark-500">R$ 24,90 - Mercado Pago</p>
                      </div>
                    </div>
                    <Shield className="w-6 h-6 text-secondary-500" />
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10"
            >
              <div className="bg-white rounded-2xl shadow-xl p-4 border border-primary-100 min-w-[200px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-400 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark-900">Novo Pedido</p>
                    <p className="text-sm text-dark-500">Há 2 minutos</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-primary-50 rounded-xl">
                    <p className="font-bold text-primary-600">12</p>
                    <p className="text-xs text-primary-500">Hoje</p>
                  </div>
                  <div className="p-2 bg-secondary-50 rounded-xl">
                    <p className="font-bold text-secondary-600">R$ 289</p>
                    <p className="text-xs text-secondary-500">Faturado</p>
                  </div>
                  <div className="p-2 bg-accent-50 rounded-xl">
                    <p className="font-bold text-accent-600">4.9★</p>
                    <p className="text-xs text-accent-500">Avaliação</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="text-center p-4"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-dark-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}