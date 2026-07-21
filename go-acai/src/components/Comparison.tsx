'use client'

import { motion } from 'framer-motion'
import { Check, X, Minus, ArrowRight } from 'lucide-react'

const comparison = [
  {
    category: 'Custo & Modelo',
    items: [
      { feature: 'Mensalidade fixa', goAcai: true, whatsapp: false, detail: 'R$ 29,90/mês sem surpresas' },
      { feature: 'Sem taxa por pedido', goAcai: true, whatsapp: false, detail: 'iFood cobra 23-27% por pedido' },
      { feature: 'Sem comissão oculta', goAcai: true, whatsapp: true, detail: 'Você fica com 100% do lucro' },
      { feature: 'Sem fidelidade', goAcai: true, whatsapp: true, detail: 'Cancela quando quiser' },
      { feature: 'Teste grátis 7 dias', goAcai: true, whatsapp: false, detail: 'Acesso completo, sem cartão' },
    ],
  },
  {
    category: 'Experiência do Cliente',
    items: [
      { feature: 'App próprio (Stores)', goAcai: true, whatsapp: false, detail: 'Sua marca na Play Store e App Store' },
      { feature: 'Link de vendas único', goAcai: true, whatsapp: false, detail: 'Compartilha no WhatsApp/Insta/Bio' },
      { feature: 'Montagem visual', goAcai: true, whatsapp: false, detail: 'Tigela/Copo → Tamanho → Base → Coberturas...' },
      { feature: 'Fotos dos produtos', goAcai: true, whatsapp: 'parcial', detail: 'Cardápio visual atrativo' },
      { feature: 'Pedidos agendados', goAcai: true, whatsapp: false, detail: 'Cliente agenda para amanhã, almoço...' },
      { feature: 'Fidelidade & Cupons', goAcai: true, whatsapp: false, detail: 'Pontos, cashback, indicação, aniversário' },
      { feature: 'Rastreio em tempo real', goAcai: true, whatsapp: false, detail: 'Mapa GPS do entregador' },
      { feature: 'Notificações push', goAcai: true, whatsapp: 'parcial', detail: 'Status do pedido automático' },
    ],
  },
  {
    category: 'Gestão & Operação',
    items: [
      { feature: 'Painel administrativo', goAcai: true, whatsapp: false, detail: 'Dashboard, relatórios, gestão completa' },
      { feature: 'Cardápio digital', goAcai: true, whatsapp: false, detail: 'Fotos, preços, estoque, categorias' },
      { feature: 'Gestão de entregadores', goAcai: true, whatsapp: false, detail: 'Rotas, GPS, comissão, documentos' },
      { feature: 'Área de entrega no mapa', goAcai: true, whatsapp: false, detail: 'Desenhe polígonos, taxa por km/região' },
      { feature: 'Impressão automática', goAcai: true, whatsapp: false, detail: 'Cozinha + expedição + cupom fiscal' },
      { feature: 'Relatórios gerenciais', goAcai: true, whatsapp: false, detail: 'Faturamento, ticket médio, top produtos' },
      { feature: 'Controle de caixa', goAcai: true, whatsapp: false, detail: 'Sangria, suprimento, fechamento' },
      { feature: 'Multi-usuário/permissões', goAcai: true, whatsapp: false, detail: 'Caixa, cozinha, gerente, entregador' },
    ],
  },
  {
    category: 'Pagamentos & Financeiro',
    items: [
      { feature: 'Mercado Pago integrado', goAcai: true, whatsapp: false, detail: 'PIX, Cartão, Boleto automático' },
      { feature: 'Split de pagamentos', goAcai: true, whatsapp: false, detail: 'Recebe direto, taxas transparentes' },
      { feature: 'Conciliação automática', goAcai: true, whatsapp: false, detail: 'Extrato sincronizado com Mercado Pago' },
      { feature: 'Dinheiro/PIX na entrega', goAcai: true, whatsapp: true, detail: 'Opção para quem prefere' },
      { feature: 'Nota fiscal automática', goAcai: true, whatsapp: false, detail: 'Emissão integrada (NF-e/NFC-e)' },
    ],
  },
  {
    category: 'Tecnologia & Segurança',
    items: [
      { feature: 'Multi-tenant isolado', goAcai: true, whatsapp: false, detail: 'Seu banco, seus dados, sua instância' },
      { feature: 'LGPD & Criptografia', goAcai: true, whatsapp: false, detail: 'Dados criptografados, backup diário' },
      { feature: '99.9% Uptime SLA', goAcai: true, whatsapp: true, detail: 'Infraestrutura cloud escalável' },
      { feature: 'Login Google OAuth', goAcai: true, whatsapp: false, detail: 'Sem senha, conversão maior' },
      { feature: 'PWA / Offline-first', goAcai: true, whatsapp: false, detail: 'Funciona sem internet, instala como app' },
      { feature: 'API aberta', goAcai: true, whatsapp: false, detail: 'Integra com seu ERP, contabilidade' },
    ],
  },
]

function ComparisonIcon({ value }: { value: boolean | 'parcial' | string }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-secondary-500" />
  }
  if (value === 'parcial') {
    return <Minus className="w-5 h-5 text-amber-500" />
  }
  return <X className="w-5 h-5 text-dark-300" />
}

export function Comparison() {
  return (
    <section id="comparativo" className="py-20 lg:py-32 bg-white relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 via-transparent to-accent-50/50" />

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            Comparativo Honesto
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-4">
            GO AÇAÍ vs <span className="text-primary-600">WhatsApp</span> / <span className="text-primary-600">iFood</span>
          </h2>
          <p className="text-lg text-dark-500">
            Por que centenas de lojas migraram do WhatsApp/iFood para app próprio
          </p>
        </motion.div>

        <div className="space-y-12">
          {comparison.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-dark-900 mb-6 pb-3 border-b border-primary-200 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                  {sectionIndex + 1}
                </span>
                {section.category}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="px-4 py-3 text-left font-semibold text-dark-900 border-b border-primary-200">
                        Funcionalidade
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-dark-900 border-b border-primary-200 w-32">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-primary-400" />
                          <span className="text-white text-xs font-bold">GO AÇAÍ</span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-dark-900 border-b border-primary-200 w-32">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-6 h-6 rounded bg-dark-200" />
                          <span className="text-dark-600 text-xs font-bold">WhatsApp</span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-dark-900 border-b border-primary-200 w-32">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-6 h-6 rounded bg-red-100" />
                          <span className="text-red-600 text-xs font-bold">iFood</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, itemIndex) => (
                      <tr
                        key={itemIndex}
                        className={`${itemIndex % 2 === 0 ? 'bg-white' : 'bg-dark-50/50'} hover:bg-primary-50/50 transition-colors`}
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-dark-900">{item.feature}</p>
                            {item.detail && (
                              <p className="text-sm text-dark-500 mt-1">{item.detail}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <ComparisonIcon value={item.goAcai} />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <ComparisonIcon value={item.whatsapp} />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <X className="w-5 h-5 text-dark-300" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: comparison.length * 0.1 }}
            className="mt-12 p-8 bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl text-center text-white"
          >
            <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4">
              Pare de perder dinheiro com comissões
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Com 30 pedidos/dia a R$ 30,00 = R$ 27.000/mês. iFood leva ~R$ 7.000. GO AÇAÍ custa R$ 29,90.
              Você economiza <span className="font-bold text-white underline">R$ 83.000/ano</span>.
            </p>
            <button className="btn-accent text-lg px-10 py-4">
              Começar Teste Grátis
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}