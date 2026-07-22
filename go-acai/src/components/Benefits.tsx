'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Zap, Globe, Smartphone, Bell, BarChart3, ShoppingBag, Palette, Tags, MessageSquare, Settings, Lock } from 'lucide-react'

const benefits = [
  {
    icon: ShoppingBag,
    title: 'App PWA Instalável',
    desc: 'Seu cliente adiciona na tela inicial do celular como um app de verdade. Funciona offline, recebe notificações, pede em 1 clique.',
    color: 'from-primary-500 to-primary-400',
  },
  {
    icon: Globe,
    title: 'Link de Vendas + QR Codes',
    desc: 'Compartilhe no WhatsApp, Instagram, Bio. QR Code na mesa, balcão, delivery. Vende sem precisar baixar nada.',
    color: 'from-accent-500 to-accent-400',
  },
  {
    icon: Zap,
    title: 'Montagem Guiada',
    desc: 'Tigela/Copo → Tamanho → Coberturas → Frutas → Complementos → Carrinho → Checkout. Experiência completa sem erro.',
    color: 'from-secondary-500 to-teal-500',
  },
  {
    icon: Bell,
    title: 'Notificações Push',
    desc: 'Cliente recebe notificação automática: Pedido recebido, preparando, saiu para entrega, entregue. Acompanhamento em tempo real.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: BarChart3,
    title: 'Dashboard em Tempo Real',
    desc: 'Pedidos do dia, status de cada pedido, produtos mais vendidos. Tudo atualizado na hora no painel administrativo.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: MessageSquare,
    title: 'Mensagens por Etapa',
    desc: 'Mensagens animadas com gradiente colorido em cada etapa da montagem. Banner promocional configurável no topo.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Palette,
    title: 'Tema Personalizável',
    desc: 'Cores, logo (emoji), banner, fontes. Sua identidade visual em cada detalhe do app do cliente.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Tags,
    title: 'Emojis & Preços por Item',
    desc: 'Emojis personalizados para cada produto. Preços individuais para coberturas, frutas e complementos.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Settings,
    title: 'Ativar/Desativar Itens',
    desc: 'Ative ou desative categorias e produtos a qualquer momento. Itens desativados somem automaticamente do cardápio.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Lock,
    title: 'LGPD & Segurança',
    desc: 'Criptografia ponta a ponta, backups diários, servidores no Brasil, HTTPS obrigatório.',
    color: 'from-slate-500 to-gray-500',
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
            Funcionalidades essenciais para seu delivery. Planos a partir de R$ 15/mês.
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