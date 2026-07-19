'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Shield, Zap, Smartphone, CreditCard, Globe, Users, Lock, RefreshCw, Database, BarChart3, Bell, ShoppingBag, MapPin, Truck, Headphones, Cpu, Wifi, LockKeyhole, Crown, Award, Heart, Star, Rocket, Sparkles } from 'lucide-react'

const benefits = [
  {
    icon: ShoppingBag,
    title: 'App Próprio nas Stores',
    desc: 'Publicamos seu app na Play Store e App Store com sua marca, ícone e cores. Seus clientes baixam e pedem direto.',
    color: 'from-primary-500 to-primary-400',
  },
  {
    icon: Globe,
    title: 'Link de Vendas + QR Codes',
    desc: 'Compartilhe no WhatsApp, Instagram, Bio. QR Code na mesa, balcão, delivery. Vende sem precisar do app instalado.',
    color: 'from-accent-500 to-accent-400',
  },
  {
    icon: Zap,
    title: 'Montagem Guiada (Totem)',
    desc: 'Tigela/Copo → Tamanho → Base → Coberturas → Frutas → Complementos → Resumo → Carrinho → Checkout. Zero erro.',
    color: 'from-secondary-500 to-teal-500',
  },
  {
    icon: CreditCard,
    title: 'Mercado Pago Integrado',
    desc: 'PIX cai na hora, cartão em 1 dia útil. Vai direto pra sua conta Mercado Pago. Taxas transparentes do MP.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Crown,
    title: 'Fidelidade & Cupons',
    desc: 'Pontos por compra, cashback automático, cupom aniversário, indicação de amigos, cupons promocionais. Cliente volta mais.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Completo',
    desc: 'Pedidos do dia, faturamento, ticket médio, produtos mais vendidos, clientes novos, pedidos em andamento. Tudo em tempo real.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Truck,
    title: 'Gestão de Entregadores',
    desc: 'Rotas otimizadas, GPS tempo real, comissão automática, documentos, disponibilidade. Entrega mais rápida e barata.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: MapPin,
    title: 'Área de Entrega no Mapa',
    desc: 'Desenhe polígonos, taxa por km/região, tempo estimado. Cliente vê se atende antes de montar pedido.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Bell,
    title: 'Notificações Automáticas',
    desc: 'Push, Email, WhatsApp: Pedido recebido, em preparo, saiu para entrega, entregue. Cliente informado, você tranquilo.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Users,
    title: 'Multi-usuário & Permissões',
    desc: 'Caixa, Cozinha, Gerente, Entregador. Cada um vê só o que precisa. Controle total de acesso.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Lock,
    title: 'LGPD & Segurança Bancária',
    desc: 'Criptografia ponta a ponta, LGPD, backups diários, servidores no Brasil, HTTPS obrigatório, tokens JWT, rate limiting, Captcha, WAF.',
    color: 'from-slate-500 to-gray-500',
  },
  {
    icon: RefreshCw,
    title: 'Atualizações Gratuitas',
    desc: 'Novas features, melhorias, correções de segurança. Tudo incluso no R$ 29,90. Sem custo extra, sem trabalho seu.',
    color: 'from-emerald-500 to-teal-500',
  },
]

export function Benefits() {
  return (
    <section id="beneficios" className="py-20 lg:py-32 bg-white relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-100/50 rounded-full blur-3xl" />
      </div>

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-4">
            Tudo que seu <span className="text-gradient">delivery precisa</span>
          </h2>
          <p className="text-lg text-dark-500">
            12 funcionalidades essenciais inclusas no R$ 29,90. Sem adicionais, sem surpresas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group glass-hover p-6 lg:p-8 rounded-2xl"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-dark-900 mb-2 text-lg">{benefit.title}</h3>
              <p className="text-dark-600 leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}