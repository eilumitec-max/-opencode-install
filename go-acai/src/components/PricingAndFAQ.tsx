'use client'

import { motion } from 'framer-motion'
import { Check, X, HelpCircle, AlertCircle } from 'lucide-react'

const whatsappComparison = [
  { feature: 'Pedidos organizados', goacai: true, whatsapp: false },
  { feature: 'Cardápio visual com fotos', goacai: true, whatsapp: false },
  { feature: 'Montagem guiada (tigela → coberturas)', goacai: true, whatsapp: false },
  { feature: 'Pagamento online (PIX/Cartão)', goacai: true, whatsapp: false },
  { feature: 'Rastreamento do pedido', goacai: true, whatsapp: false },
  { feature: 'Histórico de pedidos do cliente', goacai: true, whatsapp: false },
  { feature: 'Fidelidade & Cashback automático', goacai: true, whatsapp: false },
  { feature: 'Relatórios de vendas', goacai: true, whatsapp: false },
  { feature: 'Gestão de entregadores', goacai: true, whatsapp: false },
  { feature: 'Área de entrega no mapa', goacai: true, whatsapp: false },
  { feature: 'Notificações automáticas', goacai: true, whatsapp: false },
  { feature: 'App próprio nas stores', goacai: true, whatsapp: false },
  { feature: 'Link de vendas personalizado', goacai: true, whatsapp: false },
  { feature: 'QR Code mesa/balcão', goacai: true, whatsapp: false },
  { feature: 'Multi-usuário com permissões', goacai: true, whatsapp: false },
  { feature: 'Backup automático', goacai: true, whatsapp: false },
  { feature: 'LGPD & Segurança bancária', goacai: true, whatsapp: false },
  { feature: 'Suporte dedicado', goacai: true, whatsapp: false },
  { feature: 'Custo zero por pedido', goacai: true, whatsapp: true },
  { feature: 'Fácil de começar', goacai: true, whatsapp: true },
]

const faqs = [
  {
    q: 'Posso testar antes de contratar?',
    a: 'Sim! Você tem 7 dias grátis com acesso completo. Cadastre sua loja, configure, faça pedidos testes. Só cobramos após o período se você quiser continuar.',
  },
  {
    q: 'Preciso instalar algo no computador?',
    a: 'Não. Tudo roda na nuvem. Você acessa o painel pelo navegador (Chrome, Safari, Edge). Seus clientes usam o app no celular ou seu link de vendas.',
  },
  {
    q: 'Funciona no celular e tablet?',
    a: 'Sim. O painel é 100% responsivo. O app do cliente é nativo (Android/iOS) e o link de vendas abre perfeitamente no mobile.',
  },
  {
    q: 'Tem contrato de fidelidade?',
    a: 'Zero fidelidade. Cancele quando quiser, sem multa, sem burocracia. Seu acesso permanece até o fim do período pago.',
  },
  {
    q: 'Como recebo os pagamentos?',
    a: 'Integrado ao Mercado Pago. PIX cai na hora, cartão em 1 dia útil. Vai direto pra sua conta Mercado Pago. Taxas são as do Mercado Pago.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim. Criptografia ponta a ponta, LGPD, backups diários, servidores no Brasil, HTTPS obrigatório, tokens JWT, rate limiting, WAF.',
  },
  {
    q: 'Consigo migrar do WhatsApp/outro sistema?',
    a: 'Sim. Importamos seus produtos, clientes e categorias via planilha (CSV/Excel). Nossa equipe ajuda na migração gratuita.',
  },
  {
    q: 'E se eu tiver mais de uma loja?',
    a: 'Cada loja tem sua conta separada (multi-tenant). Painel master para ver tudo consolidado. Desconto progressivo a partir da 2ª loja.',
  },
  {
    q: 'O app vai na Play Store e App Store?',
    a: 'Sim! Publicamos com sua marca, seu ícone, suas cores. Cuidadamos de todo processo: contas developer, builds, aprovação, updates.',
  },
  {
    q: 'Qual o suporte oferecido?',
    a: 'WhatsApp, Email, Chamados no painel. Horário comercial estendido. Onboarding guiado. Base de conhecimento. Vídeos tutoriais.',
  },
]

export function PricingAndFAQ() {
  return (
    <>
      <section id="plano" className="py-20 lg:py-32 bg-white relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent-50/50 via-transparent to-primary-50/50" />

        <div className="container-custom">
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
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary-100 to-transparent rounded-full blur-3xl" />

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

              <button className="btn-primary w-full py-4 text-lg mb-8">
                <span>Começar Teste Grátis 7 Dias</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="border-t border-dark-200 pt-8 space-y-3 text-left">
                {[
                  '✓ App próprio na Play Store e App Store',
                  '✓ Link de vendas + QR Codes ilimitados',
                  '✓ Painel administrativo completo',
                  '✓ Mercado Pago (PIX, Cartão, Boleto)',
                  '✓ Fidelidade, Cupons, Promoções',
                  '✓ Entregadores + Rastreio + Rotas',
                  '✓ Relatórios + Financeiro + LGPD',
                  '✓ Suporte WhatsApp + Email + Chamados',
                  '✓ Atualizações + Backups automáticos',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 text-sm text-dark-600"
                  >
                    <Check className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-dark-500 mb-4">
                Ainda tem dúvidas? Veja o comparativo detalhado:
              </p>
              <button className="btn-outline">
                Ver Comparativo GO AÇAÍ vs WhatsApp
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="comparativo" className="py-20 lg:py-32 bg-dark-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-4">
              GO AÇAÍ <span className="text-primary-600">vs</span> WhatsApp
            </h2>
            <p className="text-lg text-dark-500">
              Por que lojas que migram não voltam mais para o WhatsApp
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-dark-200">
                  <th className="text-left p-4 font-semibold text-dark-900 sticky left-0 bg-dark-50 z-10 w-64">
                    Funcionalidade
                  </th>
                  <th className="text-center p-4 font-semibold text-primary-700 bg-primary-50">
                    <span className="flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> GO AÇAÍ
                    </span>
                  </th>
                  <th className="text-center p-4 font-semibold text-dark-500 bg-dark-100">
                    <span className="flex items-center justify-center gap-1">
                      <X className="w-4 h-4" /> WhatsApp
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {whatsappComparison.map((row, i) => (
                  <tr key={i} className="border-b border-dark-100 hover:bg-white transition-colors">
                    <td className="p-4 font-medium text-dark-900">{row.feature}</td>
                    <td className="text-center p-4">
                      {row.goacai ? (
                        <Check className="w-5 h-5 text-secondary-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {row.whatsapp ? (
                        <Check className="w-5 h-5 text-secondary-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 lg:py-32 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-dark-500">
              Não encontrou sua resposta? <a href="#contato" className="link">Fale com a gente</a>
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-semibold text-dark-900 pr-4">{faq.q}</span>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-primary-500" />
                      <AlertCircle className="w-5 h-5 text-primary-500 rotate-45 group-open:rotate-0 transition-transform" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-dark-600 leading-relaxed border-t border-dark-100">
                    {faq.a}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}