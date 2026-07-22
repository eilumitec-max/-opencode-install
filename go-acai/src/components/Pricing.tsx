'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const features = [
  'App PWA instalável no celular do cliente',
  'Link de vendas personalizado (seunome.goacai.com.br)',
  'QR Codes ilimitados para mesa/balcão/delivery',
  'Painel administrativo completo',
  'Montagem guiada: Tigela/Copo → Tamanho → Coberturas → Frutas → Complementos',
  'Cardápio digital com fotos, preços e categorias',
  'Notificações Push automáticas (status do pedido)',
  'Status do pedido em tempo real: Recebido → Preparando → Saiu → Entregue',
  'Gestão de pedidos: receber, confirmar, finalizar',
  'Dashboard com pedidos do dia em tempo real',
  'Mensagens e banner animado por etapa',
  'Emojis/ícones personalizáveis por item',
  'Preços individuais por complemento',
  'Ativar/desativar categorias e produtos',
  'Tema personalizável (cores, logo, banner, fontes)',
  'LGPD + Criptografia + Backups diários',
  'Atualizações automáticas + Novas features sem custo',
  'Suporte prioritário via WhatsApp e Email',
  'Funciona offline (PWA)',
  ('Em breve: Mercado Pago, Cupons, Fidelidade, App nas Stores'),
]

export function Pricing() {
  return (
    <section id="precos" className="py-20 lg:py-32 bg-dark-50 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50/50 via-transparent to-accent-50/50" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-4">
            Plano Único • Sem Fidelidade
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-4">
            Planos a partir de <span className="text-gradient">R$ 15/mês</span>
          </h2>
          <p className="text-lg text-dark-500">
            7 dias grátis • App PWA • Painel completo • Notificações Push • Suporte
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary-100 rounded-full blur-3xl" />

            <div className="relative text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
                Mais popular
              </div>
              <h3 className="text-2xl font-display font-bold text-dark-900 mb-2">Plano Completo</h3>
              <p className="text-dark-500">Todas as funcionalidades. Sem limites.</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="text-center">
                <span className="text-5xl sm:text-6xl font-display font-bold text-gradient">R$ 15</span>
                <span className="text-dark-400 ml-1">/mês (plano anual)</span>
              </div>
              <p className="text-center text-sm text-dark-500">Após 7 dias grátis • Cancele quando quiser</p>
            </div>

            <Link
              href="/signup"
              className="btn-primary w-full py-4 text-lg mb-8 group"
            >
              Começar Teste Grátis 7 Dias
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="border-t border-dark-200 pt-8 space-y-3 text-left max-h-96 overflow-y-auto">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.02 }}
                  className="flex items-center gap-3 text-sm text-dark-600"
                >
                  <Check className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-dark-500 mb-4">
              Ainda tem dúvidas? Veja o comparativo detalhado:
            </p>
            <Link
              href="#comparativo"
              className="btn-outline"
            >
              Ver Comparativo GO AÇAÍ vs WhatsApp
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}