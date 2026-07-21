'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const features = [
  'App próprio na Play Store e App Store',
  'Link de vendas personalizado (seunome.goacai.com.br)',
  'QR Codes ilimitados para mesa/balcão/delivery',
  'Painel administrativo completo',
  'Montagem guiada: Tigela/Copo → Tamanho → Base → Coberturas → Frutas → Complementos',
  'Mercado Pago integrado (PIX, Cartão, Boleto)',
  'Entregadores com GPS + Rotas otimizadas',
  'Área de entrega no mapa (polígonos + taxa por região)',
  'Fidelidade: pontos, cashback, indicação, aniversário',
  'Cupons, promoções, combos, horários de funcionamento',
  'Relatórios: faturamento, ticket médio, top produtos, clientes',
  'Financeiro: conciliação, extrato, fluxo de caixa',
  'Multi-usuário com permissões (caixa, cozinha, gerente, entregador)',
  'Impressão automática (cozinha + expedição + cupom fiscal)',
  'Notificações: Push, Email, WhatsApp, SMS',
  'Login Google OAuth + Email/Senha + Recuperação',
  'LGPD + Criptografia + Backups diários + 99.9% SLA',
  'Atualizações automáticas + Novas features sem custo',
  'Suporte: WhatsApp + Email + Chamados (horário estendido)',
  'Onboarding guiado + Base de conhecimento + Vídeos',
  'API aberta para integração com ERP/Contabilidade',
  'Funciona offline (PWA) + Modo quiosque para tablet',
  'Tema personalizável (cores, logo, banner, fontes)',
  'Importação de dados (CSV/Excel) na migração',
  'Painel master para redes/franquias (desconto progressivo)',
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
            Tudo incluso por <span className="text-gradient">R$ 29,90/mês</span>
          </h2>
          <p className="text-lg text-dark-500">
            7 dias grátis • App próprio nas stores • Painel completo • Mercado Pago • Suporte
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
                <span className="text-5xl sm:text-6xl font-display font-bold text-gradient">R$ 29,90</span>
                <span className="text-dark-400 ml-1">/mês</span>
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